import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { faker } from '@faker-js/faker'
import MatchFactory from 'Database/factories/MatchFactory'

test.group('Result', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('should create a new result', async ({ client }) => {
    const match = await MatchFactory.create()

    const response = await client.post('/results').json({
      matchId: match.id,
      homeScore: faker.datatype.number({ min: 0, max: 9 }),
      awayScore: faker.datatype.number({ min: 0, max: 9 }),
    })

    const createdResult = response.body().data

    response.assertStatus(201)
    response.assertBodyContains({
      data: { id: createdResult.id, matchId: createdResult.matchId },
      message: 'Result has been created',
    })
  }).tags(['result', 'store_result'])

  test('should return a list of results', async ({ client }) => {
    const matches = await MatchFactory.with('result').createMany(10)
    const results = matches.map((match) => match.result)

    const response = await client.get('/results')

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
    const matches = await MatchFactory.with('result').createMany(10)
    const results = matches.map((match) => match.result)

    const resultIds = results.map((result) => result.id)
    const resultId = faker.helpers.arrayElement(resultIds)

    const response = await client.get(`/results/${resultId}`)

    const returnedResult = response.body().data

    response.assertStatus(200)
    response.assertBodyContains({
      data: { id: returnedResult.id, match_id: returnedResult.match_id },
    })
  }).tags(['result', 'get_result'])

  test('should update a result', async ({ client }) => {
    const matches = await MatchFactory.with('result').createMany(10)
    const results = matches.map((match) => match.result)

    const resultIds = results.map((result) => result.id)
    const resultId = faker.helpers.arrayElement(resultIds)

    const response = await client.patch(`/results/${resultId}`).json({
      homeScore: faker.datatype.number({ min: 0, max: 9 }),
      awayScore: faker.datatype.number({ min: 0, max: 9 }),
    })

    const updatedResult = response.body().data

    response.assertStatus(200)
    response.assertBodyContains({
      data: { id: updatedResult.id, match_id: updatedResult.match_id },
      message: 'Result was edited',
    })
  }).tags(['result', 'update_result'])

  test('should delete a resul', async ({ client }) => {
    const matches = await MatchFactory.with('result').createMany(10)
    const results = matches.map((match) => match.result)

    const resultIds = results.map((result) => result.id)
    const resultId = faker.helpers.arrayElement(resultIds)

    const response = await client.delete(`/results/${resultId}`)

    const deletedMatch = response.body().data

    response.assertStatus(200)
    response.assertBodyContains({
      data: { id: deletedMatch.id, match_id: deletedMatch.match_id },
      message: 'Result was deleted',
    })
  }).tags(['group', 'delete_group'])
})
