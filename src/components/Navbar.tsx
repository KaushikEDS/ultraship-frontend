import { useState } from "react";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import "./Navbar.css";

function Navbar() {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-logo">
            <h2>Ultraship</h2>
          </div>

          <div className="navbar-menu">
            <a href="/" className="active">
              Employees
            </a>
          </div>

          <Button icon="pi pi-bars" onClick={() => setVisible(true)} className="hamburger-btn" text aria-label="Menu" />
        </div>
      </nav>

      <Sidebar visible={visible} onHide={() => setVisible(false)} position="right">
        <h2>Menu</h2>
        <ul className="mobile-menu">
          <li>
            <a href="/" onClick={() => setVisible(false)}>
              <i className="pi pi-users"></i>
              Employees
            </a>
          </li>
        </ul>
      </Sidebar>
    </>
  );
}

export default Navbar;
