import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Your AI Risk Assessment Results',
  robots: { index: false, follow: false },
};

export default function ThankYouLayout({ children }: { children: React.ReactNode }) {
  return children;
}
