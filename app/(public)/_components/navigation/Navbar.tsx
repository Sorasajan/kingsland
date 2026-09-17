"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Phone, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#destinations", label: "Destinations" },
  { href: "#services", label: "Services" },
  { href: "#test-prep", label: "Test Prep" },
  { href: "#success", label: "Success Stories" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState("#home");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      id="navbar"
      className={cn(
        "fixed w-full z-50 transition-all duration-500 top-0",
        scrolled && "shadow-lg shadow-slate-200/50"
      )}
    >
      {/* Top Bar */}
      <div className="hidden lg:block bg-primary-900 text-white py-1.5 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6 text-primary-200">
            <span>📍 Dillibazar, Kathmandu, Nepal</span>
            <span>⏰ Mon–Sat: 8:00 AM – 6:00 PM</span>
          </div>
          <div className="flex items-center gap-6 text-primary-200">
            <a href="tel:+97714444444" className="hover:text-white transition-colors flex items-center gap-1">
              <Phone className="w-3 h-3" /> +977-1-4444444
            </a>
            <a href="mailto:info@summitabroad.edu.np" className="hover:text-white transition-colors">
              info@summitabroad.edu.np
            </a>
          </div>
        </div>
      </div>

      <div className="glass-nav border-b border-slate-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                S
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl font-bold text-slate-900 leading-tight">
                  Summit Abroad
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-medium">
                  Education Consultancy
                </span>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-7">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setActiveLink(link.href)}
                  className={cn(
                    "nav-link text-sm font-medium transition-colors",
                    activeLink === link.href ? "text-primary-600" : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* CTA & Mobile Toggle */}
            <div className="flex items-center gap-3">
              <a
                href="tel:+97714444444"
                className="hidden md:flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span className="hidden xl:inline">+977-1-4444444</span>
              </a>
              <a
                href="#contact"
                className="hidden sm:inline-flex btn-primary text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg shadow-primary-500/25 magnetic-btn"
              >
                Free Consultation
              </a>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
                aria-label="Toggle menu"
              >
                {isOpen ? (
                  <X className="w-6 h-6 text-slate-700" />
                ) : (
                  <Menu className="w-6 h-6 text-slate-700" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "lg:hidden bg-white border-b border-slate-100 shadow-xl transition-all duration-300",
          isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        )}
      >
        <div className="px-4 py-6 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block text-base font-medium text-slate-700 hover:text-primary-600 py-2.5 border-b border-slate-50 transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setIsOpen(false)}
            className="block btn-primary text-white text-center px-6 py-3 rounded-full text-sm font-semibold mt-4"
          >
            Free Consultation
          </a>
          <div className="pt-4 text-sm text-slate-500 space-y-1">
            <p>📍 Dillibazar, Kathmandu</p>
            <p>📞 +977-1-4444444</p>
          </div>
        </div>
      </div>
    </nav>
  );
}
