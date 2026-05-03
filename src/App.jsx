// import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
// import Tables from "./pages/Tables";
// import AvailableTables from "./pages/AvailableTables";
// import Bookings from "./pages/Bookings";
// import Orders from "./pages/Orders";
// import Menu from "./pages/Menu";

// import "./styles/app.css";

// export default function App() {
//   return (
//     <BrowserRouter>
//       <nav>
//         <Link to="/">Tables</Link>
//         <Link to="/available">Available</Link>
//         <Link to="/bookings">Bookings</Link>
//         <Link to="/menu">Menu</Link>
//         <Link to="/orders">Orders</Link>
//       </nav>

//       <div className="app-container">
//         <Routes>
//           <Route path="/" element={<Tables />} />
//           <Route path="/available" element={<AvailableTables />} />
//           <Route path="/bookings" element={<Bookings />} />
//           <Route path="/menu" element={<Menu />} />
//           <Route path="/orders" element={<Orders />} />
//         </Routes>
//       </div>
//     </BrowserRouter>
//   );
// }

import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";

import Tables from "./pages/Tables";
import AvailableTables from "./pages/AvailableTables";
import Bookings from "./pages/Bookings";
import Orders from "./pages/Orders";
import Menu from "./pages/Menu";

import "./styles/app.css";

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <BrowserRouter>
      <nav className="navbar">
        {/* BRAND */}
        <div className="brand">🍽 TableBook</div>

        {/* HAMBURGER BUTTON (mobile only) */}
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>

        {/* NAV LINKS */}
        <div className={`nav-links ${menuOpen ? "active" : ""}`}>
          <Link to="/" onClick={closeMenu}>
            Tables
          </Link>
          <Link to="/available" onClick={closeMenu}>
            Available
          </Link>
          <Link to="/bookings" onClick={closeMenu}>
            Bookings
          </Link>
          <Link to="/menu" onClick={closeMenu}>
            Menu
          </Link>
          <Link to="/orders" onClick={closeMenu}>
            Orders
          </Link>
        </div>
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
