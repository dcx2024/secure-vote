/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.schema.alterTable('poll', table => {
  table.uuid('admin_id').notNullable();
  table.string('share_token').nullable();
});

};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
   await knex.schema.alterTable('poll', table => {
    table.dropColumn('admin_id');
    table.dropColumn('share_token');
  });
};
