import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import MatchSeeder from 'Database/seeders/Match'
import { DateTime } from 'luxon'
import { faker } from '@faker-js/faker'
import Match from 'App/Models/Match'

test.group('Match', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('should save provided match', async ({ client }) => {
    const response = await client.post('/matches').json({
      startTime: DateTime.fromJSDate(faker.datatype.datetime()),
      matchDate: DateTime.fromJSDate(faker.datatype.datetime()),
      groupId: 7,
    })
    const match = (await MatchSeeder.fetchMatches()).pop()
    response.assertStatus(201)
    response.assertBodyContains({
      data: { id: match?.id, group_id: match?.groupId },
      message: 'Match has been created',
    })
  }).tags(['match', 'store_match'])

  test('should return a list of matches', async ({ client }) => {
    const response = await client.get('/matches')
    const matches = await MatchSeeder.fetchMatches()
    // console.log(matches)
    // console.log(response.body())
    response.assertStatus(200)
    response.assertBodyContains({
      data: {
        meta: { total: matches.length },
        // data: matches.map((match) => ({
        //   id: match.id,
        //   group_id: match.groupId,
        //   match_date: match.matchDate,
        //   start_time: match.startTime,
        // })),
      },
    })
  }).tags(['match', 'get_matches'])

  test('should return a match', async ({ client }) => {
    const match = await Match.findOrFail(8)
    const response = await client.get('/matches/8')

    response.assertStatus(200)
    response.assertBodyContains({
      data: { id: match.id, group_id: match?.groupId },
    })
  }).tags(['match', 'get_match'])

  test('should update a match', async ({ client }) => {
    const response = await client.put('/matches/4').json({
      startTime: DateTime.fromJSDate(faker.datatype.datetime()),
      matchDate: DateTime.fromJSDate(faker.datatype.datetime()),
      groupId: 5,
    })
    const match = await Match.findOrFail(4)
    response.assertStatus(200)
    response.assertBodyContains({
      data: { id: match.id, group_id: match.groupId },
      message: 'Match was edited',
    })
  }).tags(['match', 'update_match'])
})
