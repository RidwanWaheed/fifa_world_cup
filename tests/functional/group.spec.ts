import { test } from '@japa/runner'
import { faker } from '@faker-js/faker'
import Database from '@ioc:Adonis/Lucid/Database'
import Group from 'App/Models/Group'
import GroupFactory from 'Database/factories/GroupFactory'

test.group('Groups', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('should create a new group', async ({ client }) => {
    await GroupFactory.createMany(8)

    const response = await client.post('/groups').json({
      name: faker.random.words(2),
    })

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
    const groups = await GroupFactory.createMany(8)

    const groupIds = groups.map((group) => group.id)
    const groupId = faker.helpers.arrayElement(groupIds)

    const response = await client.get(`/groups/${groupId}`)

    const returnedGroup = response.body().data

    response.assertStatus(200)
    response.assertBodyContains({
      data: { id: returnedGroup.id, name: returnedGroup.name },
    })
  }).tags(['group', 'get_group'])

  test('should update a group', async ({ client }) => {
    await GroupFactory.createMany(8)

    const groupIds = (await Group.all()).map((group) => group.id)
    const groupId = faker.helpers.arrayElement(groupIds)

    const response = await client.put(`/groups/${groupId}`).json({
      name: faker.random.words(2),
    })

    const updatedGroup = response.body().data

    response.assertStatus(200)
    response.assertBodyContains({
      data: { id: updatedGroup.id, name: updatedGroup.name },
      message: 'Group was edited',
    })
  }).tags(['group', 'update_group'])

  test('should delete a group', async ({ client }) => {
    await GroupFactory.createMany(8)

    const groupIds = (await Group.all()).map((group) => group.id)
    const groupId = faker.helpers.arrayElement(groupIds)

    const response = await client.delete(`/groups/${groupId}`)

    const deletedGroup = response.body().data

    response.assertStatus(200)
    response.assertBodyContains({
      data: { id: deletedGroup.id, name: deletedGroup.name },
      message: 'Group was deleted',
    })
  }).tags(['group', 'delete_group'])
})
