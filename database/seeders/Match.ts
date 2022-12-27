import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Group from 'App/Models/Group'
import Match from 'App/Models/Match'
import GroupFactory from 'Database/factories/GroupFactory'

export default class MatchSeeder extends BaseSeeder {
  public async run() {
    await MatchSeeder
  }
  // public static async createMatches() {
  //   // const group = await Group.findOrFail(1)
  //   return GroupFactory.with('matches', 4).with .create()
  // }

  public static async fetchMatches() {
    return Match.query()
  }
}
