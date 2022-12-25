import group from 'App/Models/group'
import Factory from '@ioc:Adonis/Lucid/Factory'
import TeamFactory from './TeamFactory'

export default Factory.define(group, ({ faker }) => {
  return {
    name: faker.helpers.unique(faker.random.alpha),
    // faker.random.alpha({ casing: 'upper', bannedChars: [`${/[I-Z]/g}`] }),
  }
})
  .relation('teams', () => TeamFactory)
  .build()
