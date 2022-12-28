import { DateTime } from 'luxon'
import match from 'App/Models/match'
import Factory from '@ioc:Adonis/Lucid/Factory'
import TeamFactory from './TeamFactory'
import ResultFactory from './ResultFactory'
import Team from 'App/Models/Team'

export default Factory.define(match, async ({ faker }) => {
  return {
    startTime: DateTime.fromJSDate(faker.datatype.datetime()),
    matchDate: DateTime.fromJSDate(faker.datatype.datetime()),
  }
})
  .relation('teams', () => TeamFactory)
  .relation('result', () => ResultFactory)
  .build()
