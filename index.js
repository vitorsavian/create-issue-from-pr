import * as core from '@actions/core';
import { Octokit } from "octokit";

class CreateIssueFromPR {
  github
  constructor(token) {
    this.github = new Octokit({ auth: token })
  }

  async checkMembership(org, user) {
    try {
      const result = await this.github.rest.orgs.checkPublicMembershipForUser({
        org: org,
        username: user,
      })

      return {
        result: result,
        err: undefined
      }
    } catch (err) {
      return {
        result: undefined,
        err: err
      }
    }
  }

  async createIssue(org, repo, title, body) {
    try {
      const result = await this.github.rest.issues.create({
        owner: org,
        repo: repo,
        title: title,
        body: body,
      })

      return {
        result: result,
        err: undefined
      }
    } catch (err) {
      return {
        result: undefined,
        err: err
      }
    }
  }
}

async function run() {
  const repo = core.getInput('repo');
  const token = core.getInput('token');
  const org = core.getInput('org');
  const title = core.getInput('title');
  const body = core.getInput('body');
  const user = core.getInput('user');

  const github = new CreateIssueFromPR(token);

  console.log(`Checking if the ${user} have membership in ${org}.`);
  let { err } = await github.checkMembership(org, user);
  if (err == undefined) {
    return
  }

  if (err.status == 302 || err.status == 404) {
    console.log(`${user} not found as a public member of the ${org}. Creating issue...`);
    let { err } = await github.createIssue(org, repo, title, body)
    if (err != undefined) {
      core.setFailed(err.message)
    }
  }
}

run()
