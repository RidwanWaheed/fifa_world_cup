import Team from 'App/Models/Team'
import Factory from '@ioc:Adonis/Lucid/Factory'
import GroupFactory from './GroupFactory'
import MatchFactory from './MatchFactory'

export default Factory.define(Team, async ({ faker }) => {
  return {
    name: faker.helpers.unique(faker.address.country),
    flag: faker.internet.url(),
  }
})
  .relation('group', () => GroupFactory)
  .relation('matchesOne', () => MatchFactory)
  .relation('matchesTwo', () => MatchFactory)
  .build()
