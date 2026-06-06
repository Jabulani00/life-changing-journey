/** Auto-confirm EAS CLI prompts (non-TTY agent environments). */
global.test = true;

const Module = require('module');
const originalLoad = Module._load;

Module._load = function (request, parent, isMain) {
  const exported = originalLoad.apply(this, arguments);
  if (request.endsWith('/prompts') || request.endsWith('\\prompts')) {
    exported.confirmAsync = async () => true;
    exported.toggleConfirmAsync = async () => true;
    exported.selectAsync = async (_message, choices) => choices[0]?.value ?? null;
    exported.promptAsync = async (question) => {
      const q = Array.isArray(question) ? question[0] : question;
      if (q?.type === 'confirm' || q?.type === 'toggle') {
        return { [q.name || 'value']: true };
      }
      if (q?.type === 'select' && q.choices?.length) {
        return { [q.name || 'value']: q.choices[0].value };
      }
      if (q?.type === 'text' && q.initial != null) {
        return { [q.name]: q.initial };
      }
      throw new Error(`Unhandled EAS prompt: ${q?.message || JSON.stringify(q)}`);
    };
  }
  return exported;
};
