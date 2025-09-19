import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container mx-auto flex h-16 items-center px-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Logo className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold font-headline text-foreground">
            Local Hunt
          </span>
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <Button asChild variant="ghost">
            <Link href="/register-vendor">Become a Vendor</Link>
          </Button>
          <Button asChild>
            <Link href="/">Logout</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
