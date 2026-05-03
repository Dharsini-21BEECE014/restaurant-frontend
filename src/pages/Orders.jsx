import { useEffect, useState } from "react";
import api from "../api/api";
import "../styles/menu.css";

export default function CreateOrder() {
  const [bookings, setBookings] = useState([]);
  const [menu, setMenu] = useState([]);
  const [bookingId, setBookingId] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });

  const showMessage = (text, type = "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  useEffect(() => {
    document.title = "Orders";

    const link = document.querySelector("link[rel~='icon']");
    if (link) {
      link.href = "/Orders1.png"; // ✅ your icon
    }
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const [b, m] = await Promise.all([
        api.get("/bookings"),
        api.get("/menu-items"),
      ]);

      const activeBookings = b.data.filter(
        (x) => x.status === "Confirmed" || x.status === "Seated",
      );

      setBookings(activeBookings);
      setMenu(m.data);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // CATEGORY ICONS (IMPORTANT)
  // =========================
  const categoryIcons = {
    Starters: "🥗",
    "Main Course": "🍛",
    Drinks: "🥤",
    Desserts: "🍰",
    "Fast Food": "🍔",
    "South Indian": "🍲",
    Default: "🍽️",
  };

  const getIcon = (categoryName) =>
    categoryIcons[categoryName] || categoryIcons.Default;

  // =========================
  // ADD ITEM
  // =========================
  const addItem = (id) => {
    const exists = items.find((i) => i.menuItemId === id);

    if (exists) {
      setItems((prev) =>
        prev.map((i) =>
          i.menuItemId === id ? { ...i, quantity: i.quantity + 1 } : i,
        ),
      );
    } else {
      setItems((prev) => [...prev, { menuItemId: id, quantity: 1 }]);
    }
  };

  const decreaseItem = (id) => {
    setItems((prev) =>
      prev
        .map((i) =>
          i.menuItemId === id ? { ...i, quantity: i.quantity - 1 } : i,
        )
        .filter((i) => i.quantity > 0),
    );
  };

  const getQty = (id) => {
    const item = items.find((i) => i.menuItemId === id);
    return item ? item.quantity : 0;
  };

  // =========================
  // SUBMIT ORDER
  // =========================
  // const submit = async () => {
  //   try {
  //     if (!bookingId) return showMessage("Select table");
  //     if (items.length === 0) return showMessage("Add items");

  //     const selectedBooking = bookings.find(
  //       (b) => b.bookingId === Number(bookingId),
  //     );

  //     if (selectedBooking?.status === "Confirmed") {
  //       await api.put(`/bookings/${bookingId}/seat`);
  //     }

  //     await api.post("/orders", {
  //       bookingId: Number(bookingId),
  //       items,
  //     });

  //     showMessage("Order placed successfully", "success");

  //     setItems([]);
  //     setBookingId("");
  //     loadData();
  //   } catch {
  //     showMessage("Order failed");
  //   }
  // };
  console.log("🧾 ITEMS:", items);
  console.log("📦 outside the submit Sending order:", {
    bookingId,
    items,
  });
  const submit = async () => {
    try {
      if (!bookingId) return showMessage("Select table");
      if (items.length === 0) return showMessage("Add items");
      if (!items.length) {
        showMessage("❌ No items selected");
        return;
      }

      const selectedBooking = bookings.find(
        (b) => b.bookingId === Number(bookingId),
      );

      // 🔥 STEP 1: seat booking
      if (selectedBooking?.status === "Confirmed") {
        await api.put(`/bookings/${bookingId}/seat`);

        // 🔥 IMPORTANT: wait & reload booking state
        await new Promise((res) => setTimeout(res, 500));
      }
      console.log("📦inside the submit Sending order:", {
        bookingId,
        items,
      });

      // 🔥 STEP 2: create order
      await api.post("/orders", {
        bookingId: Number(bookingId),
        items,
      });

      showMessage("Order placed successfully", "success");

      setItems([]);
      setBookingId("");
      loadData();
    } catch (err) {
      console.log("❌ ORDER ERROR:", err.response?.data);
      showMessage(err.response?.data || "Order failed");
    }
  };

  if (loading) {
    return (
      <div className="page">
        <h2>🍽 Loading menu...</h2>
      </div>
    );
  }

  return (
    <div className="page">
      {/* HEADER */}
      <div className="header-row">
        <h2>🍽 Create Order</h2>
      </div>

      {/* MESSAGE */}
      {message.text && (
        <div className={`msg-banner ${message.type}`}>{message.text}</div>
      )}

      {/* ACTIVE TABLES */}
      <div className="table-select-box">
        <label>Active Tables</label>

        <select
          className="booking-select"
          value={bookingId}
          onChange={(e) => setBookingId(e.target.value)}
        >
          <option value="">Select Table</option>

          {bookings.map((b) => (
            <option key={b.bookingId} value={b.bookingId}>
              🪑 Table {b.tableId} • {b.customerName}
            </option>
          ))}
        </select>
      </div>

      {/* MENU */}
      <h3 className="section-title">Menu Items</h3>

      <div className="menu-grid">
        {menu.map((m) => (
          <div key={m.menuItemId} className="menu-card">
            <div className="menu-header">
              <h3>
                {getIcon(m.menuCategory?.name)} {m.name}
              </h3>
            </div>

            <div className="menu-body">
              <p className="price">₹ {m.price}</p>
              <p className="category">{m.menuCategory?.name}</p>
            </div>

            <div className="qty-controls">
              <button
                className="qty-btn minus"
                onClick={() => decreaseItem(m.menuItemId)}
              >
                −
              </button>

              <span className="qty-value">{getQty(m.menuItemId)}</span>

              <button
                className="qty-btn plus"
                onClick={() => addItem(m.menuItemId)}
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* PLACE ORDER */}
      <div className="center-btn">
        <button className="booking-btn large-btn" onClick={submit}>
          Place Order
        </button>
      </div>
    </div>
  );
}
