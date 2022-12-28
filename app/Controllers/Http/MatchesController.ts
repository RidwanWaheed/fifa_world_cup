import Match from 'App/Models/Match'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Team from 'App/Models/Team'

export default class MatchesController {
  public async store({ request, response }: HttpContextContract) {
    const matchSchema = schema.create({
      group_id: schema.string([
        rules.exists({
          table: 'groups',
          column: 'id',
        }),
      ]),
      match_date: schema.date(),
      start_time: schema.date(),
      team_ids: schema.array().members(
        schema.string([
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

    const match = await Match.create({
      groupId,
      matchDate,
      startTime,
    })

    const teams = await Promise.all(teamIds.map((id) => Team.findOrFail(id)))

    await match.related('teamOne').associate(teams[0])
    await match.related('teamTwo').associate(teams[1])

    return response.created({ message: 'Match has been created', data: match })
  }

  public async index({ response, request }: HttpContextContract) {
    const querystring = request.qs()
    const { page = 1, per_page: perPage = 20 } = querystring
    const matches = await Match.query().paginate(page, perPage)
    return response.ok({ data: matches })
  }

  public async show({ response, params }: HttpContextContract) {
    const match = await Match.findOrFail(params.id)

    await match.load('result')
    await match.load('teamOne')
    await match.load('teamTwo')

    return response.ok({ data: match })
  }

  public async update({ response, request, params }: HttpContextContract) {
    const matchSchema = schema.create({
      group_id: schema.string([
        rules.exists({
          table: 'groups',
          column: 'id',
        }),
      ]),
      match_date: schema.date(),
      start_time: schema.date(),
    })

    const {
      group_id: groupId,
      match_date: matchDate,
      start_time: startTime,
    } = await request.validate({
      schema: matchSchema,
    })

    const match = await Match.findOrFail(params.id)
    match.merge({
      groupId,
      matchDate,
      startTime,
    })

    await match.save()

    return response.ok({ message: 'Match was edited', data: match })
  }

  public async destroy({ response, params }: HttpContextContract) {
    const match = await Match.findOrFail(params.id)
    await match.delete()

    return response.created({ message: 'Match was deleted', data: match.id })
  }
}
