import { useColorScheme } from 'react-native';

const light = {
  background: '#F4F7F2',
  surface: '#FFFFFF',
  surfaceMuted: '#E7EFE6',
  text: '#16231B',
  textMuted: '#5D6E63',
  border: '#D6E2D7',
  primary: '#007549',
  primaryText: '#FFFFFF',
  star: '#E0A100',
  danger: '#B3261E',
};

export type Palette = typeof light;

const dark: Palette = {
  background: '#0F1A14',
  surface: '#172620',
  surfaceMuted: '#20332A',
  text: '#E6EFE8',
  textMuted: '#9DB2A4',
  border: '#2A4035',
  primary: '#3DBF86',
  primaryText: '#06140D',
  star: '#F2B937',
  danger: '#F2B8B5',
};

export function usePalette(): Palette {
  return useColorScheme() === 'dark' ? dark : light;
}

export const radius = { sm: 8, md: 14, lg: 20 };
export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 };

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatRating(rating: number | null): string {
  return (rating ?? 0).toLocaleString('fr-FR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}
