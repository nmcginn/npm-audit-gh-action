const core = require('@actions/core');
// const github = require('@actions/github');
const { exec } = require("child_process");
const fs = require('fs');

try {
  const failureLevel = core.getInput('fail-on');
  if (fs.existsSync('package.json')) {
    exec('npm audit --json', (error, stdout, stderr) => {
      if (error && error.code !== 1) {
        console.error(stderr);
        throw error;
      }
      const v = JSON.parse(stdout);
      const criticalCount = v.metadata.vulnerabilities.critical;
      const highCount = v.metadata.vulnerabilities.high;
      const moderateCount = v.metadata.vulnerabilities.moderate;
      const lowCount = v.metadata.vulnerabilities.low;
      console.log(`Vulnerabilities detected: ${criticalCount} CRITICAL, ${highCount} HIGH, ${moderateCount} MODERATE, ${lowCount} LOW`);
      switch (failureLevel) {
        case 'critical':
          if (criticalCount > 0)
            core.setFailed(`Failing due to ${criticalCount} CRITICAL severity vulnerabilities. Please fix these with npm audit fix.`)
          break;
        case 'high':
          if (highCount > 0 || criticalCount > 0)
            core.setFailed(`Failing due to ${criticalCount+highCount} HIGH or worse severity vulnerabilities. Please fix these with npm audit fix.`)
          break;
        case 'moderate':
          if (moderateCount > 0 || highCount > 0 || criticalCount > 0)
            core.setFailed(`Failing due to ${criticalCount+highCount+moderateCount} MODERATE or worse severity vulnerabilities. Please fix these with npm audit fix.`)
          break;
        case 'low':
          if (lowCount > 0 || moderateCount > 0 || highCount > 0 || criticalCount > 0)
            core.setFailed(`Failing due to ${criticalCount+highCount+moderateCount+lowCount} LOW or worse severity vulnerabilities. Please fix these with npm audit fix.`)
          break;
        default:
          console.log('Not failing the build, but you should address any detected vulnerabilities :)');
          break;
      }
    });
  } else {
    console.log('No package.json detected, nothing to scan.')
  }
} catch (error) {
  core.setFailed(error.message);
}