"use client";

import { useState } from "react";
import Link from "next/link";
import ScrollReveal from "@/_globalcomponents/shared/ScrollReveal";
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, CheckCircle2, Loader2 } from "lucide-react";
import type { Company } from "@/types";

function buildContactCards(company: Company) {
  const { contact, address, officeHours } = company;
  return [
    {
      icon: <MapPin className="w-5 h-5" />,
      title: "Visit Us",
      lines: [
        `${address.street}`,
        address.landmark,
        `${address.district}, ${address.province}`,
      ],
      color: "text-primary-600",
      bg: "bg-primary-50",
      href: address.googleMapsUrl,
    },
    {
      icon: <Phone className="w-5 h-5" />,
      title: "Call Us",
      lines: [
        contact.phone.primary,
        contact.phone.secondary,
        "Viber & WhatsApp available",
      ],
      color: "text-accent-600",
      bg: "bg-accent-50",
      href: `tel:${contact.phone.primary}`,
    },
    {
      icon: <Mail className="w-5 h-5" />,
      title: "Email Us",
      lines: [
        contact.email.general,
        contact.email.visa,
        contact.email.ielts,
      ],
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      href: `mailto:${contact.email.general}`,
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: "Office Hours",
      lines: [
        `Sun–Fri: ${officeHours.sunday}`,
        `Saturday: ${officeHours.saturday}`,
        `Public holidays: ${officeHours.publicHolidays}`,
      ],
      color: "text-amber-600",
      bg: "bg-amber-50",
      href: null,
    },
  ];
}

const initialForm = {
  name: "",
  phone: "",
  email: "",
  destination: "",
  service: "",
  message: "",
  company_website: "", // honeypot — must stay empty
};

export default function ContactSection({ company }: { company: Company }) {
  const contactCards = buildContactCards(company);
  const { officeHours, contact } = company;
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.phone || !form.email) {
      setErrorMsg("Please fill in your name, phone, and email.");
      setStatus("error");
      return;
    }
    setStatus("submitting");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      setStatus("success");
      setForm(initialForm);
    } catch {
      setErrorMsg("Couldn't reach the server. Please check your connection and try again.");
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="section-label text-accent-600 mb-3">
              <span className="w-8 h-0.5 bg-accent-400 rounded" /> Get In Touch <span className="w-8 h-0.5 bg-accent-400 rounded" />
            </span>
            <h2 className="font-serif text-4xl lg:text-5xl font-bold text-slate-900 mt-3 mb-4">
              Start Your Journey Today
            </h2>
            <p className="text-lg text-slate-500">
              Book a free counseling session. No pressure, just honest advice tailored to your goals.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact Form */}
          <ScrollReveal>
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-slate-100">
              <h3 className="font-bold text-slate-900 text-xl mb-6 flex items-center gap-2">
                <Send className="w-5 h-5 text-primary-600" />
                Book a Free Consultation
              </h3>
              {status === "success" ? (
                <div className="flex flex-col items-center text-center py-10">
                  <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                  </div>
                  <h4 className="font-bold text-slate-900 mb-1.5">Request received!</h4>
                  <p className="text-sm text-slate-500 max-w-xs mb-5">
                    Thanks for reaching out — one of our counselors will contact you within 24 hours.
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="text-sm font-semibold text-primary-600 hover:underline"
                  >
                    Submit another request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Honeypot — hidden from real users, bots tend to fill every field */}
                  <input
                    type="text"
                    name="company_website"
                    value={form.company_website}
                    onChange={handleChange}
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">Full Name *</label>
                      <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Your full name"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">Phone Number *</label>
                      <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+977 98XXXXXXXX"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email Address *</label>
                    <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="your@email.com"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">Preferred Destination</label>
                      <select name="destination" value={form.destination} onChange={handleChange}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-slate-700 bg-white">
                        <option value="">Select country</option>
                        {["Australia", "UK", "Canada", "USA", "Europe", "New Zealand", "Japan", "Ireland", "Not sure yet"].map(c => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">Service Needed</label>
                      <select name="service" value={form.service} onChange={handleChange}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-slate-700 bg-white">
                        <option value="">Select service</option>
                        {["Career Counseling", "University Application", "IELTS / PTE Coaching", "Visa Assistance", "Scholarship Guidance"].map(s => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Your Message</label>
                    <textarea rows={3} name="message" value={form.message} onChange={handleChange} placeholder="Tell us about your academic background, target course, and any questions..."
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none" />
                  </div>
                  {status === "error" && (
                    <p className="text-sm text-accent-600 bg-accent-50 border border-accent-100 rounded-lg px-3 py-2">
                      {errorMsg}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="w-full btn-primary text-white py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20 disabled:opacity-60"
                  >
                    {status === "submitting" ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    {status === "submitting" ? "Submitting..." : "Submit — We Reply Within 24 Hours"}
                  </button>
                  <p className="text-xs text-slate-400 text-center">{officeHours.note}</p>
                </form>
              )}
            </div>
          </ScrollReveal>

          {/* Contact Info */}
          <ScrollReveal delay={150}>
            <div className="space-y-5">
              {contactCards.map((info, i) => (
                <div key={i} className={`${info.bg} rounded-2xl p-6 border border-white`}>
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm ${info.color} flex-shrink-0`}>
                      {info.icon}
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-900 mb-2">{info.title}</h5>
                      {info.lines.map((line, j) => (
                        info.href ? (
                          <a key={j} href={info.href} target="_blank" rel="noopener noreferrer"
                            className="block text-sm text-slate-600 leading-relaxed hover:text-primary-600 transition-colors">
                            {line}
                          </a>
                        ) : (
                          <p key={j} className="text-sm text-slate-600 leading-relaxed">{line}</p>
                        )
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              {/* WhatsApp CTA */}
              <div className="bg-green-500 rounded-2xl p-6 text-white">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="font-bold mb-1">Chat on WhatsApp</h5>
                    <p className="text-sm text-green-100 mb-3">Get instant answers from our counselors</p>
                    <a
                      href={`https://wa.me/${contact.phone.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-white text-green-700 px-4 py-2 rounded-full text-sm font-bold hover:bg-green-50 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Open WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
