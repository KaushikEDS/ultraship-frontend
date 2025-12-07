import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import EmployeeList from "./components/EmployeeList";
import FeaturesPage from "./pages/Features";
import PricingPage from "./pages/Pricing";
import ResourcesPage from "./pages/Resources";
import ContactPage from "./pages/Contact";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="content">
          <Routes>
            <Route path="/" element={<EmployeeList />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/features/tracking" element={<FeaturesPage />} />
            <Route path="/features/rates" element={<FeaturesPage />} />
            <Route path="/features/analytics" element={<FeaturesPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/resources/docs" element={<ResourcesPage />} />
            <Route path="/resources/api" element={<ResourcesPage />} />
            <Route path="/resources/support" element={<ResourcesPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
