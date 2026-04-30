import "dotenv/config"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../src/generated/prisma/client"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function migrate() {
  console.log("Fetching all SiteContent records…")
  const records = await prisma.siteContent.findMany()
  let updated = 0

  for (const record of records) {
    let v = record.value

    // **text** → <strong>text</strong>  (must run before single-star)
    v = v.replace(/\*\*(.+?)\*\*/gs, '<strong>$1</strong>')

    // *text* → <em>text</em>  (only single stars, not part of **)
    v = v.replace(/(?<!\*)\*([^*\n]+?)\*(?!\*)/g, '<em>$1</em>')

    if (v !== record.value) {
      await prisma.siteContent.update({
        where: { id: record.id },
        data: { value: v },
      })
      console.log(`  ✓ ${record.section}/${record.key}`)
      updated++
    }
  }

  console.log(`\nDone — ${updated} of ${records.length} records updated.`)
  await prisma.$disconnect()
  process.exit(0)
}

migrate().catch(e => {
  console.error(e)
  process.exit(1)
})
