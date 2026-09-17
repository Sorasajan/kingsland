import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin | Kingsland Abroad",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="admin-root min-h-screen bg-slate-50">{children}</div>;
}
