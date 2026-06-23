/** Trace EAS provisioning profile setup to find the exit point */
const origExit = process.exit.bind(process);
process.exit = (code) => {
  console.error(`[TRACE] process.exit(${code}) called`);
  console.error(new Error('exit trace').stack);
  origExit(code);
};

process.on('exit', (code) => {
  console.error(`[TRACE] process 'exit' event, code=${code}`);
});

process.on('uncaughtException', (err) => {
  console.error('[TRACE] uncaughtException:', err.message);
  console.error(err.stack);
  origExit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('[TRACE] unhandledRejection:', reason?.message || reason);
  if (reason?.stack) console.error(reason.stack);
});
