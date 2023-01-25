import User from 'App/Models/User'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(User, ({ faker }) => {
  return {
    username: faker.random.words(1),
    email: faker.internet.email(),
    password: faker.random.alpha(10),
  }
}).build()
