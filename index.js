const core = require('@actions/core');
const github = require('@actions/github');
const { exec } = require("child_process");
const fs = require('fs');

try {
  if (fs.existsSync('package.json')) {
    exec('npm audit --json', (error, stdout, stderr) => {
      if (error) {
        console.error(stderr);
        throw error;
      }
      const v = JSON.parse(stdout);
      console.log(`Vulnerabilities detected: ${v.metadata.vulnerabilities.critical} CRITICAL, ${v.metadata.vulnerabilities.high} HIGH, ${v.metadata.vulnerabilities.moderate} moderate, ${v.metadata.vulnerabilities.low} LOW`);
    });
  }
//   // `who-to-greet` input defined in action metadata file
//   const nameToGreet = core.getInput('who-to-greet');
//   console.log(`Hello ${nameToGreet}!`);
//   const time = (new Date()).toTimeString();
//   core.setOutput("time", time);
//   // Get the JSON webhook payload for the event that triggered the workflow
//   const payload = JSON.stringify(github.context.payload, undefined, 2)
//   console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}