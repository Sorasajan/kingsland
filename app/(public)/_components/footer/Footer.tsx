"use client";

import { useState } from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube, Linkedin, ArrowRight, Check, Loader2 } from "lucide-react";

const destinations = ["Australia", "United Kingdom", "Canada", "USA", "Europe", "New Zealand", "Japan", "Ireland"];
const services = ["Free Counseling", "University Application", "IELTS Coaching", "PTE Coaching", "Visa Assistance", "Scholarship Guidance", "Pre-Departure Briefing"];
const quickLinks = [
  { href: "#home", label: "Home" },
  { href: "#destinations", label: "Study Destinations" },
  { href: "#services", label: "Our Services" },
  { href: "#test-prep", label: "Test Preparation" },
  { href: "#success", label: "Success Stories" },
  { href: "#about", label: "About Us" },
  { href: "#contact", label: "Contact" },
];

export default function Footer() {
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
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                S
              </div>
              <div>
                <p className="font-serif text-xl font-bold text-white">Summit Abroad</p>
                <p className="text-[10px] uppercase tracking-widest text-slate-400">Education Consultancy</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              Nepal&apos;s most trusted education consultancy since 2010. Guiding ambitious Nepali students to world-class universities across 15+ countries.
            </p>
            <div className="space-y-2.5 text-sm">
              <a href="https://maps.google.com" className="flex items-start gap-2.5 text-slate-400 hover:text-white transition-colors">
                <MapPin className="w-4 h-4 text-primary-400 mt-0.5 flex-shrink-0" />
                Dillibazar, Kathmandu, Nepal
              </a>
              <a href="tel:+97714444444" className="flex items-center gap-2.5 text-slate-400 hover:text-white transition-colors">
                <Phone className="w-4 h-4 text-primary-400 flex-shrink-0" />
                +977-1-4444444
              </a>
              <a href="mailto:info@summitabroad.edu.np" className="flex items-center gap-2.5 text-slate-400 hover:text-white transition-colors">
                <Mail className="w-4 h-4 text-primary-400 flex-shrink-0" />
                info@summitabroad.edu.np
              </a>
            </div>
            <div className="flex gap-3 mt-6">
              {[
                { Icon: Facebook, href: "#", color: "hover:text-blue-400" },
                { Icon: Instagram, href: "#", color: "hover:text-pink-400" },
                { Icon: Youtube, href: "#", color: "hover:text-red-400" },
                { Icon: Linkedin, href: "#", color: "hover:text-blue-300" },
              ].map(({ Icon, href, color }, i) => (
                <a key={i} href={href} className={`w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 ${color} hover:bg-slate-700 transition-all`}>
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white mb-5 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 group">
                    <ArrowRight className="w-3 h-3 text-primary-500 opacity-0 group-hover:opacity-100 -ml-3 group-hover:ml-0 transition-all" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Destinations */}
          <div>
            <h4 className="font-bold text-white mb-5 text-sm uppercase tracking-wider">Study Destinations</h4>
            <ul className="space-y-2.5">
              {destinations.map((dest) => (
                <li key={dest}>
                  <a href="#destinations" className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 group">
                    <ArrowRight className="w-3 h-3 text-primary-500 opacity-0 group-hover:opacity-100 -ml-3 group-hover:ml-0 transition-all" />
                    Study in {dest}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter + Certifications */}
          <div>
            <h4 className="font-bold text-white mb-5 text-sm uppercase tracking-wider">Stay Updated</h4>
            <p className="text-sm text-slate-400 mb-4">Get admission alerts, scholarship deadlines & visa tips in your inbox.</p>
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
              <h5 className="font-semibold text-slate-300 text-xs uppercase tracking-wider mb-3">Certified & Recognised</h5>
              <div className="flex flex-wrap gap-2">
                {["ECAN Member", "ISO 9001:2015", "QEAC Certified", "British Council"].map((cert) => (
                  <span key={cert} className="text-xs bg-slate-800 border border-slate-700 text-slate-300 px-2.5 py-1 rounded-lg">{cert}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Summit Abroad Education Consultancy Pvt. Ltd. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
