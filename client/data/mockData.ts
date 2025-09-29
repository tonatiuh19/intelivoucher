// Test data for populating the Redux store
// This simulates data that would come from an API

export interface ZoneOption {
  id: string;
  name: string;
  price: number;
  description?: string;
  available: boolean;
}

export interface TripEvent {
  id: number;
  title: string;
  category: string;
  date: string;
  location: string;
  price: string;
  image: string;
  rating: number;
  soldOut: boolean;
  trending: boolean;
  includesTransportation: boolean;
  isPresale: boolean;
  requiresTicketAcquisition: boolean;
  refundableIfNoTicket: boolean;
  paymentOptions: {
    installmentsAvailable: boolean;
    presaleDepositAvailable: boolean;
    secondPaymentInstallmentsAvailable: boolean;
  };
  gifts: string[];
  acceptsUnderAge: boolean;
  jerseyAddonAvailable?: boolean;
  jerseyPrice?: number;
  availableZones: ZoneOption[];
}

export const mockEventsData: TripEvent[] = [
  {
    id: 1,
    title: "Coldplay World Tour 2024",
    category: "Concert",
    date: "Dec 15, 2024",
    location: "Madison Square Garden",
    price: "From $89",
    image:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    rating: 4.8,
    soldOut: false,
    trending: true,
    includesTransportation: false,
    isPresale: false,
    requiresTicketAcquisition: true,
    refundableIfNoTicket: true,
    paymentOptions: {
      installmentsAvailable: true,
      presaleDepositAvailable: false,
      secondPaymentInstallmentsAvailable: true,
    },
    gifts: ["Band T-shirt", "Signed poster", "VIP lanyard"],
    acceptsUnderAge: true,
    availableZones: [
      {
        id: "vip",
        name: "VIP Experience",
        price: 599,
        description: "Meet & greet, premium seating, exclusive merchandise",
        available: true,
      },
      {
        id: "lower-bowl",
        name: "Lower Bowl",
        price: 299,
        description: "Close to stage with great view",
        available: true,
      },
      {
        id: "upper-deck",
        name: "Upper Deck",
        price: 149,
        description: "Elevated view of the entire venue",
        available: true,
      },
      {
        id: "general",
        name: "General Admission",
        price: 89,
        description: "Standing room near stage",
        available: false,
      },
    ],
  },
  {
    id: 2,
    title: "Lakers vs Warriors Courtside Experience",
    category: "NBA Experience",
    date: "Dec 20, 2024",
    location: "Crypto.com Arena",
    price: "From $499",
    image:
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    rating: 4.9,
    soldOut: false,
    trending: false,
    includesTransportation: false,
    isPresale: false,
    requiresTicketAcquisition: true,
    refundableIfNoTicket: true,
    paymentOptions: {
      installmentsAvailable: true,
      presaleDepositAvailable: false,
      secondPaymentInstallmentsAvailable: true,
    },
    gifts: ["Team jersey", "Signed ball", "Court side meal voucher"],
    acceptsUnderAge: true,
    availableZones: [
      {
        id: "courtside",
        name: "Courtside",
        price: 2499,
        description: "Premium courtside seats with player interaction",
        available: true,
      },
      {
        id: "floor-seats",
        name: "Floor Seats",
        price: 999,
        description: "Floor level seating near the action",
        available: true,
      },
      {
        id: "club-level",
        name: "Club Level",
        price: 699,
        description: "Club access with premium amenities",
        available: true,
      },
      {
        id: "upper-level",
        name: "Upper Level",
        price: 499,
        description: "Great view from upper deck",
        available: true,
      },
    ],
  },
  {
    id: 3,
    title: "NYC Marathon 2024 Travel Package",
    category: "Marathon",
    date: "Nov 3, 2024",
    location: "New York City",
    price: "From $299",
    image:
      "https://images.unsplash.com/photo-1544017164-275ecebce31c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    rating: 4.7,
    soldOut: false,
    trending: true,
    includesTransportation: true,
    isPresale: false,
    requiresTicketAcquisition: false,
    refundableIfNoTicket: false,
    paymentOptions: {
      installmentsAvailable: true,
      presaleDepositAvailable: false,
      secondPaymentInstallmentsAvailable: true,
    },
    gifts: ["Running gear", "Medal display", "NYC guidebook"],
    acceptsUnderAge: true,
    availableZones: [
      {
        id: "premium-package",
        name: "Premium Package",
        price: 799,
        description: "4-star hotel, VIP start corral, post-race celebration",
        available: true,
      },
      {
        id: "standard-package",
        name: "Standard Package",
        price: 499,
        description: "3-star hotel, guaranteed entry, race kit",
        available: true,
      },
      {
        id: "basic-package",
        name: "Basic Package",
        price: 299,
        description: "Budget accommodation, race entry, basic support",
        available: true,
      },
      {
        id: "spectator-package",
        name: "Spectator Package",
        price: 199,
        description: "Accommodation and viewing areas for supporters",
        available: true,
      },
    ],
  },
  {
    id: 4,
    title: "El Clásico Match + Stadium Tour",
    category: "Soccer Experience",
    date: "Mar 15, 2025",
    location: "Madrid & Barcelona",
    price: "From $699",
    image:
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    rating: 4.9,
    soldOut: false,
    trending: true,
    includesTransportation: true,
    isPresale: true,
    requiresTicketAcquisition: true,
    refundableIfNoTicket: true,
    paymentOptions: {
      installmentsAvailable: true,
      presaleDepositAvailable: true,
      secondPaymentInstallmentsAvailable: true,
    },
    gifts: ["Team scarf", "Match program", "Stadium tour"],
    acceptsUnderAge: true,
    jerseyAddonAvailable: true,
    jerseyPrice: 120,
    availableZones: [
      {
        id: "vip-box",
        name: "VIP Box",
        price: 1899,
        description: "Private box with catering and premium view",
        available: true,
      },
      {
        id: "premium-seats",
        name: "Premium Seats",
        price: 1299,
        description: "Best seats with hospitality package",
        available: true,
      },
      {
        id: "grandstand",
        name: "Grandstand",
        price: 899,
        description: "Covered seating with great stadium view",
        available: true,
      },
      {
        id: "general-admission",
        name: "General Admission",
        price: 699,
        description: "Standing areas with authentic atmosphere",
        available: true,
      },
    ],
  },
  {
    id: 5,
    title: "Green Bay Packers Game + Lambeau Tour",
    category: "NFL Experience",
    date: "Jan 12, 2025",
    location: "Lambeau Field",
    price: "From $349",
    image:
      "https://images.unsplash.com/photo-1566577134770-3d85bb3a9cc4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    rating: 4.6,
    soldOut: false,
    trending: false,
    includesTransportation: true,
    isPresale: false,
    requiresTicketAcquisition: true,
    refundableIfNoTicket: true,
    paymentOptions: {
      installmentsAvailable: true,
      presaleDepositAvailable: false,
      secondPaymentInstallmentsAvailable: false,
    },
    gifts: ["Team hat", "Stadium blanket", "Cheese curds voucher"],
    acceptsUnderAge: true,
    availableZones: [
      {
        id: "club-level",
        name: "Club Level",
        price: 799,
        description: "Indoor/outdoor seating with premium amenities",
        available: true,
      },
      {
        id: "lower-bowl",
        name: "Lower Bowl",
        price: 549,
        description: "Close to field action with heated concourse",
        available: true,
      },
      {
        id: "upper-deck",
        name: "Upper Deck",
        price: 399,
        description: "Great stadium view with Lambeau atmosphere",
        available: true,
      },
      {
        id: "frozen-tundra",
        name: "Frozen Tundra",
        price: 349,
        description: "Authentic outdoor Lambeau experience",
        available: true,
      },
    ],
  },
  {
    id: 6,
    title: "NHL Winter Classic VIP Experience",
    category: "NHL Experience",
    date: "Jan 1, 2025",
    location: "TBD",
    price: "From $599",
    image:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    rating: 4.5,
    soldOut: false,
    trending: false,
    includesTransportation: false,
    isPresale: true,
    requiresTicketAcquisition: true,
    refundableIfNoTicket: true,
    paymentOptions: {
      installmentsAvailable: true,
      presaleDepositAvailable: true,
      secondPaymentInstallmentsAvailable: false,
    },
    gifts: ["Winter hat", "Hot chocolate voucher", "Team puck"],
    acceptsUnderAge: true,
    availableZones: [
      {
        id: "glass-seats",
        name: "Glass Seats",
        price: 1299,
        description: "Right against the glass with premium amenities",
        available: true,
      },
      {
        id: "club-seats",
        name: "Club Seats",
        price: 899,
        description: "Indoor/outdoor access with catering",
        available: true,
      },
      {
        id: "lower-bowl",
        name: "Lower Bowl",
        price: 699,
        description: "Close to ice level in outdoor stadium",
        available: true,
      },
      {
        id: "upper-level",
        name: "Upper Level",
        price: 599,
        description: "Great view of outdoor winter hockey",
        available: true,
      },
    ],
  },
  {
    id: 7,
    title: "Hamilton Musical",
    category: "Theater",
    date: "Dec 18, 2024",
    location: "Richard Rodgers Theatre",
    price: "From $199",
    image:
      "https://images.unsplash.com/photo-1507924538820-ede94a04019d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    rating: 4.9,
    soldOut: true,
    trending: false,
    includesTransportation: false,
    isPresale: false,
    requiresTicketAcquisition: true,
    refundableIfNoTicket: true,
    paymentOptions: {
      installmentsAvailable: false,
      presaleDepositAvailable: false,
      secondPaymentInstallmentsAvailable: false,
    },
    gifts: ["Program book", "Cast photo", "Broadway pin"],
    acceptsUnderAge: true,
    availableZones: [
      {
        id: "orchestra-premium",
        name: "Orchestra Premium",
        price: 699,
        description: "Front center orchestra seats with best view",
        available: false,
      },
      {
        id: "orchestra",
        name: "Orchestra",
        price: 499,
        description: "Main floor seating with excellent sightlines",
        available: false,
      },
      {
        id: "mezzanine",
        name: "Mezzanine",
        price: 299,
        description: "First balcony with great elevated view",
        available: false,
      },
      {
        id: "balcony",
        name: "Balcony",
        price: 199,
        description: "Upper level affordable seating",
        available: false,
      },
    ],
  },
  ,
  {
    id: 8,
    title: "Coachella 2024",
    category: "Festival",
    date: "Dec 22, 2024",
    location: "Coachella Valley",
    price: "From $299",
    image:
      "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    rating: 4.8,
    soldOut: false,
    trending: true,
    includesTransportation: false,
    isPresale: false,
    requiresTicketAcquisition: false,
    refundableIfNoTicket: false,
    paymentOptions: {
      installmentsAvailable: true,
      presaleDepositAvailable: false,
      secondPaymentInstallmentsAvailable: true,
    },
    gifts: ["Festival wristband", "Exclusive tote bag", "Sunglasses"],
    acceptsUnderAge: false,
    availableZones: [
      {
        id: "vip-area",
        name: "VIP Area",
        price: 899,
        description:
          "Exclusive viewing areas, premium amenities, air-conditioned restrooms",
        available: true,
      },
      {
        id: "camping-plus",
        name: "Camping Plus",
        price: 599,
        description:
          "Premium camping with shuttle service and upgraded facilities",
        available: true,
      },
      {
        id: "general-camping",
        name: "General Camping",
        price: 399,
        description: "Standard camping with basic amenities",
        available: true,
      },
      {
        id: "general-admission",
        name: "General Admission",
        price: 299,
        description: "Festival access with all stages and activities",
        available: true,
      },
    ],
  },
  {
    id: 9,
    title: "Comedy Night Live",
    category: "Comedy",
    date: "Dec 28, 2024",
    location: "Comedy Cellar",
    price: "From $45",
    image:
      "https://images.unsplash.com/photo-1527224857830-43a7acc85260?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    rating: 4.4,
    soldOut: false,
    trending: true,
    includesTransportation: false,
    isPresale: false,
    requiresTicketAcquisition: false,
    refundableIfNoTicket: false,
    paymentOptions: {
      installmentsAvailable: false,
      presaleDepositAvailable: false,
      secondPaymentInstallmentsAvailable: false,
    },
    gifts: ["Comedy CD", "Drink voucher", "Meet and greet pass"],
    acceptsUnderAge: false,
    availableZones: [
      {
        id: "front-row",
        name: "Front Row",
        price: 125,
        description: "Front row seats - may be part of the show!",
        available: true,
      },
      {
        id: "premium-table",
        name: "Premium Table",
        price: 89,
        description: "Reserved table seating with waitress service",
        available: true,
      },
      {
        id: "standard-seating",
        name: "Standard Seating",
        price: 65,
        description: "General seating with good stage view",
        available: true,
      },
      {
        id: "bar-seating",
        name: "Bar Seating",
        price: 45,
        description: "Bar stools and standing room",
        available: true,
      },
    ],
  },
  {
    id: 10,
    title: "Beethoven Symphony",
    category: "Classical",
    date: "Dec 25, 2024",
    location: "Carnegie Hall",
    price: "From $75",
    image:
      "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    rating: 4.7,
    soldOut: false,
    trending: false,
    includesTransportation: false,
    isPresale: false,
    requiresTicketAcquisition: false,
    refundableIfNoTicket: false,
    paymentOptions: {
      installmentsAvailable: false,
      presaleDepositAvailable: false,
      secondPaymentInstallmentsAvailable: false,
    },
    gifts: ["Program booklet", "Classical music CD", "Carnegie Hall pin"],
    acceptsUnderAge: true,
    availableZones: [
      {
        id: "box-seats",
        name: "Box Seats",
        price: 299,
        description: "Private box seating with exceptional acoustics",
        available: true,
      },
      {
        id: "orchestra-level",
        name: "Orchestra Level",
        price: 199,
        description: "Main floor seating close to the orchestra",
        available: true,
      },
      {
        id: "dress-circle",
        name: "Dress Circle",
        price: 149,
        description: "First tier with excellent sightlines and acoustics",
        available: true,
      },
      {
        id: "balcony",
        name: "Balcony",
        price: 75,
        description: "Upper level affordable seating with great sound",
        available: true,
      },
    ],
  },
];

