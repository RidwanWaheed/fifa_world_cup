import { DateTime } from 'luxon'
import { test } from '@japa/runner'
import Match from 'App/Models/Match'
import { faker } from '@faker-js/faker'
import Database from '@ioc:Adonis/Lucid/Database'
import GroupFactory from 'Database/factories/GroupFactory'
import MatchFactory from 'Database/factories/MatchFactory'

test.group('Match', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('should create a new match', async ({ client }) => {
    // 1. Create a group with teams
    const group = await GroupFactory.with('teams', 2).create()
    const teams = group.teams.map((team) => team.id)

    const matchAttributes = await MatchFactory.make()

    const response = await client.post('/matches').json({
      teams,
      startTime: matchAttributes.startTime,
      matchDate: matchAttributes.matchDate,
      groupId: group.id,
    })

    const createdMatch = response.body().data

    response.assertStatus(201)
    response.assertBodyContains({
      data: { id: createdMatch.id, group_id: createdMatch.group_id },
    })
  }).tags(['match', 'store_match'])

  test('should return a list of matches', async ({ client, assert, route }) => {
    const groups = await GroupFactory.with('teams', 4).createMany(8)

    for (const group of groups) {
      const teams = group.teams
      assert.equal(teams.length, 4)

      const tracker: string[] = []

      for (const currentTeam of teams) {
        // Check if already-assigned team

        const otherGroupTeams = teams.filter(
          (innerTeam) =>
            innerTeam.id !== currentTeam.id &&
            tracker.every((trackerId) => trackerId !== innerTeam.id)
        )

        tracker.push(currentTeam.id)

        await Promise.all(
          otherGroupTeams.map((otherTeam) => {
            return MatchFactory.merge({
              groupId: group.id,
              team1: currentTeam.id,
              team2: otherTeam.id,
            }).create()
          })
        )
      }
    }

    const response = await client.get(route('/matches', [], { qs: { per_page: 50 } }))

    response.assertStatus(200)
    const body = response.body()

    assert.equal(response.body().data.meta.total, 48)
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
