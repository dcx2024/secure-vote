/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    await knex.raw(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`)
  const pollExists= await knex.schema.hasTable('poll')

  if(!pollExists){
    await knex.schema.createTable('poll', table =>{
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.string('position').notNullable()
      table.text('description').nullable()
      table.jsonb('candidates').notNullable()
      table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
    })
  }

  const adminExists = await knex.schema.hasTable('admin')

  if(!adminExists){
    await knex.schema.createTable('admin', table =>{
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
      table.string('email').notNullable().unique()
      table.string('password').notNullable()
      table.timestamp('created_at',{useTz: true}).defaultTo(knex.fn.now())
    })
  }

  const voteExists = await knex.schema.hasTable('votes')
  if(!voteExists){
 await knex.schema.createTable('votes', table =>{
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
     table.uuid('poll_id').notNullable().references('id').inTable('poll').onDelete('CASCADE');
    table.uuid('candidate_id').notNullable();
    table.text('visitor_id').notNullable();
    table.specificType('ip_address', 'inet').notNullable();
    table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now())
  })
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  // Drop the tables in reverse order of creation
  await knex.schema.dropTableIfExists('votes');  // depends on poll
  await knex.schema.dropTableIfExists('admin');
  await knex.schema.dropTableIfExists('poll');
};

//Add indexes