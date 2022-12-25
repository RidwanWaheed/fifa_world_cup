// import { test } from '@japa/runner'
// import { faker } from '@faker-js/faker'
// import TeamSeeder from 'Database/seeders/Team'
// import Database from '@ioc:Adonis/Lucid/Database'
// import Team from 'App/Models/Team'
// import GroupSeeder from 'Database/seeders/Group'

// test.group('Team', (group) => {
//   group.each.setup(async () => {
//     await Database.beginGlobalTransaction()
//     return () => Database.rollbackGlobalTransaction()
//   })
//   const groups = GroupSeeder.createGroups()

//   test('should save provided team', async ({ client }) => {
//     await groups
//     const random = faker.helpers.unique(faker.address.country)
//     const response = await client.post('/teams').json({
//       name: random,
//       groupId: 1,
//     })
//     const team = Team.findByOrFail('name', random)
//     console.log(groups)

//     response.assertStatus(201)
//     response.assertBodyContains({
//       data: { id: (await team).id, name: (await team).name },
//       message: 'Team has been created',
//     })
//   })
//     .tags(['team', 'store_team'])
//     .pin()

//   test('should return a list of teams', async ({ client }) => {
//     // const teams = await TeamSeeder.createTeams()
//     const response = await client.get('/teams')
//     // console.log(await TeamSeeder.fetchTeams())
//     response.assertStatus(200)
//     // response.assertBodyContains({
//     //   data: {
//     //     data: (await teams).map((team) => ({ name: team.name, id: team.id })),
//     //     meta: { total: (await teams).length },
//     //   },
//     // })
//   }).tags(['team', 'get_team'])

//   test('should fail if team is not returned', async ({ client }) => {
//     const response = await client.get(`/teams/${randomNumber}`)

//     response.assertStatus(200)
//   }).tags(['team', 'get_team'])
// })
