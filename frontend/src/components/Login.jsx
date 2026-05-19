import { useState } from "react";

const rawBase = process.env.REACT_APP_API_BASE || "http://localhost:5000/api";
const API_BASE = rawBase.endsWith("/") ? rawBase.slice(0, -1) : rawBase;
console.log("الرابط المستخدم حالياً:", API_BASE);

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;900&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .login-root {
    min-height: 100vh;
    background-color: #f5f0e8;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Tajawal', sans-serif;
    padding: 20px;
    position: relative;
    overflow: hidden;
  }

  .login-root::before {
    content: '';
    position: fixed;
    inset: 0;
    background:
      radial-gradient(ellipse 80% 60% at 15% 50%, rgba(200,150,10,0.10) 0%, transparent 60%),
      radial-gradient(ellipse 60% 80% at 85% 30%, rgba(200,150,10,0.07) 0%, transparent 55%),
      radial-gradient(ellipse 100% 100% at 50% 100%, rgba(220,200,150,0.35) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }

  .login-root::after {
    content: '';
    position: fixed;
    inset: 0;
    background-image:
      linear-gradient(rgba(200,150,10,0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(200,150,10,0.05) 1px, transparent 1px);
    background-size: 60px 60px;
    pointer-events: none;
    z-index: 0;
  }

  .login-wrapper {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 460px;
    animation: fadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(30px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .card-accent {
    height: 3px;
    background: linear-gradient(90deg, transparent, #c8960a, #f0d060, #c8960a, transparent);
    border-radius: 3px 3px 0 0;
    animation: shimmer 3s ease-in-out infinite;
  }

  @keyframes shimmer {
    0%, 100% { opacity: 0.7; }
    50% { opacity: 1; }
  }

  .login-card {
    background: #ffffff;
    border: 1px solid rgba(200, 150, 10, 0.18);
    border-top: none;
    border-radius: 0 0 20px 20px;
    padding: 44px 40px 40px;
    box-shadow:
      0 2px 8px rgba(0,0,0,0.06),
      0 20px 60px rgba(0,0,0,0.10),
      inset 0 1px 0 rgba(255,255,255,0.9);
  }

  /* Header */
  .login-header {
    text-align: center;
    margin-bottom: 40px;
    direction: rtl;
  }

  .logo-ring {
    position: relative;
    width: 76px;
    height: 76px;
    margin: 0 auto 20px;
  }

  .logo-ring-outer {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 1px solid rgba(200,150,10,0.45);
    animation: spin 12s linear infinite;
  }

  .logo-ring-outer::before {
    content: '';
    position: absolute;
    top: -2px; left: 50%;
    transform: translateX(-50%);
    width: 5px; height: 5px;
    background: #c8960a;
    border-radius: 50%;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .logo-inner {
    position: absolute;
    inset: 8px;
    background: linear-gradient(135deg, #fdf8e8, #fffbf0);
    border-radius: 50%;
    border: 1px solid rgba(200,150,10,0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
    box-shadow: 0 2px 12px rgba(200,150,10,0.12);
  }

  .brand-name {
    font-family: 'Playfair Display', serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 5px;
    text-transform: uppercase;
    color: #c8960a;
    margin-bottom: 10px;
    opacity: 0.9;
  }

  .login-subtitle {
    color: rgba(90, 65, 20, 0.5);
    font-size: 14px;
    font-weight: 400;
  }

  /* Divider */
  .divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 32px;
  }
  .divider::before {
    content: ''; flex: 1; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(200,150,10,0.25));
  }
  .divider::after {
    content: ''; flex: 1; height: 1px;
    background: linear-gradient(90deg, rgba(200,150,10,0.25), transparent);
  }
  .divider-diamond {
    width: 6px; height: 6px;
    background: #c8960a;
    transform: rotate(45deg);
    opacity: 0.55;
  }

  /* Error */
  .error-box {
    background: #fff5f5;
    border: 1px solid #fca5a5;
    color: #dc2626;
    padding: 12px 16px;
    border-radius: 10px;
    text-align: center;
    margin-bottom: 24px;
    font-size: 14px;
    direction: rtl;
    font-weight: 600;
    animation: shake 0.4s ease;
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-6px); }
    75% { transform: translateX(6px); }
  }

  /* Form */
  .field-group {
    margin-bottom: 20px;
    direction: rtl;
  }

  .field-label {
    display: block;
    margin-bottom: 8px;
    color: #5a4010;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.4px;
  }

  .field-wrap { position: relative; }

  .field-input {
    width: 100%;
    padding: 14px 18px;
    background: #faf8f2;
    border: 1.5px solid #e8dfc8;
    border-radius: 12px;
    color: #1e1608;
    font-size: 15px;
    font-family: 'Tajawal', sans-serif;
    direction: rtl;
    outline: none;
    transition: border-color 0.25s, background 0.25s, box-shadow 0.25s;
    -webkit-appearance: none;
  }

  .field-input::placeholder {
    color: #c8b070;
    font-size: 14px;
  }

  .field-input:focus {
    border-color: #c8960a;
    background: #fffef8;
    box-shadow: 0 0 0 3px rgba(200,150,10,0.10);
  }

  /* Submit */
  .submit-btn {
    width: 100%;
    padding: 16px;
    margin-top: 10px;
    background: linear-gradient(135deg, #b07808 0%, #d4a010 40%, #f0c830 70%, #c08808 100%);
    color: #fff;
    border: none;
    border-radius: 12px;
    font-size: 17px;
    font-weight: 900;
    font-family: 'Tajawal', sans-serif;
    cursor: pointer;
    letter-spacing: 0.5px;
    position: relative;
    overflow: hidden;
    transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 4px 20px rgba(200,150,10,0.35), inset 0 1px 0 rgba(255,255,255,0.25);
    text-shadow: 0 1px 2px rgba(0,0,0,0.15);
  }

  .submit-btn::before {
    content: '';
    position: absolute; top: 0; left: -100%;
    width: 100%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent);
    transition: left 0.5s;
  }

  .submit-btn:hover:not(:disabled)::before { left: 100%; }

  .submit-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 8px 28px rgba(200,150,10,0.45), inset 0 1px 0 rgba(255,255,255,0.25);
  }

  .submit-btn:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 2px 10px rgba(200,150,10,0.3);
  }

  .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

  .loading-dots span { display: inline-block; animation: dot-bounce 1.2s ease-in-out infinite; }
  .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
  .loading-dots span:nth-child(3) { animation-delay: 0.4s; }
  @keyframes dot-bounce {
    0%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-5px); }
  }

  /* Footer link */
  .register-link {
    text-align: center;
    margin-top: 28px;
    color: rgba(90, 65, 20, 0.5);
    font-size: 14px;
    direction: rtl;
  }

  .register-link-btn {
    color: #b07808;
    font-weight: 700;
    cursor: pointer;
    background: none;
    border: none;
    font-family: 'Tajawal', sans-serif;
    font-size: 14px;
    padding: 0;
    margin-right: 4px;
    position: relative;
    transition: color 0.2s;
  }

  .register-link-btn::after {
    content: '';
    position: absolute;
    bottom: -1px; left: 0; right: 0;
    height: 1px;
    background: #b07808;
    transform: scaleX(0);
    transform-origin: center;
    transition: transform 0.25s;
  }

  .register-link-btn:hover { color: #d4a010; }
  .register-link-btn:hover::after { transform: scaleX(1); }

  /* Security badge */
  .security-badge {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    margin-top: 22px;
    color: rgba(200,150,10,0.4);
    font-size: 12px;
    direction: rtl;
  }

  .security-badge-dot {
    width: 5px; height: 5px;
    background: rgba(200,150,10,0.35);
    border-radius: 50%;
  }

  @media (max-width: 480px) {
    .login-card { padding: 36px 22px 32px; }
  }
`;

export default function Login({ onLogin, onSwitchToRegister }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "فشل تسجيل الدخول");

    sessionStorage.setItem("token", data.token);
    
    onLogin(data.user);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <>
      <style>{styles}</style>
      <div className="login-root">
        <div className="login-wrapper">

          <div className="card-accent" />

          <div className="login-card">
            <div className="login-header">
              <div className="logo-ring">
                <div className="logo-ring-outer" />
                <div className="logo-inner">🪙</div>
              </div>
              <p className="brand-name">Gold Certificate System</p>
              <p className="login-subtitle">نظام إصدار شهادات وزن الذهب</p>
            </div>

            <div className="divider">
              <div className="divider-diamond" />
            </div>

            {error && <div className="error-box"> {error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="field-group">
                <label className="field-label">اسم المستخدم</label>
                <div className="field-wrap">
                  <input
                    type="text"
                    className="field-input"
                    placeholder="أدخل اسم المستخدم"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                    required
                  />
                </div>
              </div>

              <div className="field-group" style={{ marginBottom: 28 }}>
                <label className="field-label">كلمة المرور</label>
                <div className="field-wrap">
                  <input
                    type="password"
                    className="field-input"
                    placeholder="أدخل كلمة المرور"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? (
                  <span className="loading-dots">
                    جاري تسجيل الدخول<span>.</span><span>.</span><span>.</span>
                  </span>
                ) : "تسجيل الدخول"}
              </button>
            </form>

            {/* <p className="register-link">
              ليس لديك حساب؟
              <button className="register-link-btn" onClick={onSwitchToRegister}>
                إنشاء حساب جديد
              </button>
            </p>  */}

            <div className="security-badge">
              <div className="security-badge-dot" />
              <div className="security-badge-dot" />
            </div>
          </div>

        </div>
      </div>
    </>
  );
}