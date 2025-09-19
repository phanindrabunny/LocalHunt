
'use client';

import * as React from 'react';
import { MapPin, Search, Star, SlidersHorizontal, List, Map } from 'lucide-react';
import { CATEGORIES } from '@/lib/data';
import type { Vendor } from '@/lib/types';
import { haversineDistance } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/header';
import { VendorCard } from '@/components/vendor-card';
import MapView from '@/components/map-view';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEffect } from 'react';

type SortBy = 'distance' | 'rating' | 'name';
type UserLocation = { lat: number; lng: number };

export default function DashboardPage() {
  const [vendors, setVendors] = React.useState<Vendor[]>([]);
  const [filteredVendors, setFilteredVendors] = React.useState<Vendor[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  const [sortBy, setSortBy] = React.useState<SortBy>('distance');
  const [userLocation, setUserLocation] = React.useState<UserLocation | null>(null);
  const [favorites, setFavorites] = React.useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = React.useState(true);
  const { toast } = useToast();

  React.useEffect(() => {
    const fetchVendors = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/vendors');
        if (!res.ok) throw new Error('Failed to fetch');
  const vendorsData = await res.json() as Vendor[];
  setVendors(vendorsData.map(v => ({ ...(v as any), id: String((v as any)._id || (v as any).id) } as Vendor)));
      } catch (error) {
        console.error('Error fetching vendors: ', error);
        toast({
          title: 'Error',
          description: 'Could not fetch vendors from the database.',
          variant: 'destructive',
        });
      }
      setIsLoading(false);
    };

    fetchVendors();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          toast({
            title: 'Location Error',
            description: 'Could not get your location. Distances will not be calculated.',
            variant: 'destructive',
          });
        }
      );
    }
  }, [toast]);

  React.useEffect(() => {
    let result = [...vendors];

    if (searchQuery) {
      result = result.filter((vendor) =>
        vendor.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'All') {
      result = result.filter((vendor) => vendor.categories.includes(selectedCategory));
    }

    if (userLocation) {
      result = result.map((vendor) => ({
        ...vendor,
        distance: haversineDistance(
          userLocation.lat,
          userLocation.lng,
          vendor.location.lat,
          vendor.location.lng
        ),
      }));
    }

    switch (sortBy) {
      case 'distance':
        result.sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    setFilteredVendors(result);
  }, [vendors, searchQuery, selectedCategory, sortBy, userLocation]);

  const toggleFavorite = (vendorId: string) => {
    setFavorites((prev) => {
      const newFavs = new Set(prev);
      if (newFavs.has(vendorId)) {
        newFavs.delete(vendorId);
      } else {
        newFavs.add(vendorId);
      }
      return newFavs;
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary-foreground bg-primary py-2 rounded-lg shadow-md">
              Discover Local Gems
            </h1>
            <p className="text-muted-foreground mt-3 text-lg">
              Find the best vendors and shops near you.
            </p>
          </div>

          <div className="bg-card p-4 rounded-lg shadow-sm border mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search vendors..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Categories</SelectItem>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortBy)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="distance" disabled={!userLocation}>
                    Distance
                  </SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Tabs defaultValue="list" className="w-full lg:hidden">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="list"><List className="mr-2 h-4 w-4"/>List View</TabsTrigger>
              <TabsTrigger value="map"><Map className="mr-2 h-4 w-4"/>Map View</TabsTrigger>
            </TabsList>
            <TabsContent value="list">
              <VendorListView isLoading={isLoading} vendors={filteredVendors} favorites={favorites} toggleFavorite={toggleFavorite} />
            </TabsContent>
            <TabsContent value="map">
               <div className="h-[60vh] rounded-lg overflow-hidden mt-4">
                  <MapView vendors={filteredVendors} userLocation={userLocation} />
               </div>
            </TabsContent>
          </Tabs>

          <div className="hidden lg:grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 xl:col-span-4">
              <VendorListView isLoading={isLoading} vendors={filteredVendors} favorites={favorites} toggleFavorite={toggleFavorite} />
            </div>
            <div className="lg:col-span-7 xl:col-span-8">
              <div className="sticky top-24">
                <div className="h-[calc(100vh-8rem)] rounded-lg overflow-hidden shadow-lg border">
                  <MapView vendors={filteredVendors} userLocation={userLocation} />
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

function VendorListView({ isLoading, vendors, favorites, toggleFavorite }: { isLoading: boolean; vendors: Vendor[]; favorites: Set<string>; toggleFavorite: (id: string) => void; }) {
  if (isLoading) {
    return (
      <ScrollArea className="h-[calc(100vh-8rem)]">
        <div className="space-y-4 pr-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="rounded-lg border bg-card p-4 space-y-3">
              <Skeleton className="h-40 w-full rounded-md" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex justify-between">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    );
  }

  if (vendors.length === 0) {
    return <div className="text-center py-10 text-muted-foreground">No vendors found. Try adjusting your search.</div>;
  }
  
  return (
    <ScrollArea className="h-[calc(100vh-8rem)]">
      <div className="space-y-4 pr-4">
        {vendors.map((vendor) => (
          <VendorCard
            key={vendor.id}
            vendor={vendor}
            isFavorite={favorites.has(vendor.id)}
            onToggleFavorite={toggleFavorite}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
