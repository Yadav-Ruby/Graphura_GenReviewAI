export type Sentiment = 'positive' | 'neutral' | 'negative'
export type ReviewStatus = 'processed' | 'pending' | 'flagged'
export type Platform = 'Google' | 'Yelp' | 'Zomato' | 'TripAdvisor' | 'Swiggy'

export interface Review {
  id: string
  restaurant: string
  platform: Platform
  rating: number
  sentiment: Sentiment
  date: string
  status: ReviewStatus
  excerpt: string
  keywords: string[]
}

export interface RestaurantSummary {
  id: string
  name: string
  rating: number
  reviewCount: number
  positivePct: number
  trend: number
  city: string
}

export interface ActivityItem {
  id: string
  type: 'upload' | 'analysis' | 'report' | 'model' | 'reviews'
  title: string
  timestamp: string
}

export interface NavItem {
  label: string
  path: string
  icon: string
}
