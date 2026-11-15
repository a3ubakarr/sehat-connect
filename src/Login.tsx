import { useState } from "react";
import { DemoAccount, authenticate } from "./auth";

export function Login({ onLogin }: { onLogin: (account: DemoAccount) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const account = authenticate(username, password);
    if (!account) {
      setError("The username or password is incorrect. Please try again.");
      return;
    }
    setError("");
    onLogin(account);
  };
  return (
    <main className="login-page">
      <section className="login-brand-panel">
        <div className="login-brand">
          <span className="login-logo-mark">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M3 12h4l2-7 4 14 2-7h6" />
            </svg>
          </span>
          <div>
            <strong>
              SEHAT <i>CONNECT</i>
            </strong>
            <small>Care. Connected.</small>
          </div>
        </div>
        <div className="login-message">
          <span className="login-kicker">COORDINATED FAMILY HEALTHCARE</span>
          <h1>
            Care for your family,
            <br />
            wherever you are.
          </h1>
          <p>One private place to coordinate appointments, records, reports and follow-up care.</p>
        </div>
        <div className="login-trust">
          <span>✓</span>
          <div>
            <strong>Privacy-first demonstration</strong>
            <small>Fictional data only · Not for clinical use</small>
          </div>
        </div>
      </section>
      <section className="login-form-panel">
        <div className="login-form-wrap">
          <div className="login-mobile-brand">
            <span className="login-logo-mark">SC</span>
            <div>
              <strong>SEHAT CONNECT</strong>
              <small>Care. Connected.</small>
            </div>
          </div>
          <div className="login-heading">
            <span>WELCOME TO SEHAT CONNECT</span>
            <h2>Sign in to your account</h2>
            <p>Enter your username and password to open your workspace.</p>
          </div>
          <form className="login-form" onSubmit={submit}>
            <label>
              Username
              <input
                autoComplete="username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError("");
                }}
                placeholder="Enter your username"
                autoFocus
              />
            </label>
            <label>
              Password
              <div className="password-field">
                <input
                  autoComplete="current-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </label>
            {error && (
              <div className="login-error" role="alert">
                <span>!</span>
                {error}
              </div>
            )}
            <button className="login-submit" type="submit">
              Sign in securely <span>→</span>
            </button>
          </form>
          <p className="login-footer">
            Prototype experience · Frontend role controls are not production security
          </p>
        </div>
      </section>
    </main>
  );
}
