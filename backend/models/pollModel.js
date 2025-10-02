const db = require('../config/db');
const { nanoid } = require('nanoid'); // npm install nanoid

const TABLE = 'poll';

const Poll = {
  async create(pollData) {
    const [poll] = await db(TABLE).insert(pollData).returning('*');
    return poll;
  },

  async delete(poll_id) {
    return db(TABLE).where({ id: poll_id }).del();
  },

  async fetch(poll_id) {
    return db(TABLE).where({ id: poll_id }).first();
  },

  async fetchByAdmin(admin_id) {
    return db(TABLE)
      .where({ admin_id })
      .orderBy('created_at', 'desc');
  },

  // ✅ Fetch polls using share_token
  async fetchByShareToken(token) {
    return db(TABLE)
      .where({ share_token: token })
      .orderBy('created_at', 'desc');
  },

  // ✅ Generate and set a share_token for all polls by this admin
  async generateShareToken(admin_id) {
    const token = nanoid(10); // random, e.g., 'Xb7kQ29LmA'
    await db(TABLE)
      .where({ admin_id })
      .update({ share_token: token });
    return token;
  }
};

module.exports = Poll;
