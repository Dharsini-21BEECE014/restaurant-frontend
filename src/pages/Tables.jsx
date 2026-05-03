import { useEffect, useState } from "react";
import api from "../api/api";
import "../styles/tables.css";

export default function Tables() {
  const [tables, setTables] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [filter, setFilter] = useState("available");

  useEffect(() => {
    document.title = "Tables";

    const link = document.querySelector("link[rel~='icon']");
    if (link) {
      link.href = "Tables1.png"; // your icon
    }
    loadTables();
  }, []);

  const loadTables = () => {
    api.get("/tables").then((res) => setTables(res.data));
  };

  const showMessage = (text, type = "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  const getErrorMessage = (err) => {
    const data = err.response?.data;
    if (!data) return "⚠️ Something went wrong";
    if (typeof data === "string") return data;
    if (data.title) return data.title;
    if (data.errors) {
      const first = Object.values(data.errors)[0];
      return first?.[0] || "Validation error";
    }
    return "⚠️ Request failed";
  };

  // =========================
  // VIEW DETAILS
  // =========================
  const viewDetails = async (tableId) => {
    try {
      const res = await api.get(`/orders/table/${tableId}`);

      if (!res.data) {
        showMessage("📭 No active orders found");
        setSelectedOrder(null);
        return;
      }

      setSelectedOrder(res.data);
    } catch {
      setSelectedOrder(null);
      showMessage("📭 No active orders found");
    }
  };

  // =========================
  // BILL
  // =========================
  const billOrders = async () => {
    try {
      const tableId = selectedOrder?.tableId;
      if (!tableId) return showMessage("❌ Table ID missing");

      await api.put(`/orders/table/${tableId}/bill`);

      showMessage("💰 Billed successfully", "success");
      setSelectedOrder(null);
      loadTables();
    } catch (err) {
      showMessage(getErrorMessage(err));
    }
  };

  // =========================
  // COMPLETE TABLE
  // =========================
  const completeTable = async (tableId) => {
    try {
      await api.put(`/tables/${tableId}/complete`);
      showMessage("✅ Table completed", "success");
      loadTables();
    } catch (err) {
      showMessage(getErrorMessage(err));
    }
  };

  // =========================
  // CANCEL BOOKING
  // =========================
  const cancelBookingByTable = async (tableId) => {
    try {
      const res = await api.get("/bookings");

      const booking = res.data.find(
        (b) =>
          b.tableId === tableId &&
          (b.status === "Confirmed" || b.status === "Seated"),
      );

      if (!booking) {
        showMessage("❌ No active booking found for this table");
        return;
      }

      await api.put(`/bookings/${booking.bookingId}/cancel`);

      showMessage("❌ Booking cancelled successfully", "success");
      loadTables();
    } catch (err) {
      showMessage(getErrorMessage(err));
    }
  };

  // =========================
  // FILTER LOGIC
  // =========================
  const filteredTables = tables.filter((t) => {
    if (filter === "available") return t.status === 0;
    if (filter === "occupied") return t.status === 1;
    if (filter === "reserved") return t.status === 2;
    if (filter === "maintenance") return t.status === 3;
    return true;
  });

  const statusConfig = {
    0: { label: "Available", className: "available" },
    1: { label: "Occupied", className: "occupied" },
    2: { label: "Reserved", className: "reserved" },
    3: { label: "Maintenance", className: "maintenance" },
  };

  // =========================
  // EMPTY STATE FIX (ADDED)
  // =========================
  const emptyMessages = {
    available: "🚫 No Available Tables Found",
    occupied: "🚫 No Occupied Tables Found",
    reserved: "🚫 No Reserved Tables Found",
    maintenance: "🚫 No Maintenance Tables Found",
  };

  return (
    <div className="page">
      {/* HEADER */}
      <div className="header-row">
        <h2>🍽 Restaurant Tables</h2>

        <div className="filter-tabs">
          {["available", "occupied", "reserved", "maintenance"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={filter === f ? "active" : ""}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* MESSAGE */}
      {message.text && (
        <div className={`msg-banner ${message.type}`}>
          {String(message.text)}
        </div>
      )}

      {/* TABLE GRID OR EMPTY STATE */}
      {filteredTables.length === 0 ? (
        <div className="empty-state">
          <h3>{emptyMessages[filter]}</h3>
        </div>
      ) : (
        <div className="table-grid">
          {filteredTables.map((t) => {
            const status = statusConfig[t.status];

            return (
              <div key={t.tableId} className={`table-card ${status.className}`}>
                <div className="table-header">
                  <h3>Table {t.tableNumber}</h3>
                  <span className="status-badge">{status.label}</span>
                </div>

                <div className="table-body">
                  <p>👥 Capacity: {t.capacity}</p>
                </div>

                {t.status === 3 ? (
                  <button
                    className="table-btn complete-btn"
                    onClick={() => completeTable(t.tableId)}
                  >
                    🔧 Complete Maintenance
                  </button>
                ) : (
                  <>
                    {(t.status === 1 || t.status === 2) && (
                      <button
                        className="table-btn"
                        onClick={() => viewDetails(t.tableId)}
                      >
                        View Details
                      </button>
                    )}

                    {(t.status === 1 || t.status === 2) && (
                      <button
                        className="table-btn complete-btn"
                        onClick={() => completeTable(t.tableId)}
                      >
                        Complete
                      </button>
                    )}

                    {(t.status === 1 || t.status === 2) && (
                      <button
                        className="table-btn"
                        style={{ background: "#ef4444", color: "white" }}
                        onClick={() => cancelBookingByTable(t.tableId)}
                      >
                        ❌ Cancel Booking
                      </button>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ORDER MODAL */}
      {selectedOrder && (
        <div className="modal" onClick={() => setSelectedOrder(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>🧾 Order Details</h3>

            <p>
              <b>{selectedOrder.orderNumber}</b>
            </p>

            <p>💰 Total: ₹{selectedOrder.totalAmount}</p>

            <hr />

            {(selectedOrder.orderItems || []).map((i, idx) => (
              <div key={idx}>
                🍽 {i.menuItem?.name} × {i.quantity}
              </div>
            ))}

            <button className="table-btn" onClick={billOrders}>
              💰 Bill All
            </button>

            <button
              className="close-btn"
              onClick={() => setSelectedOrder(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
