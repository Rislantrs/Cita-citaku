import { spawn } from 'child_process';

const isWindows = process.platform === 'win32';
const shell = isWindows;

const api = spawn('npm', ['run', 'dev:api'], {
  env: { ...process.env, PORT: '3001' },
  stdio: ['ignore', 'pipe', 'inherit'],
  shell,
});

let web = null;
let startedWeb = false;

api.stdout.setEncoding('utf8');
api.stdout.on('data', (chunk) => {
  process.stdout.write(chunk);

  if (startedWeb) return;

  const match = chunk.match(/Server running on http:\/\/0\.0\.0\.0:(\d+)/);
  if (!match) return;

  startedWeb = true;
  const apiPort = match[1];
  web = spawn('npm', ['run', 'dev:web'], {
    env: { ...process.env, API_PORT: apiPort },
    stdio: 'inherit',
    shell,
  });

  web.on('exit', (code) => {
    api.kill();
    process.exit(code ?? 0);
  });
});

const shutdown = () => {
  api.kill();
  if (web) {
    web.kill();
  }
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
api.on('exit', (code) => {
  process.exit(code ?? 0);
});
