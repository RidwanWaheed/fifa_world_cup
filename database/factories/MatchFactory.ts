import { DateTime } from 'luxon'
import match from 'App/Models/match'
import Factory from '@ioc:Adonis/Lucid/Factory'
import GroupFactory from './GroupFactory'

export default Factory.define(match, ({ faker }) => {
  return {
    startTime: faker.random.word(),
    matchDate: DateTime.fromJSDate(faker.datatype.datetime()),
  }
})
  .relation('group', () => GroupFactory)
  .build()
