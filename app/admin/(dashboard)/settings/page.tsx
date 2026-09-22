"use client";

import { useEffect, useState } from "react";
import { Save, Loader2, CheckCircle2 } from "lucide-react";
import PageHeader from "../../_components/PageHeader";
import ImageUploadField from "../../_components/ImageUploadField";
import RepeaterEditor from "../../_components/RepeaterEditor";

const emptyForm = {
  name: "",
  shortName: "",
  tagline: "",
  description: "",
  founded: "",
  logoUrl: "",
  phonePrimary: "",
  phoneSecondary: "",
  phoneWhatsapp: "",
  phoneViber: "",
  emailGeneral: "",
  emailVisa: "",
  emailIelts: "",
  emailAdmissions: "",
  website: "",
  street: "",
  landmark: "",
  ward: "",
  municipality: "",
  district: "",
  province: "",
  country: "",
  postalCode: "",
  googleMapsUrl: "",
  ohSunday: "",
  ohMonday: "",
  ohTuesday: "",
  ohWednesday: "",
  ohThursday: "",
  ohFriday: "",
  ohSaturday: "",
  ohPublicHolidays: "",
  ohNote: "",
  fbUrl: "",
  igUrl: "",
  ytUrl: "",
  liUrl: "",
  ttUrl: "",
  twUrl: "",
  statsStudentsPlaced: "",
  statsPartnerUniversities: "",
  statsCountriesCovered: "",
  statsVisaSuccessRate: "",
  statsYearsOfExperience: "",
  statsScholarshipsSecured: "",
  statsIeltsStudentsTrained: "",
  statsAverageIeltsBand: "",
  statsOfficeLocations: "",
  regCompanyType: "",
  regNumber: "",
  panNumber: "",
  vatNumber: "",
  registeredWith: "",
  certifications: [] as Array<{
    id?: string;
    name: string;
    fullName: string;
    year: string;
    description: string;
  }>,
  awards: [] as Array<{
    id?: string;
    title: string;
    issuer: string;
    year: string;
  }>,
};

