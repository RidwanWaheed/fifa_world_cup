import { test } from '@japa/runner'
import { faker } from '@faker-js/faker'
import Database from '@ioc:Adonis/Lucid/Database'
import TeamFactory from 'Database/factories/TeamFactory'
import GroupFactory from 'Database/factories/GroupFactory'
import Team from 'App/Models/Team'
import { createGroupTeamsMatches } from 'App/Helpers/TestHelper'
import UserFactory from 'Database/factories/UserFactory'

test.group('Team', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('should return 422 error if `group_id` is not provided', async ({ client }) => {
    const user = await UserFactory.create()

    const teamAttributes = await TeamFactory.make()
    const response = await client
      .post('/teams')
      .json({
        name: teamAttributes.name,
      })
      .guard('web')
      .loginAs(user)

    response.assertStatus(422)
  }).tags(['team', 'store_team'])

  test('should return 422 error if a `team` is being assigned to a non-existing group', async ({
    client,
  }) => {
    const user = await UserFactory.create()

    const teamAttributes = await TeamFactory.make()

    const response = await client
      .post('/teams')
      .json({
        name: teamAttributes.name,
        group_id: faker.random.numeric(1),
        flag: teamAttributes.flag,
      })
      .guard('web')
      .loginAs(user)

    response.assertStatus(422)
  }).tags(['team', 'store_team'])

  test('should create a new team', async ({ client }) => {
    const group = await GroupFactory.with('teams').create()

    const user = await UserFactory.create()

    const teamAttributes = await TeamFactory.make()

    const response = await client
      .post('/teams')
      .json({
        name: teamAttributes.name,
        group_id: group.id,
        flag: teamAttributes.flag,
      })
      .guard('web')
      .loginAs(user)

    const createdTeam = response.body().data

    response.assertStatus(201)
    response.assertBodyContains({
      data: { id: createdTeam.id, name: createdTeam.name },
      message: 'Team has been created',
    })
  }).tags(['team', 'store_team'])

  test('should return a list of teams', async ({ client, route, assert }) => {
    await createGroupTeamsMatches(assert)

    const response = await client.get(route('/teams', [], { qs: { per_page: 50 } }))

    const returnedTeams = response.body().data

    response.assertStatus(200)

    response.assertBodyContains({
      data: {
        data: returnedTeams.data.map((team) => ({ name: team.name, id: team.id })),
        meta: { total: returnedTeams.data.length },
      },
    })
  }).tags(['team', 'get_team'])

  test('should return a team', async ({ client }) => {
    const team = await TeamFactory.create()

    const response = await client.get(`/teams/${team.id}`)

    const returnedTeam = response.body().data

    response.assertStatus(200)
    response.assertBodyContains({
      data: { id: returnedTeam.id, name: returnedTeam.name },
    })
  }).tags(['team', 'get_team'])

  test('should update a team', async ({ client }) => {
    const group = await GroupFactory.with('teams').create()

    const team = await TeamFactory.create()

    const user = await UserFactory.create()

    const teamAttributes = await TeamFactory.make()

    const response = await client
      .put(`/teams/${team.id}`)
      .json({
        name: teamAttributes.name,
        group_id: group.id,
        flag: teamAttributes.flag,
      })
      .guard('web')
      .loginAs(user)

    const updatedTeam = response.body().data

    response.assertStatus(200)
    response.assertBodyContains({
      data: { id: updatedTeam.id, name: updatedTeam.name },
      message: 'Team was edited',
    })
  }).tags(['team', 'update_team'])

  test('should delete a team', async ({ client, assert }) => {
    const team = await TeamFactory.create()

    const user = await UserFactory.create()

    const response = await client.delete(`/teams/${team.id}`).guard('web').loginAs(user)

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
