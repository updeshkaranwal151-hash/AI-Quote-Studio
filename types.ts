export const CATEGORIES = ['Motivation', 'Life', 'Humor', 'Success', 'Philosophy', 'Art'];

export interface User {
  id: string;
  name: string;
  avatar: string; 
  bio?: string;
  createdAt: number;
}

export interface QuoteContent {
  id: string;
  imageUrl: string;
  audioUrl?: string;
  quoteText: string;
  category: string;
  likes: number;
  authorId: string;
  createdAt: number;
}

export interface Comment {
  id: string;
  authorId: string;
  text: string;
  createdAt: number;
}