import { useEffect, useState } from "react";
import api from "../api/api";
import "../styles/forms.css";

export default function Bookings() {
  const [tables, setTables] = useState([]);

  const [message, setMessage] = useState({ text: "", type: "" });

  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    guestCount: "",
    tableId: "",
    bookingDate: "",
  });

  const showMessage = (text, type = "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    document.title = "Bookings";

    const link = document.querySelector("link[rel~='icon']");
    if (link) {
      link.href = "Bookings.png"; // your icon
    }
    api.get("/tables/available").then((res) => setTables(res.data));
  }, []);

  // const submit = async () => {
  //   try {
  //     if (
  //       !form.customerName ||
  //       !form.customerPhone ||
  //       !form.guestCount ||
  //       !form.tableId ||
  //       !form.bookingDate
  //     ) {
  //       showMessage("All fields required");
  //       return;
  //     }

  //     if (Number(form.guestCount) <= 0) {
  //       showMessage("Guest count must be greater than 0");
  //       return;
  //     }

  //     if (new Date(form.bookingDate) <= new Date()) {
  //       showMessage("Booking must be future date");
  //       return;
  //     }

  //     const payload = {
  //       customerName: form.customerName,
  //       customerPhone: form.customerPhone,
  //       guestCount: Number(form.guestCount),
  //       tableId: Number(form.tableId),
  //       bookingDate: form.bookingDate,
  //     };

  //     const res = await api.post("/bookings", payload);

  //     showMessage("✅ Booking Success: " + res.data.bookingNumber, "success");

  //     setForm({
  //       customerName: "",
  //       customerPhone: "",
  //       guestCount: "",
  //       tableId: "",
  //       bookingDate: "",
  //     });
  //   } catch (err) {
  //     showMessage(err.response?.data || "Booking failed");
  //   }
  // };
  const submit = async () => {
    try {
      console.log("👉 Submit clicked");

      if (
        !form.customerName ||
        !form.customerPhone ||
        !form.guestCount ||
        !form.tableId ||
        !form.bookingDate
      ) {
        console.log("❌ Validation failed: missing fields");
        showMessage("All fields required");
        return;
      }

      const payload = {
        customerName: form.customerName,
        customerPhone: form.customerPhone,
        guestCount: Number(form.guestCount),
        tableId: Number(form.tableId),
        bookingDate: form.bookingDate,
      };

      console.log("📦 Payload sent:", payload);

      const res = await api.post("/bookings", payload);

      console.log("✅ API Response:", res.data);

      showMessage("Booking Success: " + res.data.bookingNumber, "success");
    } catch (err) {
      console.log("❌ ERROR FULL:", err);
      console.log("❌ RESPONSE:", err.response?.data);
      console.log("❌ STATUS:", err.response?.status);

      showMessage(err.response?.data || "Booking failed");
    }
  };

  // 🔥 DISABLE PAST DATE
  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  return (
    <div className="book-page">
      <div className="header-row">
        <h2>📅 Create Booking</h2>
      </div>

      {/* ✅ MESSAGE */}
      {message.text && (
        <div className={`msg-banner ${message.type}`}>{message.text}</div>
      )}

      <div className="booking-card">
        <div className="input-group">
          <label>Name</label>
          <input
            name="customerName"
            value={form.customerName}
            placeholder="Enter customer name"
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label>Phone Number</label>
          <input
            name="customerPhone"
            value={form.customerPhone}
            placeholder="Enter phone number"
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label>Members</label>
          <input
            type="number"
            name="guestCount"
            value={form.guestCount}
            placeholder="Number of guests"
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label>Table Number</label>

          <select
            className="select-input"
            name="tableId"
            value={form.tableId}
            onChange={handleChange}
          >
            <option value="">Select Table</option>
            {tables.map((t) => (
              <option key={t.tableId} value={t.tableId}>
                {t.tableNumber} (Capacity: {t.capacity})
              </option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label>Booking Date & Time</label>
          <input
            type="datetime-local"
            name="bookingDate"
            value={form.bookingDate}
            min={getMinDateTime()} // 🔥 NO PAST DATE
            onChange={handleChange}
          />
        </div>

        <button className="booking-btn" onClick={submit}>
          Confirm Booking
        </button>
      </div>
    </div>
  );
}