export default function SettingsPage() {
  const [original, setOriginal] = useState<any>(null);
  const [form, setForm] = useState<any>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      const c = data.company || {};
      setOriginal(c);
      setForm({
        ...emptyForm,
        name: c.name || "",
        shortName: c.shortName || "",
        tagline: c.tagline || "",
        description: c.description || "",
        founded: c.founded ?? "",
        logoUrl: c.logo?.imageUrl || "",
        phonePrimary: c.contact?.phone?.primary || "",
        phoneSecondary: c.contact?.phone?.secondary || "",
        phoneWhatsapp: c.contact?.phone?.whatsapp || "",
        phoneViber: c.contact?.phone?.viber || "",
        emailGeneral: c.contact?.email?.general || "",
        emailVisa: c.contact?.email?.visa || "",
        emailIelts: c.contact?.email?.ielts || "",
        emailAdmissions: c.contact?.email?.admissions || "",
        website: c.contact?.website || "",
        street: c.address?.street || "",
        landmark: c.address?.landmark || "",
        ward: c.address?.ward || "",
        municipality: c.address?.municipality || "",
        district: c.address?.district || "",
        province: c.address?.province || "",
        country: c.address?.country || "",
        postalCode: c.address?.postalCode || "",
        googleMapsUrl: c.address?.googleMapsUrl || "",
        ohSunday: c.officeHours?.sunday || "",
        ohMonday: c.officeHours?.monday || "",
        ohTuesday: c.officeHours?.tuesday || "",
        ohWednesday: c.officeHours?.wednesday || "",
        ohThursday: c.officeHours?.thursday || "",
        ohFriday: c.officeHours?.friday || "",
        ohSaturday: c.officeHours?.saturday || "",
        ohPublicHolidays: c.officeHours?.publicHolidays || "",
        ohNote: c.officeHours?.note || "",
        fbUrl: c.socialMedia?.facebook || "",
        igUrl: c.socialMedia?.instagram || "",
        ytUrl: c.socialMedia?.youtube || "",
        liUrl: c.socialMedia?.linkedin || "",
        ttUrl: c.socialMedia?.tiktok || "",
        twUrl: c.socialMedia?.twitter || "",
        statsStudentsPlaced: c.stats?.studentsPlaced ?? "",
        statsPartnerUniversities: c.stats?.partnerUniversities ?? "",
        statsCountriesCovered: c.stats?.countriesCovered ?? "",
        statsVisaSuccessRate: c.stats?.visaSuccessRate ?? "",
        statsYearsOfExperience: c.stats?.yearsOfExperience ?? "",
        statsScholarshipsSecured: c.stats?.scholarshipsSecured ?? "",
        statsIeltsStudentsTrained: c.stats?.ieltsStudentsTrained ?? "",
        statsAverageIeltsBand: c.stats?.averageIeltsBand ?? "",
        statsOfficeLocations: c.stats?.officeLocations ?? "",
        regCompanyType: c.registration?.companyType || "",
        regNumber: c.registration?.registrationNumber || "",
        panNumber: c.registration?.panNumber || "",
        vatNumber: c.registration?.vatNumber || "",
        registeredWith: c.registration?.registeredWith || "",
        certifications: c.certifications || [],
        awards: c.awards || [],
      });
      setLoading(false);
    })();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaved(false);

    const num = (v: string) => (v === "" ? undefined : Number(v));

    const payload = {
      ...original,
      name: form.name,
      shortName: form.shortName,
      tagline: form.tagline,
      description: form.description,
      founded: num(form.founded) ?? original?.founded,
      logo: { ...original?.logo, imageUrl: form.logoUrl },
      contact: {
        ...original?.contact,
        phone: {
          ...original?.contact?.phone,
          primary: form.phonePrimary,
          secondary: form.phoneSecondary,
          whatsapp: form.phoneWhatsapp,
          viber: form.phoneViber,
        },
        email: {
          ...original?.contact?.email,
          general: form.emailGeneral,
          visa: form.emailVisa,
          ielts: form.emailIelts,
          admissions: form.emailAdmissions,
        },
        website: form.website,
      },
      address: {
        ...original?.address,
        street: form.street,
        landmark: form.landmark,
        ward: form.ward,
        municipality: form.municipality,
        district: form.district,
        province: form.province,
        country: form.country,
        postalCode: form.postalCode,
        googleMapsUrl: form.googleMapsUrl,
      },
      officeHours: {
        ...original?.officeHours,
        sunday: form.ohSunday,
        monday: form.ohMonday,
        tuesday: form.ohTuesday,
        wednesday: form.ohWednesday,
        thursday: form.ohThursday,
        friday: form.ohFriday,
        saturday: form.ohSaturday,
        publicHolidays: form.ohPublicHolidays,
        note: form.ohNote,
      },
      socialMedia: {
        ...original?.socialMedia,
        facebook: form.fbUrl,
        instagram: form.igUrl,
        youtube: form.ytUrl,
        linkedin: form.liUrl,
        tiktok: form.ttUrl,
        twitter: form.twUrl,
      },
      stats: {
        ...original?.stats,
        studentsPlaced: num(form.statsStudentsPlaced),
        partnerUniversities: num(form.statsPartnerUniversities),
        countriesCovered: num(form.statsCountriesCovered),
        visaSuccessRate: num(form.statsVisaSuccessRate),
        yearsOfExperience: num(form.statsYearsOfExperience),
        scholarshipsSecured: num(form.statsScholarshipsSecured),
        ieltsStudentsTrained: num(form.statsIeltsStudentsTrained),
        averageIeltsBand: num(form.statsAverageIeltsBand),
        officeLocations: num(form.statsOfficeLocations),
      },
      registration: {
        ...original?.registration,
        companyType: form.regCompanyType,
        registrationNumber: form.regNumber,
        panNumber: form.panNumber,
        vatNumber: form.vatNumber,
        registeredWith: form.registeredWith,
      },
      certifications: form.certifications,
      awards: form.awards,
    };

    setSaving(true);
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (res.ok) {
      const data = await res.json();
      setOriginal(data.company);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Failed to save.");
    }
  }

  if (loading) {
    return (
      <div>
        <PageHeader
          title="Company Settings"
          description="Your business identity, contact info, and logo."
        />
        <p className="text-sm text-slate-400">Loading…</p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Company Settings"
        description="Shown across the site — nav, footer, contact page, and metadata."
        action={
          <button
            type="submit"
            form="settings-form"
            disabled={saving}
            className="flex items-center gap-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 px-4 py-2 rounded-xl transition-colors disabled:opacity-60"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saving ? "Saving…" : "Save Changes"}
          </button>
        }
      />

      {saved && (
        <p className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2.5 mb-6">
          <CheckCircle2 className="w-4 h-4" /> Saved. Changes are live on the
          site immediately.
        </p>
      )}
      {error && (
        <p className="text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-4 py-2.5 mb-6">
          {error}
        </p>
      )}

      <form id="settings-form" onSubmit={handleSave} className="space-y-6">
        <Section title="Identity">
          <ImageUploadField
            label="Logo"
            value={form.logoUrl}
            onChange={(url) => setForm({ ...form, logoUrl: url })}
          />
          <div className="grid grid-cols-2 gap-4 mt-4">
            <Field label="Full Company Name *">
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input"
              />
            </Field>
            <Field label="Short Name (nav/footer)">
              <input
                value={form.shortName}
                onChange={(e) =>
                  setForm({ ...form, shortName: e.target.value })
                }
                className="input"
              />
            </Field>
          </div>
          <Field label="Tagline">
            <input
              value={form.tagline}
              onChange={(e) => setForm({ ...form, tagline: e.target.value })}
              className="input mt-4"
            />
          </Field>
          <Field label="Description">
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="input resize-none mt-4"
            />
          </Field>
          <Field label="Founded Year">
            <input
              type="number"
              value={form.founded}
              onChange={(e) => setForm({ ...form, founded: e.target.value })}
              className="input mt-4 w-32"
            />
          </Field>
        </Section>

        <Section title="Contact">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Primary Phone">
              <input
                value={form.phonePrimary}
                onChange={(e) =>
                  setForm({ ...form, phonePrimary: e.target.value })
                }
                className="input"
              />
            </Field>
            <Field label="Secondary Phone">
              <input
                value={form.phoneSecondary}
                onChange={(e) =>
                  setForm({ ...form, phoneSecondary: e.target.value })
                }
                className="input"
              />
            </Field>
            <Field label="WhatsApp">
              <input
                value={form.phoneWhatsapp}
                onChange={(e) =>
                  setForm({ ...form, phoneWhatsapp: e.target.value })
                }
                className="input"
              />
            </Field>
            <Field label="Viber">
              <input
                value={form.phoneViber}
                onChange={(e) =>
                  setForm({ ...form, phoneViber: e.target.value })
                }
                className="input"
              />
            </Field>
            <Field label="General Email">
              <input
                type="email"
                value={form.emailGeneral}
                onChange={(e) =>
                  setForm({ ...form, emailGeneral: e.target.value })
                }
                className="input"
              />
            </Field>
            <Field label="Visa Email">
              <input
                type="email"
                value={form.emailVisa}
                onChange={(e) =>
                  setForm({ ...form, emailVisa: e.target.value })
                }
                className="input"
              />
            </Field>
            <Field label="IELTS Email">
              <input
                type="email"
                value={form.emailIelts}
                onChange={(e) =>
                  setForm({ ...form, emailIelts: e.target.value })
                }
                className="input"
              />
            </Field>
            <Field label="Admissions Email">
              <input
                type="email"
                value={form.emailAdmissions}
                onChange={(e) =>
                  setForm({ ...form, emailAdmissions: e.target.value })
                }
                className="input"
              />
            </Field>
          </div>
          <Field label="Website">
            <input
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
              className="input mt-4"
            />
          </Field>
        </Section>

        <Section title="Address">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Street">
              <input
                value={form.street}
                onChange={(e) => setForm({ ...form, street: e.target.value })}
                className="input"
              />
            </Field>
            <Field label="Landmark">
              <input
                value={form.landmark}
                onChange={(e) => setForm({ ...form, landmark: e.target.value })}
                className="input"
              />
            </Field>
            <Field label="Ward">
              <input
                value={form.ward}
                onChange={(e) => setForm({ ...form, ward: e.target.value })}
                className="input"
              />
            </Field>
            <Field label="Municipality">
              <input
                value={form.municipality}
                onChange={(e) =>
                  setForm({ ...form, municipality: e.target.value })
                }
                className="input"
              />
            </Field>
            <Field label="District">
              <input
                value={form.district}
                onChange={(e) => setForm({ ...form, district: e.target.value })}
                className="input"
              />
            </Field>
            <Field label="Province">
              <input
                value={form.province}
                onChange={(e) => setForm({ ...form, province: e.target.value })}
                className="input"
              />
            </Field>
            <Field label="Country">
              <input
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                className="input"
              />
            </Field>
            <Field label="Postal Code">
              <input
                value={form.postalCode}
                onChange={(e) =>
                  setForm({ ...form, postalCode: e.target.value })
                }
                className="input"
              />
            </Field>
          </div>
          <Field label="Google Maps URL">
            <input
              value={form.googleMapsUrl}
              onChange={(e) =>
                setForm({ ...form, googleMapsUrl: e.target.value })
              }
              className="input mt-4"
            />
          </Field>
        </Section>

        <Section title="Office Hours">
          <div className="grid grid-cols-3 gap-4">
            <Field label="Sunday">
              <input
                value={form.ohSunday}
                onChange={(e) => setForm({ ...form, ohSunday: e.target.value })}
                className="input"
              />
            </Field>
            <Field label="Monday">
              <input
                value={form.ohMonday}
                onChange={(e) => setForm({ ...form, ohMonday: e.target.value })}
                className="input"
              />
            </Field>
            <Field label="Tuesday">
              <input
                value={form.ohTuesday}
                onChange={(e) =>
                  setForm({ ...form, ohTuesday: e.target.value })
                }
                className="input"
              />
            </Field>
            <Field label="Wednesday">
              <input
                value={form.ohWednesday}
                onChange={(e) =>
                  setForm({ ...form, ohWednesday: e.target.value })
                }
                className="input"
              />
            </Field>
            <Field label="Thursday">
              <input
                value={form.ohThursday}
                onChange={(e) =>
                  setForm({ ...form, ohThursday: e.target.value })
                }
                className="input"
              />
            </Field>
            <Field label="Friday">
              <input
                value={form.ohFriday}
                onChange={(e) => setForm({ ...form, ohFriday: e.target.value })}
                className="input"
              />
            </Field>
            <Field label="Saturday">
              <input
                value={form.ohSaturday}
                onChange={(e) =>
                  setForm({ ...form, ohSaturday: e.target.value })
                }
                className="input"
              />
            </Field>
            <Field label="Public Holidays">
              <input
                value={form.ohPublicHolidays}
                onChange={(e) =>
                  setForm({ ...form, ohPublicHolidays: e.target.value })
                }
                className="input"
              />
            </Field>
          </div>
          <Field label="Note">
            <input
              value={form.ohNote}
              onChange={(e) => setForm({ ...form, ohNote: e.target.value })}
              className="input mt-4"
            />
          </Field>
        </Section>

        <Section title="Social Media">
          <div className="grid grid-cols-3 gap-4">
            <Field label="Facebook">
              <input
                value={form.fbUrl}
                onChange={(e) => setForm({ ...form, fbUrl: e.target.value })}
                className="input"
              />
            </Field>
            <Field label="Instagram">
              <input
                value={form.igUrl}
                onChange={(e) => setForm({ ...form, igUrl: e.target.value })}
                className="input"
              />
            </Field>
            <Field label="YouTube">
              <input
                value={form.ytUrl}
                onChange={(e) => setForm({ ...form, ytUrl: e.target.value })}
                className="input"
              />
            </Field>
            <Field label="LinkedIn">
              <input
                value={form.liUrl}
                onChange={(e) => setForm({ ...form, liUrl: e.target.value })}
                className="input"
              />
            </Field>
            <Field label="TikTok">
              <input
                value={form.ttUrl}
                onChange={(e) => setForm({ ...form, ttUrl: e.target.value })}
                className="input"
              />
            </Field>
            <Field label="Twitter / X">
              <input
                value={form.twUrl}
                onChange={(e) => setForm({ ...form, twUrl: e.target.value })}
                className="input"
              />
            </Field>
          </div>
        </Section>

        <Section
          title="Headline Stats"
          description="Shown in stat counters across the site."
        >
          <div className="grid grid-cols-3 gap-4">
            <Field label="Students Placed">
              <input
                type="number"
                value={form.statsStudentsPlaced}
                onChange={(e) =>
                  setForm({ ...form, statsStudentsPlaced: e.target.value })
                }
                className="input"
              />
            </Field>
            <Field label="Universities Available">
              <input
                type="number"
                value={form.statsPartnerUniversities}
                onChange={(e) =>
                  setForm({ ...form, statsPartnerUniversities: e.target.value })
                }
                className="input"
              />
            </Field>
            <Field label="Countries Covered">
              <input
                type="number"
                value={form.statsCountriesCovered}
                onChange={(e) =>
                  setForm({ ...form, statsCountriesCovered: e.target.value })
                }
                className="input"
              />
            </Field>
            <Field label="Visa Success Rate (%)">
              <input
                type="number"
                value={form.statsVisaSuccessRate}
                onChange={(e) =>
                  setForm({ ...form, statsVisaSuccessRate: e.target.value })
                }
                className="input"
              />
            </Field>
            <Field label="Years of Experience">
              <input
                type="number"
                value={form.statsYearsOfExperience}
                onChange={(e) =>
                  setForm({ ...form, statsYearsOfExperience: e.target.value })
                }
                className="input"
              />
            </Field>
            <Field label="Scholarships Secured">
              <input
                type="number"
                value={form.statsScholarshipsSecured}
                onChange={(e) =>
                  setForm({ ...form, statsScholarshipsSecured: e.target.value })
                }
                className="input"
              />
            </Field>
            <Field label="IELTS Students Trained">
              <input
                type="number"
                value={form.statsIeltsStudentsTrained}
                onChange={(e) =>
                  setForm({
                    ...form,
                    statsIeltsStudentsTrained: e.target.value,
                  })
                }
                className="input"
              />
            </Field>
            <Field label="Average IELTS Band">
              <input
                type="number"
                step="0.1"
                value={form.statsAverageIeltsBand}
                onChange={(e) =>
                  setForm({ ...form, statsAverageIeltsBand: e.target.value })
                }
                className="input"
              />
            </Field>
            <Field label="Office Locations">
              <input
                type="number"
                value={form.statsOfficeLocations}
                onChange={(e) =>
                  setForm({ ...form, statsOfficeLocations: e.target.value })
                }
                className="input"
              />
            </Field>
          </div>
        </Section>

        <Section title="Registration Details">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Company Type">
              <input
                value={form.regCompanyType}
                onChange={(e) =>
                  setForm({ ...form, regCompanyType: e.target.value })
                }
                className="input"
                placeholder="Private Limited"
              />
            </Field>
            <Field label="Registration Number">
              <input
                value={form.regNumber}
                onChange={(e) =>
                  setForm({ ...form, regNumber: e.target.value })
                }
                className="input"
              />
            </Field>
            <Field label="PAN Number">
              <input
                value={form.panNumber}
                onChange={(e) =>
                  setForm({ ...form, panNumber: e.target.value })
                }
                className="input"
              />
            </Field>
            <Field label="VAT Number">
              <input
                value={form.vatNumber}
                onChange={(e) =>
                  setForm({ ...form, vatNumber: e.target.value })
                }
                className="input"
              />
            </Field>
          </div>
          <Field label="Registered With">
            <input
              value={form.registeredWith}
              onChange={(e) =>
                setForm({ ...form, registeredWith: e.target.value })
              }
              className="input mt-4"
            />
          </Field>
        </Section>

        <Section title="Certifications">
          <RepeaterEditor
            label="Certifications"
            fields={[
              { key: "name", label: "Short Name", placeholder: "ECAN Member" },
              {
                key: "fullName",
                label: "Full Name",
                placeholder: "Education Counsellors Association of Nepal",
              },
              { key: "year", label: "Year", placeholder: "2012" },
              {
                key: "description",
                label: "Description",
                placeholder:
                  "Full member of Nepal's leading education counsellors body",
              },
            ]}
            rows={form.certifications}
            onChange={(rows) => setForm({ ...form, certifications: rows })}
          />
        </Section>

        <Section title="Awards">
          <RepeaterEditor
            label="Awards"
            fields={[
              {
                key: "title",
                label: "Title",
                placeholder: "Top Education Consultancy Award",
              },
              {
                key: "issuer",
                label: "Issuer",
                placeholder: "Nepal Education Awards",
              },
              { key: "year", label: "Year", placeholder: "2024" },
            ]}
            rows={form.awards}
            onChange={(rows) => setForm({ ...form, awards: rows })}
          />
        </Section>
      </form>

      <style jsx global>{`
        .input {
          width: 100%;
          padding: 0.6rem 0.9rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.75rem;
          font-size: 0.875rem;
        }
        .input:focus {
          outline: none;
          box-shadow: 0 0 0 2px #94a3b8;
          border-color: transparent;
        }
      `}</style>
    </div>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <h3 className="font-bold text-sm text-slate-900 mb-1">{title}</h3>
      {description && (
        <p className="text-xs text-slate-500 mb-4">{description}</p>
      )}
      {!description && <div className="mb-4" />}
      {children}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}
