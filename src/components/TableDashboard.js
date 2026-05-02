import React, { useEffect, useState } from "react";
import API from "../api";
import "./style.css";

export default function TableDashboard() {
  const [tables, setTables] = useState([]);

  useEffect(() => {
    loadTables();
  }, []);

  const loadTables = async () => {
    const res = await API.get("/tables");
    setTables(res.data);
  };

  const colorMap = {
    0: "green", // Available
    1: "red", // Occupied
    2: "orange", // Reserved
    3: "gray", // Maintenance
  };

  return (
    <div>
      <h2>Table Dashboard</h2>

      <div className="grid">
        {tables.map((t) => (
          <div
            key={t.tableId}
            className="card"
            style={{ backgroundColor: colorMap[t.status] }}
          >
            <h3>Table {t.tableNumber}</h3>
            <p>Capacity: {t.capacity}</p>
            <p>Status: {t.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
