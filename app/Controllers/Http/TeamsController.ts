import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Team from 'App/Models/Team'

export default class TeamsController {
  public async store({ request, response }: HttpContextContract) {
    const teamSchema = schema.create({
      name: schema.string([rules.trim(), rules.escape(), rules.maxLength(30)]),
      groupId: schema.number([
        rules.exists({
          table: 'groups',
          column: 'id',
        }),
      ]),
    })

    const { name, groupId } = await request.validate({
      schema: teamSchema,
    })

    const team = await Team.create({
      name,
      groupId,
    })

    return response.created(team)
  }

  public async index({}: HttpContextContract) {
    const teams = await Team.query()
    return teams
  }

  public async show({ response, params }: HttpContextContract) {
    const team = await Team.findOrFail(params.id)
    return response.ok({ data: team })
  }

  public async update({ response, request, params }: HttpContextContract) {
    const teamSchema = schema.create({
      name: schema.string([rules.trim(), rules.escape(), rules.maxLength(30)]),
      groupId: schema.number([
        rules.exists({
          table: 'groups',
          column: 'id',
        }),
      ]),
    })

    const { name, groupId } = await request.validate({
      schema: teamSchema,
    })

    const team = await Team.findOrFail(params.id)
    team.merge({
      name,
      groupId: groupId ?? team.groupId,
    })

    await team.save()

    return response.ok({ message: 'Team was edited', data: team })
  }

  public async destroy({ response, params }: HttpContextContract) {
    const team = await Team.findOrFail(params.id)
    await team.delete()

    return response.ok({ message: 'Team was deleted', data: team.id })
  }
}
