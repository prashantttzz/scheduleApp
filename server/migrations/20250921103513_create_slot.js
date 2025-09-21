/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable('slots', (table) => {
    table.increments('id').primary();
    table.integer('day_of_week').notNullable(); // 0=Sunday ... 6=Saturday
    table.time('start_time').notNullable();
    table.time('end_time').notNullable();
    table.timestamps(true, true);
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists('slot_exceptions');
  await knex.schema.dropTableIfExists('slots');
}
