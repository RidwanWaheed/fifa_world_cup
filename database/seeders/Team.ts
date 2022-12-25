import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Team from 'App/Models/Team'
import GroupFactory from 'Database/factories/GroupFactory'
import TeamFactory from 'Database/factories/TeamFactory'

export default class TeamSeeder extends BaseSeeder {
  public async run() {
    await TeamSeeder.fetchTeams()
  }

  // public static async createTeams() {
  //   return TeamFactory.with('group', 1)
  //   // return GroupFactory.with('teams', 4).createMany(8)
  // }

  public static async fetchTeams() {
    return Team.all()
  }
}
