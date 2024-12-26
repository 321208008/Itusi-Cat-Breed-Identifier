import { ThemeToggle } from "./theme-toggle";
import { LanguageToggle } from "./language-toggle";
import { useI18n } from "@/lib/i18n/use-translations";
import Image from "next/image";

export function Header() {
  const { t } = useI18n();
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image
            src="/cat-logo.svg"
            alt="Cat Logo"
            width={32}
            height={32}
            className="dark:invert"
          />
          <h1 className="text-xl font-bold">{t('home.title')}</h1>
        </div>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}