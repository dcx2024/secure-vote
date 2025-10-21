import React, { useEffect, useState } from "react";

const PollResults = ({ token }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      const API_URL="http://localhost:5000"
      try {
        const res = await fetch(`${API_URL}/voter/result`, {
          method: "GET",
          credentials: "include", // important so cookie is sent
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch poll results");

        setResults(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (loading)
    return <p className="text-center text-gray-500 mt-6">Loading results...</p>;

  if (error)
    return <p className="text-center text-red-500 mt-6 font-medium">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Poll Results</h2>

      {results.length === 0 ? (
        <p className="text-center text-gray-600">No results available yet.</p>
      ) : (
        <div className="space-y-8">
          {results.map((poll) => (
            <div
              key={poll.id || poll._id}
              className="border border-gray-200 shadow-md rounded-lg p-6 bg-white"
            >
              <h3 className="text-xl font-semibold text-gray-800">
                {poll.position}
              </h3>
              <p className="text-gray-600">{poll.description}</p>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {poll.candidates.map((candidate) => (
                  <div
                    key={candidate.id || candidate._id}
                    className="flex flex-col items-center border p-3 rounded-md bg-gray-50"
                  >
                    {candidate.image && (
                      <img
                        src={`http://localhost:5000${candidate.image}`}
                        alt={candidate.name}
                        className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 object-cover rounded-full mb-2"
                      />
                    )}
                    <span className="font-medium text-gray-800 text-center">
                      {candidate.name}
                    </span>
                    <span className="text-gray-700 font-semibold mt-1">
                      {candidate.votes} votes
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PollResults;
