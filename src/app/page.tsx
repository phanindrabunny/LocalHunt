
import Link from 'next/link';
import { User, Store, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/icons';

export default function WelcomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
        <div className="container mx-auto flex h-16 items-center px-4">
          <Link href="/" className="flex items-center gap-2">
            <Logo className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold font-headline text-foreground">
              Local Hunt
            </span>
          </Link>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold font-headline">
            Welcome! Choose Your Path
          </h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
          {/* User Path */}
          <Card>
            <CardHeader className="items-center">
              <div className="flex items-center gap-2 text-2xl font-semibold text-primary">
                <User />
                <CardTitle>User</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/login?role=user" passHref>
                <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-lg">Login</CardTitle>
                    <CardDescription>Access your personal account</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
              <Link href="/login?register=true&role=user" passHref>
                 <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-lg">Register</CardTitle>
                    <CardDescription>Create a new user account</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </CardContent>
          </Card>

          {/* Vendor Path */}
          <Card>
            <CardHeader className="items-center">
               <div className="flex items-center gap-2 text-2xl font-semibold text-primary">
                <Store />
                <CardTitle>Vendor</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
               <Link href="/login?role=vendor" passHref>
                 <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-lg">Login</CardTitle>
                    <CardDescription>Manage your business account</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
              <Link href="/register-vendor" passHref>
                 <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-lg">Register</CardTitle>
                    <CardDescription>Create a new vendor account</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </CardContent>
          </Card>
          
          {/* Admin Path */}
          <Card>
            <CardHeader className="items-center">
               <div className="flex items-center gap-2 text-2xl font-semibold text-primary">
                <Shield />
                <CardTitle>Admin</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
               <Link href="/login?role=admin" passHref>
                 <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-lg">Login</CardTitle>
                    <CardDescription>Access the admin dashboard</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
              <Link href="/login?register=true&role=admin" passHref>
                 <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-lg">Register</CardTitle>
                    <CardDescription>Create a new admin account</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  );
}
