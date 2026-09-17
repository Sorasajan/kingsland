import AnimatedCounter from "@/_globalcomponents/shared/AnimatedCounter";
import { GraduationCap, Globe, Star, Building2, ShieldCheck } from "lucide-react";
import type { SiteConfig, StatItem } from "@/types";

const iconMap: Record<string, React.ReactNode> = {
  Star:         <Star className="w-5 h-5" />,
  GraduationCap:<GraduationCap className="w-5 h-5" />,
  ShieldCheck:  <ShieldCheck className="w-5 h-5" />,
  Building2:    <Building2 className="w-5 h-5" />,
  Globe:        <Globe className="w-5 h-5" />,
};

export default function StatsBar({ stats }: { stats: StatItem[] }) {
  return (
    <section className="relative -mt-16 z-20 px-4">
      <div className="max-w-6xl mx-auto bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-slate-200/60 border border-white/50 overflow-hidden">
        <div className="grid grid-cols-2 lg:grid-cols-5">
          {stats.map((stat, i) => (
            <div
              key={stat.id}
              className={`p-7 text-center group transition-all duration-300 cursor-default relative ${
                stat.accent ? "bg-gradient-to-br from-accent-600 to-accent-700 text-white" : "hover:bg-primary-50/40"
              } ${i < stats.length - 1 ? "border-r border-slate-100" : ""}`}
            >
              <div className={`w-10 h-10 mx-auto rounded-xl flex items-center justify-center mb-3 transition-colors ${
                stat.accent ? "bg-white/20 text-white" : "bg-primary-50 text-primary-600 group-hover:bg-primary-100"
              }`}>
                {iconMap[stat.icon]}
              </div>
              <p className={`text-3xl lg:text-4xl font-bold ${stat.accent ? "text-white" : "text-primary-700"}`}>
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </p>
              <p className={`text-xs mt-1.5 font-medium ${stat.accent ? "text-red-100" : "text-slate-500"}`}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
