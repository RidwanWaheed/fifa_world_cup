import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'team_matches'

  public async up() {
    this.schema.dropTable(this.tableName)
  }

  public async down() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id').primary().index().unsigned()

      table.integer('group_id').unsigned().index()
      table.date('match_date').notNullable()
      table.time('start_time').nullable()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table.foreign('group_id').references('groups.id').onDelete('RESTRICT').onUpdate('RESTRICT')

      table.bigint('team1').unsigned().index()
      table.bigint('team2').unsigned().index()

      table.foreign('team1').references('teams.id').onDelete('CASCADE').onUpdate('CASCADE')
      table.foreign('team2').references('teams.id').onDelete('CASCADE').onUpdate('CASCADE')
    })
  }
}
