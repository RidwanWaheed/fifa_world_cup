import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Result from 'App/Models/Result'

export default class ResultsController {
  public async store({ request, response }: HttpContextContract) {
    const resultSchema = schema.create({
      matchId: schema.number([
        rules.exists({
          table: 'matches',
          column: 'id',
        }),
      ]),
      homeScore: schema.number(),
      awayScore: schema.number(),
    })

    const { matchId, homeScore, awayScore } = await request.validate({
      schema: resultSchema,
    })

    const result = await Result.create({
      matchId,
      homeScore,
      awayScore,
    })

    return response.created({ message: 'Result has been created', data: result })
  }

  public async index({}: HttpContextContract) {
    const results = await Result.query()
    return results
  }

  public async show({ response, params }: HttpContextContract) {
    const result = await Result.findOrFail(params.id)
    return response.ok({ data: result })
  }

  public async update({ response, request, params }: HttpContextContract) {
    const resultSchema = schema.create({
      matchId: schema.number([
        rules.exists({
          table: 'matches',
          column: 'id',
        }),
      ]),
      homeScore: schema.number(),
      awayScore: schema.number(),
    })

    const { matchId, homeScore, awayScore } = await request.validate({
      schema: resultSchema,
    })

    const result = await Result.find(params.id)
    result?.merge({
      matchId,
      homeScore,
      awayScore,
    })

    await result?.save()

    return response.created({ message: 'Result was edited', data: result })
  }

  public async destroy({ response, params }: HttpContextContract) {
    const result = await Result.findOrFail(params.id)
    await result.delete()

    return response.created({ message: 'Result was deleted', data: result.id })
  }
}
