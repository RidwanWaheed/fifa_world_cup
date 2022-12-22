import { test } from '@japa/runner'
import { faker } from '@faker-js/faker'
import Database from '@ioc:Adonis/Lucid/Database'
import GroupSeeder from 'Database/seeders/Group'

test.group('Groups', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  const randomNumber = faker.datatype.number({
    min: 1,
    max: 8,
  })
  console.log(randomNumber)

  test('should fail if groups are not returned', async ({ client }) => {
    const response = await client.get('/groups')

    response.assertStatus(200)
    response.assertBodyContains({
      data: GroupSeeder.fetchGroups,
    })
  })

  test('should fail if group is not returned', async ({ client }) => {
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
  })
})
