import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  public up() {
    this.schema.alterTable('results', (table) => {
      table.bigInteger('match_id').unsigned().index().unique()
      table.foreign('match_id').references('matches.id').onDelete('CASCADE').onUpdate('CASCADE')
    })
  }
}