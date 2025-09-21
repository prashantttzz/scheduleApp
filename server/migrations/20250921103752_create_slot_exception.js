/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable('slot_exceptions', (table) => {
    table.increments('id').primary();
    table
      .integer('slot_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('slots')
      .onDelete('CASCADE');
    table.date('date').notNullable();
    table.time('start_time'); // optional override
    table.time('end_time');   // optional override
    table.boolean('is_deleted').defaultTo(false);
    table.timestamps(true, true);

    table.unique(['slot_id', 'date']);
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists('slot_exceptions');
}
