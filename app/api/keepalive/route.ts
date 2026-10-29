// app/api/keepalive/route.ts
import { createClient } from '@/utils/supabase/server' // Ajusta a tu ruta real
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  // 1. Verificar el secreto del cron
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 2. Hacer la consulta real a Supabase (esto mantiene vivo el proyecto)
  const supabase = await createClient()
  const { error } = await supabase
    .from('keepalive')
    .select('id')
    .limit(1)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, timestamp: new Date().toISOString() })
}
