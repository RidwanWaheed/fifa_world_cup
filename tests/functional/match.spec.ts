import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import MatchSeeder from 'Database/seeders/Match'
import { DateTime } from 'luxon'
import { faker } from '@faker-js/faker'
import Match from 'App/Models/Match'
import Team from 'App/Models/Team'

test.group('Match', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('should save provided match', async ({ client }) => {
    const teams = await Team.all()
    const teamss = teams.map((team) => team.id)
    const response = await client.post('/matches').json({
      teams: faker.helpers.arrayElements(teamss, 2),
      startTime: DateTime.fromJSDate(faker.datatype.datetime()),
      matchDate: DateTime.fromJSDate(faker.datatype.datetime()),
      groupId: 7,
    })
    const match = (await MatchSeeder.fetchMatches()).pop()
    console.log(response.body())
    response.assertStatus(201)
    response.assertBodyContains({
      data: { id: match?.id, group_id: match?.groupId },
      message: 'Match has been created',
    })
  }).tags(['match', 'store_match'])

  test('should return a list of matches', async ({ client, assert }) => {
    const response = await client.get('/matches')
    const matches = await MatchSeeder.fetchMatches()
    // console.log(matches)

    const body = response.body()
    response.assertStatus(200)

    assert.equal(body.data.meta.total, 16)

    for (const match of body.data.data) {
      ;['id', 'group_id', 'match_date', 'start_time'].forEach((key) => {
        assert.isDefined(match[key])
        assert.isNotNull(match[key])
      })
    }
  })
    .tags(['match', 'get_matches'])
    .pin()

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
