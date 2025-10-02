const db = require('../config/db');

const TABLE = 'votes';

const Vote = {
  async castVote(voterData){
    const [vote]=await db(TABLE).insert(voterData).returning("*")
        return vote
  },
 
 async getPollsWithResultsByToken(admin_id){
  // 1. Get all polls with the given share_token
  const polls = await db('poll').where({ admin_id });
  if (!polls || polls.length === 0) {
    throw new Error('No polls found for this token');
  }

  // 2. Get all vote counts for these polls in ONE query
  const pollIds = polls.map(p => p.id);
  const rawVotes = await db('votes')
    .select('poll_id', 'candidate_id')
    .count('id as vote_count')
    .whereIn('poll_id', pollIds)
    .groupBy('poll_id', 'candidate_id');

  // 3. Convert vote counts into a lookup map
  const voteMap = rawVotes.reduce((acc, v) => {
    if (!acc[v.poll_id]) acc[v.poll_id] = {};
    acc[v.poll_id][v.candidate_id] = v.vote_count; // keep as string
    return acc;
  }, {});

  // 4. Merge vote counts into each poll's candidates
  const pollsWithResults = polls.map(poll => {
    const candidatesWithVotes = poll.candidates.map(c => ({
      ...c,
      votes: voteMap[poll.id]?.[c.id] || "0" // default to "0" if no votes
    }));

    return {
      ...poll,
      candidates: candidatesWithVotes
    };
  });

  return pollsWithResults;
}
}

module.exports = Vote;