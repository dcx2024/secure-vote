import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

const VotePage = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [polls, setPolls] = useState([]);
  const [selectedCandidates, setSelectedCandidates] = useState({});

  const [visitorId, setVisitorId] = useState("");

  const API_URL = "http://localhost:5000";

  // Load unique fingerprint ID once
  useEffect(() => {
    const loadFingerprint = async () => {
      try {
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        setVisitorId(result.visitorId);
      } catch (err) {
        console.error("FingerprintJS error:", err);
        setMessage("Failed to generate device ID.");
      }
    };
    loadFingerprint();
  }, []);

  // Fetch polls by share token
  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const res = await fetch(`${API_URL}/admin/share/${token}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Failed to fetch polls");

        const parsedPolls = data.data.map((poll) => ({
          ...poll,
          candidates:
            typeof poll.candidates === "string"
              ? JSON.parse(poll.candidates)
              : poll.candidates,
        }));

        setPolls(parsedPolls);
      } catch (error) {
        setMessage(error.message);
      }
    };

    if (token) fetchPolls();
  }, [token, API_URL]);

  const handleSelectCandidate = (pollId, e) => {
    const candidateId = e.target.value;
    setSelectedCandidates((prev) => ({ ...prev, [pollId]: candidateId }));
  };

  const handleVote = async (pollId) => {
    const candidateId = selectedCandidates[pollId];
    if (!candidateId) {
      toast.info("⚠️ Please select a candidate before voting.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/voter/castVote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          poll_id: pollId,
          candidate_id: candidateId,
          visitor_id: visitorId,
        }),
      });

      const data = await res.json();

      if (res.status === 401 || res.status === 403) {
        toast.error("Please log in to vote")
        setTimeout(() => navigate(`/?token=${token}`), 1500); // ✅ keep token
        return;
      }

      if (!res.ok) throw new Error(data.error || "Vote submission failed");
      toast.success(`${data.message}`)
      
      
    } catch (error) {
      toast.error(`${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">
          🗳️ Cast Your Vote
        </h1>

        {!visitorId && (
          <p className="text-center text-gray-500 mb-6">
            Loading your voter ID...
          </p>
        )}

        {polls.map((poll) => (
          <div
            key={poll.id || poll._id}
            className="border border-gray-200 rounded-lg p-6 mb-8 bg-gray-50 hover:shadow-md transition"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {poll.position}
            </h2>
            <p className="text-gray-600 mb-4">{poll.description}</p>

            <div className="space-y-4">
              {poll.candidates.map((candidate, index) => (
                <label
                  key={candidate.id || candidate._id || index}
                  className={`flex flex-col items-center space-y-2 p-3 rounded-lg border cursor-pointer transition 
                    ${
                      selectedCandidates[poll.id || poll._id] ===
                      (candidate.id || candidate._id)
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200"
                    }`}
                >
                  {candidate.image && (
                    <img
                      src={`${API_URL}${candidate.image}`}
                      alt={candidate.name}
                      className="w-32 h-32 object-cover rounded-full border"
                    />
                  )}
                  <span className="font-medium text-gray-800 text-center">
                    {candidate.name}
                  </span>
                  <input
                    type="radio"
                    name={`poll-${poll.id || poll._id}`}
                    value={candidate.id || candidate._id}
                    checked={
                      selectedCandidates[poll.id || poll._id] ===
                      (candidate.id || candidate._id)
                    }
                    onChange={(e) =>
                      handleSelectCandidate(poll.id || poll._id, e)
                    }
                    className="form-radio h-5 w-5 text-blue-600 mt-2"
                  />
                </label>
              ))}
            </div>

            <button
              onClick={() => handleVote(poll.id || poll._id)}
              disabled={!visitorId}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg shadow transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              ✅ Submit Vote
            </button>
          </div>
        ))}

        
      </div>
    </div>
  );
};

export default VotePage;
