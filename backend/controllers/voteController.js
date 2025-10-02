const Vote = require('../models/voteModel');
const bcrypt=require('bcrypt')
const knex=require('../config/db')
const voteController = {
 
  async castVote(req, res) {
    try {
      const { poll_id, candidate_id, visitor_id } = req.body;

      const ip_address= req.ip
      

      if (!poll_id || !candidate_id) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const existingVote = await knex("votes").where({ poll_id,visitor_id, ip_address}).first();

      if(existingVote){
        return res.status(400).json({error: "This user has already voted"})
      }

      const vote = await Vote.castVote({
        poll_id,
        candidate_id,
          ip_address,
          visitor_id
      });

      return res.status(201).json({ message: 'Vote cast successfully', vote });
    } catch (error) {
      console.error('Vote Error:', error.message);
      return res.status(400).json({ error: error.message });
    }
  },

  /**
   * Get poll results by share token
   * GET /api/polls/:token/results
   */
  async getPollResults(req, res) {
    try {
      const  admin_id  = req.user.id;
      const results = await Vote.getPollsWithResultsByToken(admin_id);

      return res.json(results);
    } catch (error) {
      console.error('Poll Results Error:', error.message);
      return res.status(404).json({ error: error.message });
    }
  }
};

module.exports = voteController;
