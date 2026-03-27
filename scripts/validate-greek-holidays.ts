/**
 * Validation script for Orthodox Easter calculation.
 * Run with: npx tsx scripts/validate-greek-holidays.ts
 */

import { calculateOrthodoxEaster, getGreekHolidays } from '../src/lib/email/greek-holidays';

// Known Orthodox Easter dates (verified)
const knownEasterDates: Record<number, string> = {
  2024: '2024-05-05',
  2025: '2025-04-20',
  2026: '2026-04-12',
  2027: '2027-05-02',
  2028: '2028-04-16',
  2029: '2029-04-08',
  2030: '2030-04-28',
};

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

let passed = 0;
let failed = 0;

console.log('=== Orthodox Easter Calculation Validation ===\n');

for (const [yearStr, expected] of Object.entries(knownEasterDates)) {
  const year = parseInt(yearStr, 10);
  const calculated = formatDate(calculateOrthodoxEaster(year));

  if (calculated === expected) {
    console.log(`  ✓ ${year}: ${calculated}`);
    passed++;
  } else {
    console.error(`  ✗ ${year}: expected ${expected}, got ${calculated}`);
    failed++;
  }
}

console.log('\n=== Holiday Count Validation ===\n');

for (const year of [2025, 2026, 2027]) {
  const holidays = getGreekHolidays(year);
  const count = holidays.length;
  // 8 fixed + 5 variable = 13 holidays
  if (count === 13) {
    console.log(`  ✓ ${year}: ${count} holidays`);
    passed++;
  } else {
    console.error(`  ✗ ${year}: expected 13 holidays, got ${count}`);
    failed++;
  }

  // Verify all dates are in the correct year
  const wrongYear = holidays.filter((h) => !h.date.startsWith(`${year}-`));
  if (wrongYear.length === 0) {
    console.log(`  ✓ ${year}: all dates in correct year`);
    passed++;
  } else {
    console.error(`  ✗ ${year}: ${wrongYear.length} dates in wrong year`);
    failed++;
  }
}

console.log(`\n=== Results: ${passed} passed, ${failed} failed ===`);

if (failed > 0) {
  process.exit(1);
}
