"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/utils";
import {
  LayoutDashboard,
  Newspaper,
  Images,
  Users,
  FolderKanban,
  CalendarDays,
  FileText,
  Heart,
  Handshake,
  MessageSquare,
  Mail,
  Library,
  Search,
  BarChart3,
  Settings,
  Menu,
  X,
  LogOut,
  ChevronDown,
  UserCircle,
} from "lucide-react";
import type { RoleSlug } from "@/lib/rbac";
import { canAccessModule, RESOURCES } from "@/lib/rbac";

// ─── Navigation Configuration ──────────────────────────────────────────────────

interface NavSection {
  label: string;
  items: NavItem[];
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  resource: string;
  badge?: string;
}

const NAV_SECTIONS: NavSection[] = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard, resource: RESOURCES.DASHBOARD },
    ],
  },
  {
    label: "Content",
    items: [
      { label: "News", href: "/admin/news", icon: Newspaper, resource: RESOURCES.NEWS },
      { label: "Gallery", href: "/admin/gallery", icon: Images, resource: RESOURCES.GALLERY },
      { label: "Team", href: "/admin/team", icon: Users, resource: RESOURCES.MEMBERS },
      { label: "Projects", href: "/admin/projects", icon: FolderKanban, resource: RESOURCES.PROJECTS },
      { label: "Events", href: "/admin/events", icon: CalendarDays, resource: RESOURCES.EVENTS },
      { label: "Documents", href: "/admin/documents", icon: FileText, resource: RESOURCES.DOCUMENTS },
    ],
  },
  {
    label: "Management",
    items: [
      { label: "Donations", href: "/admin/donations", icon: Heart, resource: RESOURCES.DONATIONS },
      { label: "Volunteers", href: "/admin/volunteers", icon: Handshake, resource: RESOURCES.VOLUNTEERS },
      { label: "Contacts", href: "/admin/contacts", icon: MessageSquare, resource: RESOURCES.CONTACTS },
      { label: "Newsletter", href: "/admin/newsletter", icon: Mail, resource: RESOURCES.NEWSLETTER },
    ],
  },
  {
    label: "Tools",
    items: [
      { label: "Media Library", href: "/admin/media", icon: Library, resource: RESOURCES.MEDIA },
      { label: "Search", href: "/admin/search", icon: Search, resource: RESOURCES.DASHBOARD },
      { label: "Reports", href: "/admin/reports", icon: BarChart3, resource: RESOURCES.REPORTS },
      { label: "Settings", href: "/admin/settings", icon: Settings, resource: RESOURCES.SETTINGS },
    ],
  },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [user, setUser] = useState<{
    name: string;
    email: string;
    avatar?: string;
    role?: string;
    roleSlug?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      if (authUser) {
        const { data: profile } = await supabase
          .from("users")
          .select("*, roles(*)")
          .eq("id", authUser.id)
          .single();

        setUser({
          name: profile?.name || authUser.email || "User",
          email: authUser.email || "",
          avatar: profile?.avatar_url || undefined,
          role: profile?.roles?.name || undefined,
          roleSlug: profile?.roles?.slug || undefined,
        });
      }
      setLoading(false);
    }
    loadUser();
  }, [supabase]);

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/admin/auth/login");
    router.refresh();
  };

  // Filter nav items based on role permissions
  const filterNavItems = (items: NavItem[]) => {
    return items.filter((item) => canAccessModule(user?.roleSlug as RoleSlug, item.resource as any));
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-neutral-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white shadow-lg ring-1 ring-neutral-200 transition-transform duration-300 lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-neutral-200 px-6">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500 text-sm font-bold text-white">
              R
            </div>
            <span className="font-display text-lg font-bold text-neutral-900">
              RHARK CMS
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {NAV_SECTIONS.map((section) => {
            const filteredItems = filterNavItems(section.items);
            if (filteredItems.length === 0) return null;

            return (
              <div key={section.label} className="mb-6">
                <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-widest text-neutral-400">
                  {section.label}
                </p>
                <div className="space-y-0.5">
                  {filteredItems.map((item) => {
                    const isActive =
                      pathname === item.href ||
                      pathname.startsWith(item.href + "/");
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                          isActive
                            ? "bg-primary-50 text-primary-700"
                            : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-800"
                        )}
                      >
                        <item.icon size={18} />
                        <span>{item.label}</span>
                        {item.badge && (
                          <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-error-500 px-1.5 text-[10px] font-bold text-white">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        {/* User info */}
        <div className="border-t border-neutral-200 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-neutral-900">
                {user?.name}
              </p>
              <p className="truncate text-xs text-neutral-500">
                {user?.role || "Staff"}
              </p>
            </div>
          </div>
          <div className="mt-3 space-y-1">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
            >
              <LogOut size={16} />
              <span>View Website</span>
            </Link>
            <button
              onClick={handleSignOut}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-error-600 transition-colors hover:bg-error-50"
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-neutral-200 bg-white/80 backdrop-blur-sm px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 lg:hidden"
          >
            <Menu size={20} />
          </button>

          <div className="flex-1" />

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
              >
                <UserCircle size={18} />
                <span className="hidden sm:inline">{user?.name}</span>
                <ChevronDown size={14} className={cn("transition-transform", userMenuOpen && "rotate-180")} />
              </button>

              {userMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-full z-20 mt-1 w-48 rounded-xl border border-neutral-200 bg-white py-1 shadow-lg">
                    <div className="border-b border-neutral-100 px-4 py-2">
                      <p className="text-sm font-medium text-neutral-900">{user?.name}</p>
                      <p className="text-xs text-neutral-500">{user?.email}</p>
                    </div>
                    <Link
                      href="/admin/settings"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Settings size={14} />
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        handleSignOut();
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-error-600 hover:bg-error-50"
                    >
                      <LogOut size={14} />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}