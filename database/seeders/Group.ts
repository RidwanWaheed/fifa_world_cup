import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import { createGroupTeamsMatches } from 'App/Helpers/TestHelper'
import Group from 'App/Models/Group'

export default class GroupSeeder extends BaseSeeder {
  public async run() {
    await GroupSeeder.createGroups()
  }

  public static async createGroups() {
    return createGroupTeamsMatches()
  }

  public static async fetchGroups() {
    return Group.all()
  }
}
