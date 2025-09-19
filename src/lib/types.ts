export type Vendor = {
    id: string;
    name: string;
    description: string;
    image: string;
    categories: string[];
    rating: number;
    reviews: number;
    location: {
      lat: number;
      lng: number;
    };
    address: string;
    phone: string;
    hours: string;
    distance?: number;
};

export type User = {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'vendor' | 'admin';
    joinedDate: string;
};
