import { NextResponse } from "next/server"
import { requireAuth, corsHeaders, optionsResponse } from "@/lib/auth"

export function OPTIONS() { return optionsResponse() }

export function GET(request: Request) {
  const result = requireAuth(request)
  if (result instanceof NextResponse) return result
  return NextResponse.json({ id: result.id, email: result.email }, { headers: corsHeaders })
}
