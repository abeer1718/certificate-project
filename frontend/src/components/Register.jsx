import { useState } from "react";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000/api";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;900&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .reg-root {
    min-height: 100vh;
    background: #f7f3ee;
    display: flex;
    font-family: 'Tajawal', sans-serif;
    position: relative;
    overflow: hidden;
  }

  /* Ambient warm glow */
  .reg-root::before {
    content: '';
    position: fixed; inset: 0;
    background:
      radial-gradient(ellipse 70% 55% at 90% 15%, rgba(200,150,10,0.09) 0%, transparent 55%),
      radial-gradient(ellipse 60% 60% at 10% 85%, rgba(200,150,10,0.06) 0%, transparent 50%);
    pointer-events: none; z-index: 0;
  }

  /* Left decorative panel */
  .reg-panel {
    display: none;
    width: 42%;
    background: linear-gradient(160deg, #c8960a 0%, #e8b800 40%, #f5d060 70%, #c8960a 100%);
    position: relative;
    overflow: hidden;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 48px;
  }

  @media (min-width: 900px) { .reg-panel { display: flex; } }

  .panel-pattern {
    position: absolute; inset: 0;
    background-image:
      radial-gradient(circle at 20% 25%, rgba(255,255,255,0.18) 0%, transparent 40%),
      radial-gradient(circle at 80% 75%, rgba(255,255,255,0.10) 0%, transparent 40%),
      repeating-linear-gradient(45deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 16px);
    pointer-events: none;
  }

  .panel-content { position: relative; z-index: 1; text-align: center; color: #fff; }

  .panel-icon {
    width: 96px; height: 96px; margin: 0 auto 28px;
    background: rgba(255,255,255,0.2);
    border: 2px solid rgba(255,255,255,0.4);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 42px;
    box-shadow: 0 8px 40px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.3);
  }

  .panel-title {
    font-family: 'Playfair Display', serif;
    font-size: 30px; font-weight: 700;
    color: #fff; line-height: 1.25; margin-bottom: 14px;
    text-shadow: 0 2px 12px rgba(0,0,0,0.15);
  }

  .panel-divider {
    width: 48px; height: 2px;
    background: rgba(255,255,255,0.5);
    margin: 22px auto; border-radius: 2px;
  }

  .panel-subtitle {
    font-size: 15px; color: rgba(255,255,255,0.75);
    font-weight: 400; direction: rtl; line-height: 1.8;
  }

  .panel-steps {
    margin-top: 32px; direction: rtl; text-align: right;
    display: flex; flex-direction: column; gap: 14px;
  }

  .panel-step {
    display: flex; align-items: center; gap: 12px;
    color: rgba(255,255,255,0.85); font-size: 14px; font-weight: 600;
  }

  .step-num {
    width: 28px; height: 28px; flex-shrink: 0;
    background: rgba(255,255,255,0.25);
    border: 1px solid rgba(255,255,255,0.4);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 900; color: #fff;
  }

  .panel-tagline {
    font-family: 'Playfair Display', serif;
    font-size: 11px; letter-spacing: 3px; text-transform: uppercase;
    color: rgba(255,255,255,0.55); margin-top: 40px;
  }

  /* Right form section */
  .reg-form-side {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 24px;
    background: #faf8f5;
    position: relative;
  }

  .reg-form-side::before {
    content: '';
    position: absolute; inset: 0;
    background-image:
      radial-gradient(circle at 80% 10%, rgba(200,150,10,0.07) 0%, transparent 50%),
      radial-gradient(circle at 20% 90%, rgba(200,150,10,0.05) 0%, transparent 40%);
    pointer-events: none;
  }

  .reg-wrapper {
    position: relative; z-index: 1;
    width: 100%; max-width: 440px;
    animation: fadeUp 0.65s cubic-bezier(0.16,1,0.3,1) both;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* Mobile logo */
  .mobile-logo { text-align: center; margin-bottom: 32px; }
  @media (min-width: 900px) { .mobile-logo { display: none; } }

  .mobile-logo-icon {
    width: 68px; height: 68px; margin: 0 auto 12px;
    background: linear-gradient(135deg, #c8960a, #f0d060);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 30px;
    box-shadow: 0 4px 20px rgba(200,150,10,0.3);
  }

  .mobile-logo-title { font-size: 19px; font-weight: 900; color: #2d2108; margin-bottom: 4px; }
  .mobile-logo-sub {
    font-family: 'Playfair Display', serif;
    font-size: 10px; letter-spacing: 3px; color: #c8960a; text-transform: uppercase;
  }

  /* Card */
  .reg-card {
    background: #ffffff;
    border-radius: 20px;
    padding: 36px 36px 32px;
    box-shadow:
      0 1px 3px rgba(0,0,0,0.06),
      0 8px 32px rgba(0,0,0,0.08),
      0 0 0 1px rgba(200,150,10,0.08);
    position: relative; overflow: hidden;
  }

  .reg-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg, #c8960a, #f0d060, #c8960a);
    animation: shimmer 3s ease-in-out infinite;
  }

  @keyframes shimmer { 0%,100%{opacity:.7} 50%{opacity:1} }

  /* Heading */
  .reg-heading { direction: rtl; margin-bottom: 24px; }
  .reg-title { font-size: 24px; font-weight: 900; color: #1e1608; margin-bottom: 5px; }
  .reg-subtitle {
    font-family: 'Playfair Display', serif;
    font-size: 13px; color: #b89a40; font-style: italic;
  }

  /* Ornament */
  .ornament {
    display: flex; align-items: center; gap: 12px; margin-bottom: 24px;
  }
  .ornament-line { flex:1; height:1px; background: linear-gradient(90deg, transparent, #e0d0a0); }
  .ornament-line.rev { background: linear-gradient(90deg, #e0d0a0, transparent); }
  .ornament-diamond { width:6px; height:6px; background:#c8960a; transform:rotate(45deg); opacity:.5; }

  /* Alerts */
  .alert-box {
    padding: 11px 14px; border-radius: 10px; text-align: center;
    margin-bottom: 18px; font-size: 13.5px; direction: rtl; font-weight: 600;
  }
  .alert-error {
    background: #fff5f5; border: 1px solid #fca5a5; color: #dc2626;
    animation: shake .4s ease;
  }
  .alert-success {
    background: #f0fdf4; border: 1px solid #86efac; color: #16a34a;
    animation: fadeUp .4s ease;
  }
  @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-5px)} 75%{transform:translateX(5px)} }

  /* Two-column row */
  .field-row {
    display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 16px;
  }

  /* Fields */
  .field-group { margin-bottom: 16px; direction: rtl; }
  .field-group-no-mb { direction: rtl; }

  .field-label {
    display: block; margin-bottom: 7px;
    color: #5a4820; font-size: 12.5px; font-weight: 700; letter-spacing: 0.3px;
  }

  .field-input {
    width: 100%; padding: 13px 15px;
    background: #faf8f2;
    border: 1.5px solid #e8dfc8;
    border-radius: 11px; color: #1e1608; font-size: 15px;
    font-family: 'Tajawal', sans-serif; direction: rtl; outline: none;
    transition: border-color .22s, box-shadow .22s, background .22s;
    -webkit-appearance: none;
  }
  .field-input::placeholder { color: #c8b880; font-size: 13.5px; }
  .field-input:focus {
    border-color: #c8960a; background: #fffef8;
    box-shadow: 0 0 0 3px rgba(200,150,10,0.1);
  }

  /* Password strength */
  .strength-bar-wrap {
    margin-top: 8px; display: flex; gap: 4px; direction: rtl;
  }
  .strength-seg {
    flex: 1; height: 3px; border-radius: 3px;
    background: #e8e0d0; transition: background .3s;
  }
  .strength-seg.active-weak   { background: #ef4444; }
  .strength-seg.active-medium { background: #f59e0b; }
  .strength-seg.active-strong { background: #22c55e; }

  .strength-label {
    font-size: 11.5px; margin-top: 5px; direction: rtl;
    transition: color .3s; font-weight: 600;
  }

  /* Match indicator */
  .match-hint {
    font-size: 12px; margin-top: 6px; direction: rtl; font-weight: 600;
  }

  /* Submit */
  .submit-btn {
    width: 100%; padding: 15px; margin-top: 6px;
    background: linear-gradient(135deg, #b07808 0%, #d4a010 40%, #f0c830 70%, #c08808 100%);
    color: #fff; border: none; border-radius: 12px;
    font-size: 16px; font-weight: 900; font-family: 'Tajawal', sans-serif;
    cursor: pointer; position: relative; overflow: hidden;
    transition: transform .2s, box-shadow .2s;
    box-shadow: 0 4px 18px rgba(200,150,10,0.35), inset 0 1px 0 rgba(255,255,255,0.2);
    text-shadow: 0 1px 2px rgba(0,0,0,0.15);
  }
  .submit-btn::before {
    content: ''; position: absolute; top:0; left:-100%; width:100%; height:100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent);
    transition: left .5s;
  }
  .submit-btn:hover:not(:disabled)::before { left:100%; }
  .submit-btn:hover:not(:disabled) {
    transform: translateY(-1px); box-shadow: 0 8px 28px rgba(200,150,10,0.45);
  }
  .submit-btn:active:not(:disabled) { transform: translateY(0); }
  .submit-btn:disabled { opacity:.6; cursor:not-allowed; }

  .loading-dots span { display:inline-block; animation: dot-bounce 1.2s ease-in-out infinite; }
  .loading-dots span:nth-child(2) { animation-delay:.2s; }
  .loading-dots span:nth-child(3) { animation-delay:.4s; }
  @keyframes dot-bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-4px)} }

  /* Footer link */
  .login-link {
    text-align: center; margin-top: 20px;
    color: #9a8050; font-size: 13.5px; direction: rtl;
  }
  .login-link-btn {
    color: #b07808; font-weight: 700; cursor: pointer;
    background: none; border: none;
    font-family: 'Tajawal', sans-serif; font-size: 13.5px;
    padding: 0; margin-right: 4px; position: relative; transition: color .2s;
  }
  .login-link-btn::after {
    content: ''; position: absolute; bottom:-1px; left:0; right:0;
    height:1px; background:#b07808;
    transform:scaleX(0); transform-origin:center; transition:transform .25s;
  }
  .login-link-btn:hover { color:#d4a010; }
  .login-link-btn:hover::after { transform:scaleX(1); }

  .security-badge {
    display: flex; align-items: center; justify-content: center;
    gap: 8px; margin-top: 18px; color: #c8b070; font-size: 11.5px; direction: rtl;
  }
  .badge-dot { width:4px; height:4px; background:#d4a810; border-radius:50%; opacity:.5; }

  @media (max-width: 520px) {
    .reg-card { padding: 28px 18px 24px; }
    .field-row { grid-template-columns: 1fr; gap: 0; }
    .field-row .field-group-no-mb { margin-bottom: 16px; }
  }
`;

function getStrength(pw) {
  if (!pw) return { level: 0, label: "", color: "" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw) || /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { level: 1, label: "ضعيفة", color: "#ef4444" };
  if (score <= 2) return { level: 2, label: "متوسطة", color: "#d97706" };
  return { level: 3, label: "قوية", color: "#16a34a" };
}

export default function Register({ onRegisterSuccess }) {
  const [form, setForm] = useState({
    username: "", full_name: "", password: "", confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(""); setSuccess("");

    if (form.password !== form.confirmPassword) {
      setError("كلمة المرور غير متطابقة");
      setLoading(false); return;
    }

    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: form.username, full_name: form.full_name, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "فشل التسجيل");
      setSuccess(" تم إنشاء الحساب بنجاح! جاري تحويلك...");
      setTimeout(() => onRegisterSuccess(), 2000);
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  const strength = getStrength(form.password);
  const strengthClass = (i) => {
    if (i > strength.level) return "strength-seg";
    if (strength.level === 1) return "strength-seg active-weak";
    if (strength.level === 2) return "strength-seg active-medium";
    return "strength-seg active-strong";
  };

  const passwordsMatch = form.confirmPassword && form.password === form.confirmPassword;
  const passwordsMismatch = form.confirmPassword && form.password !== form.confirmPassword;

  return (
    <>
      <style>{styles}</style>
      <div className="reg-root">


        {/* Right form */}
        <div className="reg-form-side">
          <div className="reg-wrapper">

            {/* Mobile logo */}


            <div className="reg-card">
              <div className="reg-heading">
                <div className="reg-title">إنشاء حساب جديد </div>
                <div className="reg-subtitle">أدخل بياناتك للبدء</div>
              </div>

              <div className="ornament">
                <div className="ornament-line" />
                <div className="ornament-diamond" />
                <div className="ornament-line rev" />
              </div>

              {error   && <div className="alert-box alert-error"> {error}</div>}
              {success && <div className="alert-box alert-success">{success}</div>}

              <form onSubmit={handleSubmit}>
                {/* Row: Full name + Username */}
                <div className="field-row">
                  <div className="field-group-no-mb">
                    <label className="field-label">الاسم الكامل</label>
                    <input
                      type="text" name="full_name" className="field-input"
                      placeholder="أداخل اسمك الكامل"
                      value={form.full_name} onChange={handleChange}
                      autoComplete="name" required
                    />
                  </div>
                  <div className="field-group-no-mb">
                    <label className="field-label">اسم المستخدم</label>
                    <input
                      type="text" name="username" className="field-input"
                      placeholder="username"
                      value={form.username} onChange={handleChange}
                      autoComplete="username" required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="field-group">
                  <label className="field-label">كلمة المرور</label>
                  <input
                    type="password" name="password" className="field-input"
                    placeholder="أدخل كلمة المرور"
                    value={form.password} onChange={handleChange}
                    autoComplete="new-password" required
                  />
                  {form.password && (
                    <>
                      <div className="strength-bar-wrap">
                        {[1,2,3].map(i => <div key={i} className={strengthClass(i)} />)}
                      </div>
                      <div className="strength-label" style={{ color: strength.color }}>
                        قوة كلمة المرور: {strength.label}
                      </div>
                    </>
                  )}
                </div>

                {/* Confirm password */}
                <div className="field-group" style={{ marginBottom: 22 }}>
                  <label className="field-label">تأكيد كلمة المرور</label>
                  <input
                    type="password" name="confirmPassword" className="field-input"
                    placeholder="أعد إدخال كلمة المرور"
                    value={form.confirmPassword} onChange={handleChange}
                    autoComplete="new-password"
                    style={
                      passwordsMismatch ? { borderColor: "#fca5a5" } :
                      passwordsMatch    ? { borderColor: "#86efac" } : {}
                    }
                    required
                  />
                  {passwordsMismatch && (
                    <div className="match-hint" style={{ color: "#dc2626" }}>✗ كلمتا المرور غير متطابقتين</div>
                  )}
                  {passwordsMatch && (
                    <div className="match-hint" style={{ color: "#16a34a" }}>✓ كلمتا المرور متطابقتان</div>
                  )}
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? (
                    <span className="loading-dots">جاري إنشاء الحساب<span>.</span><span>.</span><span>.</span></span>
                  ) : "إنشاء الحساب "}
                </button>
              </form>

              <p className="login-link">
                لديك حساب بالفعل؟
                <button className="login-link-btn" onClick={onRegisterSuccess}>تسجيل الدخول</button>
              </p>

              <div className="security-badge">
                <div className="badge-dot" />
                <div className="badge-dot" />
              </div>
            </div>

          </div>
        </div>

      </div>
    </>
  );
}