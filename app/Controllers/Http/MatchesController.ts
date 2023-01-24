import Match from 'App/Models/Match'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Team from 'App/Models/Team'

export default class MatchesController {
  public async store({ request, response }: HttpContextContract) {
    const matchSchema = schema.create({
      group_id: schema.number([
        rules.exists({
          table: 'groups',
          column: 'id',
        }),
      ]),
      match_date: schema.date(),
      start_time: schema.date(),
      team_ids: schema.array().members(
        schema.number([
          rules.exists({
            table: 'teams',
            column: 'id',
          }),
        ])
      ),
    })

    const {
      group_id: groupId,
      match_date: matchDate,
      start_time: startTime,
      team_ids: teamIds,
    } = await request.validate({
      schema: matchSchema,
    })
    //  check if both teams belong to the same group
    // 1. fetch both teams
    const teams = await Promise.all(
      teamIds.map((teamId) => Team.query().where('id', teamId).firstOrFail())
    )
    // 2. fetch their groupIds
    const groupid = teams.map((team) => team.groupId)

    //persist data if both teams belong to the same group
    if (groupid[0] !== groupid[1] && groupId[0] !== groupId)
      return response.badRequest({ message: 'Teams does not belong to the same group' })

    //check if match has already been created
    const existingMatch = await Match.query()
      .where('group_id', groupId)
      .where('team1', teamIds[0])
      .where('team2', teamIds[1])
      .first()

    if (existingMatch) {
      return response.badRequest({ message: 'Match already exists' })
    }

    const match = await Match.create({
      groupId: groupId.toString(),
      matchDate,
      startTime,
      team1: teamIds[0].toString(),
      team2: teamIds[1].toString(),
    })

    return response.created({ message: 'Match has been created', data: match })
  }

  public async index({ response, request }: HttpContextContract) {
    const querystring = request.qs()
    const { page = 1, per_page: perPage = 20 } = querystring
    const matches = await Match.query().paginate(page, perPage)
    return response.ok({ data: matches })
  }

  public async show({ response, params }: HttpContextContract) {
    const match = await Match.query()
      .preload('result')
      .preload('teamOne')
      .preload('teamTwo')
      .where('id', params.id)
      .firstOrFail()

    return response.ok({ data: match })
  }

  public async update({ response, request, params }: HttpContextContract) {
    const matchSchema = schema.create({
      match_date: schema.date(),
      start_time: schema.date(),
      team_ids: schema.array().members(
        schema.number([
          rules.exists({
            table: 'teams',
            column: 'id',
          }),
        ])
      ),
    })

    const {
      match_date: matchDate,
      start_time: startTime,
      team_ids: teamIds,
    } = await request.validate({
      schema: matchSchema,
    })

    const match = await Match.findOrFail(params.id)

    match.merge({
      matchDate,
      startTime,
      team1: teamIds[0].toString(),
      team2: teamIds[1].toString(),
    })

    await match.save()

    return response.ok({ message: 'Match was edited', data: match })
  }

  public async destroy({ response, params }: HttpContextContract) {
    const match = await Match.findOrFail(params.id)
    await match.delete()
    return response.ok({ message: 'Match was deleted', data: match })
  }
}
