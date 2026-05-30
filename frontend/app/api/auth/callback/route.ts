import { NextResponse } from 'next/server'

/**
 * Auth callback handler for direct Google OAuth flow.
 * 
 * The backend has already:
 * 1. Exchanged the Google OAuth code for tokens
 * 2. Created/updated the user in the database
 * 3. Generated a JWT and set it in an httpOnly cookie
 * 
 * This route redirects to the frontend callback page, which will then
 * fetch the user's workspaces using the httpOnly cookie (auto-sent by browser).
 */
export async function GET(request: Request) {
  const { origin } = new URL(request.url)
  
  // Backend has already set the httpOnly cookie and all auth is done.
  // Redirect to the callback page which will use the cookie to fetch workspaces.
  return NextResponse.redirect(`${origin}/auth/callback`)
}
