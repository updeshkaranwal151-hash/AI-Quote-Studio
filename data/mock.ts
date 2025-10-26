import { QuoteContent, User } from '../types';

export const MOCK_USERS: Record<string, User> = {
  'user-ai': { id: 'user-ai', name: 'AI Artisan', avatar: `https://api.dicebear.com/8.x/bottts/svg?seed=aiartisan` },
  'user-0': { id: 'user-0', name: 'Guest', avatar: `https://api.dicebear.com/8.x/bottts/svg?seed=guest` },
};

export const INITIAL_QUOTES: QuoteContent[] = [];