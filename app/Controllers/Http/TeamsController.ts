import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Team from 'App/Models/Team'

export default class TeamsController {
  public async store({ request, response }: HttpContextContract) {
    const teamSchema = schema.create({
      name: schema.string([rules.trim(), rules.escape(), rules.maxLength(30)]),
      group_id: schema.number([
        rules.exists({
          table: 'groups',
          column: 'id',
        }),
      ]),
    })

    const { name: name, group_id: groupId } = await request.validate({
      schema: teamSchema,
    })

    const team = await Team.create({
      name,
      groupId,
    })

    return response.created({ message: 'Team has been created', data: team })
  }

  public async index({ response }: HttpContextContract) {
    const teams = await Team.query().paginate(1, 50)
    return response.ok({ data: teams })
  }

  public async show({ response, params }: HttpContextContract) {
    const team = await Team.findOrFail(params.id)
    return response.ok({ data: team })
  }

  public async update({ response, request, params }: HttpContextContract) {
    const teamSchema = schema.create({
      name: schema.string([rules.trim(), rules.escape(), rules.maxLength(30)]),
      group_id: schema.number([
        rules.exists({
          table: 'groups',
          column: 'id',
        }),
      ]),
    })

    const { name: name, group_id: groupId } = await request.validate({
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

    return response.ok({ message: 'Team was deleted', data: team })
  }
}
