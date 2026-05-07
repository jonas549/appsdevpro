import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../../src/generated/prisma/client.js"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const g = globalThis as unknown as { _prisma?: PrismaClient }
export const prisma = g._prisma ?? new PrismaClient({ adapter })
g._prisma = prisma
