/**
 * Role-based access control.
 *
 * Every admin API route (and every /admin page) belongs to a "resource"
 * (leads, blog, users, ...). Each request maps to an action — read,
 * write, or delete — based on its HTTP method / intent. A role grants a
 * fixed set of "resource:action" permissions. This file is the single
 * source of truth for that mapping, imported by both `middleware.ts`
 * (server-side enforcement, runs in the Edge runtime — no DB/Node APIs
 * here) and the admin UI (to hide nav items / actions a user can't use).
 */

export const ROLES = ["SUPER_ADMIN", "ADMIN", "EDITOR", "SUPPORT"] as const;
export type Role = (typeof ROLES)[number];

export const RESOURCES = [
  "leads",
  "newsletter",
  "testimonials",
  "destinations",
  "services",
  "blog",
  "team",
  "gallery",
  "pages",
  "popup",
  "seo",
  "smtp",
  "settings",
  "users",
] as const;
export type Resource = (typeof RESOURCES)[number];

export type Action = "read" | "write" | "delete";
export type Permission = `${Resource}:${Action}`;

function perms(resource: Resource, actions: Action[]): Permission[] {
  return actions.map((a) => `${resource}:${a}` as Permission);
}

const ALL_CONTENT_PERMISSIONS: Permission[] = [
  ...perms("leads", ["read", "write", "delete"]),
  ...perms("newsletter", ["read", "write", "delete"]),
  ...perms("testimonials", ["read", "write", "delete"]),
  ...perms("destinations", ["read", "write", "delete"]),
  ...perms("services", ["read", "write", "delete"]),
  ...perms("blog", ["read", "write", "delete"]),
  ...perms("team", ["read", "write", "delete"]),
  ...perms("gallery", ["read", "write", "delete"]),
  ...perms("pages", ["read", "write"]),
  ...perms("popup", ["read", "write"]),
  ...perms("seo", ["read", "write"]),
  ...perms("smtp", ["read", "write"]),
  ...perms("settings", ["read", "write"]),
];

const ALL_PERMISSIONS: Permission[] = [
  ...ALL_CONTENT_PERMISSIONS,
  ...perms("users", ["read", "write", "delete"]),
];

/**
 * Role → permissions.
 * - SUPER_ADMIN: everything, including managing other admin users.
 * - ADMIN: everything except user management (incl. company settings).
 * - EDITOR: site content only (testimonials/destinations/services/blog/
 *   team) — no access to leads, newsletter subscribers, company
 *   settings, or user management.
 * - SUPPORT: leads + newsletter only (handles inquiries) — read/write,
 *   no deletes, no content editing, no user management.
 */
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  SUPER_ADMIN: ALL_PERMISSIONS,
  ADMIN: ALL_CONTENT_PERMISSIONS,
  EDITOR: [
    ...perms("testimonials", ["read", "write", "delete"]),
    ...perms("destinations", ["read", "write", "delete"]),
    ...perms("services", ["read", "write", "delete"]),
    ...perms("blog", ["read", "write", "delete"]),
    ...perms("team", ["read", "write", "delete"]),
    ...perms("gallery", ["read", "write", "delete"]),
    ...perms("pages", ["read", "write"]),
    ...perms("popup", ["read", "write"]),
  ],
  SUPPORT: [...perms("leads", ["read", "write"]), ...perms("newsletter", ["read"])],
};

export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function can(role: Role, resource: Resource, action: Action): boolean {
  return hasPermission(role, `${resource}:${action}`);
}

/** HTTP method → the action it represents, for blanket route-level gating. */
export function methodToAction(method: string): Action {
  if (method === "DELETE") return "delete";
  if (method === "GET" || method === "HEAD") return "read";
  return "write"; // POST, PUT, PATCH
}

/**
 * Maps a request path to the resource it governs. Order matters — more
 * specific patterns should come first. Used by both `middleware.ts`
 * (for `/admin/*` pages and `/api/admin/*` routes) and can be reused
 * anywhere else a path → resource lookup is needed.
 */
const ROUTE_RESOURCE_MAP: Array<{ pattern: RegExp; resource: Resource }> = [
  { pattern: /^\/(api\/)?admin\/leads/, resource: "leads" },
  { pattern: /^\/(api\/)?admin\/newsletter/, resource: "newsletter" },
  { pattern: /^\/(api\/)?admin\/testimonials/, resource: "testimonials" },
  { pattern: /^\/(api\/)?admin\/destinations/, resource: "destinations" },
  { pattern: /^\/(api\/)?admin\/services/, resource: "services" },
  { pattern: /^\/(api\/)?admin\/blog/, resource: "blog" },
  { pattern: /^\/(api\/)?admin\/team/, resource: "team" },
  { pattern: /^\/(api\/)?admin\/gallery/, resource: "gallery" },
  { pattern: /^\/(api\/)?admin\/pages/, resource: "pages" },
  { pattern: /^\/(api\/)?admin\/popup/, resource: "popup" },
  { pattern: /^\/(api\/)?admin\/seo/, resource: "seo" },
  { pattern: /^\/(api\/)?admin\/smtp/, resource: "smtp" },
  { pattern: /^\/(api\/)?admin\/settings/, resource: "settings" },
  { pattern: /^\/(api\/)?admin\/users/, resource: "users" },
];

export function resourceForPath(pathname: string): Resource | null {
  for (const { pattern, resource } of ROUTE_RESOURCE_MAP) {
    if (pattern.test(pathname)) return resource;
  }
  return null;
}

export const RESOURCE_LABELS: Record<Resource, string> = {
  leads: "Leads",
  newsletter: "Newsletter",
  testimonials: "Testimonials",
  destinations: "Destinations",
  services: "Services",
  blog: "Blog",
  team: "Team",
  gallery: "Gallery",
  pages: "Page Content",
  popup: "Landing Popup",
  settings: "Company Settings",
  seo: "SEO",
  smtp: "Email (SMTP)",
  users: "Admin Users",
};

export const ROLE_LABELS: Record<Role, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  EDITOR: "Editor",
  SUPPORT: "Support",
};
