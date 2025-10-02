/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up =async function(knex) {

  await knex.raw(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`)
 const exists = await knex.schema.hasTable('voters');
  if (!exists) {
    return knex.schema.createTable('voters', table => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.string('full_name').notNullable();
      table.string('phone_no').notNullable(); // always store phone as string
      table.specificType('ip_address', 'inet'); // Postgres only
      table.string('visitor_id', 32).notNullable().index(); // indexed for fraud detection
      table.timestamps(true, true); // created_at and updated_at
    });
  }
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down =async function(knex) {
  return knex.schema.dropTableIfExists('voters')
};
