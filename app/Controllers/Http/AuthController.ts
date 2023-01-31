import User from 'App/Models/User'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthController {
  public async register({ request, response, auth }: HttpContextContract) {
    const userSchema = schema.create({
      email: schema.string([
        rules.trim(),
        rules.email(),
        rules.unique({ table: 'users', column: 'email', caseInsensitive: true }),
      ]),
      password: schema.string([rules.minLength(8), rules.trim()]),
    })

    const { email, password } = await request.validate({
      schema: userSchema,
      messages: {
        'email.required': 'The {{ field }} is required to create a new account',
        'email.unique': 'Email has already been used',
        'password.minLength': 'Password length must be greater than eight',
      },
    })

    const user = await User.create({
      email: email.toLocaleLowerCase(),
      password,
    })

    return response.created({ message: 'User has been Registered!', data: user })
  }

  public async login({ request, response, auth }: HttpContextContract) {
    const { email, password } = request.only(['email', 'password'])

    try {
      // Create session
      await auth.use('web').attempt(email, password)
    } catch (error) {
      return response.unauthorized({ message: 'Invalid credentials' })
    }
    response.ok({ message: 'Login successful', auth: auth.isLoggedIn, username: email })
  }

  public async logout({ response, auth }: HttpContextContract) {
    await auth.logout()

    response.ok({ message: 'Logout successful' })
  }
}
