import { test } from '@japa/runner'
import Match from 'App/Models/Match'
import { faker } from '@faker-js/faker'
import Database from '@ioc:Adonis/Lucid/Database'
import GroupFactory from 'Database/factories/GroupFactory'
import MatchFactory from 'Database/factories/MatchFactory'
import { createGroupTeamsMatches } from 'App/Helpers/TestHelper'
import { assert } from '@japa/preset-adonis'

test.group('Match', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('should return 422 error if `group_id` is not provided', async ({ client }) => {
    // 1. Create a group with teams
    const group = await GroupFactory.with('teams', 2).create()
    const teams = group.teams.map((team) => team.id)

    const matchAttributes = await MatchFactory.make()

    const response = await client.post('/matches').json({
      team_ids: teams,
      start_time: matchAttributes.startTime,
      match_date: matchAttributes.matchDate,
      group_ids: group.id,
    })

    response.assertStatus(422)
  }).tags(['match', 'store_match'])

  test('should return 400 error if `teams` does not belong to the same group', async ({
    client,
  }) => {
    // 1. Create a group with teams
    const groups = await GroupFactory.with('teams', 2).createMany(2)
    const teams = groups.map((group) => group.teams.map((team) => team.id))
    const group = groups.map((group) => group.id)

    const matchAttributes = await MatchFactory.make()

    const response = await client.post('/matches').json({
      team_ids: [teams[0][0], teams[1][1]],
      start_time: matchAttributes.startTime,
      match_date: matchAttributes.matchDate,
      group_id: group[0],
    })
    response.assertStatus(400)
  }).tags(['match', 'store_match'])

  test('should create a new match', async ({ client, assert }) => {
    // 1. Create a group with teams
    const group = await GroupFactory.with('teams', 2).create()
    const teams = group.teams.map((team) => team.id)
    assert.equal(teams.length, 2)
    const matchAttributes = await MatchFactory.make()

    const response = await client.post('/matches').json({
      team_ids: teams,
      start_time: matchAttributes.startTime,
      match_date: matchAttributes.matchDate,
      group_id: group.id,
    })

    const createdMatch = response.body().data
    response.assertStatus(201)
    response.assertBodyContains({
      data: {
        id: createdMatch.id,
        group_id: createdMatch.group_id,
        team1: teams[0],
        team2: teams[1],
      },
    })
  }).tags(['match', 'store_match'])

  test('should return a list of matches', async ({ client, assert, route }) => {
    await createGroupTeamsMatches(assert)

    const response = await client.get(route('/matches', [], { qs: { per_page: 50 } }))

    response.assertStatus(200)

    assert.equal(response.body().data.meta.total, 48)

    // Assert other properties of the response

    const returnedMatches = response.body().data

    response.assertBodyContains({
      data: {
        data: returnedMatches.data.map((match) => ({
          id: match.id,
          group_id: match.group_id,
          team1: match.team1,
          team2: match.team2,
        })),
      },
    })
  }).tags(['match', 'get_matches'])

  test('should return a match', async ({ client, assert }) => {
    await createGroupTeamsMatches(assert)

    const matchIds = (await Match.all()).map((match) => match.id)
    const matchId = faker.helpers.arrayElement(matchIds)

    const response = await client.get(`/matches/${matchId}`)

    const returnedMatch = response.body().data

    response.assertStatus(200)
    response.assertBodyContains({
      data: { id: returnedMatch.id, group_id: returnedMatch.group_id },
    })
  }).tags(['match', 'get_match'])

  test('should update a match', async ({ client, assert }) => {
    await createGroupTeamsMatches(assert)
    const group = await GroupFactory.with('teams', 2).create()
    const teams = group.teams.map((team) => team.id)

    const matches = await Match.all()
    const match = faker.helpers.arrayElement(matches)

    const matchAttributes = await MatchFactory.make()

    const response = await client.put(`/matches/${match.id}`).json({
      team_ids: teams,
      start_time: matchAttributes.startTime,
      match_date: matchAttributes.matchDate,
    })

    const updatededMatch = response.body().data
    // Assert the edited `start_time` and `match_date`
    response.assertStatus(200)
    response.assertBodyContains({
      data: {
        id: match.id,
        group_id: match.groupId,
        match_date: updatededMatch.match_date,
        start_time: updatededMatch.start_time,
      },
      message: 'Match was edited',
    })
  }).tags(['match', 'update_match'])

  test('should delete a match', async ({ client, assert }) => {
    await createGroupTeamsMatches(assert)

    const matchIds = (await Match.all()).map((match) => match.id)
    const matchId = faker.helpers.arrayElement(matchIds)

    const response = await client.delete(`/matches/${matchId}`)

    const deletedMatch = response.body().data

    response.assertStatus(200)
    response.assertBodyContains({
      data: { id: deletedMatch.id, name: deletedMatch.name },
      message: 'Match was deleted',
    })
    // Assert that match does not exist
    assert.notInclude(
      (await Match.all()).map((match) => match.id),
      deletedMatch.id
    )
  }).tags(['group', 'delete_group'])
})
