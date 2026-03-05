#!/usr/bin/env node
/**
 * generate-puzzles.js — Weekly puzzle refresh via Claude API
 * 
 * Usage:
 *   ANTHROPIC_API_KEY=sk-ant-... node generate-puzzles.js
 * 
 * Or add to package.json scripts:
 *   "refresh": "node generate-puzzles.js"
 * 
 * What it does:
 *   1. Reads current data files as context
 *   2. Asks Claude to generate a fresh week of puzzles
 *   3. Validates the output (correct counts, no duplicates)
 *   4. Writes new data files (old ones backed up)
 * 
 * Run weekly via cron, GitHub Actions, or manually:
 *   0 0 * * 0 cd /path/to/inkworm && node generate-puzzles.js
 */

const fs = require('fs');
const path = require('path');

const API_KEY = process.env.ANTHROPIC_API_KEY;
if (!API_KEY) {
  console.error('Error: Set ANTHROPIC_API_KEY environment variable');
  process.exit(1);
}

const DATA_DIR = path.join(__dirname, 'src', 'data');

async function callClaude(prompt, systemPrompt) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8000,
      system: systemPrompt,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  const data = await res.json();
  return data.content[0].text;
}

function backup(filename) {
  const src = path.join(DATA_DIR, filename);
  if (fs.existsSync(src)) {
    const bak = path.join(DATA_DIR, `${filename}.bak`);
    fs.copyFileSync(src, bak);
    console.log(`  Backed up ${filename} → ${filename}.bak`);
  }
}

function extractJSON(text) {
  // Strip markdown fences if present
  const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  return JSON.parse(clean);
}

// ═══ SCRAMBLE GENERATION ═══
async function generateScramble() {
  console.log('Generating Scramble puzzles...');
  
  const current = fs.readFileSync(path.join(DATA_DIR, 'scramble-data.js'), 'utf8');
  
  const system = `You are a literary puzzle designer for Inkworm, a daily literary quiz game. 
You create sophisticated, witty, and elegant clues that delight bibliophiles.
You MUST respond with ONLY valid JSON — no markdown, no explanation, no preamble.`;

  const prompt = `Generate 35 NEW literary scramble puzzles (7 days × 5 per day). 

Rules:
- Mix of characters, authors, and works from world literature
- Each needs two hints: h1 (cryptic/literary — witty, allusive) and h2 (easier — direct identification)  
- Type t: "character", "author", or "work"
- Answers should be varied in length (3-18 characters)
- NO duplicates with existing puzzles below
- Represent diverse literary traditions: Western, South Asian, Latin American, African, Japanese, Russian, etc.

EXISTING PUZZLES TO AVOID (do not repeat any answer):
${current.match(/a:"([^"]+)"/g)?.map(m => m.slice(3, -1)).join(', ')}

Return a JSON array of 35 objects: [{"a":"ANSWER","h1":"cryptic hint","h2":"easier hint","t":"type"}, ...]`;

  const raw = await callClaude(prompt, system);
  const puzzles = extractJSON(raw);
  
  if (!Array.isArray(puzzles) || puzzles.length < 35) {
    throw new Error(`Expected 35 scramble puzzles, got ${puzzles?.length}`);
  }
  
  // Validate structure
  for (const p of puzzles) {
    if (!p.a || !p.h1 || !p.h2 || !p.t) {
      throw new Error(`Invalid puzzle: ${JSON.stringify(p)}`);
    }
  }
  
  return puzzles;
}

// ═══ QUOTE MATCH GENERATION ═══
async function generateQuotes() {
  console.log('Generating Quote Match puzzles...');
  
  const current = fs.readFileSync(path.join(DATA_DIR, 'quotes-data.js'), 'utf8');
  
  const system = `You are a literary puzzle designer. You select memorable, recognizable quotes from world literature.
You MUST respond with ONLY valid JSON — no markdown, no explanation, no preamble.`;

  const prompt = `Generate 28 NEW quote-source pairs for a matching game (7 days × 4 per day).

Rules:
- Quotes should be famous enough that a well-read person might recognize them
- Sources formatted as: "Book Title — Author" or "Character Name" 
- Mix classic and modern, Western and non-Western
- No duplicates with existing quotes below

EXISTING QUOTES TO AVOID:
${current.match(/q:"([^"]+)"/g)?.slice(0, 10).map(m => m.slice(3, -1)).join('\n')}

Return a JSON array of 28 objects: [{"q":"quote text","s":"Source — Author"}, ...]`;

  const raw = await callClaude(prompt, system);
  const quotes = extractJSON(raw);
  
  if (!Array.isArray(quotes) || quotes.length < 28) {
    throw new Error(`Expected 28 quotes, got ${quotes?.length}`);
  }
  
  return quotes;
}

