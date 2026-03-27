import { readFileSync, writeFileSync } from 'node:fs'
import { resolve, join } from 'node:path'
import { execFileSync } from 'node:child_process'
import { tmpdir } from 'node:os'
import { fisherYatesShuffle } from '../src/utils/shuffle'
import { geocodeCity } from './geocode'

const remote = process.argv.includes('--remote')
const preview = process.argv.includes('--preview')

const membersPath = resolve(import.meta.dirname!, '..', 'members.json')
const raw = readFileSync(membersPath, 'utf-8')
const members = JSON.parse(raw)

// Geocode members that have a city but no lat/lng
for (const member of members) {
  if (member.city && member.lat == null && member.lng == null) {
    const coords = await geocodeCity(member.city)
    if (coords) {
      member.lat = coords.lat
      member.lng = coords.lng
      process.stdout.write(`  Geocoded ${member.city} → ${coords.lat}, ${coords.lng}\n`)
    } else {
      process.stdout.write(`  Could not geocode ${member.city}\n`)
    }
  }
}

const enrichedMembersPath = join(tmpdir(), 'webring-members-enriched.json')
writeFileSync(enrichedMembersPath, JSON.stringify(members))

const activeSlugs = members
  .filter((m: { active: boolean }) => m.active)
  .map((m: { slug: string }) => m.slug)
const slugs = fisherYatesShuffle(activeSlugs)

const flags = [
  remote ? '--remote' : '--local',
  ...(preview || !remote ? ['--preview'] : []),
]

const cwd = resolve(import.meta.dirname!, '..')

const ringOrderPath = join(tmpdir(), 'webring-ring-order.json')
writeFileSync(ringOrderPath, JSON.stringify(slugs))

const target = remote ? (preview ? 'remote preview' : 'remote') : 'local'
process.stdout.write(`Seeding ${members.length} members to KV (${target})...\n`)

execFileSync('npx', [
  'wrangler', 'kv', 'key', 'put', 'members',
  '--binding', 'WEBRING',
  '--path', enrichedMembersPath,
  ...flags,
], { cwd, stdio: 'inherit' })

execFileSync('npx', [
  'wrangler', 'kv', 'key', 'put', 'ring-order',
  '--binding', 'WEBRING',
  '--path', ringOrderPath,
  ...flags,
], { cwd, stdio: 'inherit' })

process.stdout.write(`Done. Seeded ${members.length} members, ring order: [${slugs.join(', ')}]\n`)
