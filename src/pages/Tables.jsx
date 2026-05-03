// import { useEffect, useState } from "react";
// import api from "../api/api";
// import "../styles/tables.css";

// export default function Tables() {
//   const [tables, setTables] = useState([]);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [message, setMessage] = useState({ text: "", type: "" });
//   const [filter, setFilter] = useState("available");

//   useEffect(() => {
//     document.title = "Tables";

//     const link = document.querySelector("link[rel~='icon']");
//     if (link) {
//       link.href = "Tables1.png"; // your icon
//     }
//     loadTables();
//   }, []);

//   const loadTables = () => {
//     api.get("/tables").then((res) => setTables(res.data));
//   };

//   const showMessage = (text, type = "error") => {
//     setMessage({ text, type });
//     setTimeout(() => setMessage({ text: "", type: "" }), 3000);
//   };

//   const getErrorMessage = (err) => {
//     const data = err.response?.data;
//     if (!data) return "⚠️ Something went wrong";
//     if (typeof data === "string") return data;
//     if (data.title) return data.title;
//     if (data.errors) {
//       const first = Object.values(data.errors)[0];
//       return first?.[0] || "Validation error";
//     }
//     return "⚠️ Request failed";
//   };

//   // =========================
//   // VIEW DETAILS
//   // =========================
//   const viewDetails = async (tableId) => {
//     try {
//       const res = await api.get(`/orders/table/${tableId}`);

//       if (!res.data) {
//         showMessage("📭 No active orders found");
//         setSelectedOrder(null);
//         return;
//       }

//       setSelectedOrder(res.data);
//     } catch {
//       setSelectedOrder(null);
//       showMessage("📭 No active orders found");
//     }
//   };

//   // =========================
//   // BILL
//   // =========================
//   const billOrders = async () => {
//     try {
//       const tableId = selectedOrder?.tableId;
//       if (!tableId) return showMessage("❌ Table ID missing");

//       await api.put(`/orders/table/${tableId}/bill`);

//       showMessage("💰 Billed successfully", "success");
//       setSelectedOrder(null);
//       loadTables();
//     } catch (err) {
//       showMessage(getErrorMessage(err));
//     }
//   };

//   // =========================
//   // COMPLETE TABLE
//   // =========================
//   const completeTable = async (tableId) => {
//     try {
//       await api.put(`/tables/${tableId}/complete`);
//       showMessage("✅ Table completed", "success");
//       loadTables();
//     } catch (err) {
//       showMessage(getErrorMessage(err));
//     }
//   };

//   // =========================
//   // CANCEL BOOKING
//   // =========================
//   const cancelBookingByTable = async (tableId) => {
//     try {
//       const res = await api.get("/bookings");

//       const booking = res.data.find(
//         (b) =>
//           b.tableId === tableId &&
//           (b.status === "Confirmed" || b.status === "Seated"),
//       );

//       if (!booking) {
//         showMessage("❌ No active booking found for this table");
//         return;
//       }

//       await api.put(`/bookings/${booking.bookingId}/cancel`);

//       showMessage("❌ Booking cancelled successfully", "success");
//       loadTables();
//     } catch (err) {
//       showMessage(getErrorMessage(err));
//     }
//   };

//   // =========================
//   // FILTER LOGIC
//   // =========================
//   const filteredTables = tables.filter((t) => {
//     if (filter === "available") return t.status === 0;
//     if (filter === "occupied") return t.status === 1;
//     if (filter === "reserved") return t.status === 2;
//     if (filter === "maintenance") return t.status === 3;
//     return true;
//   });

//   const statusConfig = {
//     0: { label: "Available", className: "available" },
//     1: { label: "Occupied", className: "occupied" },
//     2: { label: "Reserved", className: "reserved" },
//     3: { label: "Maintenance", className: "maintenance" },
//   };

//   // =========================
//   // EMPTY STATE FIX (ADDED)
//   // =========================
//   const emptyMessages = {
//     available: "🚫 No Available Tables Found",
//     occupied: "🚫 No Occupied Tables Found",
//     reserved: "🚫 No Reserved Tables Found",
//     maintenance: "🚫 No Maintenance Tables Found",
//   };

//   return (
//     <div className="page">
//       {/* HEADER */}
//       <div className="header-row">
//         <h2>🍽 Restaurant Tables</h2>

//         <div className="filter-tabs">
//           {["available", "occupied", "reserved", "maintenance"].map((f) => (
//             <button
//               key={f}
//               onClick={() => setFilter(f)}
//               className={filter === f ? "active" : ""}
//             >
//               {f.toUpperCase()}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* MESSAGE */}
//       {message.text && (
//         <div className={`msg-banner ${message.type}`}>
//           {String(message.text)}
//         </div>
//       )}

//       {/* TABLE GRID OR EMPTY STATE */}
//       {filteredTables.length === 0 ? (
//         <div className="empty-state">
//           <h3>{emptyMessages[filter]}</h3>
//         </div>
//       ) : (
//         <div className="table-grid">
//           {filteredTables.map((t) => {
//             const status = statusConfig[t.status];

//             return (
//               <div key={t.tableId} className={`table-card ${status.className}`}>
//                 <div className="table-header">
//                   <h3>Table {t.tableNumber}</h3>
//                   <span className="status-badge">{status.label}</span>
//                 </div>

//                 <div className="table-body">
//                   <p>👥 Capacity: {t.capacity}</p>
//                 </div>

