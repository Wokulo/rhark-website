/**
 * Role-Based Access Control (RBAC) Utilities
 *
 * Defines roles, permissions, and authorization helpers.
 * Permissions are stored in the database and cached here for performance.
 */

// ─── Role Definitions ──────────────────────────────────────────────────────────

export const ROLES = {
  SUPER_ADMIN: "super-admin",
  EXECUTIVE_DIRECTOR: "executive-director",
  COMMUNICATIONS_OFFICER: "communications-officer",
  FINANCE_OFFICER: "finance-officer",
  VOLUNTEER_MANAGER: "volunteer-manager",
  EDITOR: "editor",
} as const;

export type RoleSlug = (typeof ROLES)[keyof typeof ROLES];

// ─── Resource Definitions ──────────────────────────────────────────────────────

export const RESOURCES = {
  DASHBOARD: "dashboard",
  NEWS: "news",
  GALLERY: "gallery",
  MEMBERS: "members",
  PROJECTS: "projects",
  EVENTS: "events",
  DOCUMENTS: "documents",
  DONATIONS: "donations",
  VOLUNTEERS: "volunteers",
  CONTACTS: "contacts",
  NEWSLETTER: "newsletter",
  MEDIA: "media",
  SETTINGS: "settings",
  REPORTS: "reports",
  USERS: "users",
  ROLES: "roles",
} as const;

export type Resource = (typeof RESOURCES)[keyof typeof RESOURCES];

// ─── Action Definitions ────────────────────────────────────────────────────────

export const ACTIONS = {
  CREATE: "create",
  READ: "read",
  UPDATE: "update",
  DELETE: "delete",
  PUBLISH: "publish",
  UNPUBLISH: "unpublish",
  APPROVE: "approve",
  EXPORT: "export",
  MANAGE: "manage",
} as const;

export type Action = (typeof ACTIONS)[keyof typeof ACTIONS];

// ─── Default Role Permissions ──────────────────────────────────────────────────
// These are the default permissions for each role.
// They can be overridden in the database.

