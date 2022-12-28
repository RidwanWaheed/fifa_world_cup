import { DateTime } from 'luxon'
import { BaseModel, belongsTo, BelongsTo, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Group from './Group'
import Match from './Match'

export default class Team extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public name: string

  @column()
  public groupId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Group)
  public group: BelongsTo<typeof Group>

  @hasMany(() => Match, { foreignKey: 'team1' })
  public matchesOne: HasMany<typeof Match>

  @hasMany(() => Match, { foreignKey: 'team2' })
  public matchesTwo: HasMany<typeof Match>
}
