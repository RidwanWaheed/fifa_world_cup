import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Result from 'App/Models/Result'
import Database from '@ioc:Adonis/Lucid/Database'

export default class ResultsController {
  public async store({ request, response }: HttpContextContract) {
    const resultSchema = schema.create({
      matchId: schema.number([
        rules.exists({
          table: 'matches',
          column: 'id',
        }),
      ]),
      team1Score: schema.number(),
      team2Score: schema.number(),
    })

    const { matchId, team1Score, team2Score } = await request.validate({
      schema: resultSchema,
    })

    const result = await Result.create({
      matchId,
      team1Score,
      team2Score,
    })

    return response.created({ message: 'Result has been created', data: result })
  }

  public async index({ request, response }: HttpContextContract) {
    const querystring = request.qs()
    const { page = 1, per_page: perPage = 20 } = querystring

    const results = await Database.from('results')
      .join('matches as m', 'results.match_id', '=', 'm.id')
      .join('teams as t1', 'm.team1', '=', 't1.id')
      .join('teams as t2', 'm.team2', '=', 't2.id')
      .select('results.team1_score', 'results.team2_score', 'results.match_id')
      .select('t1.name as team1', 't2.name as team2', 't1.group_id', 'm.match_date')
      .paginate(page, perPage)

    const groupedData = results.reduce((acc, match) => {
      if (!acc[match.group_id]) {
        acc[match.group_id] = []
      }
      acc[match.group_id].push(match)
      return acc
    }, {})

    return response.ok({ data: groupedData })
  }

  public async show({ response, params }: HttpContextContract) {
    const result = await Result.findOrFail(params.id)
    return response.ok({ data: result })
  }

  public async update({ response, request, params }: HttpContextContract) {
    const resultSchema = schema.create({
      team1Score: schema.number(),
      team2Score: schema.number(),
    })

    const { team1Score, team2Score } = await request.validate({
      schema: resultSchema,
    })

    const result = await Result.findOrFail(params.id)
    result.merge({
      team1Score,
      team2Score,
    })

    await result.save()

    return response.ok({ message: 'Result was edited', data: result })
  }

  public async destroy({ response, params }: HttpContextContract) {
    const result = await Result.findOrFail(params.id)
    await result.delete()

    return response.ok({ message: 'Result was deleted', data: result })
  }
}
