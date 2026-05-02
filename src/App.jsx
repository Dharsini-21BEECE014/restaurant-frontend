import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Tables from "./pages/Tables";
import AvailableTables from "./pages/AvailableTables";
import Bookings from "./pages/Bookings";
import Orders from "./pages/Orders";
import Menu from "./pages/Menu";

import "./styles/app.css";

export default function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Tables</Link>
        <Link to="/available">Available</Link>
        <Link to="/bookings">Bookings</Link>
        <Link to="/menu">Menu</Link>
        <Link to="/orders">Orders</Link>
      </nav>

      <div className="app-container">
        <Routes>
          <Route path="/" element={<Tables />} />
          <Route path="/available" element={<AvailableTables />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/orders" element={<Orders />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
