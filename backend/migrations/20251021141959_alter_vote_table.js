/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up =async function(knex) {
  await knex.schema.alterTable('votes',table=>{
    table.string('voter_id')
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down =async function(knex) {
  await knex.schema.alterTable('votes', table=>{
    table.dropColumn('voter_id')
  })
};
