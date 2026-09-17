"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, GraduationCap, Globe, Shield, Award, ChevronDown } from "lucide-react";
import FloatingCard from "./FloatingCard";

const destinations = [
  { flag: "🇦🇺", name: "Australia", students: "800+" },
  { flag: "🇬🇧", name: "UK", students: "600+" },
  { flag: "🇨🇦", name: "Canada", students: "550+" },
  { flag: "🇩🇪", name: "Germany", students: "300+" },
];

const badges = [
  { Icon: Shield, label: "ECAN Member", color: "text-primary-600" },
  { Icon: Award, label: "ISO 9001:2015", color: "text-accent-600" },
  { Icon: GraduationCap, label: "QEAC Certified", color: "text-primary-600" },
  { Icon: Award, label: "British Council", color: "text-blue-600" },
];

export default function HeroSection() {
  const [typedText, setTypedText] = useState("");
  const fullText = "Beyond Borders";

  useEffect(() => {
    let charIndex = 0;
    const timer = setTimeout(() => {
      const typeInterval = setInterval(() => {
        if (charIndex < fullText.length) {
          setTypedText(fullText.substring(0, charIndex + 1));
          charIndex++;
        } else {
          clearInterval(typeInterval);
        }
      }, 100);
      return () => clearInterval(typeInterval);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden pt-28"
      style={{
        background: "linear-gradient(135deg, #f0f7ff 0%, #e8f4fd 35%, #fdf0f0 70%, #fef9f0 100%)",
      }}
    >
      {/* Animated blobs */}
      <div
        className="absolute rounded-full opacity-35 -z-0 w-[500px] h-[500px] bg-primary-200 -top-32 -left-32"
        style={{ filter: "blur(80px)", animation: "blobMove1 15s ease-in-out infinite" }}
      />
      <div
        className="absolute rounded-full opacity-35 -z-0 w-[400px] h-[400px] bg-red-100 top-20 right-0"
        style={{ filter: "blur(80px)", animation: "blobMove2 18s ease-in-out infinite" }}
      />
      <div
        className="absolute rounded-full opacity-35 -z-0 w-[350px] h-[350px] bg-blue-100 bottom-10 left-1/4"
        style={{ filter: "blur(80px)", animation: "blobMove3 20s ease-in-out infinite" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* ── Left Content ── */}
          <div className="space-y-7">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-primary-100 shadow-sm"
              style={{ animation: "fadeUp 0.8s ease-out 0s both" }}
            >
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-semibold text-primary-700 uppercase tracking-wider">
                Trusted by 2,500+ Nepali Students Since 2010
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 leading-[1.1]">
              <span className="block" style={{ animation: "fadeUp 0.8s ease-out 0.3s both", opacity: 0 }}>
                Shape Your Future
              </span>
              <span
                className="block text-gradient italic"
                style={{ animation: "fadeUp 0.8s ease-out 0.5s both", opacity: 0 }}
              >
                {typedText || "Beyond Borders"}
                <span className="text-accent-500 animate-pulse">|</span>
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-500 leading-relaxed max-w-xl" style={{ animation: "fadeUp 0.8s ease-out 0.7s both", opacity: 0 }}>
              Nepal&apos;s premier education consultancy guiding ambitious students to world-class universities in Australia, UK, Canada, USA &amp; Europe. Free counseling. Proven results.
            </p>

            {/* Destination Pills */}
            <div className="flex flex-wrap gap-2" style={{ animation: "fadeUp 0.8s ease-out 0.85s both", opacity: 0 }}>
              {destinations.map((dest, i) => (
                <div key={i} className="flex items-center gap-1.5 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-full px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm">
                  <span>{dest.flag}</span>
                  <span>{dest.name}</span>
                  <span className="text-primary-500 font-bold">{dest.students}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4" style={{ animation: "fadeUp 0.8s ease-out 0.9s both", opacity: 0 }}>
              <Link href="/contact" className="btn-primary text-white px-8 py-4 rounded-full text-base font-semibold shadow-xl shadow-primary-500/25 text-center inline-flex items-center justify-center gap-2 group magnetic-btn">
                Book Free Counseling
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/destinations" className="px-8 py-4 rounded-full text-base font-semibold text-slate-700 bg-white border border-slate-200 hover:border-primary-300 hover:shadow-lg transition-all text-center inline-flex items-center justify-center gap-2 group magnetic-btn">
                <Globe className="w-5 h-5 text-primary-500 group-hover:scale-110 transition-transform" />
                Explore Destinations
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-slate-200/60" style={{ animation: "fadeUp 0.8s ease-out 1.1s both", opacity: 0 }}>
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-4 font-medium">Recognized &amp; Certified</p>
              <div className="flex flex-wrap items-center gap-5 opacity-60 hover:opacity-100 transition-all duration-500">
                {badges.map(({ Icon, label, color }, i) => (
                  <div key={i} className="flex items-center gap-2 hover:scale-105 transition-transform cursor-default">
                    <Icon className={`w-4 h-4 ${color}`} />
                    <span className="text-xs font-semibold text-slate-700">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right Visual ── */}
          <div className="relative hidden lg:block">
            {/* Orbit rings — use inline keyframes via style tag for reliability */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 0 }}>
              {/* Outer ring */}
              <div
                style={{
                  position: "absolute",
                  width: 550,
                  height: 550,
                  border: "1.5px dashed rgba(37,99,235,0.25)",
                  borderRadius: "50%",
                  animation: "spinCW 20s linear infinite",
                }}
              />
              {/* Inner ring */}
              <div
                style={{
                  position: "absolute",
                  width: 440,
                  height: 440,
                  border: "1.5px dotted rgba(220,38,38,0.18)",
                  borderRadius: "50%",
                  animation: "spinCCW 25s linear infinite",
                }}
              />
              {/* Orbiting dot on outer ring */}
              <div
                style={{
                  position: "absolute",
                  width: 550,
                  height: 550,
                  borderRadius: "50%",
                  animation: "spinCW 20s linear infinite",
                }}
              >
                <div style={{
                  position: "absolute",
                  top: -6,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
                  boxShadow: "0 0 10px rgba(37,99,235,0.5)",
                }} />
              </div>
              {/* Orbiting dot on inner ring */}
              <div
                style={{
                  position: "absolute",
                  width: 440,
                  height: 440,
                  borderRadius: "50%",
                  animation: "spinCCW 25s linear infinite",
                }}
              >
                <div style={{
                  position: "absolute",
                  top: -5,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg,#dc2626,#b91c1c)",
                  boxShadow: "0 0 8px rgba(220,38,38,0.5)",
                }} />
              </div>
            </div>

            {/* Main Image */}
            <div className="relative z-10">
              <div className="rounded-3xl shadow-2xl shadow-primary-900/10 overflow-hidden" style={{ animation: "fadeUp 1s ease-out 0.4s both", opacity: 0 }}>
                <Image
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&h=700&fit=crop&q=85"
                  alt="Nepali students celebrating admission abroad"
                  width={600}
                  height={700}
                  className="w-full object-cover h-[560px] hover:scale-105 transition-transform duration-700"
                  priority
                />
              </div>

              {/* Floating Cards */}
              <FloatingCard
                position="-left-12 top-20"
                icon={<GraduationCap className="w-6 h-6 text-primary-600" />}
                value="2,500+"
                label="Students Placed"
                iconBg="from-primary-100 to-primary-200"
                delay="0s"
                glow
              />
              <FloatingCard
                position="-right-8 bottom-32"
                icon={<Globe className="w-6 h-6 text-accent-600" />}
                value="15+"
                label="Countries"
                iconBg="from-accent-100 to-accent-200"
                delay="3s"
              />
              <FloatingCard
                position="left-10 -bottom-6"
                avatars={[
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop",
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop",
                  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop",
                ]}
                value="98% Visa"
                label="Success Rate"
                delay="1.5s"
              />
              <div
                className="absolute -top-4 right-20 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg"
                style={{ animation: "float 3s ease-in-out infinite" }}
              >
                <Award className="w-3 h-3 inline mr-1" />
                Top Rated 2024
              </div>
            </div>

            {/* Dot pattern behind image */}
            <div
              className="absolute inset-0 -z-10 pattern-dots opacity-30"
              style={{ transform: "translate(8px, 8px)" }}
            />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-xs text-slate-400 font-medium tracking-widest uppercase">Scroll</span>
        <Link href="#stats" className="w-[26px] h-10 border-2 border-slate-300/50 rounded-[13px] relative hover:border-primary-400 transition-colors">
          <div
            className="w-1 h-2 rounded-sm absolute left-1/2 -translate-x-1/2"
            style={{
              background: "linear-gradient(180deg, #2563eb, #dc2626)",
              animation: "scrollWheelAnim 2s ease-in-out infinite",
              top: 4,
            }}
          />
        </Link>
      </div>

      {/* Inline keyframes for orbit + wheel animations */}
      <style>{`
        @keyframes spinCW {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes spinCCW {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
        @keyframes scrollWheelAnim {
          0%   { top: 4px;  opacity: 1; }
          50%  { top: 18px; opacity: 0.3; }
          100% { top: 4px;  opacity: 1; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-12px); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes blobMove1 {
          0%,100% { transform: translate(0,0) scale(1); }
          33%     { transform: translate(30px,-50px) scale(1.1); }
          66%     { transform: translate(-20px,30px) scale(0.9); }
        }
        @keyframes blobMove2 {
          0%,100% { transform: translate(0,0) scale(1); }
          33%     { transform: translate(-40px,20px) scale(1.15); }
          66%     { transform: translate(20px,-30px) scale(0.85); }
        }
        @keyframes blobMove3 {
          0%,100% { transform: translate(0,0) scale(1); }
          50%     { transform: translate(50px,40px) scale(1.2); }
        }
      `}</style>
    </section>
  );
}
