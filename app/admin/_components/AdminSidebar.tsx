"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Mail,
  Quote,
  Globe2,
  Briefcase,
  Newspaper,
  LogOut,
  GraduationCap,
  UserCog,
  IdCard,
  Settings,
  Search,
  MailCheck,
  Image as ImageIcon,
  FileText,
  MessageSquareWarning,
} from "lucide-react";
import { can, ROLE_LABELS, type Resource, type Role } from "@/lib/permissions";

const NAV: Array<{
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
  resource?: Resource; // omit for items every logged-in admin can see
}> = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/leads", label: "Leads", icon: Users, resource: "leads" },
  { href: "/admin/newsletter", label: "Newsletter", icon: Mail, resource: "newsletter" },
  { href: "/admin/testimonials", label: "Testimonials", icon: Quote, resource: "testimonials" },
  { href: "/admin/destinations", label: "Destinations", icon: Globe2, resource: "destinations" },
  { href: "/admin/services", label: "Services", icon: Briefcase, resource: "services" },
  { href: "/admin/blog", label: "Blog", icon: Newspaper, resource: "blog" },
  { href: "/admin/team", label: "Team", icon: IdCard, resource: "team" },
  { href: "/admin/gallery", label: "Gallery", icon: ImageIcon, resource: "gallery" },
  { href: "/admin/pages", label: "Page Content", icon: FileText, resource: "pages" },
  { href: "/admin/popup", label: "Landing Popup", icon: MessageSquareWarning, resource: "popup" },
  { href: "/admin/settings", label: "Company Settings", icon: Settings, resource: "settings" },
  { href: "/admin/seo", label: "SEO", icon: Search, resource: "seo" },
  { href: "/admin/smtp", label: "Email (SMTP)", icon: MailCheck, resource: "smtp" },
  { href: "/admin/users", label: "Admin Users", icon: UserCog, resource: "users" },
];

export default function AdminSidebar({
  role,
  name,
}: {
  role: Role;
  name: string;
}) {
  const pathname = usePathname();

  const visibleNav = NAV.filter((item) => !item.resource || can(role, item.resource, "read"));

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    // Hard navigation for the same reason as login — ensures the cleared
    // cookie is respected immediately and middleware re-evaluates fresh.
    window.location.href = "/admin/login";
  }

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-screen sticky top-0 flex-shrink-0">
      <div className="flex items-center gap-2.5 px-6 py-6 border-b border-slate-800">
        <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center">
          <GraduationCap className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-bold text-sm leading-tight">Kingsland</p>
          <p className="text-xs text-slate-400 leading-tight">Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        {visibleNav.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                active
                  ? "bg-slate-800 text-white"
                  : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-slate-800">
        <div className="px-3.5 py-2 mb-1">
          <p className="text-xs font-semibold text-white truncate">{name}</p>
          <p className="text-[11px] text-slate-400">{ROLE_LABELS[role]}</p>
        </div>
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors mb-1"
        >
          <Globe2 className="w-4 h-4" />
          View Site
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-accent-600/20 hover:text-accent-300 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </button>
      </div>
    </aside>
  );
}