// ═══ KINDRED WORDS GENERATION ═══
async function generateKindred() {
  console.log('Generating Kindred Words puzzles...');
  
  const system = `You are a literary puzzle designer creating word grouping puzzles.
You MUST respond with ONLY valid JSON — no markdown, no explanation, no preamble.`;

  const prompt = `Generate 7 Kindred Words puzzles (one per day). Each puzzle has 4 groups of 4 words.

Rules:
- All 16 words in a puzzle should be related to literature in some way
- Groups should have clever, non-obvious categories
- Some words should be tricky — plausibly fitting multiple groups
- Words should be 3-12 characters, ALL CAPS
- Use colors: "#BDA36B", "#B8A9D4", "#9DB89A", "#D4929B" for the 4 groups

Return a JSON array of 7 objects:
[{"g":[{"l":"Category Name","w":["WORD1","WORD2","WORD3","WORD4"],"c":"#BDA36B"}, ...]}, ...]`;

  const raw = await callClaude(prompt, system);
  const kindred = extractJSON(raw);
  
  if (!Array.isArray(kindred) || kindred.length < 7) {
    throw new Error(`Expected 7 kindred sets, got ${kindred?.length}`);
  }
  
  for (const k of kindred) {
    if (!k.g || k.g.length !== 4) throw new Error('Each kindred set needs 4 groups');
    for (const g of k.g) {
      if (!g.l || !g.w || g.w.length !== 4 || !g.c) throw new Error(`Invalid group: ${JSON.stringify(g)}`);
    }
  }
  
  return kindred;
}

// ═══ WANDERLUST GENERATION ═══
async function generateWanderlust() {
  console.log('Generating Wanderlust puzzles...');
  
  const current = fs.readFileSync(path.join(DATA_DIR, 'wanderlust-data.js'), 'utf8');
  
  const system = `You are a literary travel guide designing location-guessing puzzles.
You MUST respond with ONLY valid JSON — no markdown, no explanation, no preamble.`;

  const prompt = `Generate 7 NEW literary Wanderlust locations (one per day).

Rules:
- Each location is a real city/place famous for its literary heritage
- 4 progressive hints: first is cryptic/allusive, last is almost a giveaway
- Include lat/lng coordinates
- Diverse: mix European, Asian, African, American, Middle Eastern locations
- Do NOT repeat: Edinburgh, Florence, Moscow, Prague, New Orleans, Kolkata, Buenos Aires

Return a JSON array of 7 objects:
[{"answer":"City, Country","lat":0.0,"lng":0.0,"hints":["hint1","hint2","hint3","hint4"]}, ...]`;

  const raw = await callClaude(prompt, system);
  const locations = extractJSON(raw);
  
  if (!Array.isArray(locations) || locations.length < 7) {
    throw new Error(`Expected 7 locations, got ${locations?.length}`);
  }
  
  for (const loc of locations) {
    if (!loc.answer || !loc.lat || !loc.lng || !loc.hints || loc.hints.length < 4) {
      throw new Error(`Invalid location: ${JSON.stringify(loc)}`);
    }
  }
  
  return locations;
}

// ═══ WRITE DATA FILES ═══
function writeDataFile(filename, exportName, data, comment) {
  const content = `// ${comment}\nexport const ${exportName} = ${JSON.stringify(data, null, 2)};\n`;
  fs.writeFileSync(path.join(DATA_DIR, filename), content);
  console.log(`  Wrote ${filename} (${data.length} items)`);
}

// ═══ MAIN ═══
async function main() {
  console.log('🪱 Inkworm Puzzle Generator\n');
  
  try {
    // Back up existing files
    console.log('Backing up current data...');
    backup('scramble-data.js');
    backup('quotes-data.js');
    backup('kindred-data.js');
    backup('wanderlust-data.js');
    
    // Generate all puzzle types
    const scramble = await generateScramble();
    const quotes = await generateQuotes();
    const kindred = await generateKindred();
    const wanderlust = await generateWanderlust();
    
    // Write new data files
    console.log('\nWriting new data files...');
    writeDataFile('scramble-data.js',  'SC', scramble,  `Scramble du Jour — ${scramble.length} puzzles (generated ${new Date().toISOString().slice(0,10)})`);
    writeDataFile('quotes-data.js',    'QM', quotes,    `Quote Match — ${quotes.length} pairs (generated ${new Date().toISOString().slice(0,10)})`);
    writeDataFile('kindred-data.js',   'KD', kindred,   `Kindred Words — ${kindred.length} sets (generated ${new Date().toISOString().slice(0,10)})`);
    
    // Wanderlust needs REGS too — read existing REGS and merge new locations
    const existingWL = fs.readFileSync(path.join(DATA_DIR, 'wanderlust-data.js.bak'), 'utf8');
    const regsMatch = existingWL.match(/export const REGS = (\[[\s\S]*?\]);/);
    const existingRegs = regsMatch ? eval(regsMatch[1]) : [];
    
    // Add new location pins to REGS if not already present
    const regsSet = new Set(existingRegs.map(r => r.n));
    for (const loc of wanderlust) {
      const cityName = loc.answer.split(',')[0].trim();
      if (!regsSet.has(cityName)) {
        existingRegs.push({n: cityName, la: loc.lat, lo: loc.lng, lb: "📍"});
      }
    }
    
    const wlContent = `// Wanderlust — ${wanderlust.length} locations (generated ${new Date().toISOString().slice(0,10)})\nexport const WL = ${JSON.stringify(wanderlust, null, 2)};\n\nexport const REGS = ${JSON.stringify(existingRegs, null, 2)};\n`;
    fs.writeFileSync(path.join(DATA_DIR, 'wanderlust-data.js'), wlContent);
    console.log(`  Wrote wanderlust-data.js (${wanderlust.length} locations, ${existingRegs.length} map pins)`);
    
    console.log('\n✅ All puzzles generated successfully!');
    console.log('Run `npm run build` and deploy to update the live site.');
    
  } catch (err) {
    console.error('\n❌ Generation failed:', err.message);
    console.error('Old data files preserved as .bak — restore if needed.');
    process.exit(1);
  }
}

main();
