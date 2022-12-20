import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import Match from 'App/Models/Match'

export default class TeamsMatchesController {
  public async store({ request, response, params }: HttpContextContract) {
    const teamsSchema = schema.create({
      teams: schema.array().members(schema.number()),
    })

    const { teams } = await request.validate({
      schema: teamsSchema,
    })

    const match = await Match.findOrFail(params.id)

    await match.related('teams').attach(teams)

    return response.created({ ok: true })
  }
}
