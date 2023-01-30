import { test } from '@japa/runner'
import { faker } from '@faker-js/faker'
import Database from '@ioc:Adonis/Lucid/Database'
import GroupFactory from 'Database/factories/GroupFactory'
import UserFactory from 'Database/factories/UserFactory'

test.group('Groups', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('should create a new group', async ({ client }) => {
    const user = await UserFactory.create()
    const groupAttributes = await GroupFactory.make()

    const response = await client
      .post('/groups')
      .json({
        name: groupAttributes.name,
      })
      .guard('web')
      .loginAs(user)

    const createdGroup = response.body().data

    response.assertStatus(201)
    response.assertBodyContains({
      data: { id: createdGroup.id, name: createdGroup.name },
      message: 'Group has been created',
    })
  }).tags(['group', 'create_group'])

  test('should return a list of groups', async ({ client }) => {
    const groups = await GroupFactory.createMany(8)

    const response = await client.get('/groups')

    response.assertStatus(200)
    response.assertBodyContains({
      data: {
        data: groups.map((group) => ({ name: group.name, id: group.id })),
        meta: { total: groups.length },
      },
    })
  }).tags(['group', 'get_groups'])

  test('should return a group', async ({ client }) => {
    const group = await GroupFactory.create()

    const response = await client.get(`/groups/${group.id}`)

    const returnedGroup = response.body().data

    response.assertStatus(200)
    response.assertBodyContains({
      data: { id: returnedGroup.id, name: returnedGroup.name },
    })
  }).tags(['group', 'get_group'])

  test('should update a group', async ({ client }) => {
    const group = await GroupFactory.create()
    const user = await UserFactory.create()
    const groupAttributes = await GroupFactory.make()

    const response = await client
      .put(`/groups/${group.id}`)
      .json({
        name: groupAttributes.name,
      })
      .guard('web')
      .loginAs(user)

    const updatedGroup = response.body().data

    response.assertStatus(200)
    response.assertBodyContains({
      data: { id: updatedGroup.id, name: updatedGroup.name },
      message: 'Group was edited',
    })
  }).tags(['group', 'update_group'])

  test('should delete a group', async ({ client }) => {
    const group = await GroupFactory.create()
    const user = await UserFactory.create()

    const response = await client.delete(`/groups/${group.id}`).guard('web').loginAs(user)

    const deletedGroup = response.body().data

    response.assertStatus(200)
    response.assertBodyContains({
      data: { id: deletedGroup.id, name: deletedGroup.name },
      message: 'Group was deleted',
    })
  }).tags(['group', 'delete_group'])
})
