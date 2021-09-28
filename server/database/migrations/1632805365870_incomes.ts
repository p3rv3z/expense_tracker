import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Incomes extends BaseSchema {
  protected tableName = 'incomes'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('amount')
      table
        .integer('category_id')
        .unsigned()
        .references('categories.id')
        .onDelete('CASCADE')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
