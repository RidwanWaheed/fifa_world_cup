/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
import HealthCheck from '@ioc:Adonis/Core/HealthCheck'

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.get('health', async ({ response }) => {
  const report = await HealthCheck.getReport()

  return report.healthy ? response.ok(report) : response.badRequest(report)
})

Route.post('register', 'AuthController.register')
Route.post('login', 'AuthController.login')

// Require all data inputs and modifications to be done by authenticated users
Route.group(() => {
  Route.post('/groups', 'GroupsController.store')
  Route.put('groups/:id', 'GroupsController.update')
  Route.delete('/groups/:id', 'GroupsController.destroy')

  Route.post('/teams', 'TeamsController.store')
  Route.put('teams/:id', 'TeamsController.update')
  Route.delete('/teams/:id', 'TeamsController.destroy')

  Route.post('/matches', 'MatchesController.store')
  Route.put('matches/:id', 'MatchesController.update')
  Route.delete('/matches/:id', 'MatchesController.destroy')

  Route.post('/results', 'ResultsController.store')
  Route.patch('results/:id', 'ResultsController.update')
  Route.delete('/results/:id', 'ResultsController.destroy')

  Route.get('user', 'UsersController.show')

  Route.post('logout', 'AuthController.logout')
}).middleware('auth:web')

Route.get('groups/:id', 'GroupsController.show')
Route.get('/groups', 'GroupsController.index')
Route.get('/teams', 'TeamsController.index')
Route.get('teams/:id', 'TeamsController.show')

Route.get('/matches', 'MatchesController.index')
Route.get('matches/:id', 'MatchesController.show')

Route.get('/results', 'ResultsController.index')
Route.get('results/:id', 'ResultsController.show')
