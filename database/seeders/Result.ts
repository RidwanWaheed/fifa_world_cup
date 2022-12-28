import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Result from 'App/Models/Result'

export default class ResultSeeder extends BaseSeeder {
  public async run() {
    await ResultSeeder.fetchResults()
  }

  public static async fetchResults() {
    return Result.all()
  }
}
