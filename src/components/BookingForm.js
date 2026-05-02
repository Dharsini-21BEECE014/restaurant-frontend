import React, { useEffect, useState } from "react";
import API from "../api";

export default function BookingForm() {
  const [tables, setTables] = useState([]);

  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    tableId: "",
    bookingDate: "",
    guestCount: "",
  });

  // ✅ Load available tables
  useEffect(() => {
    API.get("/tables/available")
      .then((res) => setTables(res.data))
      .catch((err) => console.log(err));
  }, []);

  // ✅ Handle input change
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ Submit booking
  const submit = async () => {
    try {
      // Convert payload properly (IMPORTANT FIX)
      const payload = {
        customerName: form.customerName,
        customerPhone: form.customerPhone,
        tableId: Number(form.tableId),
        guestCount: Number(form.guestCount),
        bookingDate: form.bookingDate,
      };

      // Validation
      if (
        !payload.customerName ||
        !payload.customerPhone ||
        !payload.tableId ||
        !payload.bookingDate ||
        !payload.guestCount
      ) {
        alert("All fields are required");
        return;
      }

      if (payload.guestCount <= 0) {
        alert("Guest count must be greater than 0");
        return;
      }

      if (new Date(payload.bookingDate) <= new Date()) {
        alert("Booking date must be in future");
        return;
      }

      // API call
      const res = await API.post("/bookings", payload);

      alert("Booking Created: " + res.data.bookingNumber);

      // Reset form
      setForm({
        customerName: "",
        customerPhone: "",
        tableId: "",
        bookingDate: "",
        guestCount: "",
      });
    } catch (err) {
      console.log(err);
      alert(err.response?.data || "Error creating booking");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>📅 Create Booking</h2>

      {/* NAME */}
      <input
        name="customerName"
        placeholder="Customer Name"
        value={form.customerName}
        onChange={handleChange}
      />

      {/* PHONE */}
      <input
        name="customerPhone"
        placeholder="Phone"
        value={form.customerPhone}
        onChange={handleChange}
      />

      {/* TABLE DROPDOWN (FIXED AS REQUIRED) */}
      <select name="tableId" value={form.tableId} onChange={handleChange}>
        <option value="">Select Table</option>
        {tables.map((t) => (
          <option key={t.tableId} value={t.tableId}>
            {t.tableNumber} (Capacity: {t.capacity})
          </option>
        ))}
      </select>

      {/* DATE */}
      <input
        type="datetime-local"
        name="bookingDate"
        value={form.bookingDate}
        onChange={handleChange}
      />

      {/* GUEST COUNT */}
      <input
        name="guestCount"
        type="number"
        placeholder="Guests"
        value={form.guestCount}
        onChange={handleChange}
      />

      {/* SUBMIT BUTTON */}
      <button onClick={submit}>Create Booking</button>
    </div>
  );
}
