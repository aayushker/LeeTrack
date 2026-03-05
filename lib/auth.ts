import { NextRequest } from "next/server";
import { verifyToken, JwtPayload } from "./jwt";

export function getAuthUser(request: NextRequest): JwtPayload | null {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return verifyToken(authHeader.slice(7));
  }
  // Also check cookie
  const cookie = request.cookies.get("auth_token");
  if (cookie?.value) {
    return verifyToken(cookie.value);
  }
  return null;
}
