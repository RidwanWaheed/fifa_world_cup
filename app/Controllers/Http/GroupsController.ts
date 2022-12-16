 import { schema, rules } from '@ioc:Adonis/Core/Validator'
 import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
 import Group from 'App/Models/Group'

export default class GroupsController {
    public async store({ request, response }: HttpContextContract) {
        const groupSchema = schema.create({
          name : schema.string({ escape: true, trim: true }, [rules.maxLength(30)])
        })
    
        const { name } = await request.validate({
          schema: groupSchema,
        })
    
        const group = await Group.create({
           name
          })

          await group.refresh()

          return response.created(group)
      }

      public async index({}: HttpContextContract) {
        const groups = await Group.query();
        return groups
      }

      public async update({ response, request, params}: HttpContextContract)
    {
        const groupSchema = schema.create({
            name : schema.string({ escape: true, trim: true }, [rules.maxLength(30)])
          })
      
          const { name } = await request.validate({
            schema: groupSchema,
          })

        const group = await Group.find(params.id);
        group?.merge({
            name
          })
    
          await group?.save()
          await group?.refresh()
    
          return response.created({ message: 'Contact was edited', data: group })
    }

    public async destroy({response, params}: HttpContextContract) {
        const group = await Group.find(params.id);
        await group?.delete()

        return response.created({ message: 'Group was deleted', data: group?.id })
    }
}
