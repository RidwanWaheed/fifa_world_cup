import { test } from '@japa/runner'
import { faker } from '@faker-js/faker'
import Database from '@ioc:Adonis/Lucid/Database'
import TeamFactory from 'Database/factories/TeamFactory'
import GroupFactory from 'Database/factories/GroupFactory'
import Team from 'App/Models/Team'

test.group('Team', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('should return 422 error if `group_id` is not provided', async ({ client }) => {
    const group = await GroupFactory.with('teams').create()

    const response = await client.post('/teams').json({
      name: faker.helpers.unique(faker.address.country),
      group_ids: group.id,
    })
    response.assertStatus(422)
  }).tags(['team', 'store_team'])

  test('should return 422 error if a `team` is being assigned to a non-existing group', async ({
    client,
  }) => {
    await GroupFactory.with('teams').create()

    const response = await client.post('/teams').json({
      name: faker.helpers.unique(faker.address.country),
      group_ids: 5,
    })
    response.assertStatus(422)
  }).tags(['team', 'store_team'])

  test('should create a new team', async ({ client }) => {
    const group = await GroupFactory.with('teams').create()

    const response = await client.post('/teams').json({
      name: faker.helpers.unique(faker.address.country),
      group_id: group.id,
    })

    const createdTeam = response.body().data

    response.assertStatus(201)
    response.assertBodyContains({
      data: { id: createdTeam.id, name: createdTeam.name },
      message: 'Team has been created',
    })
  }).tags(['team', 'store_team'])

  test('should return a list of teams', async ({ client, route }) => {
    const teams = await TeamFactory.createMany(32)

    const response = await client.get(route('/teams', [], { qs: { per_page: 50 } }))

    response.assertStatus(200)

    response.assertBodyContains({
      data: {
        data: teams.map((team) => ({ name: team.name, id: team.id })),
        meta: { total: teams.length },
      },
    })
  }).tags(['team', 'get_team'])

  test('should return a team', async ({ client }) => {
    const teams = await TeamFactory.createMany(32)

    const teamIds = teams.map((team) => team.id)
    const teamId = faker.helpers.arrayElement(teamIds)

    const response = await client.get(`/teams/${teamId}`)

    const returnedTeam = response.body().data

    response.assertStatus(200)
    response.assertBodyContains({
      data: { id: returnedTeam.id, name: returnedTeam.name },
    })
  }).tags(['team', 'get_team'])

  test('should update a team', async ({ client }) => {
    const group = await GroupFactory.with('teams', 4).create()

    const teamIds = group.teams.map((team) => team.id)
    const teamId = faker.helpers.arrayElement(teamIds)

    const response = await client.put(`/teams/${teamId}`).json({
      name: faker.helpers.unique(faker.address.country),
      group_id: group.id,
    })

    const updatedTeam = response.body().data

    response.assertStatus(200)
    response.assertBodyContains({
      data: { id: updatedTeam.id, name: updatedTeam.name },
      message: 'Team was edited',
    })
  }).tags(['team', 'update_team'])

  test('should delete a team', async ({ client, assert }) => {
    const teams = await TeamFactory.createMany(4)

    const teamIds = teams.map((team) => team.id)
    const teamId = faker.helpers.arrayElement(teamIds)

    const response = await client.delete(`/teams/${teamId}`)

    const deletedTeam = response.body().data

    response.assertStatus(200)
    response.assertBodyContains({
      data: { id: deletedTeam.id, name: deletedTeam.name },
      message: 'Team was deleted',
    })
    // Assert that match does not exist
    assert.notInclude(
      (await Team.all()).map((team) => team.id),
      deletedTeam.id
    )
  }).tags(['team', 'delete_team'])
})
