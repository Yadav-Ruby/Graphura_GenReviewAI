import type { Review, RestaurantSummary, ActivityItem } from '@/types'

export const monthlyTrend = [
  { month: 'Jan', reviews: 1240, positive: 860 },
  { month: 'Feb', reviews: 1380, positive: 960 },
  { month: 'Mar', reviews: 1510, positive: 1040 },
  { month: 'Apr', reviews: 1690, positive: 1180 },
  { month: 'May', reviews: 1820, positive: 1310 },
  { month: 'Jun', reviews: 2040, positive: 1490 },
  { month: 'Jul', reviews: 2260, positive: 1660 },
]

export const sentimentDistribution = [
  { name: 'Positive', value: 6840, color: '#22C55E' },
  { name: 'Neutral', value: 1920, color: '#F59E0B' },
  { name: 'Negative', value: 980, color: '#EF4444' },
]

export const ratingDistribution = [
  { rating: '1★', count: 210 },
  { rating: '2★', count: 340 },
  { rating: '3★', count: 890 },
  { rating: '4★', count: 2480 },
  { rating: '5★', count: 3820 },
]

export const platformDistribution = [
  { name: 'Google', value: 3620, color: '#4F46E5' },
  { name: 'Zomato', value: 2480, color: '#8B5CF6' },
  { name: 'Yelp', value: 1540, color: '#22C55E' },
  { name: 'Swiggy', value: 980, color: '#F59E0B' },
  { name: 'TripAdvisor', value: 720, color: '#EF4444' },
]

export const cityDistribution = [
  { city: 'Mumbai', count: 2140 },
  { city: 'Delhi', count: 1980 },
  { city: 'Bengaluru', count: 1720 },
  { city: 'Hyderabad', count: 1260 },
  { city: 'Pune', count: 940 },
  { city: 'Chennai', count: 800 },
]

export const recentReviews: Review[] = [
  { id: 'RV-1042', restaurant: 'Spice Route', platform: 'Zomato', rating: 5, sentiment: 'positive', date: '2026-07-06', status: 'processed', excerpt: 'Best butter chicken in the city, service was fast and friendly.', keywords: ['service', 'butter chicken', 'fast'] },
  { id: 'RV-1041', restaurant: 'Coastal Kitchen', platform: 'Google', rating: 2, sentiment: 'negative', date: '2026-07-06', status: 'flagged', excerpt: 'Waited 40 minutes and the fish was cold when it arrived.', keywords: ['wait time', 'cold food'] },
  { id: 'RV-1040', restaurant: 'Urban Tandoor', platform: 'Yelp', rating: 4, sentiment: 'positive', date: '2026-07-05', status: 'processed', excerpt: 'Great ambience, slightly pricey but worth it for date night.', keywords: ['ambience', 'pricey'] },
  { id: 'RV-1039', restaurant: 'Green Bowl Cafe', platform: 'Swiggy', rating: 3, sentiment: 'neutral', date: '2026-07-05', status: 'processed', excerpt: 'Food was okay, nothing special but delivery was on time.', keywords: ['delivery', 'average'] },
  { id: 'RV-1038', restaurant: 'Nawabi Handi', platform: 'TripAdvisor', rating: 1, sentiment: 'negative', date: '2026-07-04', status: 'flagged', excerpt: 'Found a hair in the biryani, extremely disappointed.', keywords: ['hygiene', 'biryani'] },
  { id: 'RV-1037', restaurant: 'Spice Route', platform: 'Google', rating: 5, sentiment: 'positive', date: '2026-07-04', status: 'pending', excerpt: 'Consistently excellent, this is our third visit this month.', keywords: ['consistency', 'repeat visit'] },
  { id: 'RV-1036', restaurant: 'The Grill House', platform: 'Zomato', rating: 4, sentiment: 'positive', date: '2026-07-03', status: 'processed', excerpt: 'Steak was cooked perfectly, staff recommended a great pairing.', keywords: ['steak', 'staff recommendation'] },
  { id: 'RV-1035', restaurant: 'Coastal Kitchen', platform: 'Yelp', rating: 3, sentiment: 'neutral', date: '2026-07-03', status: 'processed', excerpt: 'Decent seafood platter, portion size could be bigger.', keywords: ['portion size', 'seafood'] },
]

export const topRestaurants: RestaurantSummary[] = [
  { id: 'R1', name: 'Spice Route', rating: 4.8, reviewCount: 2140, positivePct: 92, trend: 6.4, city: 'Mumbai' },
  { id: 'R2', name: 'Urban Tandoor', rating: 4.6, reviewCount: 1860, positivePct: 88, trend: 4.1, city: 'Delhi' },
  { id: 'R3', name: 'The Grill House', rating: 4.5, reviewCount: 1520, positivePct: 85, trend: 2.8, city: 'Bengaluru' },
  { id: 'R4', name: 'Green Bowl Cafe', rating: 4.3, reviewCount: 980, positivePct: 79, trend: -1.2, city: 'Pune' },
  { id: 'R5', name: 'Coastal Kitchen', rating: 3.9, reviewCount: 1140, positivePct: 61, trend: -4.5, city: 'Chennai' },
]

export const recentActivity: ActivityItem[] = [
  { id: 'A1', type: 'reviews', title: '184 new reviews ingested from Zomato', timestamp: '12 minutes ago' },
  { id: 'A2', type: 'analysis', title: 'Sentiment analysis completed for "Coastal Kitchen"', timestamp: '48 minutes ago' },
  { id: 'A3', type: 'report', title: 'Weekly intelligence report generated', timestamp: '2 hours ago' },
  { id: 'A4', type: 'upload', title: 'Dataset "mumbai_q3_reviews.csv" uploaded', timestamp: '5 hours ago' },
  { id: 'A5', type: 'model', title: 'Sentiment model updated to v4.2.1', timestamp: 'Yesterday' },
]

export const topKeywords = [
  { word: 'service', weight: 92 },
  { word: 'ambience', weight: 78 },
  { word: 'delivery time', weight: 71 },
  { word: 'value for money', weight: 65 },
  { word: 'hygiene', weight: 54 },
  { word: 'portion size', weight: 48 },
  { word: 'staff', weight: 44 },
  { word: 'wait time', weight: 39 },
]
