const core = require('@actions/core')
const github = require('@actions/github')
const { Octokit } = require('@ocktokit/rest')

async function run() {
  try {
    const project = core.getInput('project');
    const token = core.getInput('token');
    const org = core.getInput('org');
    const team = core.getInput('team');
    const issueTitle = core.getInput('title');
    const issueBody = core.getInput('body');
    const user = core.getInput('user');
    const octokit = new Octokit({ auth: token });

    const { data: teamMembers } = await octokit.teams.listMembersInOrg({
      org: org,
      team_slug: team
    });

    const userInTeam = teamMembers.some(member => member.login === user);

    if (userInTeam) {
      console.log(`${user} is in the team ${team}.`);
    } else {
      console.log(`${user} not in the team ${team}. Creating issue...`);

      await octokit.issues.create({
        owner: org,
        repo: project,
        title: issueTitle,
        body: issueBody,
      });

      console.log(`Issue created.`);
    }
  } catch (err) {
    core.setFailed(err.message);
  }
}

run()
