import { useState, useEffect } from "react";

function VerifyCertificate() {
  const [certificateData, setCertificateData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCertificateData = () => {
      setLoading(true);
      setError(null);

      // قراءة الـ query parameters من الرابط
      const params = new URLSearchParams(window.location.search);
      const data = {};
      for (const [key, value] of params.entries()) {
        data[key] = value;
      }

      if (Object.keys(data).length > 0) {
        setCertificateData(data);
      } else {
        setError("لا توجد بيانات شهادة في الرابط.");
      }
      setLoading(false);
    };

    fetchCertificateData();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-xl">جاري تحميل بيانات الشهادة...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-red-500 text-xl">{error}</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">بيانات الشهادة</h1>
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        {Object.entries(certificateData).map(([key, value]) => (
          <p key={key} className="text-lg mb-2"><span className="font-semibold">{key}:</span> {value}</p>
        ))}
      </div>
    </div>
  );
}

export default VerifyCertificate;