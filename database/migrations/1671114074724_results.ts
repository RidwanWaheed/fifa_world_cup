import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'results'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id').primary().index()

      table.bigInteger('match_id').unsigned().index()
      table.integer('home_score').unsigned()
      table.integer('away_score').unsigned()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table.foreign('match_id').references('matches.id').onDelete('CASCADE').onUpdate('CASCADE')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
