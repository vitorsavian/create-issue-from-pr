/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 714:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 735:
/***/ ((module) => {

module.exports = eval("require")("@actions/github");


/***/ }),

/***/ 822:
/***/ ((module) => {

module.exports = eval("require")("@ocktokit/core");


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
const core = __nccwpck_require__(714)
const github = __nccwpck_require__(735)
const { Octokit } = __nccwpck_require__(822)

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

})();

module.exports = __webpack_exports__;
/******/ })()
;