import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Group from 'App/Models/Group'
import { groupData } from 'Database/seeds/group_data'

export default class GroupSeeder extends BaseSeeder {
  public async run() {
    await GroupSeeder.createGroups()
  }

  public static async createGroups() {
    await Group.fetchOrCreateMany(
      'name',
      groupData.map((group) => ({ name: group }))
    )
  }

  public static async fetchGroups() {
    return Group.all()
  }
}
