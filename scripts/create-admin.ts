import "dotenv/config"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../src/generated/prisma/client"
import bcrypt from "bcryptjs"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

const EMAIL = "admin@appsdeveloperspro.com"
const PASSWORD = "Admin2024!"

async function main() {
  const hashed = await bcrypt.hash(PASSWORD, 12)
  const user = await prisma.adminUser.upsert({
    where: { email: EMAIL },
    update: { password: hashed },
    create: { email: EMAIL, password: hashed },
  })
  console.log("✅ Admin user ready:")
  console.log("   Email   :", user.email)
  console.log("   Password:", PASSWORD)
  console.log("   ⚠️  Cambia la contraseña después del primer login.")
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
