import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Group from 'App/Models/Group'
import GroupFactory from 'Database/factories/GroupFactory'

export default class GroupSeeder extends BaseSeeder {
  public async run() {
    await GroupSeeder.createGroups()
  }

  public static async createGroups() {
    return GroupFactory.with('teams', 4)
      .with('matches', 2, (match) => {
        match.with('result', 1)
      })
      .createMany(8)
  }

  public static async fetchGroups() {
    return Group.all()
  }
}
