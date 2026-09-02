import type { AIParseResult, BloodGroup, Component, Urgency } from '@/types';

const bloodGroupPattern = /\b(A[+-]|B[+-]|O[+-]|AB[+-])\b/i;
const componentPatterns: { pattern: RegExp; value: Component }[] = [
  { pattern: /\bplatelet/i, value: 'Platelets' },
  { pattern: /\bplasma/i, value: 'Plasma' },
  { pattern: /\bwhole\s*blood/i, value: 'Whole Blood' },
  { pattern: /\brbc|red\s*cell/i, value: 'RBC' },
];
const unitsPattern = /\b(\d+)\s*(?:units?|unit|bag|bags|pkt|pack)\b/i;
const urgencyPatterns: { pattern: RegExp; value: Urgency }[] = [
  { pattern: /\b(critical|immediate|emergency|life\s*threatening|asap)\b/i, value: 'Critical' },
  { pattern: /\b(urgent|emergency|quickly|soon)\b/i, value: 'Urgent' },
  { pattern: /\b(normal|routine|scheduled|regular)\b/i, value: 'Normal' },
];
const hospitalKeywords = ['hospital', 'medical', 'care', 'institute', 'clinic', 'health'];

export function parseNaturalLanguage(input: string): AIParseResult {
  const result: AIParseResult = {
    bloodGroup: null,
    component: null,
    units: null,
    urgency: null,
    hospital: null,
    confidence: 0,
  };

  const bgMatch = input.match(bloodGroupPattern);
  if (bgMatch) {
    result.bloodGroup = normalizeBloodGroup(bgMatch[1]);
  }

  for (const { pattern, value } of componentPatterns) {
    if (pattern.test(input)) {
      result.component = value;
      break;
    }
  }

  const unitsMatch = input.match(unitsPattern);
  if (unitsMatch) {
    result.units = parseInt(unitsMatch[1], 10);
  } else {
    const anyNumber = input.match(/\b(\d+)\b/);
    if (anyNumber) result.units = parseInt(anyNumber[1], 10);
  }

  for (const { pattern, value } of urgencyPatterns) {
    if (pattern.test(input)) {
      result.urgency = value;
      break;
    }
  }

  const hospitalMatch = extractHospital(input);
  if (hospitalMatch) result.hospital = hospitalMatch;

  const fields = [result.bloodGroup, result.component, result.units, result.urgency, result.hospital];
  const found = fields.filter((f) => f !== null && f !== undefined).length;
  result.confidence = Math.round((found / 5) * 100);

  return result;
}

function normalizeBloodGroup(raw: string): BloodGroup {
  const upper = raw.toUpperCase().replace(/\s/g, '');
  const groups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
  return groups.find((g) => g === upper) ?? 'O+';
}

function extractHospital(input: string): string | null {
  const lower = input.toLowerCase();
  for (const keyword of hospitalKeywords) {
    const idx = lower.indexOf(keyword);
    if (idx !== -1) {
      let start = idx;
      while (start > 0 && /[a-z]/.test(lower[start - 1])) start--;
      let end = idx + keyword.length;
      while (end < lower.length && /[a-z\s,]/.test(lower[end])) end++;
      let hospital = input.slice(start, end).trim().replace(/[,\s]+$/, '');
      if (hospital) return hospital;
    }
  }
  return null;
}