//                 {t.status === 3 ? (
//                   <button
//                     className="table-btn complete-btn"
//                     onClick={() => completeTable(t.tableId)}
//                   >
//                     🔧 Complete Maintenance
//                   </button>
//                 ) : (
//                   <>
//                     {(t.status === 1 || t.status === 2) && (
//                       <button
//                         className="table-btn"
//                         onClick={() => viewDetails(t.tableId)}
//                       >
//                         View Details
//                       </button>
//                     )}

//                     {(t.status === 1 || t.status === 2) && (
//                       <button
//                         className="table-btn complete-btn"
//                         onClick={() => completeTable(t.tableId)}
//                       >
//                         Complete
//                       </button>
//                     )}

//                     {(t.status === 1 || t.status === 2) && (
//                       <button
//                         className="table-btn"
//                         style={{ background: "#ef4444", color: "white" }}
//                         onClick={() => cancelBookingByTable(t.tableId)}
//                       >
//                         ❌ Cancel Booking
//                       </button>
//                     )}
//                   </>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {/* ORDER MODAL */}
//       {selectedOrder && (
//         <div className="modal" onClick={() => setSelectedOrder(null)}>
//           <div className="modal-card" onClick={(e) => e.stopPropagation()}>
//             <h3>🧾 Order Details</h3>

//             <p>
//               <b>{selectedOrder.orderNumber}</b>
//             </p>

//             <p>💰 Total: ₹{selectedOrder.totalAmount}</p>

//             <hr />

//             {(selectedOrder.orderItems || []).map((i, idx) => (
//               <div key={idx}>
//                 🍽 {i.menuItem?.name} × {i.quantity}
//               </div>
//             ))}

//             <button className="table-btn" onClick={billOrders}>
//               💰 Bill All
//             </button>

//             <button
//               className="close-btn"
//               onClick={() => setSelectedOrder(null)}
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import api from "../api/api";

export default function Tables() {
  const [tables, setTables] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [filter, setFilter] = useState("available");

  useEffect(() => {
    document.title = "Tables";
    loadTables();
  }, []);

  const loadTables = () => {
    api.get("/tables").then((res) => setTables(res.data));
  };

  const showMessage = (text, type = "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  const filteredTables = tables.filter((t) => {
    if (filter === "available") return t.status === 0;
    if (filter === "occupied") return t.status === 1;
    if (filter === "reserved") return t.status === 2;
    if (filter === "maintenance") return t.status === 3;
    return true;
  });

  const statusConfig = {
    0: "text-green-400",
    1: "text-red-400",
    2: "text-yellow-400",
    3: "text-gray-400",
  };

  const completeTable = async (tableId) => {
    try {
      await api.put(`/tables/${tableId}/complete`);
      showMessage("Table completed", "success");
      loadTables();
    } catch {
      showMessage("Error completing table");
    }
  };

  return (
    <div className="p-4 md:p-6 text-gray-200">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 border-b border-yellow-500/20 pb-3">
        <h2 className="text-yellow-400 text-xl md:text-2xl font-bold">
          🍽 Restaurant Tables
        </h2>

        {/* FILTERS */}
        <div className="flex flex-wrap gap-2">
          {["available", "occupied", "reserved", "maintenance"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-lg text-sm border transition ${
                filter === f
                  ? "bg-yellow-500 text-black"
                  : "bg-slate-800 border-slate-700 text-gray-300"
              }`}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* MESSAGE */}
      {message.text && (
        <div
          className={`mt-3 p-3 rounded-lg text-sm ${
            message.type === "success"
              ? "bg-green-500/20 text-green-400"
              : "bg-red-500/20 text-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* GRID */}
      {filteredTables.length === 0 ? (
        <div className="mt-6 flex justify-center items-center h-40 border border-dashed border-slate-700 rounded-lg text-gray-400">
          No tables found
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
          {filteredTables.map((t) => (
            <div
              key={t.tableId}
              className="bg-slate-900 border border-slate-700 rounded-xl p-4 hover:border-yellow-500 transition"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-bold">Table {t.tableNumber}</h3>
                <span className={`text-sm ${statusConfig[t.status]}`}>●</span>
              </div>

              <p className="text-gray-400 text-sm mt-1">
                Capacity: {t.capacity}
              </p>

              {(t.status === 1 || t.status === 2) && (
                <button className="mt-3 w-full bg-yellow-500 text-black py-2 rounded-lg text-sm">
                  View Details
                </button>
              )}

              <button
                onClick={() => completeTable(t.tableId)}
                className="mt-2 w-full bg-green-500 text-white py-2 rounded-lg text-sm"
              >
                Complete
              </button>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-slate-900 w-full max-w-md rounded-xl p-4">
            <h3 className="text-lg font-bold mb-2">Order Details</h3>

            <p className="text-sm text-gray-400">
              Total: ₹{selectedOrder.totalAmount}
            </p>

            <div className="mt-3 space-y-1 text-sm">
              {(selectedOrder.orderItems || []).map((i, idx) => (
                <div key={idx}>
                  🍽 {i.menuItem?.name} × {i.quantity}
                </div>
              ))}
            </div>

            <button className="mt-4 w-full bg-yellow-500 text-black py-2 rounded-lg">
              Bill All
            </button>

            <button
              onClick={() => setSelectedOrder(null)}
              className="mt-2 w-full bg-red-500 text-white py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
