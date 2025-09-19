import Image from 'next/image';
import { Heart, MapPin, Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Vendor } from '@/lib/types';

type VendorCardProps = {
  vendor: Vendor;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
};

export function VendorCard({ vendor, isFavorite, onToggleFavorite }: VendorCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="p-0 relative">
        <Image
          src={vendor.image}
          alt={`Photo of ${vendor.name}`}
          width={400}
          height={200}
          data-ai-hint="business storefront"
          className="w-full h-40 object-cover"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-black/30 hover:bg-black/50 text-white rounded-full"
          onClick={() => onToggleFavorite(vendor.id)}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={cn('h-5 w-5', isFavorite ? 'fill-red-500 text-red-500' : 'text-white')} />
        </Button>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-headline mb-1">{vendor.name}</CardTitle>
          <div className="flex items-center gap-1 text-sm font-semibold text-amber-500 shrink-0">
            <Star className="h-4 w-4 fill-current" />
            <span>{vendor.rating.toFixed(1)}</span>
          </div>
        </div>
        <CardDescription className="line-clamp-2">{vendor.description}</CardDescription>
        <div className="flex flex-wrap gap-2 mt-3">
          {vendor.categories.map((category) => (
            <Badge key={category} variant="secondary">
              {category}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <MapPin className="h-4 w-4" />
          <span>{vendor.address.split(',')[0]}</span>
        </div>
        {vendor.distance !== undefined && (
          <span className="font-semibold">{vendor.distance.toFixed(1)} km away</span>
        )}
      </CardFooter>
    </Card>
  );
}
