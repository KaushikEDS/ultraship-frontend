import { useState } from "react";
import { Link } from "react-router-dom";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import "./Navbar.css";

function Navbar() {
  const [visible, setVisible] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const toggleSubmenu = (menu: string) => {
    setOpenSubmenu(openSubmenu === menu ? null : menu);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-logo">
            <img src="https://www.ultrashiptms.ai/logo.svg" alt="UltraShip" className="logo-image" />
          </div>

          <div className="navbar-menu">
            <Link to="/">Home</Link>

            <div className="menu-item-with-dropdown">
              <Link to="/features">Features</Link>
              <div className="dropdown">
                <a href="#tracking">Shipment Tracking</a>
                <a href="#rates">Rate Management</a>
                <a href="#analytics">Analytics</a>
              </div>
            </div>

            <Link to="/pricing">Pricing</Link>

            <div className="menu-item-with-dropdown">
              <Link to="/resources">Resources</Link>
              <div className="dropdown">
                <a href="#docs">Documentation</a>
                <a href="#api">API Guide</a>
                <a href="#support">Support</a>
              </div>
            </div>

            <Link to="/contact">Contact</Link>
          </div>

          <Button icon="pi pi-bars" onClick={() => setVisible(true)} className="hamburger-btn" text aria-label="Menu" />
        </div>
      </nav>

      <Sidebar visible={visible} onHide={() => setVisible(false)} position="right">
        <h2>Menu</h2>
        <ul className="mobile-menu">
          <li>
            <Link to="/" onClick={() => setVisible(false)}>
              <i className="pi pi-home"></i>
              Home
            </Link>
          </li>

          <li className="has-submenu">
            <div className="menu-header" onClick={() => toggleSubmenu("features")}>
              <span>
                <i className="pi pi-star"></i>
                Features
              </span>
              <i className={`pi ${openSubmenu === "features" ? "pi-chevron-up" : "pi-chevron-down"}`}></i>
            </div>
            {openSubmenu === "features" && (
              <ul className="submenu">
                <li>
                  <a href="#tracking" onClick={() => setVisible(false)}>
                    Shipment Tracking
                  </a>
                </li>
                <li>
                  <a href="#rates" onClick={() => setVisible(false)}>
                    Rate Management
                  </a>
                </li>
                <li>
                  <a href="#analytics" onClick={() => setVisible(false)}>
                    Analytics
                  </a>
                </li>
              </ul>
            )}
          </li>

          <li>
            <Link to="/pricing" onClick={() => setVisible(false)}>
              <i className="pi pi-dollar"></i>
              Pricing
            </Link>
          </li>

          <li className="has-submenu">
            <div className="menu-header" onClick={() => toggleSubmenu("resources")}>
              <span>
                <i className="pi pi-book"></i>
                Resources
              </span>
              <i className={`pi ${openSubmenu === "resources" ? "pi-chevron-up" : "pi-chevron-down"}`}></i>
            </div>
            {openSubmenu === "resources" && (
              <ul className="submenu">
                <li>
                  <a href="#docs" onClick={() => setVisible(false)}>
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#api" onClick={() => setVisible(false)}>
                    API Guide
                  </a>
                </li>
                <li>
                  <a href="#support" onClick={() => setVisible(false)}>
                    Support
                  </a>
                </li>
              </ul>
            )}
          </li>

          <li>
            <Link to="/contact" onClick={() => setVisible(false)}>
              <i className="pi pi-envelope"></i>
              Contact
            </Link>
          </li>
        </ul>
      </Sidebar>
    </>
  );
}

export default Navbar;
