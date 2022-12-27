import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'team_matches'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.bigInteger('team_id').unsigned().index()
      table.bigInteger('match_id').unsigned()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table.foreign('team_id').references('teams.id').onDelete('CASCADE').onUpdate('CASCADE')
      table.foreign('match_id').references('matches.id').onDelete('CASCADE').onUpdate('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
