import result from 'App/Models/result'
import Factory from '@ioc:Adonis/Lucid/Factory'
import MatchFactory from './MatchFactory'

export default Factory.define(result, ({ faker }) => {
  return {
    team1Score: faker.datatype.number({ min: 0, max: 9 }),
    team2Score: faker.datatype.number({ min: 0, max: 9 }),
  }
})
  .relation('matches', () => MatchFactory)
  .build()
