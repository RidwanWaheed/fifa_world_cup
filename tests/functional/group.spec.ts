import { test } from '@japa/runner'
import { faker } from '@faker-js/faker'
import Database from '@ioc:Adonis/Lucid/Database'
import GroupSeeder from 'Database/seeders/Group'

test.group('Groups', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('should return a list of groups', async ({ client }) => {
    const groups = await GroupSeeder.createGroups()

    const response = await client.get('/groups')

    response.assertStatus(200)
    response.assertBodyContains({
      data: {
        data: groups.map((group) => ({ name: group.name, id: group.id })),
        meta: { total: groups.length },
      },
    })
  }).pin()

  /*   test('should fail if group is not returned', async ({ client }) => {
    const response = await client.get(`/groups/${randomNumber}`)

    response.assertStatus(200)
  })

  test('should fail if group is not updated', async ({ client }) => {
    const response = await client.put(`/groups/${randomNumber}`).json({
      name: faker.random.alpha({ casing: 'upper', bannedChars: [`${/[A-H]/g}`] }),
    })

    response.assertStatus(201)
  })

  test('should fail if group is not deleted', async ({ client }) => {
    const response = await client.delete(`/groups/${randomNumber}`)

    response.assertStatus(200)
    response.assertBodyContains({
      data: randomNumber,
    })
  }) */
})
