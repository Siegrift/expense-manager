import { NextResponse, NextRequest } from 'next/server'

// https://stackoverflow.com/a/58182678
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname == '/') return NextResponse.redirect('/add')
  return NextResponse.next()
}
