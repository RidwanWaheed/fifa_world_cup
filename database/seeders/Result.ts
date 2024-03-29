import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Result from 'App/Models/Result'

export default class ResultSeeder extends BaseSeeder {
  public async run() {
    await ResultSeeder.createResults()
  }

  public static async createResults() {
    // return await ResultFactory.createMany(48)
  }

  public static async fetchResults() {
    return Result.all()
  }
}
