"use client";

import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/_globalcomponents/shared/ScrollReveal";
import { Check, Award } from "lucide-react";
import type { TeamMember, Company } from "@/types";

function buildFeatures(company: Company) {
  return [
    {
      title: `ECAN & QEAC Certified Counselors`,
      description: "Our counselors hold international certifications from Education Counsellors Association of Nepal and QEAC Australia, ensuring ethical and accurate guidance.",
      accent: false,
    },
    {
      title: `${company.stats.partnerUniversities}+ Direct University Partnerships`,
      description: "Official partnerships with universities across Australia, UK, Canada, USA, Europe & New Zealand, giving you access to faster decisions and special offers.",
      accent: false,
    },
    {
      title: `${company.stats.visaSuccessRate}% Visa Success Rate`,
      description: "Our meticulous GTE/SOP documentation, financial affidavit guidance, and mock interview preparation ensures near-perfect visa outcomes.",
      accent: true,
    },
    {
      title: "Scholarship Up to 100% Tuition",
      description: `We proactively identify and help you apply for merit, government, and university scholarships. We have secured ${company.stats.scholarshipsSecured}+ scholarships for our students.`,
      accent: false,
    },
    {
      title: `Nepal-Wide Network & Alumni`,
      description: `Offices in ${company.address.municipality} with active alumni network in ${company.stats.countriesCovered}+ countries to guide you once you arrive abroad.`,
      accent: false,
    },
  ];
}

const galleryImages = [
  { src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=300&h=400&fit=crop&q=80", alt: "Team meeting", h: "h-52" },
  { src: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=300&h=300&fit=crop&q=80", alt: "Students studying", h: "h-60" },
  { src: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=300&h=300&fit=crop&q=80", alt: "Counseling session", h: "h-64" },
  { src: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=300&h=400&fit=crop&q=80", alt: "Happy students", h: "h-52" },
];

export default function AboutSection({
  company,
  team,
}: {
  company: Company;
  team: TeamMember[];
}) {
  const features = buildFeatures(company);
  const featuredTeam = team.filter((m) => m.isFeatured);
  return (
    <section id="about" className="py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-50 rounded-full blur-3xl opacity-60" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Who We Are */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <ScrollReveal>
            <div className="relative order-2 lg:order-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4 mt-10">
                  <Image src={galleryImages[0].src} alt={galleryImages[0].alt} width={300} height={400}
                    className={`rounded-2xl shadow-lg w-full ${galleryImages[0].h} object-cover`} />
                  <Image src={galleryImages[1].src} alt={galleryImages[1].alt} width={300} height={300}
                    className={`rounded-2xl shadow-lg w-full ${galleryImages[1].h} object-cover`} />
                </div>
                <div className="space-y-4">
                  <Image src={galleryImages[2].src} alt={galleryImages[2].alt} width={300} height={300}
                    className={`rounded-2xl shadow-lg w-full ${galleryImages[2].h} object-cover`} />
                  <Image src={galleryImages[3].src} alt={galleryImages[3].alt} width={300} height={400}
                    className={`rounded-2xl shadow-lg w-full ${galleryImages[3].h} object-cover`} />
                </div>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-6 shadow-2xl border border-slate-100 z-10">
                <p className="text-5xl font-bold text-gradient text-center">{company.yearsOfExperience}+</p>
                <p className="text-sm text-slate-500 text-center font-medium mt-1">Years of<br />Excellence</p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <div className="order-1 lg:order-2">
              <span className="section-label text-accent-600 mb-4">
                <span className="w-8 h-0.5 bg-accent-400 rounded" /> Why {company.shortName}
              </span>
              <h2 className="font-serif text-4xl lg:text-5xl font-bold text-slate-900 mt-4 mb-5">
                Nepal&apos;s Most Trusted Education Partner
              </h2>
              <p className="text-lg text-slate-500 mb-8">
                Founded in {company.founded} in {company.address.municipality}, {company.shortName} has helped over {company.stats.studentsPlaced.toLocaleString()} Nepali students reach world-class universities across {company.stats.countriesCovered}+ countries. We don&apos;t just process applications — we build futures with honesty, expertise, and genuine care.
              </p>

              <div className="space-y-5 mb-8">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-4 group">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                      feature.accent ? "bg-accent-100 group-hover:bg-accent-600" : "bg-primary-100 group-hover:bg-primary-600"
                    }`}>
                      <Check className={`w-3 h-3 transition-colors ${
                        feature.accent ? "text-accent-600 group-hover:text-white" : "text-primary-600 group-hover:text-white"
                      }`} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{feature.title}</h4>
                      <p className="text-sm text-slate-500 mt-0.5">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
                <Link href="/contact" className="btn-primary text-white px-6 py-3 rounded-full text-sm font-semibold">
                  Meet Our Team
                </Link>
                <Link href="/success-stories" className="text-sm font-semibold text-slate-700 hover:text-primary-600 transition-colors underline underline-offset-2">
                  See Success Stories →
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Team Section */}
        {featuredTeam.length > 0 && (
          <>
            <ScrollReveal>
              <div className="text-center mb-12">
                <h3 className="font-serif text-3xl font-bold text-slate-900 mb-3">Meet Our Expert Team</h3>
                <p className="text-slate-500">Certified, experienced, and genuinely invested in your success</p>
              </div>
            </ScrollReveal>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredTeam.map((member, i) => (
            <ScrollReveal key={member.id} delay={i * 80}>
              <div className="group text-center card-hover bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-xl">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  {member.image ? (
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={96}
                      height={96}
                      className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md group-hover:border-primary-200 transition-colors"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full border-4 border-white shadow-md bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">
                        {member.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary-500 rounded-full flex items-center justify-center shadow">
                    <Award className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
                <h5 className="font-bold text-slate-900 text-sm">{member.name}</h5>
                <p className="text-xs text-primary-600 font-medium mt-0.5">{member.role}</p>
                <div className="mt-3 flex gap-1.5 justify-center flex-wrap">
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{member.experience}</span>
                  {(member.specialisation ?? []).slice(0, 2).map(s => (
                    <span key={s} className="text-xs bg-primary-50 text-primary-600 px-2 py-0.5 rounded-full">{s}</span>
                  ))}
                </div>
                <p className="text-xs text-slate-400 mt-2 italic">Studied in {member.studiedIn}</p>
              </div>
            </ScrollReveal>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
