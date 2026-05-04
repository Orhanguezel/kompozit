// Backend user_roles.role: admin | editor | carrier | customer | dealer
// Admin UI: admin | moderator | user

import type { UserRoleName } from "@/integrations/shared/users/users";

export type ApiDbRoleName = "admin" | "editor" | "carrier" | "customer" | "dealer";

export function uiRolesToApiRoles(roles: UserRoleName[]): ApiDbRoleName[] {
  const r = roles[0] ?? "user";
  if (r === "admin") return ["admin"];
  if (r === "moderator") return ["editor"];
  return ["customer"];
}
