import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasOne, hasOne, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Group from './Group'
import Result from './Result'
import Team from './Team'

export default class Match extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public group_id: number

  @column()
  public start_time: string

  @column.dateTime()
  public match_date: DateTime

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime

  @belongsTo(() => Group)
  public group: BelongsTo<typeof Group>

  @hasOne(() => Result)
  public result: HasOne<typeof Result>

  @manyToMany(() => Team, { pivotTable: 'team_matches'})
  public teams: ManyToMany<typeof Team>
}
