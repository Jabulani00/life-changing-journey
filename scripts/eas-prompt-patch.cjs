/** Auto-confirm EAS CLI prompts (non-TTY agent environments). */
global.test = true;

// Pretend we have a TTY so EAS CLI doesn't bail early on certificate validation.
function patchStream(stream) {
  if (!stream) return;
  if (!stream.isTTY) {
    Object.defineProperty(stream, 'isTTY', { value: true, writable: true });
  }
  if (!stream.getWindowSize) stream.getWindowSize = () => [120, 40];
  if (!stream.columns) Object.defineProperty(stream, 'columns', { value: 120, writable: true });
  if (!stream.rows) Object.defineProperty(stream, 'rows', { value: 40, writable: true });
  // Mock readline-compatible TTY control methods used by ora/inquirer
  if (!stream.clearLine) stream.clearLine = (_dir, cb) => { if (cb) cb(); return true; };
  if (!stream.cursorTo) stream.cursorTo = (_x, _y, cb) => { if (cb) cb(); return true; };
  if (!stream.moveCursor) stream.moveCursor = (_dx, _dy, cb) => { if (cb) cb(); return true; };
  if (!stream.clearScreenDown) stream.clearScreenDown = (cb) => { if (cb) cb(); return true; };
}
patchStream(process.stdin);
patchStream(process.stdout);
patchStream(process.stderr);

const Module = require('module');
const originalLoad = Module._load;

Module._load = function (request, parent, isMain) {
  const exported = originalLoad.apply(this, arguments);
  if (request.endsWith('/prompts') || request.endsWith('\\prompts')) {
    // Decline Apple account login so EAS proceeds with stored credentials only.
    // All other yes/no prompts (reuse cert, reuse profile, etc.) → yes.
    exported.confirmAsync = async (prompt) => {
      const msg = (typeof prompt === 'string' ? prompt : prompt?.message) || '';
      process.stderr.write(`[PATCH] confirmAsync: "${msg}" → `);
      // Decline anything that requires Apple Developer Portal credentials
      if (/apple account|log in to your apple|push notif.*key|generate.*apple.*push/i.test(msg)) {
        process.stderr.write('false\n'); return false;
      }
      process.stderr.write('true\n');
      return true;
    };
    exported.toggleConfirmAsync = async (prompt) => {
      const msg = (typeof prompt === 'string' ? prompt : prompt?.message) || '';
      process.stderr.write(`[PATCH] toggleConfirmAsync: "${msg}" → true\n`);
      return true;
    };
    exported.selectAsync = async (prompt, choices) => {
      const msg = (typeof prompt === 'string' ? prompt : prompt?.message) || '';
      // For push notification setup, pick the "Skip" / last option to avoid Apple auth.
      let val;
      if (/push notif/i.test(msg)) {
        val = choices[choices.length - 1]?.value ?? null;
      } else {
        val = choices[0]?.value ?? null;
      }
      process.stderr.write(`[PATCH] selectAsync: "${msg}" → ${val}\n`);
      return val;
    };
    exported.promptAsync = async (question) => {
      const q = Array.isArray(question) ? question[0] : question;
      const msg = typeof q?.message === 'function' ? q.message() : (q?.message || '');
      process.stderr.write(`[PATCH] promptAsync type=${q?.type} msg="${msg}"\n`);
      if (q?.type === 'confirm' || q?.type === 'toggle') {
        const ans = /apple account|log in to your apple/i.test(msg) ? false : true;
        return { [q.name || 'value']: ans };
      }
      if (q?.type === 'select' && q.choices?.length) {
        return { [q.name || 'value']: q.choices[0].value };
      }
      if (q?.type === 'text' && q.initial != null) {
        return { [q.name]: q.initial };
      }
      throw new Error(`Unhandled EAS prompt: ${msg || JSON.stringify(q)}`);
    };
  }
  return exported;
};
