// ==========================================================================
// CAREERLY — LOGIN PAGE
// ==========================================================================
import React, { useState } from "react";
import Button from "../components/Button";
import Icon from "../components/Icons";

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e) => {
    e.preventDefault();
    onLogin?.();
  };

  return (
    <div className="app">
      <main className="login-page">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true" />
          Careerly
        </div>

        <form className="login-form" onSubmit={submit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button variant="primary" type="submit">Sign in</Button>
        </form>

        <div className="divider">or</div>

        <Button variant="outline" icon={<Icon name="mail" size={18} />} onClick={() => {}}>
          Continue with Google
        </Button>

        <p className="alt-link">
          New here? <a href="#" onClick={(e) => { e.preventDefault(); }}>Create an account</a>
        </p>
      </main>
    </div>
  );
}
