import { useEffect, useState } from "react";
import api from "../api/api";
import "../styles/tables.css";
import { useNavigate } from "react-router-dom";

export default function AvailableTables() {
  const [tables, setTables] = useState([]);
  const [message, setMessage] = useState({ text: "", type: "" });

  const navigate = useNavigate();

  useEffect(() => {
    loadTables();
  }, []);

  const loadTables = () => {
    api.get("/tables/available").then((res) => setTables(res.data));
  };

  // ✅ message system
  const showMessage = (text, type = "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  // =========================
  // SET MAINTENANCE
  // =========================
  const markMaintenance = async (tableId) => {
    try {
      await api.put(`/tables/${tableId}/maintenance`);

      showMessage("🛠️ Table moved to maintenance", "success");
      loadTables();
    } catch (err) {
      showMessage("⚠️ Failed to update table", "error");
    }
  };

  return (
    <div className="page">
      <div className="header-row">
        <h2>🟢 Available Tables</h2>
      </div>

      {/* MESSAGE */}
      {message.text && (
        <div className={`msg-banner ${message.type}`}>{message.text}</div>
      )}

      <div className="table-grid">
        {tables.length === 0 ? (
          <div className="empty-state">
            <h3>No available tables</h3>
          </div>
        ) : (
          tables.map((t) => (
            <div key={t.tableId} className="table-card available">
              <div className="table-header">
                <h3>Table {t.tableNumber}</h3>
                <span className="status-badge">Available</span>
              </div>

              <div className="table-body">
                <p>👥 Capacity: {t.capacity}</p>
                <p>🆔 ID: {t.tableId}</p>
              </div>

              {/* BOOK BUTTON */}
              <button
                className="table-btn"
                onClick={() => navigate("/bookings")}
              >
                Book Now
              </button>

              {/* MAINTENANCE BUTTON */}
              <button
                className="table-btn disabled-btn"
                style={{ marginTop: "8px" }}
                onClick={() => markMaintenance(t.tableId)}
              >
                🛠 Maintenance
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
