// ─── Company ────────────────────────────────────────────────────────────────

export interface ContactInfo {
  phone: {
    primary: string;
    secondary: string;
    whatsapp: string;
    viber: string;
  };
  email: {
    general: string;
    visa: string;
    ielts: string;
    admissions: string;
  };
  website: string;
}

export interface Address {
  street: string;
  landmark: string;
  ward: string;
  municipality: string;
  district: string;
  province: string;
  country: string;
  postalCode: string;
  googleMapsUrl: string;
  coordinates: { lat: number; lng: number };
}

export interface OfficeHours {
  sunday: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  publicHolidays: string;
  note: string;
}

export interface SocialMedia {
  facebook: string;
  instagram: string;
  youtube: string;
  linkedin: string;
  tiktok: string;
  twitter: string;
}

export interface Certification {
  id: string;
  name: string;
  fullName: string;
  year: number;
  description: string;
}

export interface CompanyStats {
  studentsPlaced: number;
  partnerUniversities: number;
  countriesCovered: number;
  visaSuccessRate: number;
  yearsOfExperience: number;
  scholarshipsSecured: number;
  ieltsStudentsTrained: number;
  averageIeltsBand: number;
  officeLocations: number;
}

export interface Award {
  id: string;
  title: string;
  issuer: string;
  year: number;
}

export interface Company {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  founded: number;
  yearsOfExperience: number;
  logo: { initial: string; gradientFrom: string; gradientTo: string };
  registration: {
    companyType: string;
    registrationNumber: string;
    panNumber: string;
    vatNumber: string;
    registeredWith: string;
  };
  contact: ContactInfo;
  address: Address;
  officeHours: OfficeHours;
  socialMedia: SocialMedia;
  certifications: Certification[];
  stats: CompanyStats;
  awards: Award[];
}

// ─── Destination ─────────────────────────────────────────────────────────────

export interface Scholarship {
  name: string;
  coverage: string;
  eligibility: string;
}

export interface Destination {
  id: string;
  name: string;
  slug: string;
  flag: string;
  flagCode: string;
  image: string;
  badge: string | null;
  badgeColor: string | null;
  tagline: string;
  description: string;
  longDescription: string;
  currency: string;
  capital: string;
  studentVisaType: string;
  averageTuitionRange: { undergraduate: string; postgraduate: string };
  averageLivingCost: string;
  partnerUniversities: number;
  studentsPlaced: number;
  postStudyWork: string;
  intakes: string[];
  englishRequirements: {
    ielts?: string;
    pte?: string;
    toefl?: string;
    german?: string;
    japanese?: string;
    [key: string]: string | undefined;
  };
  topUniversities: string[];
  popularCourses: string[];
  highlights: string[];
  scholarships: Scholarship[];
  processingTime: string;
  color: string;
  featured: boolean;
  order: number;
}

// ─── Service ─────────────────────────────────────────────────────────────────

export interface TestOption {
  name: string;
  duration: string;
  classSize: number;
  mockTests: number | string;
  guarantee: string | null;
  schedule: string;
}

export interface ScholarshipType {
  type: string;
  examples: string[];
  coverage: string;
}

export interface Service {
  id: string;
  slug: string;
  icon: string;
  title: string;
  shortDescription: string;
  description: string;
  tag: string;
  tagColor: string;
  accent: boolean;
  isFree: boolean;
  duration: string;
  deliverables: string[];
  processSteps: string[];
  order: number;
  // Optional extended fields
  visaSuccessRate?: number;
  countriesHandled?: string[];
  tests?: TestOption[];
  scholarshipsSecured?: number;
  scholarshipTypes?: ScholarshipType[];
  orientationTopics?: string[];
}

// ─── Team ────────────────────────────────────────────────────────────────────

export interface TeamMember {
  id: string;
  name: string;
  role?: string;
  department?: string;
  experience?: string;
  specialisation?: string[];
  image?: string;
  bio?: string;
  qualifications?: string[];
  languages?: string[];
  studiedIn?: string;
  linkedIn?: string;
  email?: string;
  isFeatured?: boolean;
  order?: number;
}

// ─── Testimonial ─────────────────────────────────────────────────────────────

export interface Testimonial {
  id: string;
  name: string;
  program?: string;
  university?: string;
  country?: string;
  flagCode?: string;
  flagImage?: string;
  year?: number;
  intake?: string;
  scholarship?: string;
  scholarshipName?: string;
  previousEducation?: string;
  ieltsBand?: number;
  previousIeltsBand?: number;
  visaProcessingDays?: number;
  quote: string;
  avatar?: string;
  rating?: number;
  servicesUsed?: string[];
  counselorId?: string;
  isFeatured?: boolean;
  videoTestimonial?: boolean;
  order?: number;
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────

export interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
  tags: string[];
  order: number;
}

// ─── Site Config ─────────────────────────────────────────────────────────────

export interface NavLink {
  href: string;
  label: string;
  exact?: boolean;
}

export interface StatItem {
  id: string;
  value: number;
  suffix: string;
  label: string;
  icon: string;
  accent: boolean;
}

export interface SiteConfig {
  navigation: {
    main: NavLink[];
    footer: {
      quickLinks: NavLink[];
      legal: NavLink[];
    };
    cta: { label: string; href: string };
  };
  seo: {
    defaultTitle: string;
    titleTemplate: string;
    defaultDescription: string;
    defaultKeywords: string[];
    ogImage: string;
    twitterHandle: string;
  };
  pages: Record<string, { title: string; description: string }>;
  stats: StatItem[];
  certifications: { id: string; name: string }[];
  partnerUniversities: string[];
}
