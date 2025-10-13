
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/header';
import { CATEGORIES } from '@/lib/data';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

const formSchema = z
  .object({
    businessName: z.string().min(2, {
      message: 'Business name must be at least 2 characters.',
    }),
    email: z.string().email({
      message: 'Please enter a valid email address.',
    }),
    description: z.string().min(10, {
      message: 'Description must be at least 10 characters.',
    }),
    categories: z
      .array(z.string())
      .refine((value) => value.some((item) => item), {
        message: 'You have to select at least one category.',
      })
      .refine((value) => value.length <= 3, {
        message: 'You can select up to 3 categories.',
      }),
    address: z.string().min(5, 'Please enter a valid address.'),
    phone: z.string().min(10, 'Please enter a valid phone number.'),
    hours: z.string().min(5, 'Please enter your business hours.'),
    coverPhoto: z.any().optional(),
  });

export default function RegisterVendorPage() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: '',
      email: '',
      description: '',
      categories: [],
      address: '',
      phone: '',
      hours: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const payload = {
        name: values.businessName,
        email: values.email,
        description: values.description,
        categories: values.categories,
        address: values.address,
        phone: values.phone,
        hours: values.hours,
        image: `https://picsum.photos/seed/${Math.random()}/400/200`,
        rating: Math.random() * 2 + 3,
        reviews: Math.floor(Math.random() * 200),
        location: { lat: 37.7749, lng: -122.4194 }
      };

      const res = await fetch('/api/vendors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to submit registration');

      toast({
        title: 'Registration Submitted!',
        description: 'Thank you for registering. Your profile is under review.',
      });
      form.reset();
    } catch (error) {
       console.error('Error adding document: ', error);
       toast({
        title: 'Error',
        description: 'There was a problem submitting your registration.',
        variant: 'destructive',
      });
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-3xl font-headline">Join Local Hunt</CardTitle>
            <CardDescription>
              Register your business to connect with customers in your community.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="businessName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., The Daily Grind Cafe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="contact@yourbusiness.com" {...field} />
                      </FormControl>
                      <FormDescription>Used for account management and customer communications.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Tell us about your business..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="categories"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel>Categories</FormLabel>
                        <FormDescription>Select up to 3 categories that best fit your business.</FormDescription>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {CATEGORIES.map((item) => (
                          <FormField
                            key={item}
                            control={form.control}
                            name="categories"
                            render={({ field }) => {
                              return (
                                <FormItem key={item} className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(item)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, item])
                                          : field.onChange(field.value?.filter((value) => value !== item));
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">{item}</FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main St, Anytown, USA" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="(555) 123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="hours"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Hours</FormLabel>
                        <FormControl>
                          <Input placeholder="Mon-Fri: 9am-5pm" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                 <FormField
                  control={form.control}
                  name="coverPhoto"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cover Photo</FormLabel>
                      <FormControl>
                        <Input type="file" onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)} />
                      </FormControl>
                       <FormDescription>Upload a picture that represents your business.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-between items-center">
                   <Button asChild variant="link" className="p-0">
                    <Link href="/">Back to Home</Link>
                   </Button>
                   <Button type="submit" size="lg">Register Business</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
