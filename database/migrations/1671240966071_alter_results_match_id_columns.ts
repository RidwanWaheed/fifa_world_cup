import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  public up() {
    this.schema.alterTable('results', (table) => {
      table.dropIndex('match_id')
      table.dropColumn('match_id')
      // table.bigInteger('match_id').unsigned().index().unique()
    })
  }
}