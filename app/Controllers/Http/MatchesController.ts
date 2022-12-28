import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Match from 'App/Models/Match'

export default class MatchesController {
  public async store({ request, response }: HttpContextContract) {
    const matchSchema = schema.create({
      groupId: schema.number([
        rules.exists({
          table: 'groups',
          column: 'id',
        }),
      ]),
      matchDate: schema.date(),
      startTime: schema.date(),
      teams: schema.array().members(schema.number()),
    })

    const { groupId, matchDate, startTime, teams } = await request.validate({
      schema: matchSchema,
    })

    const match = await Match.create({
      groupId,
      matchDate,
      startTime,
    })

    await match.related('teams').attach(teams)

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
    await match.load('teams')

    return response.ok({ data: match })
  }

  public async update({ response, request, params }: HttpContextContract) {
    const matchSchema = schema.create({
      groupId: schema.number([
        rules.exists({
          table: 'groups',
          column: 'id',
        }),
      ]),
      matchDate: schema.date(),
      startTime: schema.date(),
    })

    const { groupId, matchDate, startTime } = await request.validate({
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
