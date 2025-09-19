
'use client';

import Link from 'next/link';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { User, Vendor } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MoreVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import RoleBasedLayout from '@/components/auth/role-based-layout';


function AdminDashboardPage() {
  const [users, setUsers] = React.useState<User[]>([]);
  const [vendors, setVendors] = React.useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const { toast } = useToast();

  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [usersRes, vendorsRes] = await Promise.all([
          fetch('/api/users'),
          fetch('/api/vendors')
        ]);
        if (!usersRes.ok || !vendorsRes.ok) throw new Error('Failed to fetch');
        const usersData = await usersRes.json() as User[];
        const vendorsData = await vendorsRes.json() as Vendor[];

  setUsers(usersData.map(u => ({ ...(u as any), id: String((u as any)._id || (u as any).id) } as User)));
  setVendors(vendorsData.map(v => ({ ...(v as any), id: String((v as any)._id || (v as any).id) } as Vendor)));

      } catch (error) {
        console.error('Error fetching data: ', error);
        toast({
          title: 'Error',
          description: 'Could not fetch data from the database.',
          variant: 'destructive',
        });
      }
      setIsLoading(false);
    };
    fetchData();
  }, [toast]);


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
        <div className="container mx-auto flex h-16 items-center px-4">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <span className="text-xl font-bold font-headline text-foreground">
              Admin Dashboard
            </span>
          </Link>
          <div className="ml-auto flex items-center gap-4">
            <Button asChild>
              <Link href="/">Logout</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold font-headline mb-6">Management</h1>
          <Tabs defaultValue="users">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="vendors">Vendors</TabsTrigger>
            </TabsList>
            <TabsContent value="users">
              <UserTable users={users} />
            </TabsContent>
            <TabsContent value="vendors">
              <VendorTable vendors={vendors} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}

function UserTable({ users }: { users: User[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
        <CardDescription>A list of all registered users.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={`https://avatar.vercel.sh/${user.email}.png`} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{user.name}</span>
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'}>{user.role}</Badge>
                </TableCell>
                <TableCell>{user.joinedDate}</TableCell>
                <TableCell>
                  <UserActions />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function VendorTable({ vendors }: { vendors: Vendor[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Vendors</CardTitle>
        <CardDescription>A list of all vendors.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Business Name</TableHead>
              <TableHead>Categories</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Address</TableHead>
               <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vendors.map((vendor) => (
              <TableRow key={vendor.id}>
                <TableCell className="font-medium">{vendor.name}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {vendor.categories.map(cat => <Badge key={cat} variant="outline">{cat}</Badge>)}
                  </div>
                </TableCell>
                <TableCell>{vendor.rating.toFixed(1)}</TableCell>
                <TableCell>{vendor.address}</TableCell>
                 <TableCell>
                  <UserActions />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function UserActions() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem>View Details</DropdownMenuItem>
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default function() {
    return (
        <RoleBasedLayout allowedRole="admin">
            <AdminDashboardPage />
        </RoleBasedLayout>
    )
}