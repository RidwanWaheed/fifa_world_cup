import { DateTime } from 'luxon'
import {
  BaseModel,
  belongsTo,
  BelongsTo,
  column,
  ManyToMany,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import Group from './Group'
import Match from './Match'

export default class Team extends BaseModel {
  @column({ isPrimary: true })
  public id: number

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

  @manyToMany(() => Match, { pivotTable: 'team_matches', pivotTimestamps: true })
  public matches: ManyToMany<typeof Match>
}
