import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Message } from "primereact/message";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(username, password);
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Card className="login-card">
        <div className="login-header">
          <img src="https://www.ultrashiptms.ai/logo.svg" alt="UltraShip" className="login-logo" />
          <h2>Welcome Back</h2>
          <p>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <Message severity="error" text={error} className="login-error" />}

          <div className="form-field">
            <label htmlFor="username">Username</label>
            <InputText
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              autoFocus
            />
          </div>

          <div className="form-field">
            <label htmlFor="password">Password</label>
            <Password
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              feedback={false}
              toggleMask
              required
            />
          </div>

          <div className="demo-credentials">
            <p>
              <strong>Demo Credentials:</strong>
            </p>
            <p>
              Admin: <code>admin</code> / <code>admin123</code>
            </p>
            <p>
              Employee: <code>employee</code> / <code>employee123</code>
            </p>
          </div>

          <Button
            type="submit"
            label={loading ? "Signing in..." : "Sign In"}
            icon={loading ? "pi pi-spin pi-spinner" : "pi pi-sign-in"}
            className="login-button"
            disabled={loading}
          />
        </form>
      </Card>
    </div>
  );
}

export default Login;
