"use client";
import { useState } from "react";

export default function LanguageSelector({
  onChange,
}: {
  onChange: (lang: string) => void;
}) {
  const [language, setLanguage] = useState("en");

  // 🌍 Added major Indian languages + a few global ones
  const languages = [
    { code: "en", label: "🇬🇧 English" },
    { code: "hi", label: "🇮🇳 Hindi" },
    { code: "bn", label: "🇮🇳 Bengali" },
    { code: "ta", label: "🇮🇳 Tamil" },
    { code: "te", label: "🇮🇳 Telugu" },
    { code: "mr", label: "🇮🇳 Marathi" },
    { code: "gu", label: "🇮🇳 Gujarati" },
    { code: "kn", label: "🇮🇳 Kannada" },
    { code: "ml", label: "🇮🇳 Malayalam" },
    { code: "pa", label: "🇮🇳 Punjabi" },
    { code: "es", label: "🇪🇸 Spanish" },
    { code: "fr", label: "🇫🇷 French" },
    { code: "zh", label: "🇨🇳 Chinese" },
  ];

  return (
    <div className="flex flex-wrap gap-2 justify-center p-2 border rounded-xl bg-white/70 backdrop-blur-md shadow-sm">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => {
            setLanguage(lang.code);
            onChange(lang.code);
          }}
          className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
            language === lang.code
              ? "bg-green-600 text-white shadow-md"
              : "bg-gray-100 text-gray-800 hover:bg-green-100"
          }`}>
          {lang.label}
        </button>
      ))}
    </div>
  );
}