export const mockCategoriesData = [
  {
    name: "Concerts",
    icon: "🎵",
    color: "bg-gradient-to-r from-brand-blue to-brand-cyan",
    count: "2,847 events",
  },
  {
    name: "Theater",
    icon: "🎭",
    color: "bg-gradient-to-r from-brand-green to-brand-orange",
    count: "892 events",
  },
  {
    name: "Festivals",
    icon: "🎪",
    color: "bg-gradient-to-r from-brand-orange to-brand-green",
    count: "567 events",
  },
  {
    name: "Marathons",
    icon: "🏃",
    color: "bg-gradient-to-r from-brand-cyan to-brand-blue",
    count: "312 events",
  },
  {
    name: "Soccer",
    icon: "⚽",
    color: "bg-gradient-to-r from-brand-blue to-brand-cyan",
    count: "1,102 events",
  },
  {
    name: "NFL",
    icon: "🏈",
    color: "bg-gradient-to-r from-brand-green to-brand-orange",
    count: "764 events",
  },
  {
    name: "NBA",
    icon: "🏀",
    color: "bg-gradient-to-r from-brand-cyan to-brand-blue",
    count: "845 events",
  },
  {
    name: "NHL",
    icon: "🏒",
    color: "bg-gradient-to-r from-brand-blue to-brand-cyan",
    count: "523 events",
  },
];

export const mockStatsData = [
  { number: "2M+", label: "Happy Customers" },
  { number: "50K+", label: "Events Monthly" },
  { number: "500+", label: "Cities Worldwide" },
  { number: "99.9%", label: "Uptime" },
];

export const mockVenuesData = [
  { name: "Madison Square Garden", logo: "🏟️" },
  { name: "Hollywood Bowl", logo: "🎭" },
  { name: "Red Rocks", logo: "🏔️" },
  { name: "Wembley Stadium", logo: "⚽" },
  { name: "Carnegie Hall", logo: "🎼" },
  { name: "Fenway Park", logo: "⚾" },
];
