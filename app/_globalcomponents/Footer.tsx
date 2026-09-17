"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
  ArrowRight,
  Check,
  Loader2,
} from "lucide-react";
import type { Company, SiteConfig, Destination } from "@/types";
import defaultLogo from "@/public/resources/logo/logo.png";
import Image from "next/image";

interface FooterProps {
  company: Company;
  siteConfig: SiteConfig;
  destinations: Destination[];
}

export default function Footer({ company, siteConfig, destinations: allDestinations }: FooterProps) {
  const logoSrc = (company as any).logo?.imageUrl || defaultLogo;
  const quickLinks = siteConfig.navigation.footer.quickLinks;
  const legalLinks = siteConfig.navigation.footer.legal;
  const certifications = siteConfig.certifications;
  const destinations = allDestinations.slice(0, 8);

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("submitting");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-4 ">
          {/* Brand */}
          <div className="lg:col-span-1 ">
            <Link
              href="/"
              className="relative flex w-40 mb-5 bg-white rounded-xl aspect-square items-center gap-3  group"
            >
              <Image
                className="object-fill"
                src={logoSrc}
                fill
                alt="Kingsland Consultancy"
              />
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              {company.description}
            </p>
            <div className="space-y-2.5 text-sm">
              <a
                href={company.address.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2.5 text-slate-400 hover:text-white transition-colors"
              >
                <MapPin className="w-4 h-4 text-primary-400 mt-0.5 flex-shrink-0" />
                {company.address.street}, {company.address.district}, Nepal
              </a>
              <a
                href={`tel:${company.contact.phone.primary}`}
                className="flex items-center gap-2.5 text-slate-400 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4 text-primary-400 flex-shrink-0" />
                {company.contact.phone.primary}
              </a>
              <a
                href={`mailto:${company.contact.email.general}`}
                className="flex items-center gap-2.5 text-slate-400 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 text-primary-400 flex-shrink-0" />
                {company.contact.email.general}
              </a>
            </div>
            <div className="flex gap-3 mt-6">
              {[
                {
                  Icon: Facebook,
                  href: company.socialMedia.facebook,
                  color: "hover:text-blue-400",
                },
                {
                  Icon: Instagram,
                  href: company.socialMedia.instagram,
                  color: "hover:text-pink-400",
                },
                {
                  Icon: Youtube,
                  href: company.socialMedia.youtube,
                  color: "hover:text-red-400",
                },
                {
                  Icon: Linkedin,
                  href: company.socialMedia.linkedin,
                  color: "hover:text-blue-300",
                },
              ].map(({ Icon, href, color }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 ${color} hover:bg-slate-700 transition-all`}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white mb-5 text-sm uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 group"
                  >
                    <ArrowRight className="w-3 h-3 text-primary-500 opacity-0 group-hover:opacity-100 -ml-3 group-hover:ml-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Destinations */}
          <div>
            <h4 className="font-bold text-white mb-5 text-sm uppercase tracking-wider">
              Study Destinations
            </h4>
            <ul className="space-y-2.5">
              {destinations.map((dest) => (
                <li key={dest.id}>
                  <Link
                    href={`/destinations/${dest.slug}`}
                    className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 group"
                  >
                    <ArrowRight className="w-3 h-3 text-primary-500 opacity-0 group-hover:opacity-100 -ml-3 group-hover:ml-0 transition-all" />
                    <span className="mr-1">{dest.flag}</span> {dest.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter + Certifications */}
          <div>
            <h4 className="font-bold text-white mb-5 text-sm uppercase tracking-wider">
              Stay Updated
            </h4>
            <p className="text-sm text-slate-400 mb-4">
              Get admission alerts, scholarship deadlines &amp; visa tips in
              your inbox.
            </p>
            {status === "success" ? (
              <p className="flex items-center gap-2 text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2.5 mb-6">
                <Check className="w-4 h-4" /> Subscribed! Check your inbox.
              </p>
            ) : (
              <form onSubmit={handleSubscribe} className="mb-6">
                <div className="flex gap-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="btn-primary text-white px-4 py-2.5 rounded-xl text-sm font-semibold flex-shrink-0 disabled:opacity-60"
                  >
                    {status === "submitting" ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <ArrowRight className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {status === "error" && (
                  <p className="text-xs text-accent-400 mt-2">Something went wrong. Please try again.</p>
                )}
              </form>
            )}
            <div>
              <h5 className="font-semibold text-slate-300 text-xs uppercase tracking-wider mb-3">
                Certified &amp; Recognised
              </h5>
              <div className="flex flex-wrap gap-2">
                {certifications.map((cert) => (
                  <span
                    key={cert.id}
                    className="text-xs bg-slate-800 border border-slate-700 text-slate-300 px-2.5 py-1 rounded-lg"
                  >
                    {cert.name}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-6">
              <h5 className="font-semibold text-slate-300 text-xs uppercase tracking-wider mb-3">
                Awards
              </h5>
              {company.awards.map((award) => (
                <p key={award.id} className="text-xs text-slate-500 mb-1">
                  🏆 {award.title} — {award.year}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} {company.name} Pvt. Ltd. All rights
            reserved.
          </p>
          <div className="flex gap-4">
            {legalLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="hover:text-slate-300 transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
