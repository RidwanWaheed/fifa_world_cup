import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Result from 'App/Models/Result'
import MatchFactory from 'Database/factories/MatchFactory'
import ResultFactory from 'Database/factories/ResultFactory'

export default class ResultSeeder extends BaseSeeder {
  public async run() {
    await ResultSeeder.createResults()
  }

  public static async createResults() {
    return await MatchFactory.with('result').with('teamOne').with('teamTwo').createMany(10)
  }

  public static async fetchResults() {
    return Result.all()
  }
}
