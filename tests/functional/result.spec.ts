import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { faker } from '@faker-js/faker'
import ResultSeeder from 'Database/seeders/Result'
import GroupSeeder from 'Database/seeders/Group'
import Result from 'App/Models/Result'

test.group('Result', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('should fail if matchId already exist', async ({ client }) => {
    await GroupSeeder.createGroups()

    const response = await client.post('/results').json({
      matchId: 17,
      homeScore: faker.datatype.number({ min: 0, max: 9 }),
      awayScore: faker.datatype.number({ min: 0, max: 9 }),
    })
    // const result = (await ResultSeeder.fetchResults()).pop()
    response.assertStatus(422)
    // response.assertBodyContains({
    //   data: { id: result?.id, matchId: result?.matchId },
    //   message: 'Result has been created',
    // })
  }).tags(['result', 'store_result'])

  test('should return a list of results', async ({ client }) => {
    const response = await client.get('/results')
    const results = await ResultSeeder.fetchResults()

    response.assertStatus(200)
    response.assertBodyContains({
      data: {
        meta: { total: results.length },
        data: results.map((result) => ({
          id: result.id,
          match_id: result.matchId,
          home_score: result.homeScore,
        })),
      },
    })
  }).tags(['result', 'get_results'])

  test('should return a result', async ({ client }) => {
    const result = await Result.findOrFail(1)
    const response = await client.get('/results/1')
    // console.log(response.body())
    response.assertStatus(200)
    response.assertBodyContains({
      data: { id: result.id, match_id: result.matchId },
    })
  }).tags(['result', 'get_result'])

  test('should fail if matchId already exist', async ({ client }) => {
    const response = await client.put('/results/1').json({
      matchId: 18,
      homeScore: faker.datatype.number({ min: 0, max: 9 }),
      awayScore: faker.datatype.number({ min: 0, max: 9 }),
    })
    // console.log(response.body())
    // const result = await Result.findOrFail(1)
    response.assertStatus(422)
    // response.assertBodyContains({
    //   data: { id: result.id, match_id: result.matchId },
    //   message: 'Result was edited',
    // })
  }).tags(['result', 'update_result'])
})
