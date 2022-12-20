import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Match from './Match'

export default class Result extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public matchId: number

  @column()
  public homeScore: number

  @column()
  public awayScore: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Match)
  public matches: BelongsTo<typeof Match>
}
