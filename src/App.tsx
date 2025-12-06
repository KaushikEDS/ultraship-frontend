import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ApolloProvider } from "@apollo/client/react";
import apolloClient from "./config/apollo-client";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import EmployeeList from "./components/EmployeeList";
import FeaturesPage from "./pages/Features";
import PricingPage from "./pages/Pricing";
import ResourcesPage from "./pages/Resources";
import ContactPage from "./pages/Contact";
import Login from "./pages/Login";
import "./App.css";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="App">
      {isAuthenticated && <Navbar />}
      <main className="content">
        <Routes>
          <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <EmployeeList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/features"
            element={
              <ProtectedRoute>
                <FeaturesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/features/tracking"
            element={
              <ProtectedRoute>
                <FeaturesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/features/rates"
            element={
              <ProtectedRoute>
                <FeaturesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/features/analytics"
            element={
              <ProtectedRoute>
                <FeaturesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pricing"
            element={
              <ProtectedRoute>
                <PricingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resources"
            element={
              <ProtectedRoute>
                <ResourcesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resources/docs"
            element={
              <ProtectedRoute>
                <ResourcesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resources/api"
            element={
              <ProtectedRoute>
                <ResourcesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resources/support"
            element={
              <ProtectedRoute>
                <ResourcesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contact"
            element={
              <ProtectedRoute>
                <ContactPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;
