import type { Metadata } from 'next';
import Deck from './Deck';

export const metadata: Metadata = {
  title: 'Hey Otis · Pitch',
  robots: { index: false, follow: false },
};

export default function PitchPage() {
  return <Deck />;
}
