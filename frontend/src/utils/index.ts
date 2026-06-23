import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getMenuItemPlaceholder(title: string, category?: string) {
  const safeTitle = title.replace(/&/g, '&amp;').slice(0, 22);
  const safeCategory = (category || 'Fresh kitchen').replace(/&/g, '&amp;').slice(0, 20);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fff3eb"/>
          <stop offset="55%" stop-color="#ffd8b3"/>
          <stop offset="100%" stop-color="#d8ebe5"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="900" rx="56" fill="url(#bg)"/>
      <circle cx="970" cy="180" r="140" fill="#2f6b5f" opacity="0.18"/>
      <circle cx="220" cy="720" r="180" fill="#d9652a" opacity="0.15"/>
      <g transform="translate(120 160)">
        <rect width="360" height="360" rx="180" fill="#ffffff" opacity="0.82"/>
        <circle cx="180" cy="180" r="118" fill="#d9652a"/>
        <circle cx="180" cy="180" r="82" fill="#fff8ef"/>
        <circle cx="132" cy="150" r="18" fill="#2f6b5f"/>
        <circle cx="228" cy="220" r="18" fill="#2f6b5f"/>
        <circle cx="226" cy="126" r="14" fill="#9a3f1c"/>
        <circle cx="146" cy="244" r="14" fill="#9a3f1c"/>
      </g>
      <text x="120" y="640" fill="#221d1a" font-family="Outfit, Arial, sans-serif" font-size="84" font-weight="800">${safeTitle}</text>
      <text x="120" y="720" fill="#6b5f51" font-family="Outfit, Arial, sans-serif" font-size="34" font-weight="600" letter-spacing="4">${safeCategory.toUpperCase()}</text>
    </svg>
  `.trim();

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}
