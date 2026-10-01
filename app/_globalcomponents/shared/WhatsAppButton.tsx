"use client";

import { MessageCircle } from "lucide-react";
import type { Company } from "@/types";

export default function WhatsAppButton({ company }: { company: Company }) {
  const { contact } = company;
  return (
    <a
      href={`https://wa.me/${contact.phone.whatsapp?.replace(/\D/g, "")}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 transition-transform"
      style={{ animation: "bounce 3s infinite" }}
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-7 h-7" />
    </a>
  );
}
