import group from 'App/Models/group'
import Factory from '@ioc:Adonis/Lucid/Factory'
import TeamFactory from './TeamFactory'
import MatchFactory from './MatchFactory'

export default Factory.define(group, ({ faker }) => {
  return {
    name: faker.random.words(2),
  }
})
  .relation('teams', () => TeamFactory)
  .relation('matches', () => MatchFactory)
  .build()
