import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UsersController {
  public async show({ response, auth }: HttpContextContract) {
    if (auth.isLoggedIn) return response.ok({ data: auth.user })
  }
}
