import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"

const SECRET = process.env.JWT_SECRET!

export const hashPassword = (p: string) => bcrypt.hash(p, 12)
export const comparePassword = (p: string, hash: string) => bcrypt.compare(p, hash)

export const signToken = (payload: { id: string; email: string }) =>
  jwt.sign(payload, SECRET, { expiresIn: "7d" })

export const verifyToken = (token: string): { id: string; email: string } =>
  jwt.verify(token, SECRET) as { id: string; email: string }

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
}

export function optionsResponse() {
  return new Response(null, { status: 204, headers: corsHeaders })
}

export function requireAuth(
  request: Request,
): { id: string; email: string } | NextResponse {
  const auth = request.headers.get("authorization")
  if (!auth?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders })
  }
  try {
    return verifyToken(auth.slice(7))
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401, headers: corsHeaders })
  }
}
