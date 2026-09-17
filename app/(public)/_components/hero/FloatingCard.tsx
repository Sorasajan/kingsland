"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface FloatingCardProps {
  position: string;
  icon?: React.ReactNode;
  iconBg?: string;
  value: string;
  label: string;
  delay?: string;
  glow?: boolean;
  avatars?: string[];
}

export default function FloatingCard({
  position,
  icon,
  iconBg,
  value,
  label,
  delay = "0s",
  glow = false,
  avatars,
}: FloatingCardProps) {
  return (
    <div
      className={cn(
        "absolute bg-white/90 backdrop-blur-xl rounded-2xl p-5 shadow-2xl border border-white/50 animate-float",
        glow && "glow-pulse",
        position
      )}
      style={{ animationDelay: delay }}
    >
      {avatars ? (
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {avatars.map((avatar, i) => (
              <Image
                key={i}
                src={avatar}
                alt=""
                width={32}
                height={32}
                className="w-8 h-8 rounded-full border-2 border-white object-cover"
              />
            ))}
          </div>
          <div className="text-xs">
            <p className="font-bold text-slate-900">{value}</p>
            <p className="text-slate-500">{label}</p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br",
              iconBg
            )}
          >
            {icon}
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
            <p className="text-xs text-slate-500 font-medium">{label}</p>
          </div>
        </div>
      )}
    </div>
  );
}
