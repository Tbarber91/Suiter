import { Location } from '@/lib/types';

/**
 * Service to handle external directory integrations like Yellow Pages.
 * In a production app, this would call a real scraping service (e.g. Apify) or a Business API.
 */
export const ExternalDirectoryService = {
  /**
   * Simulates fetching data from an external directory.
   * This logic can be easily swapped with a real `fetch()` call to a scraper endpoint.
   */
  async fetchDirectoryListings(query: string = 'business', location: string = 'Adelaide'): Promise<Location[]> {
    console.log(`Background Sync: Fetching Yellow Pages data for ${location}...`);
    
    // Simulate API network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Example directory structure
    const directoryResults: Location[] = [
      {
        id: 'yp-1',
        lat: -34.9212,
        lng: 138.5995,
        title: 'Adelaide Central Plumbers',
        description: 'Elite plumbing services. 24/7 emergencies. Certified by regional directory standards.',
        type: 'service',
        price: 'Quotes Available',
        rating: 4.5,
        category: 'Trades',
        externalUrl: 'https://www.yellowpages.com.au/adelaide-plumbing',
        image: 'https://picsum.photos/seed/plumbing-adelaide/800/450',
        source: 'Yellow Pages',
        phone: '(08) 8212 4455',
        hours: ['Mon-Fri: 7:00 AM - 6:00 PM', 'Sat-Sun: 24/7 (Emergency Only)'],
        reviews: [
          { id: 'r1', user: 'Mark S.', rating: 5, comment: 'Fixed my burst pipe in 20 minutes. Professional and fast.', date: '2 days ago' },
          { id: 'r2', user: 'Sarah L.', rating: 4, comment: 'Great service, slightly pricey but worth it for the reliability.', date: '1 week ago' }
        ]
      },
      {
        id: 'yp-2',
        lat: -34.9285,
        lng: 138.6007,
        title: 'Tarntanya Tech Solutions',
        description: 'High-end computer repairs and custom IT consulting. Adelaide\'s trusted tech experts.',
        type: 'service',
        price: 'Expert',
        rating: 4.2,
        category: 'IT & Tech',
        externalUrl: 'https://www.yellowpages.com.au/adelaide-tech',
        image: 'https://picsum.photos/seed/tech-adelaide/800/450',
        source: 'Yellow Pages',
        phone: '(08) 8352 1100',
        hours: ['Mon-Fri: 9:00 AM - 5:30 PM', 'Sat: 10:00 AM - 2:00 PM'],
        reviews: [
          { id: 'r3', user: 'James K.', rating: 4, comment: 'Saved my data after a crash. Highly recommended.', date: '3 days ago' }
        ]
      },
      {
        id: 'yp-3',
        lat: -34.9350,
        lng: 138.5950,
        title: 'South Aussie Designer Boutique',
        description: 'Exclusive fashion curator. One-of-a-kind pieces from local Adelaide designers.',
        type: 'shop',
        price: 'Designer',
        rating: 4.8,
        category: 'Fashion',
        externalUrl: 'https://www.yellowpages.com.au/adelaide-fashion',
        image: 'https://picsum.photos/seed/fashion-boutique/800/450',
        source: 'Yellow Pages',
        phone: '(08) 8122 3344',
        hours: ['Mon-Thu: 10:00 AM - 5:00 PM', 'Fri: 10:00 AM - 9:00 PM', 'Sat: 10:00 AM - 5:00 PM'],
        reviews: [
          { id: 'r4', user: 'Emma B.', rating: 5, comment: 'Found a stunning dress for the gala. Unique collection.', date: 'Yesterday' }
        ]
      },
      {
        id: 'yp-4',
        lat: -34.9150,
        lng: 138.6050,
        title: 'Rundle Mall Roast',
        description: 'Award-winning coffee roasters in the heart of Rundle Mall. Experience Adelaide coffee culture.',
        type: 'shop',
        price: 'Boutique',
        rating: 4.9,
        category: 'Hospitality',
        externalUrl: 'https://www.yellowpages.com.au/rundle-mall-roast',
        image: 'https://picsum.photos/seed/coffee-adelaide/800/450',
        source: 'Yellow Pages',
        phone: '(08) 8410 5566',
        hours: ['Daily: 7:00 AM - 4:00 PM'],
        reviews: [
          { id: 'r5', user: 'Liam P.', rating: 5, comment: 'Best flat white in the city. Beans are freshly roasted.', date: '4h ago' }
        ]
      },
      {
        id: 'yp-5',
        lat: -34.9240,
        lng: 138.6120,
        title: 'Adelaide Hills Spa & Wellness',
        description: 'A sanctuary of peace and luxury. Holistic treatments inspired by the South Australian landscape.',
        type: 'service',
        price: 'Premium',
        rating: 4.7,
        category: 'Wellness',
        externalUrl: 'https://www.yellowpages.com.au/adelaide-spa',
        image: 'https://picsum.photos/seed/spa-adelaide/800/450',
        source: 'Yellow Pages',
        phone: '(08) 8339 7788',
        hours: ['Tue-Sun: 10:00 AM - 7:00 PM'],
        reviews: [
          { id: 'r6', user: 'Chloe M.', rating: 5, comment: 'Incredible massage. Felt brand new after the session.', date: '2 weeks ago' }
        ]
      },
      {
        id: 'yp-6',
        lat: -34.9260,
        lng: 138.5920,
        title: 'Light Square Legal',
        description: 'Specialized legal counsel for local startups and small businesses on Kaurna Country.',
        type: 'service',
        price: 'Corporate',
        rating: 4.4,
        category: 'Professional',
        externalUrl: 'https://www.yellowpages.com.au/light-square-legal',
        image: 'https://picsum.photos/seed/legal-adelaide/800/450',
        source: 'Yellow Pages',
        phone: '(08) 8231 9900',
        hours: ['Mon-Fri: 8:30 AM - 5:30 PM'],
        reviews: [
          { id: 'r7', user: 'David W.', rating: 4, comment: 'Strategic advice that helped our seed round.', date: '1 month ago' }
        ]
      }
    ];

    return directoryResults;
  }
};
