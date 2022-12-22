import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Team from 'App/Models/Team'
import TeamFactory from 'Database/factories/TeamFactory'

export default class TeamSeeder extends BaseSeeder {
  public async run() {
    await TeamSeeder.createTeams()
  }

  public static async createTeams() {
    await TeamFactory.createMany(32)
  }

  public static async fetchTeams() {
    return Team.all()
  }
}
