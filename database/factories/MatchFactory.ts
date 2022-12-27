import { DateTime } from 'luxon'
import match from 'App/Models/match'
import Factory from '@ioc:Adonis/Lucid/Factory'
import GroupFactory from './GroupFactory'
import TeamFactory from './TeamFactory'
import ResultFactory from './ResultFactory'

export default Factory.define(match, ({ faker }) => {
  return {
    startTime: DateTime.fromJSDate(faker.datatype.datetime()),
    matchDate: DateTime.fromJSDate(faker.datatype.datetime()),
  }
})
  .relation('teams', () => TeamFactory)
  .relation('result', () => ResultFactory)
  .build()
