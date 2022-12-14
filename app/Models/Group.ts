import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Team from './Team'
import Match from './Match'

export default class Group extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime

  @hasMany(() => Team)
  public teams: HasMany<typeof Team>

  @hasMany(() => Match)
  public matches: HasMany<typeof Match>
}


