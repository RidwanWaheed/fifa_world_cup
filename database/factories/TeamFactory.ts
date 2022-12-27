import Team from 'App/Models/Team'
import Factory from '@ioc:Adonis/Lucid/Factory'
import GroupFactory from './GroupFactory'
import MatchFactory from './MatchFactory'

export default Factory.define(Team, async ({ faker }) => {
  return {
    name: faker.helpers.unique(faker.address.country),
  }
})
  .relation('group', () => GroupFactory)
  .relation('matches', () => MatchFactory)
  .build()

// groupId: faker.datatype.number({
//   min: 1,
//   max: 8,
// }),
