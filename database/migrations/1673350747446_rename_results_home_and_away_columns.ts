import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'results'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.renameColumn('home_score', 'team1_score')
      table.renameColumn('away_score', 'team2_score')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.renameColumn('team1_score', 'home_score')
      table.renameColumn('team2_score', 'away_score')
    })
  }
}
