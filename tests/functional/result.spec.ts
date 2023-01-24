import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { faker } from '@faker-js/faker'
import MatchFactory from 'Database/factories/MatchFactory'
import Result from 'App/Models/Result'
import GroupFactory from 'Database/factories/GroupFactory'
import { createGroupTeamsMatches } from 'App/Helpers/TestHelper'

test.group('Result', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('should return 422 error if `match_id` is not provided', async ({ client }) => {
    await MatchFactory.create()

    const response = await client.post('/results').json({
      team1Score: faker.datatype.number({ min: 0, max: 9 }),
      team2Score: faker.datatype.number({ min: 0, max: 9 }),
    })

    response.assertStatus(422)
  }).tags(['result', 'store_result'])

  test('should return 422 error if non-existing `match_id` is provided', async ({ client }) => {
    await MatchFactory.create()

    const response = await client.post('/results').json({
      matchId: 5,
      team1Score: faker.datatype.number({ min: 0, max: 9 }),
      team2Score: faker.datatype.number({ min: 0, max: 9 }),
    })

    response.assertStatus(422)
  }).tags(['result', 'store_result'])

  test('should create a new result', async ({ client }) => {
    const match = await MatchFactory.create()

    const response = await client.post('/results').json({
      matchId: match.id,
      team1Score: faker.datatype.number({ min: 0, max: 9 }),
      team2Score: faker.datatype.number({ min: 0, max: 9 }),
    })

    const createdResult = response.body().data

    response.assertStatus(201)
    response.assertBodyContains({
      data: { id: createdResult.id, matchId: createdResult.matchId },
      message: 'Result has been created',
    })
  }).tags(['result', 'store_result'])

  test('should return a list of results', async ({ client, assert }) => {
    await createGroupTeamsMatches(assert)

    const response = await client.get('/results')

    const returnedResults = response.body().data

    assert.equal(response.body().data.meta.total, 48)

    response.assertStatus(200)

    response.assertBodyContains({
      data: {
        data: returnedResults.data.map((result) => ({
          match_id: result.match_id,
          team1_score: result.team1_score,
          team2_score: result.team2_score,
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
      team1Score: faker.datatype.number({ min: 0, max: 9 }),
      team2Score: faker.datatype.number({ min: 0, max: 9 }),
    })

    const updatedResult = response.body().data

    response.assertStatus(200)
    response.assertBodyContains({
      data: { id: updatedResult.id, match_id: updatedResult.match_id },
      message: 'Result was edited',
    })
  }).tags(['result', 'update_result'])

  test('should delete a result', async ({ client, assert }) => {
    const matches = await MatchFactory.with('result').createMany(10)
    const results = matches.map((match) => match.result)

    const resultIds = results.map((result) => result.id)
    const resultId = faker.helpers.arrayElement(resultIds)

    const response = await client.delete(`/results/${resultId}`)

    const deletedResult = response.body().data

    response.assertStatus(200)
    response.assertBodyContains({
      data: {
        id: deletedResult.id,
        match_id: deletedResult.match_id,
        team1_score: deletedResult.team1_score,
        team2_score: deletedResult.team2_score,
      },
      message: 'Result was deleted',
    })
    // Assert that result does not exist
    assert.notInclude(
      (await Result.all()).map((result) => result.id),
      deletedResult.id
    )
  }).tags(['result', 'delete_result'])
})
