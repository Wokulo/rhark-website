import { ROLES } from "@/lib/rbac";
import type { RoleSlug } from "@/lib/rbac";

export interface StaffRole {
  slug: RoleSlug;
  label: string;
  description: string;
  department: string;
  isSystem: boolean;
}

export const STAFF_ROLES: StaffRole[] = [
  {
    slug: ROLES.SUPER_ADMINISTRATOR,
    label: "Super Administrator",
    description: "Full system access and configuration management",
    department: "System",
    isSystem: true,
  },
  {
    slug: ROLES.EXECUTIVE_DIRECTOR,
    label: "Executive Director",
    description: "Strategic oversight and organisational leadership",
    department: "Leadership",
    isSystem: true,
  },
  {
    slug: ROLES.PROGRAMS_MANAGER,
    label: "Programs Manager",
    description: "Oversees programme planning, implementation, and reporting",
    department: "Programs",
    isSystem: true,
  },
  {
    slug: ROLES.COMMUNICATIONS_OFFICER,
    label: "Communications Officer",
    description: "Manages public communications, media, and content",
    department: "Communications",
    isSystem: true,
  },
  {
    slug: ROLES.FINANCE_OFFICER,
    label: "Finance Officer",
    description: "Handles financial management, donations, and reporting",
    department: "Finance",
    isSystem: true,
  },
  {
    slug: ROLES.HR_ADMINISTRATION,
    label: "HR & Administration",
    description: "Manages human resources, team administration, and operations",
    department: "Human Resources",
    isSystem: true,
  },
  {
    slug: ROLES.MONITORING_EVALUATION_OFFICER,
    label: "Monitoring & Evaluation Officer",
    description: "Tracks programme performance, impact metrics, and reporting",
    department: "Programs",
    isSystem: true,
  },
  {
    slug: ROLES.VOLUNTEER_COORDINATOR,
    label: "Volunteer Coordinator",
    description: "Manages volunteer recruitment, onboarding, and coordination",
    department: "Operations",
    isSystem: true,
  },
];

export function getStaffRole(slug: RoleSlug): StaffRole | undefined {
  return STAFF_ROLES.find((role) => role.slug === slug);
}

export function getStaffRoleLabel(slug: RoleSlug): string {
  const role = getStaffRole(slug);
  return role?.label ?? slug;
}

export function getStaffRoleDescription(slug: RoleSlug): string {
  const role = getStaffRole(slug);
  return role?.description ?? "";
}

export function getAllStaffRoleSlugs(): RoleSlug[] {
  return STAFF_ROLES.map((role) => role.slug);
}