const DEFAULT_PERMISSIONS: Record<RoleSlug, { resource: Resource; actions: Action[] }[]> = {
  [ROLES.SUPER_ADMIN]: [
    { resource: RESOURCES.DASHBOARD, actions: [ACTIONS.READ] },
    { resource: RESOURCES.NEWS, actions: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.DELETE, ACTIONS.PUBLISH, ACTIONS.UNPUBLISH] },
    { resource: RESOURCES.GALLERY, actions: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.DELETE] },
    { resource: RESOURCES.MEMBERS, actions: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.DELETE] },
    { resource: RESOURCES.PROJECTS, actions: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.DELETE] },
    { resource: RESOURCES.EVENTS, actions: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.DELETE] },
    { resource: RESOURCES.DOCUMENTS, actions: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.DELETE] },
    { resource: RESOURCES.DONATIONS, actions: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.DELETE, ACTIONS.EXPORT] },
    { resource: RESOURCES.VOLUNTEERS, actions: [ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.DELETE, ACTIONS.APPROVE, ACTIONS.EXPORT] },
    { resource: RESOURCES.CONTACTS, actions: [ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.DELETE] },
    { resource: RESOURCES.NEWSLETTER, actions: [ACTIONS.READ, ACTIONS.DELETE, ACTIONS.EXPORT] },
    { resource: RESOURCES.MEDIA, actions: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.DELETE] },
    { resource: RESOURCES.SETTINGS, actions: [ACTIONS.READ, ACTIONS.UPDATE] },
    { resource: RESOURCES.REPORTS, actions: [ACTIONS.READ, ACTIONS.EXPORT] },
    { resource: RESOURCES.USERS, actions: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.DELETE] },
    { resource: RESOURCES.ROLES, actions: [ACTIONS.READ, ACTIONS.UPDATE] },
  ],
  [ROLES.EXECUTIVE_DIRECTOR]: [
    { resource: RESOURCES.DASHBOARD, actions: [ACTIONS.READ] },
    { resource: RESOURCES.NEWS, actions: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.DELETE, ACTIONS.PUBLISH, ACTIONS.UNPUBLISH] },
    { resource: RESOURCES.GALLERY, actions: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.DELETE] },
    { resource: RESOURCES.MEMBERS, actions: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.DELETE] },
    { resource: RESOURCES.PROJECTS, actions: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.DELETE] },
    { resource: RESOURCES.EVENTS, actions: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.DELETE] },
    { resource: RESOURCES.DOCUMENTS, actions: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.DELETE] },
    { resource: RESOURCES.DONATIONS, actions: [ACTIONS.READ, ACTIONS.EXPORT] },
    { resource: RESOURCES.VOLUNTEERS, actions: [ACTIONS.READ, ACTIONS.APPROVE] },
    { resource: RESOURCES.CONTACTS, actions: [ACTIONS.READ, ACTIONS.UPDATE] },
    { resource: RESOURCES.NEWSLETTER, actions: [ACTIONS.READ] },
    { resource: RESOURCES.MEDIA, actions: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.DELETE] },
    { resource: RESOURCES.SETTINGS, actions: [ACTIONS.READ, ACTIONS.UPDATE] },
    { resource: RESOURCES.REPORTS, actions: [ACTIONS.READ, ACTIONS.EXPORT] },
    { resource: RESOURCES.USERS, actions: [ACTIONS.READ] },
  ],
  [ROLES.COMMUNICATIONS_OFFICER]: [
    { resource: RESOURCES.DASHBOARD, actions: [ACTIONS.READ] },
    { resource: RESOURCES.NEWS, actions: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.PUBLISH, ACTIONS.UNPUBLISH] },
    { resource: RESOURCES.GALLERY, actions: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.DELETE] },
    { resource: RESOURCES.MEMBERS, actions: [ACTIONS.READ] },
    { resource: RESOURCES.PROJECTS, actions: [ACTIONS.READ] },
    { resource: RESOURCES.EVENTS, actions: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE] },
    { resource: RESOURCES.DOCUMENTS, actions: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE] },
    { resource: RESOURCES.MEDIA, actions: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.DELETE] },
    { resource: RESOURCES.CONTACTS, actions: [ACTIONS.READ] },
    { resource: RESOURCES.NEWSLETTER, actions: [ACTIONS.READ, ACTIONS.EXPORT] },
  ],
  [ROLES.FINANCE_OFFICER]: [
    { resource: RESOURCES.DASHBOARD, actions: [ACTIONS.READ] },
    { resource: RESOURCES.DONATIONS, actions: [ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.EXPORT] },
    { resource: RESOURCES.PROJECTS, actions: [ACTIONS.READ] },
    { resource: RESOURCES.REPORTS, actions: [ACTIONS.READ, ACTIONS.EXPORT] },
    { resource: RESOURCES.DOCUMENTS, actions: [ACTIONS.CREATE, ACTIONS.READ] },
  ],
  [ROLES.VOLUNTEER_MANAGER]: [
    { resource: RESOURCES.DASHBOARD, actions: [ACTIONS.READ] },
    { resource: RESOURCES.VOLUNTEERS, actions: [ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.APPROVE, ACTIONS.EXPORT] },
    { resource: RESOURCES.EVENTS, actions: [ACTIONS.READ] },
    { resource: RESOURCES.CONTACTS, actions: [ACTIONS.READ] },
  ],
  [ROLES.EDITOR]: [
    { resource: RESOURCES.DASHBOARD, actions: [ACTIONS.READ] },
    { resource: RESOURCES.NEWS, actions: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE] },
    { resource: RESOURCES.GALLERY, actions: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE] },
    { resource: RESOURCES.MEMBERS, actions: [ACTIONS.READ] },
    { resource: RESOURCES.PROJECTS, actions: [ACTIONS.READ] },
    { resource: RESOURCES.EVENTS, actions: [ACTIONS.READ] },
    { resource: RESOURCES.MEDIA, actions: [ACTIONS.CREATE, ACTIONS.READ] },
  ],
};

// ─── Permission Check ──────────────────────────────────────────────────────────

export interface Permission {
  resource: Resource;
  actions: Action[];
}

/**
 * Check if a role has permission to perform an action on a resource.
 */
export function hasPermission(
  roleSlug: RoleSlug | null | undefined,
  resource: Resource,
  action: Action
): boolean {
  if (!roleSlug) return false;

  const rolePermissions = DEFAULT_PERMISSIONS[roleSlug];
  if (!rolePermissions) return false;

  const permission = rolePermissions.find((p) => p.resource === resource);
  if (!permission) return false;

  return permission.actions.includes(action) || permission.actions.includes(ACTIONS.MANAGE);
}

/**
 * Get all permissions for a role.
 */
export function getRolePermissions(roleSlug: RoleSlug | null | undefined): Permission[] {
  if (!roleSlug) return [];
  return DEFAULT_PERMISSIONS[roleSlug] || [];
}

/**
 * Check if a role can access a specific admin module.
 * This is a convenience wrapper for checking "read" access.
 */
export function canAccessModule(roleSlug: RoleSlug | null | undefined, resource: Resource): boolean {
  return hasPermission(roleSlug, resource, ACTIONS.READ);
}

/**
 * Get the display name for a role slug.
 */
export function getRoleDisplayName(roleSlug: RoleSlug | string): string {
  const names: Record<string, string> = {
    [ROLES.SUPER_ADMIN]: "Super Admin",
    [ROLES.EXECUTIVE_DIRECTOR]: "Executive Director",
    [ROLES.COMMUNICATIONS_OFFICER]: "Communications Officer",
    [ROLES.FINANCE_OFFICER]: "Finance Officer",
    [ROLES.VOLUNTEER_MANAGER]: "Volunteer Manager",
    [ROLES.EDITOR]: "Editor",
  };
  return names[roleSlug] || roleSlug;
}