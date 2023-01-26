import { test } from '@japa/runner'
import User from 'App/Models/User'
import Database from '@ioc:Adonis/Lucid/Database'
import Hash from '@ioc:Adonis/Core/Hash'
import UserFactory from 'Database/factories/UserFactory'
import { faker } from '@faker-js/faker'

test.group('Groups', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('register a new user', async ({ client, assert }) => {
    await UserFactory.create()

    const userAttributes = await UserFactory.make()
    const password = userAttributes.password
    const response = await client.post('/register').json({
      username: userAttributes.username,
      email: userAttributes.email,
      password: password,
    })

    const registeredUser = response.body().data

    response.assertStatus(201)
    response.assertBodyContains({
      message: 'User has been Registered!',
      data: {
        username: registeredUser.username,
        email: registeredUser.email,
      },
    })

    const user = await User.findByOrFail('username', registeredUser.username)

    const hashedPassword = user.password
    assert.isTrue(await Hash.verify(hashedPassword, password))
  }).tags(['user', 'auth', 'register'])

  test('should fail if user is already registered', async ({ client }) => {
    const user = await UserFactory.create()

    const userAttributes = await UserFactory.make()
    const password = userAttributes.password
    const response = await client.post('/register').json({
      username: user.username,
      email: user.email,
      password: password,
    })

    response.assertStatus(422)
    response.error()
  }).tags(['user', 'auth', 'register'])

  test('should fail if password length is less than 8', async ({ client }) => {
    const user = await UserFactory.create()

    const userAttributes = await UserFactory.make()
    const password = faker.random.alpha(5)
    const response = await client.post('/register').json({
      username: userAttributes.username,
      email: userAttributes.email,
      password: password,
    })

    response.assertStatus(422)
    response.error()
  }).tags(['user', 'auth', 'register'])

  test('login a user', async ({ client }) => {
    const userAttributes = await UserFactory.make()
    const password = userAttributes.password
    const userData = await User.create({
      username: userAttributes.username,
      email: userAttributes.email,
      password: password,
    })

    const response = await client.post('/login').json({
      username: userData.username,
      email: userData.email,
      password: password,
    })

    response.assertStatus(200)
    response.assertBodyContains({ message: 'Login successful' })
  }).tags(['user', 'auth', 'login'])

  test('should return invalid credentials if either password or email is incorrect', async ({
    client,
  }) => {
    const userAttributes = await UserFactory.make()
    const password = userAttributes.password
    const userData = await User.create({
      username: userAttributes.username,
      email: userAttributes.email,
      password: faker.random.alpha(10),
    })

    const response = await client.post('/login').json({
      username: faker.random.words(1),
      email: userData.email,
      password: password,
    })

    response.assertStatus(401)
    response.assertBodyContains({ message: 'Invalid credentials' })
  }).tags(['user', 'auth', 'login'])

  test('logout a user', async ({ client }) => {
    const userAttributes = await UserFactory.make()
    const password = userAttributes.password
    const userData = await User.create({
      username: userAttributes.username,
      email: userAttributes.email,
      password: password,
    })

    await client.post('/login').json({
      username: userData.username,
      email: userData.email,
      password: password,
    })

    const response = await client.get('/logout')

    response.assertStatus(200)
    response.assertBodyContains({ message: 'Logout successful' })
  }).tags(['user', 'auth', 'logout'])
})
