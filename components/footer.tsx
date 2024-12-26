import { Github, Twitter, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/lib/i18n';

export function Footer() {
  const { t } = useI18n();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-6 border-t">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              asChild
            >
              <a
                href="https://github.com/321208008"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              asChild
            >
              <a
                href="https://twitter.com/zyailive"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              asChild
            >
              <a
                href="https://itusi.cn"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Website"
              >
                <Globe className="h-5 w-5" />
              </a>
            </Button>
          </div>
          <div className="text-sm text-muted-foreground text-center">
            <p>© {currentYear} Cat Breed Identifier. {t('footer.rights')}</p>
          </div>
        </div>
      </div>
    </footer>
  );
} 