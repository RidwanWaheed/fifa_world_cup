import { test } from '@japa/runner'
import { faker } from '@faker-js/faker'
import TeamSeeder from 'Database/seeders/Team'
import Database from '@ioc:Adonis/Lucid/Database'
import Team from 'App/Models/Team'
import GroupSeeder from 'Database/seeders/Group'

test.group('Team', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('should save provided team', async ({ client }) => {
    await GroupSeeder.createGroups()
    const random = faker.helpers.unique(faker.address.country)
    const response = await client.post('/teams').json({
      name: random,
      groupId: 1,
    })
    const team = Team.findByOrFail('name', random)

    response.assertStatus(201)
    response.assertBodyContains({
      data: { id: (await team).id, name: (await team).name },
      message: 'Team has been created',
    })
  }).tags(['team', 'store_team'])

  test('should return a list of teams', async ({ client }) => {
    const response = await client.get('/teams')
    const teams = await TeamSeeder.fetchTeams()
    response.assertStatus(200)
    response.assertBodyContains({
      data: {
        data: teams.map((team) => ({ name: team.name, id: team.id })),
        meta: { total: teams.length },
      },
    })
  }).tags(['team', 'get_team'])

  test('should return a team', async ({ client }) => {
    const team = await Team.findOrFail(8)
    const response = await client.get('/teams/8')

    response.assertStatus(200)
    response.assertBodyContains({
      data: { id: team.id, name: team.name },
    })
  }).tags(['team', 'get_team'])

  test('should update a team', async ({ client }) => {
    const response = await client.put('/teams/8').json({
      name: faker.helpers.unique(faker.address.country),
      groupId: 1,
    })
    const team = await Team.findOrFail(8)
    response.assertStatus(200)
    response.assertBodyContains({
      data: { id: team.id, name: team.name },
      message: 'Team was edited',
    })
  }).tags(['team', 'update_team'])
})
