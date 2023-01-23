import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Group from 'App/Models/Group'

export default class GroupsController {
  public async store({ request, response }: HttpContextContract) {
    // 1. Create schema validation
    const groupSchema = schema.create({
      name: schema.string([rules.trim(), rules.escape(), rules.maxLength(30)]),
    })
    // 2. Validate incoming data
    const { name } = await request.validate({
      schema: groupSchema,
    })
    //. 3. create and persist data into the database
    const group = await Group.create({
      name,
    })
    // 4. return a response with a message and group data created
    return response.created({ message: 'Group has been created', data: group })
  }

  public async index({ response, request }: HttpContextContract) {
    const querystring = request.qs()
    const { page = 1, per_page: perPage = 20 } = querystring

    const groups = await Group.query().preload('teams').paginate(page, perPage)
    return response.ok({ data: groups })
  }

  public async show({ response, params }: HttpContextContract) {
    const group = await Group.findOrFail(params.id)

    return response.ok({ data: group })
  }

  public async update({ response, request, params }: HttpContextContract) {
    const groupSchema = schema.create({
      name: schema.string({ escape: true, trim: true }, [rules.maxLength(30)]),
    })

    const { name } = await request.validate({
      schema: groupSchema,
    })

    const group = await Group.findOrFail(params.id)
    group.merge({
      name,
    })

    await group.save()

    return response.ok({ message: 'Group was edited', data: group })
  }

  public async destroy({ response, params }: HttpContextContract) {
    const group = await Group.findOrFail(params.id)
    await group.delete()

    return response.ok({ message: 'Group was deleted', data: group })
  }

  public async destroyall({ response }: HttpContextContract) {
    const groups = await Group.all()

    await Promise.all(groups.map((group) => group.delete()))

    return response.created({ message: 'Group was deleted', data: groups })
  }
}
