import { useState, useEffect } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import CertificateForm from "./components/CertificateForm";
import VerifyCertificate from "./components/VerifyCertificate"; // استيراد المكون الجديد

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  // الستيت باستخدام الـ Boolean للتبديل السريع بين اللوجن والرجستر
  const [showRegister, setShowRegister] = useState(false); 

  useEffect(() => {
    // تشييك الـ sessionStorage عند فتح التبويب أو عمل Refresh
    const token = sessionStorage.getItem("token");
    const AUTO_LOGIN = true; 

    if (token && AUTO_LOGIN) {
      setUser({ token }); 
    }

    setIsLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    setUser(null);
  };

  const handleRegisterSuccess = () => {
    // أكشن اختيارى: بعد ما يسجل بنجاح، بنرجعه لصفحة اللوجن عشان يدخل
    setShowRegister(false); 
  };

  // التحقق من المسار الحالي لعرض صفحة التحقق
  if (window.location.pathname === "/verify") {
    return <VerifyCertificate />;
  }

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen text-xl">جاري التحميل...</div>;
  }

  // 1️⃣ لو المستخدم مسجل دخول -> يعرض صفحة الشهادات فوراً
  if (user) {
    return <CertificateForm user={user} onLogout={handleLogout} />;
  }

  // 2️⃣ لو مش مسجل دخول -> بيبدل بين اللوجن والرجستر بناءً على قيمة showRegister
  return showRegister ? (
    <Register 
      onRegisterSuccess={handleRegisterSuccess} 
      onSwitchToLogin={() => setShowRegister(false)} // يرجعه للوجن
    />
  ) : (
    <Login 
      onLogin={handleLogin} 
      onSwitchToRegister={() => setShowRegister(true)} // يوديه للرجستر
    />
  );
}

export default App;