import { test } from '@japa/runner'
import { faker } from '@faker-js/faker'
import Database from '@ioc:Adonis/Lucid/Database'
import GroupSeeder from 'Database/seeders/Group'
import Group from 'App/Models/Group'
import TeamSeeder from 'Database/seeders/Team'
import Team from 'App/Models/Team'

test.group('Groups', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })
  const groups = GroupSeeder.createGroups()

  test('should save provided group', async ({ client }) => {
    await groups
    const random = faker.random.alpha({ casing: 'upper', bannedChars: [`${/[A-H]/g}`] })
    const response = await client.post('/groups').json({
      name: random,
    })

    const group = Group.findByOrFail('name', random)
    response.assertStatus(201)
    response.assertBodyContains({
      data: { id: (await group).id, name: (await group).name },
      message: 'Group has been created',
    })
  }).tags(['group', 'create_group'])

  test('should return a list of groups', async ({ client }) => {
    await groups
    const response = await client.get('/groups')
    const groupss = await GroupSeeder.fetchGroups()

    response.assertStatus(200)
    response.assertBodyContains({
      data: {
        data: (await groupss).map((group) => ({ name: group.name, id: group.id })),
        meta: { total: (await groupss).length },
      },
    })
  }).tags(['group', 'get_groups'])

  test('should return a group', async ({ client }) => {
    await groups
    const group = Group.findOrFail(8)
    const response = await client.get('/groups/8')

    response.assertStatus(200)
    response.assertBodyContains({
      data: { id: (await group).id, name: (await group).name },
    })
  }).tags(['group', 'get_group'])

  test('should update a group', async ({ client }) => {
    await groups
    const response = await client.put('/groups/5').json({
      name: faker.random.alpha({ casing: 'upper', bannedChars: [`${/[A-H]/g}`] }),
    })
    const group = Group.findOrFail(5)

    response.assertStatus(200)
    response.assertBodyContains({
      data: { id: (await group).id, name: (await group).name },
      message: 'Group was edited',
    })
  }).tags(['group', 'update_group'])

  // test('should delete a group', async ({ client }) => {
  //   await groups
  //   const group = Group.findOrFail(7)
  //   const response = await client.delete('/groups/7')

  //   response.assertStatus(200)
  //   response.assertBodyContains({
  //     data: { id: (await group).id, name: (await group).name },
  //     message: 'Group was deleted',
  //   })
  // }).tags(['group', 'delete_group'])

  //////////* TEAM TEST*//////////

  test('should return a list of teams', async ({ client }) => {
    await groups
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

  test('should save provided team', async ({ client }) => {
    await groups
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

  test('should return a team', async ({ client }) => {
    await groups
    const team = await Team.findOrFail(8)
    const response = await client.get('/teams/8')

    response.assertStatus(200)
    response.assertBodyContains({
      data: { id: team.id, name: team.name },
    })
  }).tags(['team', 'get_team'])

  test('should update a team', async ({ client }) => {
    await groups
    const random = faker.helpers.unique(faker.address.country)
    const response = await client.put('/teams/5').json({
      name: random,
      groupId: 1,
    })
    const team = await Team.findOrFail(5)
    response.assertStatus(200)
    response.assertBodyContains({
      data: { id: team.id, name: team.name },
      message: 'Team was edited',
    })
  }).tags(['team', 'update_team'])
})
