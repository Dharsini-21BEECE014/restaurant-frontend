import { useEffect, useState } from "react";
import api from "../api/api";
import "../styles/menu.css";
// import { Helmet } from "react-helmet";

export default function Menu() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    document.title = "Menu-items";

    const link = document.querySelector("link[rel~='icon']");
    if (link) {
      link.href = "Menu1.png"; // your icon
    }
    api.get("/menu-items").then((res) => setItems(res.data));
  }, []);

  return (
    <div className="page">
      <div className="header-row">
        {/* <Helmet>
          <title>Menu</title>
        </Helmet> */}
        <h2>🍽 Menu</h2>
      </div>
      <div className="menu-grid">
        {items.map((item) => (
          <div key={item.menuItemId} className="menu-card">
            <h3>{item.name}</h3>
            <p>₹ {item.price}</p>
            <p>{item.description}</p>
            <span className="category">{item.menuCategory?.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
