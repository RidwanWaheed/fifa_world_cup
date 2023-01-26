import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'

export default class AuthController {
  public async register({ request, response, auth }: HttpContextContract) {
    const userSchema = schema.create({
      username: schema.string([
        rules.trim(),
        rules.escape(),
        rules.maxLength(30),
        rules.unique({ table: 'users', column: 'username', caseInsensitive: true }),
      ]),
      email: schema.string([
        rules.trim(),
        rules.email(),
        rules.unique({ table: 'users', column: 'email', caseInsensitive: true }),
      ]),
      password: schema.string([rules.minLength(8), rules.trim()]),
    })

    const { username, email, password } = await request.validate({
      schema: userSchema,
      messages: {
        'username.required': 'The {{ field }} is required to create a new account',
        'username.unique': 'Username not available',
        'email.required': 'The {{ field }} is required to create a new account',
        'email.unique': 'Email has already been used',
        'password.minLength': 'Password length must be greater than eight',
      },
    })

    const user = await User.create({
      username,
      email,
      password,
    })

    await auth.login(user)

    return response.created({ message: 'User has been Registered!', data: user })
  }

  public async login({ request, response, auth }: HttpContextContract) {
    const { username, password } = request.only(['username', 'password'])

    try {
      await auth.attempt(username, password)
    } catch (error) {
      return response.unauthorized({ message: 'Invalid credentials' })
    }
    response.ok({ message: 'Login successful' })
  }

  public async logout({ response, auth }: HttpContextContract) {
    await auth.logout()

    response.ok({ message: 'Logout successful' })
  }
}
