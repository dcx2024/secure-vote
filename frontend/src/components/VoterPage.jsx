import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

const VotePage = () => {
  const { token } = useParams();
  const [polls, setPolls] = useState([]);
  const [selectedCandidates, setSelectedCandidates] = useState({});
  const [message, setMessage] = useState("");
  const [visitorId, setVisitorId] = useState("");

  // Load fingerprint once
  useEffect(() => {
    const loadFingerprint = async () => {
      try {
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        setVisitorId(result.visitorId);
        console.log("🆔 Visitor ID:", result.visitorId);
      } catch (err) {
        console.error("FingerprintJS error:", err);
      }
    };
    loadFingerprint();
  }, []);

  // Fetch polls by share token
  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const res = await fetch(`http://localhost:3000/admin/share/${token}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch polls");
        }

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
  }, [token]);

  // Update candidate selection per poll
  const handleSelectCandidate = (pollId, e) => {
    const candidateId = e.target.value;
    setSelectedCandidates((prev) => ({
      ...prev,
      [pollId]: candidateId,
    }));
  };

  // Submit vote
  const handleVote = async (pollId) => {
    const candidateId = selectedCandidates[pollId];

    if (!candidateId) {
      setMessage("⚠️ Please select a candidate before voting.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/voter/castVote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          poll_id: pollId,
          candidate_id: candidateId,
          visitor_id: visitorId, // ✅ fingerprint sent
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Vote submission failed");
      }

      setMessage(`✅ ${data.message}`);
    } catch (error) {
      setMessage(error.message);
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
      ${selectedCandidates[poll.id || poll._id] === (candidate.id || candidate._id)
        ? "border-blue-500 bg-blue-50"
        : "border-gray-200"
      }`}
  >
    {candidate.image && (
      <img
        src={`http://localhost:3000${candidate.image}`}
        alt={candidate.name}
        className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 object-cover rounded-full border"
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
        selectedCandidates[poll.id || poll._id] === (candidate.id || candidate._id)
      }
      onChange={(e) => handleSelectCandidate(poll.id || poll._id, e)}
      className="form-radio h-5 w-5 text-blue-600 mt-2"
    />
  </label>
))}

            </div>

            <button
              onClick={() => handleVote(poll.id || poll._id)}
              disabled={!visitorId} // disable until fingerprint loads
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg shadow transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              ✅ Submit Vote
            </button>
          </div>
        ))}

        {message && (
          <p
            className={`mt-6 text-center text-lg font-medium ${
              message.startsWith("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default VotePage;
