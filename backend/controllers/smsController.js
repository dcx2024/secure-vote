const { MessagingResponse } = require('twilio').twiml;
const session = new Map();


app.post("/api/sms", async (req, res) => {
  const from = req.body.From;
  const body = req.body.Body.trim().toUpperCase();
  const twiml = new MessagingResponse();

  try {
    const parts = body.split(/\s+/);
    const command = parts[0].toLowerCase();
    const token = parts[1];

    // ---- BACK COMMAND ----
    if (body === "BACK" && session.has(from)) {
      const state = session.get(from);
      if (!state.token) {
        twiml.message("No active election. Send 'VOTE <share token>' to start.");
      } else {
        const polls = await knex("poll").where({ share_token: state.token });
        session.set(from, { token: state.token }); // reset pollId
        const message = [
          `Positions for election (${state.token}):`,
          ...polls.map((p, i) => `${i + 1}. ${p.position}`),
          "Reply with the number of the position you want to vote for."
        ].join("\n");
        twiml.message(message);
      }
    }

    // ---- DONE COMMAND ----
    else if (body === "DONE" && session.has(from)) {
      session.delete(from);
      twiml.message("✅ Thank you! Your votes have been recorded.");
    }

    // ---- NEW ELECTION ----
    else if (command === "vote" && token) {
      // (same as before)
      const polls = await knex("poll").where({ share_token: token });
      if (polls.length === 0) {
        twiml.message("❌ No poll found with that share token.");
      } else if (polls.length === 1) {
        // One poll only
        const poll = polls[0];
        session.set(from, { token, pollId: poll.id });
        const candidates = poll.candidates;
        const message = [
          `Candidates for ${poll.position}:`,
          ...candidates.map((c, i) => `${i + 1}. ${c.name}`),
          "Reply with the number of your choice."
        ].join("\n");
        twiml.message(message);
      } else {
        session.set(from, { token });
        const message = [
          `Positions for election (${token}):`,
          ...polls.map((p, i) => `${i + 1}. ${p.position}`),
          "Reply with the number of the position you want to vote for."
        ].join("\n");
        twiml.message(message);
      }
    }

    // ---- SELECT POSITION ----
    else if (/^\d+$/.test(body) && session.has(from)) {
      const state = session.get(from);

      // Selecting a position
      if (state.token && !state.pollId) {
        const polls = await knex("poll").where({ share_token: state.token });
        const posIndex = parseInt(body) - 1;

        if (!polls[posIndex]) {
          twiml.message("❌ Invalid choice. Reply with a valid position number.");
        } else {
          const poll = polls[posIndex];
          session.set(from, { token: state.token, pollId: poll.id });

          const candidates = poll.candidates;
          const message = [
            `Candidates for ${poll.position}:`,
            ...candidates.map((c, i) => `${i + 1}. ${c.name}`),
            "Reply with the number of your choice."
          ].join("\n");
          twiml.message(message);
        }
      }

      // Selecting a candidate
      else if (state.pollId) {
        const poll = await knex("poll").where({ id: state.pollId }).first();
        const candidates = poll.candidates;
        const candIndex = parseInt(body) - 1;

        if (!candidates[candIndex]) {
          twiml.message("❌ Invalid candidate number.");
        } else {
          const selected = candidates[candIndex];
          const existing = await knex("vote")
            .where({ poll_id: poll.id, phone_number: from })
            .first();

          if (existing) {
            twiml.message(`🗳️ You already voted for ${poll.position}. Reply "BACK" to vote for another position.`);
          } else {
            await knex("vote").insert({
              poll_id: poll.id,
              phone_number: from,
              candidate_id: selected.id
            });
            twiml.message(
              `✅ Your vote for ${selected.name} (${poll.position}) has been recorded.\nReply "BACK" to vote for another position or "DONE" to finish.`
            );
          }

          // Keep their token but clear pollId so they can pick another position
          session.set(from, { token: state.token });
        }
      }
    }

    else {
      twiml.message("Send 'VOTE <share token>' to start voting.");
    }

  } catch (err) {
    console.error(err);
    twiml.message("⚠️ An error occurred. Please try again later.");
  }

  res.type("text/xml").send(twiml.toString());
});
