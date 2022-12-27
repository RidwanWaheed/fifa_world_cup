import { DateTime } from 'luxon'
import {
  BaseModel,
  BelongsTo,
  belongsTo,
  column,
  HasOne,
  hasOne,
  ManyToMany,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import Group from './Group'
import Result from './Result'
import Team from './Team'

export default class Match extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public groupId: number

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

  @manyToMany(() => Team, { pivotTable: 'team_matches', pivotTimestamps: true })
  public teams: ManyToMany<typeof Team>
}
