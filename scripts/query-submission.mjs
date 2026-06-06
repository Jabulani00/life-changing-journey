import { createRequire } from 'module';
import path from 'path';
import fs from 'fs';
import os from 'os';

const require = createRequire(import.meta.url);
const root = path.dirname(require.resolve('eas-cli/package.json', {
  paths: ['C:/Users/JABU/AppData/Roaming/npm/node_modules'],
}));

const { createGraphqlClient } = require(path.join(root, 'build/commandUtils/context/contextUtils/createGraphqlClient'));
const { SubmissionQuery } = require(path.join(root, 'build/graphql/queries/SubmissionQuery'));

const statePath = path.join(os.homedir(), '.expo', 'state.json');
const state = JSON.parse(fs.readFileSync(statePath, 'utf8'));
const sessionSecret = state?.auth?.sessionSecret;
if (!sessionSecret) throw new Error('Not logged in to EAS');

const client = createGraphqlClient({ sessionSecret });
const appId = 'bc265066-d7a0-43c1-ae2c-d7d7a013bff8';
const submissionId = process.argv[2];

async function printLogs(submission) {
  console.log(JSON.stringify({
    id: submission.id,
    status: submission.status,
    platform: submission.platform,
    error: submission.error,
    createdAt: submission.createdAt,
    logFiles: submission.logFiles,
  }, null, 2));

  if (!submission.logFiles?.length) return;

  for (const url of submission.logFiles) {
    const res = await fetch(url);
    const text = await res.text();
    console.log('\n--- LOG ---\n');
    for (const line of text.split('\n')) {
      try {
        const parsed = JSON.parse(line);
        if (parsed.level >= 40 || /error|agreement|fail/i.test(parsed.msg || '')) {
          console.log(parsed.msg || line);
        }
      } catch {
        if (/error|agreement|fail/i.test(line)) console.log(line);
      }
    }
  }
}

if (submissionId) {
  await printLogs(await SubmissionQuery.byIdAsync(client, submissionId, { useCache: false }));
} else {
  const submissions = await SubmissionQuery.allForAppAsync(client, appId, {
    limit: 5,
    platform: 'IOS',
  });
  for (const s of submissions) {
    await printLogs(s);
    console.log('\n');
  }
}
