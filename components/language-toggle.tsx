"use client";

import { Languages, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocale } from "@/lib/i18n";
import type { Language } from "@/lib/i18n/store";

const LANGUAGE_NAMES: Record<Language, string> = {
  en: 'English',
  zh: '中文',
};

export function LanguageToggle() {
  const { locale, setLocale } = useLocale();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Languages className="h-5 w-5" />
          <span className="sr-only">
            {LANGUAGE_NAMES[locale as Language]}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.entries(LANGUAGE_NAMES).map(([key, name]) => (
          <DropdownMenuItem
            key={key}
            onClick={() => setLocale(key as Language)}
            className="flex items-center justify-between"
          >
            {name}
            {locale === key && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}