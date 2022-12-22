import { test } from '@japa/runner'
import { faker } from '@faker-js/faker'
import TeamSeeder from 'Database/seeders/Team'
import Database from '@ioc:Adonis/Lucid/Database'

test.group('Team', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  const randomNumber = faker.datatype.number({
    min: 1,
    max: 32,
  })
  console.log(randomNumber)

  test('should fail if team is not provided', async ({ client }) => {
    const response = await client.post('/teams')

    response.assertStatus(422)
  }).tags(['team', 'store_team'])

  test('should fail if teams are not returned', async ({ client }) => {
    const response = await client.get('/teams')

    response.assertStatus(200)
    response.assertBodyContains({
      data: TeamSeeder.fetchTeams,
    })
  }).tags(['team', 'get_team'])

  test('should fail if team is not returned', async ({ client }) => {
    const response = await client.get(`/teams/${randomNumber}`)

    response.assertStatus(200)
  }).tags(['team', 'get_team'])
})
