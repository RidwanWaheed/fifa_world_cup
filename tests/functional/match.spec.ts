import { test } from '@japa/runner'
import Match from 'App/Models/Match'
import { faker } from '@faker-js/faker'
import Database from '@ioc:Adonis/Lucid/Database'
import GroupFactory from 'Database/factories/GroupFactory'
import MatchFactory from 'Database/factories/MatchFactory'
import { createGroupTeamsMatches } from 'App/Helpers/TestHelper'

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
      team_ids: teams,
      start_time: matchAttributes.startTime,
      match_date: matchAttributes.matchDate,
      group_id: group.id,
    })

    const createdMatch = response.body().data

    response.assertStatus(201)
    response.assertBodyContains({
      data: { id: createdMatch.id, group_id: createdMatch.group_id },
    })
  }).tags(['match', 'store_match'])

  test('should return a list of matches', async ({ client, assert, route }) => {
    await createGroupTeamsMatches(assert)

    const response = await client.get(route('/matches', [], { qs: { per_page: 50 } }))

    response.assertStatus(200)

    assert.equal(response.body().data.meta.total, 48)
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

    const matchIds = (await Match.all()).map((match) => match.id)
    const matchId = faker.helpers.arrayElement(matchIds)

    const matchAttributes = await MatchFactory.make()

    const response = await client.put(`/matches/${matchId}`).json({
      team_ids: teams,
      start_time: matchAttributes.startTime,
      match_date: matchAttributes.matchDate,
      group_id: group.id,
    })

    const updatedMatch = response.body().data

    response.assertStatus(200)
    response.assertBodyContains({
      data: { id: updatedMatch.id, group_id: updatedMatch.group_id },
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
  }).tags(['group', 'delete_group'])
})
