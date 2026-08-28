import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const skillName = 'gpt-image-2-portrait-library';
const source = join(root, 'agents', 'skills', skillName);
const definitions = {
  codex: join(process.env.CODEX_HOME || join(homedir(), '.codex'), 'skills'),
  'claude-code': join(process.env.CLAUDE_HOME || join(homedir(), '.claude'), 'skills'),
  agents: join(process.env.AGENTS_HOME || join(homedir(), '.agents'), 'skills')
};
const aliases = { all: Object.keys(definitions), claude: ['claude-code'], shared: ['agents'] };
const requested = process.argv.slice(2);
const targets = [...new Set((requested.length ? requested : ['all']).flatMap((name) => aliases[name] || (definitions[name] ? [name] : [])))];

if (!existsSync(join(source, 'SKILL.md'))) throw new Error(`Skill source is missing: ${source}`);
if (!targets.length || targets.length !== (requested.length ? requested : ['all']).flatMap((name) => aliases[name] || (definitions[name] ? [name] : [])).length) throw new Error('Use all, codex, claude-code, or agents.');
for (const name of targets) {
  const target = join(definitions[name], skillName);
  mkdirSync(definitions[name], { recursive: true });
  rmSync(target, { recursive: true, force: true });
  cpSync(source, target, { recursive: true });
  console.log(`Installed for ${name}: ${target}`);
}
