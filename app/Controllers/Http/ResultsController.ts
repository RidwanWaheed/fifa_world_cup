import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Result from 'App/Models/Result'
import Database from '@ioc:Adonis/Lucid/Database'

export default class ResultsController {
  public async store({ request, response }: HttpContextContract) {
    const resultSchema = schema.create({
      match_id: schema.number([
        rules.exists({
          table: 'matches',
          column: 'id',
        }),
      ]),
      team1_score: schema.number(),
      team2_score: schema.number(),
    })

    const { match_id, team1_score, team2_score } = await request.validate({
      schema: resultSchema,
    })

    const result = await Result.create({
      matchId: match_id,
      team1Score: team1_score,
      team2Score: team2_score,
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
      .join('groups as g', 'm.group_id', '=', 'g.id')
      .select('results.team1_score', 'results.team2_score', 'results.match_id')
      .select('t1.name as team1', 't2.name as team2', 'm.match_date')
      .select('g.name as group_name')
      .paginate(page, perPage)

    return response.ok({ data: results })
  }

  public async show({ response, params }: HttpContextContract) {
    const result = await Result.findOrFail(params.id)
    return response.ok({ data: result })
  }

  public async update({ response, request, params }: HttpContextContract) {
    const resultSchema = schema.create({
      team1_score: schema.number(),
      team2_score: schema.number(),
    })

    const { team1_score, team2_score } = await request.validate({
      schema: resultSchema,
    })

    const result = await Result.findOrFail(params.id)
    result.merge({
      team1Score: team1_score,
      team2Score: team2_score,
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
