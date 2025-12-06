import { useState } from "react";
import { Menubar } from "primereact/menubar";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { MenuItem } from "primereact/menuitem";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [visible, setVisible] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const navigate = useNavigate();

  const toggleSubmenu = (menu: string) => {
    setOpenSubmenu(openSubmenu === menu ? null : menu);
  };

  const menuItems: MenuItem[] = [
    {
      label: "Home",
      icon: "pi pi-home",
      command: () => navigate("/"),
    },
    {
      label: "Features",
      icon: "pi pi-star",
      items: [
        {
          label: "Shipment Tracking",
          command: () => navigate("/features/tracking"),
        },
        {
          label: "Rate Management",
          command: () => navigate("/features/rates"),
        },
        {
          label: "Analytics",
          command: () => navigate("/features/analytics"),
        },
      ],
    },
    {
      label: "Pricing",
      icon: "pi pi-dollar",
      command: () => navigate("/pricing"),
    },
    {
      label: "Resources",
      icon: "pi pi-book",
      items: [
        {
          label: "Documentation",
          command: () => navigate("/resources/docs"),
        },
        {
          label: "API Guide",
          command: () => navigate("/resources/api"),
        },
        {
          label: "Support",
          command: () => navigate("/resources/support"),
        },
      ],
    },
    {
      label: "Employees",
      icon: "pi pi-users",
      command: () => navigate("/"),
    },
    {
      label: "Contact",
      icon: "pi pi-envelope",
      command: () => navigate("/contact"),
    },
  ];

  const start = (
    <div className="navbar-logo">
      <img src="https://www.ultrashiptms.ai/logo.svg" alt="UltraShip" className="logo-image" />
    </div>
  );

  const end = <Button icon="pi pi-bars" onClick={() => setVisible(true)} className="hamburger-btn" text aria-label="Menu" />;

  return (
    <>
      <div className="navbar-wrapper">
        <Menubar model={menuItems} start={start} end={end} />
      </div>

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
                  <Link to="/features/tracking" onClick={() => setVisible(false)}>
                    Shipment Tracking
                  </Link>
                </li>
                <li>
                  <Link to="/features/rates" onClick={() => setVisible(false)}>
                    Rate Management
                  </Link>
                </li>
                <li>
                  <Link to="/features/analytics" onClick={() => setVisible(false)}>
                    Analytics
                  </Link>
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
                  <Link to="/resources/docs" onClick={() => setVisible(false)}>
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link to="/resources/api" onClick={() => setVisible(false)}>
                    API Guide
                  </Link>
                </li>
                <li>
                  <Link to="/resources/support" onClick={() => setVisible(false)}>
                    Support
                  </Link>
                </li>
              </ul>
            )}
          </li>

          <li>
            <Link to="/" onClick={() => setVisible(false)}>
              <i className="pi pi-users"></i>
              Employees
            </Link>
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
