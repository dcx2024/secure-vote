import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ for navigation

const AdminPolls = () => {
  const api_url="https://secure-vote-bawo.onrender.com"
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [shareLink, setShareLink] = useState("");
  const navigate = useNavigate(); // ✅ init navigate

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const res = await fetch(`${api_url}/admin/adminPolls`, {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch polls");
        }

        setPolls(data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPolls();
  }, []);

  const handleShare = async () => {
    try {
      const res = await fetch(`${api_url}/admin/share`, {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to generate share link");
      }

      setShareLink(data.link);
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-lg text-gray-500 animate-pulse">Loading polls...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-red-600 font-semibold">{error}</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-blue-700">📊 My Polls</h2>

          {/* ✅ Create Poll Button */}
          <button
            onClick={() => navigate("/#/admin/create")}
            className="mt-4 sm:mt-0 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition"
          >
            ➕ Create Poll
          </button>
        </div>

        {/* Share link generator */}
        <div className="mb-10 text-center">
          <button
            onClick={handleShare}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition"
          >
            🔗 Generate Share Link
          </button>
          {shareLink && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-gray-700">Your public voting link:</p>
              <a
                href={shareLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 font-medium break-all underline"
              >
                {shareLink}
              </a>
            </div>
          )}
        </div>

        {polls.length === 0 ? (
          <p className="text-center text-gray-600 bg-white shadow rounded-lg p-6">
            No polls created yet.
          </p>
        ) : (
          <div className="grid gap-6">
            {polls.map((poll) => (
              <div
                key={poll.id}
                className="border border-gray-200 shadow-md rounded-xl p-6 bg-white hover:shadow-lg transition"
              >
                <h3 className="text-xl font-semibold text-gray-800">
                  {poll.position}
                </h3>
                <p className="text-gray-600 mt-2">{poll.description}</p>
                {poll.created_at && (
                  <p className="text-sm text-gray-400 mt-2">
                    🕒 Created:{" "}
                    {new Date(poll.created_at).toLocaleString([], {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                )}

                {/* Candidates */}
                {poll.candidates && poll.candidates.length > 0 && (
                  <div className="mt-5">
                    <h4 className="font-medium text-gray-700 mb-3">
                      👤 Candidates:
                    </h4>
                    <ul className="grid sm:grid-cols-2 gap-3">
                      {poll.candidates.map((c, i) => (
                        <li
                          key={i}
                          className="flex items-center space-x-3 border border-gray-200 rounded-lg p-3 bg-gray-50 hover:bg-gray-100 transition"
                        >
                          {c.image && (
                            <img
                              src={`http://localhost:3000${c.image}`}
                              alt={c.name}
                              className="w-12 h-12 object-cover rounded-full border"
                            />
                          )}
                          <span className="text-gray-800 font-medium">
                            {c.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPolls;
