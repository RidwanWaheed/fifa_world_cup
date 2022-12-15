import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'teams'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id').primary()

      table.string('name').notNullable().unique().index()
      table.integer('group_id').unsigned().index()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table.foreign('group_id').references('groups.id').onDelete('RESTRICT').onUpdate('RESTRICT')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
