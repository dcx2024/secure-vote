import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

const VoterLogin = () => {
  const navigate = useNavigate();
  const [visitorId, setVisitorId] = useState("");

  const [formData, setFormData] = useState({
    full_name: "",
    phone_no: "",
    visitor_id: "" // include fingerprint
  });

  // Load FingerprintJS once on mount
  useEffect(() => {
    const initFingerprint = async () => {
      try {
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        setVisitorId(result.visitorId);
        setFormData((prev) => ({ ...prev, visitor_id: result.visitorId }));
        console.log("Visitor ID:", result.visitorId);
      } catch (error) {
        console.error("FingerprintJS error:", error);
      }
    };

    initFingerprint();
  }, []);

  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const api_url ="https://secure-vote-bawo.onrender.com"
    try {
      const response = await fetch(`${api_url}/voter/voterLogin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        navigate("/home");
      } else {
        console.error("Error submitting data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Voter Login
        </h1>
        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="phone_no"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Phone Number
            </label>
            <input
              type="number"
              name="phone_no"
              placeholder="Enter your phone number"
              value={formData.phone_no}
              onChange={onChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="full_name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Full Name
            </label>
            <input
              type="text"
              name="full_name"
              placeholder="Enter your full name"
              value={formData.full_name}
              onChange={onChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Hidden visitor_id */}
          <input type="hidden" name="visitor_id" value={visitorId} />

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 transition duration-200"
          >
            Submit
          </button>
        </form>
      </div>
    </section>
  );
};

export default VoterLogin;
