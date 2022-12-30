import GroupFactory from 'Database/factories/GroupFactory'
import MatchFactory from 'Database/factories/MatchFactory'

export async function createGroupTeamsMatches(assert) {
  const groups = await GroupFactory.with('teams', 4).createMany(8)

  for (const group of groups) {
    const teams = group.teams
    assert.equal(teams.length, 4)

    const tracker: string[] = []

    for (const currentTeam of teams) {
      // Check if already-assigned team

      const otherGroupTeams = teams.filter(
        (innerTeam) =>
          innerTeam.id !== currentTeam.id &&
          tracker.every((trackerId) => trackerId !== innerTeam.id)
      )

      tracker.push(currentTeam.id)
      await Promise.all(
        otherGroupTeams.map((otherTeam) => {
          return MatchFactory.merge({
            groupId: group.id,
            team1: currentTeam.id,
            team2: otherTeam.id,
          }).create()
        })
      )
    }
  }
}
