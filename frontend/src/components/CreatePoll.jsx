import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const CreatePoll = () => {
  const navigate= useNavigate()
  const [position, setPosition] = useState("");
  const [description, setDescription] = useState("");
  const [candidates, setCandidates] = useState([{ name: "", image: null }]);
  const [message, setMessage] = useState("");
const API_URL="http://localhost:5000"
  // Add new candidate field
  const addCandidate = () => {
    setCandidates([...candidates, { name: "", image: null }]);
  };

  // Remove candidate field
  const removeCandidate = (index) => {
    const updated = candidates.filter((_, i) => i !== index);
    setCandidates(updated);
  };

  // Handle candidate input changes
  const handleCandidateChange = (index, field, value) => {
    const updated = [...candidates];
    updated[index][field] = value;
    setCandidates(updated);
  };

  // Submit poll
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("position", position);
      formData.append("description", description);

      // Only send candidate names in JSON
      formData.append(
        "candidates",
        JSON.stringify(candidates.map(({ name }) => ({ name })))
      );

      // Append candidate images
      candidates.forEach((c) => {
        if (c.image) {
          formData.append("candidateImages", c.image);
        }
      });

      const res = await fetch(`${API_URL}/api/admin/createPoll`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(`${data.message}` || "✅ Poll created successfully!");
        navigate('/admin/poll')
        setPosition("");
        setDescription("");
        setCandidates([{ name: "", image: null }]);
      } else {
        toast.info(`${data.message}` || "❌ Error creating poll");
      }
    } catch (error) {
      console.error("Error creating poll:", error);
      toast.error("❌ Error creating poll");
    }
  };

 return (
  <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 sm:px-6 lg:px-8">
    <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-6 sm:p-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-center text-blue-700 mb-6">
        🗳️ Create a Poll
      </h2>

      {message && (
        <p
          className={`text-center mb-4 font-medium ${
            message.includes("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Position */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Position
          </label>
          <input
            type="text"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm sm:text-base"
            placeholder="e.g., President"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 h-24 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm sm:text-base"
            placeholder="Brief description of the position"
          />
        </div>

        {/* Candidates */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Candidates
          </h3>

          <div className="space-y-4">
            {candidates.map((candidate, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-3 sm:space-y-0 border border-gray-200 p-3 rounded-lg"
              >
                <input
                  type="text"
                  placeholder="Candidate name"
                  value={candidate.name}
                  onChange={(e) =>
                    handleCandidateChange(index, "name", e.target.value)
                  }
                  required
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm sm:text-base"
                />

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleCandidateChange(index, "image", e.target.files[0])
                  }
                  className="text-sm text-gray-600"
                />

                {candidates.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeCandidate(index)}
                    className="self-end sm:self-auto px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    ✖
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addCandidate}
            className="w-full mt-4 py-2 border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition text-sm sm:text-base"
          >
            + Add Candidate
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md transition text-sm sm:text-base"
        >
          ✅ Create Poll
        </button>
      </form>
    </div>
  </div>
);

};

export default CreatePoll;
