import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'matches'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.bigint('team1').unsigned().index()
      table.bigint('team2').unsigned().index()

      table.foreign('team1').references('teams.id').onDelete('CASCADE').onUpdate('CASCADE')
      table.foreign('team2').references('teams.id').onDelete('CASCADE').onUpdate('CASCADE')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign('team1')
      table.dropForeign('team2')
      table.dropColumns('team1', 'team2')
    })
  }
}
