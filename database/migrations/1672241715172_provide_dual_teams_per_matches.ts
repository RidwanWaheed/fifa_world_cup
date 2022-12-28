import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'team_matches'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign('team_id')
      table.renameColumn('team_id', 'team1')
      table.bigInteger('team2').index().unsigned()
      table.index('team1')

      table.foreign('team2').references('teams.id').onDelete('CASCADE').onUpdate('CASCADE')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign('team2')
      table.dropIndex('team2')
      table.dropColumn('team2')
      table.renameColumn('team1', 'team_id')
      table.foreign('team_id').references('teams.id').onDelete('CASCADE').onUpdate('CASCADE')
    })
  }
}
