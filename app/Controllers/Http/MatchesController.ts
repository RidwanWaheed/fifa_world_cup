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
      startTime: schema.string.nullableAndOptional(),
    })

    const { groupId, matchDate, startTime } = await request.validate({
      schema: matchSchema,
    })

    const match = await Match.create({
      groupId,
      matchDate,
      startTime,
    })

    return response.created({ message: 'Match has been created', data: match })
  }

  public async index({}: HttpContextContract) {
    const matches = await Match.query().preload('result').preload('teams')
    return matches
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
      startTime: schema.string.nullableAndOptional(),
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

    return response.created({ message: 'Match was edited', data: match })
  }

  public async destroy({ response, params }: HttpContextContract) {
    const match = await Match.findOrFail(params.id)
    await match.delete()

    return response.created({ message: 'Match was deleted', data: match.id })
  }
}
