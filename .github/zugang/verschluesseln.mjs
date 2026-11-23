// Verschlüsselt beim Veröffentlichen alle HTML-Seiten in _site/ mit dem Zugangscode (StatiCrypt, AES-256).
// Läuft nur in GitHub Actions (siehe .github/workflows/pages.yml). Im Repo selbst bleibt alles reines HTML.
// Ohne Secret ZUGANGSCODE passiert nichts: Die Seite ist dann offen.
//
// Danach wird geprüft, dass kein Text aus den Seiten mehr lesbar in _site/ steht.
// Sonst bricht der Lauf ab, damit nichts unverschlüsselt online geht.

import { execFileSync } from 'node:child_process';
import { copyFileSync, readFileSync, readdirSync, rmSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const SITE = '_site';
// Fester, nicht geheimer Salt: Bleibt der Code gleich, bleibt man auch nach einem neuen Deploy freigeschaltet.
const SALT = 'b7c2e91f4a6d08c3e5f1a2b94d7e6c10';
const MERKEN_TAGE = '30';
const TMP = '.zugang-tmp';

const code = process.env.ZUGANGSCODE?.trim();
if (!code) {
  console.log('Zugangscode: ZUGANGSCODE nicht gesetzt, Seite bleibt offen.');
  process.exit(0);
}
if (code.length < 8) {
  console.error('Zugangscode: bitte mindestens 8 Zeichen verwenden (Schutz gegen Durchprobieren).');
  process.exit(1);
}

const files = (dir) =>
  readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? files(p) : [p];
  });

const html = files(SITE).filter((f) => f.endsWith('.html'));

// Textproben aus den unverschlüsselten Seiten für die Prüfung am Ende
const proben = new Set();
for (const f of html) {
  const text = readFileSync(f, 'utf8').replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, '');
  for (const m of text.matchAll(/>([^<>]{40,})</g)) proben.add(m[1].trim().slice(0, 40));
}

rmSync(TMP, { recursive: true, force: true });
execFileSync(
  'npx',
  [
    '--yes',
    'staticrypt@3.5.4',
    SITE,
    '-d', TMP,
    '-r',
    '--short',
    '--salt', SALT,
    '--remember', MERKEN_TAGE,
    '--config', 'false',
    '-t', resolve('.github/zugang/vorlage.html'),
    '--template-title', 'Bald online.',
    '--template-instructions', 'Diese Seite ist noch nicht öffentlich. Mit dem Zugangscode kannst du sie dir schon ansehen.',
    '--template-placeholder', 'Zugangscode',
    '--template-button', 'Öffnen',
    '--template-error', 'Der Code stimmt nicht. Bitte versuch es noch einmal.',
  ],
  { stdio: ['ignore', 'ignore', 'inherit'], env: { ...process.env, STATICRYPT_PASSWORD: code } },
);
// staticrypt schreibt nach TMP/_site/…; nur die verschlüsselten HTML-Dateien zurückkopieren
for (const f of html) copyFileSync(join(TMP, f), f);
rmSync(TMP, { recursive: true, force: true });
console.log(`Zugangscode: ${html.length} Seiten verschlüsselt.`);

const offen = html.filter((f) => !readFileSync(f, 'utf8').includes('staticrypt'));
if (offen.length) {
  console.error('Zugangscode: nicht verschlüsselt:\n' + offen.join('\n'));
  process.exit(1);
}

const lesbar = [];
for (const f of files(SITE)) {
  if (!/\.(html|js|css|svg|txt|xml|json)$/.test(f) || f.endsWith('LICENSE.txt')) continue;
  const inhalt = readFileSync(f, 'utf8');
  for (const p of proben) if (inhalt.includes(p)) lesbar.push(`${f}: „${p}…“`);
}
if (lesbar.length) {
  console.error('Zugangscode: Diese Texte sind trotz Verschlüsselung lesbar:\n' + lesbar.join('\n'));
  process.exit(1);
}
console.log(`Zugangscode: Prüfung ok (${proben.size} Textproben, keine lesbar).`);
