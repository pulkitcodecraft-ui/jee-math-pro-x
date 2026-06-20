/**
 * Validates all topic bulk JSON files before commit.
 * Usage: npm run validate:bulk
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const topicsDir = join(root, 'src/lib/data/topics');

const MCQ = new Set(['A', 'B', 'C', 'D']);
const DIFF = new Set(['easy', 'medium', 'hard', 'advanced']);

function validateQuestion(q, label, qIds, aIds, defaults = {}) {
  const errors = [];
  const subtopicId = q.subtopicId ?? defaults.subtopicId;
  const difficulty = q.difficulty ?? defaults.difficulty;

  if (!q.id) errors.push(`${label}: missing id`);
  if (q.id && qIds.has(q.id)) errors.push(`${label}: duplicate id ${q.id}`);
  if (q.id) qIds.add(q.id);
  if (!q.statement) errors.push(`${label}: missing statement`);
  if (!subtopicId) errors.push(`${label}: missing subtopicId`);
  if (!DIFF.has(difficulty)) errors.push(`${label}: invalid difficulty`);
  if (!q.approaches?.length) errors.push(`${label}: needs approaches[]`);

  q.approaches?.forEach((a, j) => {
    const aLabel = `${label} approach[${j}]`;
    if (!a.label) errors.push(`${aLabel}: missing label`);
    if (!a.content) errors.push(`${aLabel}: missing content`);
    const aid = a.id || `${q.id}-a${j + 1}`;
    if (aIds.has(aid)) errors.push(`${aLabel}: duplicate id ${aid}`);
    aIds.add(aid);
  });

  if (q.correctOption && !MCQ.has(q.correctOption)) {
    errors.push(`${label}: invalid correctOption`);
  }
  if (q.correctOptions) {
    for (const c of q.correctOptions) {
      if (!MCQ.has(c)) errors.push(`${label}: invalid correctOptions entry ${c}`);
    }
  }

  return errors;
}

function validatePack(pack, file) {
  const errors = [];
  if (!pack.topicId) errors.push(`${file}: missing topicId`);

  const qIds = new Set();
  const aIds = new Set();
  const pIds = new Set();

  if (pack.questions) {
    pack.questions.forEach((q, i) => {
      errors.push(
        ...validateQuestion(q, `${file} question[${i}] (${q.id ?? '?'})`, qIds, aIds)
      );
    });
  }

  if (pack.passages) {
    pack.passages.forEach((p, pi) => {
      const pLabel = `${file} passage[${pi}] (${p.id ?? '?'})`;
      if (!p.id) errors.push(`${pLabel}: missing id`);
      if (p.id && pIds.has(p.id)) errors.push(`${pLabel}: duplicate passage id`);
      if (p.id) pIds.add(p.id);
      if (!p.passage) errors.push(`${pLabel}: missing passage`);
      if (!p.subtopicId) errors.push(`${pLabel}: missing subtopicId`);
      if (!DIFF.has(p.difficulty)) errors.push(`${pLabel}: invalid difficulty`);
      if (!p.questions?.length) errors.push(`${pLabel}: needs questions[]`);

      p.questions?.forEach((q, qi) => {
        errors.push(
          ...validateQuestion(
            q,
            `${pLabel} sub[${qi}] (${q.id ?? '?'})`,
            qIds,
            aIds,
            { subtopicId: p.subtopicId, difficulty: p.difficulty }
          )
        );
      });
    });
  }

  if (!pack.questions?.length && !pack.passages?.length) {
    errors.push(`${file}: needs questions[] or passages[]`);
  }

  return errors;
}

let totalQuestions = 0;
let totalPassages = 0;
let allErrors = [];

for (const name of readdirSync(topicsDir)) {
  const topicPath = join(topicsDir, name);
  if (!statSync(topicPath).isDirectory()) continue;
  const jsonPath = join(topicPath, 'questions.json');
  try {
    const raw = readFileSync(jsonPath, 'utf8');
    const pack = JSON.parse(raw);
    const errors = validatePack(pack, jsonPath);
    allErrors.push(...errors);
    const standalone = pack.questions?.length ?? 0;
    const passageSubs =
      pack.passages?.reduce((n, p) => n + (p.questions?.length ?? 0), 0) ?? 0;
    totalQuestions += standalone + passageSubs;
    totalPassages += pack.passages?.length ?? 0;
    console.log(
      `✓ ${name}: ${standalone} standalone + ${passageSubs} paragraph (${pack.passages?.length ?? 0} passages)`
    );
  } catch (e) {
    if (e.code === 'ENOENT') continue;
    allErrors.push(`${jsonPath}: ${e.message}`);
  }
}

if (allErrors.length) {
  console.error('\nValidation failed:\n');
  allErrors.forEach((e) => console.error('  •', e));
  process.exit(1);
}

console.log(
  `\nAll bulk packs OK (${totalQuestions} questions, ${totalPassages} passages).`
);
