import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Result extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public match_id: number

  @column()
  public home_score: number

  @column()
  public away_score: number


  @column.dateTime({ autoCreate: true })
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime
}
