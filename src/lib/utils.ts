
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function getLanguageEmoji(language: string): string {
  const languageEmojis: Record<string, string> = {
    'hindi': '🇮🇳',
    'english': '🇬🇧',
    'sanskrit': '📜',
    'bengali': '🏵️',
    'tamil': '🌿',
    'telugu': '🪔',
    'malayalam': '🌴',
    'kannada': '🔶',
    'marathi': '🪄',
    'punjabi': '🧶',
    'tribal': '🗣️',
    'gond': '🪶',
    'bhil': '🧵',
    'santhal': '🪘',
    'oraon': '🏺',
    'munda': '🌾',
    'khasi': '🍃',
    'garo': '🏞️',
    'naga': '🗿',
    'mizo': '🌄',
    'bodo': '🌳',
  };
  
  const lowerCaseLanguage = language.toLowerCase();
  return languageEmojis[lowerCaseLanguage] || '🔤';
}

export function getContentTypeIcon(type: string): string {
  const typeIcons: Record<string, string> = {
    'story': '📖',
    'song': '🎵',
    'poem': '📝',
    'word': '🔤',
    'phrase': '💬',
    'proverb': '📜',
    'ritual': '🪔',
    'prayer': '🙏',
  };
  
  const lowerCaseType = type.toLowerCase();
  return typeIcons[lowerCaseType] || '📌';
}
