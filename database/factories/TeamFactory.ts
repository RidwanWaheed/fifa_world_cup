import Team from 'App/Models/Team'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(Team, async ({ faker }) => {
  return {
    name: faker.helpers.unique(faker.address.country),
    groupId: faker.datatype.number({
      min: 1,
      max: 8,
    }),
  }
}).build()
