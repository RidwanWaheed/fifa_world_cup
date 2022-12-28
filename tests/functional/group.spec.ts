import { test } from '@japa/runner'
import { faker } from '@faker-js/faker'
import Database from '@ioc:Adonis/Lucid/Database'
import GroupSeeder from 'Database/seeders/Group'
import Group from 'App/Models/Group'

test.group('Groups', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('should save provided group', async ({ client }) => {
    const random = faker.random.alpha({ casing: 'upper', bannedChars: [`${/[A-H]/g}`] })
    const response = await client.post('/groups').json({
      name: random,
    })

    const group = Group.findByOrFail('name', random)
    response.assertStatus(201)
    response.assertBodyContains({
      data: { id: (await group).id, name: (await group).name },
      message: 'Group has been created',
    })
  }).tags(['group', 'create_group'])

  test('should return a list of groups', async ({ client }) => {
    const response = await client.get('/groups')
    const groupss = await GroupSeeder.fetchGroups()

    response.assertStatus(200)
    response.assertBodyContains({
      data: {
        data: (await groupss).map((group) => ({ name: group.name, id: group.id })),
        meta: { total: (await groupss).length },
      },
    })
  }).tags(['group', 'get_groups'])

  test('should return a group', async ({ client }) => {
    const group = Group.findOrFail(8)
    const response = await client.get('/groups/8')

    response.assertStatus(200)
    response.assertBodyContains({
      data: { id: (await group).id, name: (await group).name },
    })
  }).tags(['group', 'get_group'])

  test('should update a group', async ({ client }) => {
    const response = await client.put('/groups/5').json({
      name: faker.random.alpha({ casing: 'upper', bannedChars: [`${/[A-H]/g}`] }),
    })
    const group = Group.findOrFail(5)

    response.assertStatus(200)
    response.assertBodyContains({
      data: { id: (await group).id, name: (await group).name },
      message: 'Group was edited',
    })
  }).tags(['group', 'update_group'])

  // test('should delete a group', async ({ client }) => {
  //   await groups
  //   const group = Group.findOrFail(7)
  //   const response = await client.delete('/groups/7')

  //   response.assertStatus(200)
  //   response.assertBodyContains({
  //     data: { id: (await group).id, name: (await group).name },
  //     message: 'Group was deleted',
  //   })
  // }).tags(['group', 'delete_group'])

  //////////* TEAM TEST*//////////
})
