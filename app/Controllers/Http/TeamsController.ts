import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Team from 'App/Models/Team'

export default class TeamsController {
   public async store({ request, response }: HttpContextContract) {
       const teamSchema = schema.create({
         name : schema.string({ escape: true, trim: true }, [rules.maxLength(30)]),
         group_id : schema.number( [
           rules.exists({
             table: 'groups',
             column: 'id',
           })
         ])
       })
   
       const { name, group_id } = await request.validate({
         schema: teamSchema,
       })
   
       const team = await Team.create({
          name,
          group_id
         })

         await team.refresh()

         return response.created(team)
     }
}
