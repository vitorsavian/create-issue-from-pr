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

    const result = await octokit.request('GET /orgs/{org}/members/{username}', {
      org: org,
      username: user,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })

    if (result.status == 204) {
      console.log(`${user} is in the team ${team}.`);
    } else {
      console.log(`${user} not in the team ${team}. Creating issue...`);

      await octokit.request('POST /repos/{owner}/{repo}/issues', {
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
