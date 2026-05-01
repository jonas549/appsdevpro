import "dotenv/config"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../src/generated/prisma/client"
import bcrypt from "bcryptjs"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

const NEW_EMAIL    = "jonasoko82@gmail.com"
const NEW_PASSWORD = "100aldr.Jacinto"

async function main() {
  const hashed = await bcrypt.hash(NEW_PASSWORD, 12)

  // Find the first (and only) admin user and update it
  const existing = await prisma.adminUser.findFirst()
  if (!existing) {
    console.error("❌ No admin user found in DB. Run npm run admin:create first.")
    process.exit(1)
  }

  const updated = await prisma.adminUser.update({
    where: { id: existing.id },
    data: { email: NEW_EMAIL, password: hashed },
  })

  console.log("✅ Admin credentials updated:")
  console.log("   Email   :", updated.email)
  console.log("   Password: [hidden]")
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
