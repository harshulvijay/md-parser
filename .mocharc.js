// mocha configuration
"use strict";

// .mocharc.json schema: https://json.schemastore.org/mocharc

module.exports = {
  "check-leaks": true,
  jobs: 8,
  retries: 5,
  color: true,
  parallel: true,
  reporter: "mochawesome",
  recursive: true,
  "reporter-option": [
    "reportDir=tests/reports",
    "reportFilename=index",
    "quiet=true",
  ],
};
