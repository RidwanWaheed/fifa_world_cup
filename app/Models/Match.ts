import Team from './Team'
import Group from './Group'
import Result from './Result'
import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'

export default class Match extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public groupId: string

  @column()
  public team1: string

  @column()
  public team2: string

  @column.dateTime()
  public startTime: DateTime

  @column.dateTime()
  public matchDate: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Group)
  public group: BelongsTo<typeof Group>

  @hasOne(() => Result)
  public result: HasOne<typeof Result>

  @belongsTo(() => Team, { foreignKey: 'team1' })
  public teamOne: BelongsTo<typeof Team>

  @belongsTo(() => Team, { foreignKey: 'team2' })
  public teamTwo: BelongsTo<typeof Team>
}
