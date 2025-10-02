const Poll = require('../models/pollModel')
require('dotenv').config()
const { v4: uuidv4 } = require("uuid");

const createPoll = async (req, res) => {
  try {
    const { position, description, candidates } = req.body;

    if (!position || !candidates) {
      return res.status(400).json({ message: "Position or candidates missing" });
    }

    const parsedCandidates = JSON.parse(candidates);

    // Give each candidate a unique id
    const finalCandidates = parsedCandidates.map((candidate, index) => ({
      id: uuidv4(), // 👈 unique id
      name: candidate.name,
      image: req.files[index] ? `/uploads/${req.files[index].filename}` : null,
    }));

    const newPoll = await Poll.create({
      position,
      description,
      candidates: JSON.stringify(finalCandidates),
      admin_id: req.user.id,
    });

    return res
      .status(201)
      .json({ message: "Poll has been created successfully", data: newPoll });
  } catch (error) {
    console.error("An error occurred:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};



const generateShareLink =async(req,res)=>{
      try {
      const admin_id = req.user.id; // from authentication middleware for token

      // Generate or refresh token
      const token = await Poll.generateShareToken(admin_id);
        const BASE_URL='http://localhost:5173'
      const shareableLink = `${BASE_URL}/vote/${token}`;
      return res.status(200).json({
        message: "Shareable link generated successfully",
        link: shareableLink
      });
    } catch (error) {
      console.error("Error generating share link:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
}

const fetchSharedPolls = async(req,res)=>{
    try {
      const { token } = req.params;
      
      const polls = await Poll.fetchByShareToken(token);

      if (!polls.length) {
        return res.status(404).json({ message: "No polls found for this link" });
      }

      return res.status(200).json({ data: polls });
    } catch (error) {
      console.error("Error fetching shared polls:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  
}

const fetchPollsByAdmin = async (req, res) => {
  try {
    const admin_id = req.user.id;
    const polls = await Poll.fetchByAdmin(admin_id);

    return res.status(200).json({
      message: "Polls fetched successfully",
      data: polls,
    });
  } catch (error) {
    console.error("Error fetching admin polls:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports={
  createPoll,
  generateShareLink,
  fetchSharedPolls,
  fetchPollsByAdmin,
}