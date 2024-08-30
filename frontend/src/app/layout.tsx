import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'
import Logo from '../../public/miss_khalifa_ai.png'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Miss Khalifa AI | Breaking Barriers, Building Confidence',
  description:
    'Empower yourself with Miss Khalifa AI, your trusted companion for sexual health education and advice. Get accurate, judgment-free information tailored to your needs.',
  authors: [{ name: 'Pink Panthers' }],
  keywords: [
    'AI',
    'Sexual Health',
    'Education',
    'Confidential Advice',
    'STI Awareness',
  ],
  openGraph: {
    title: 'Miss Khalifa AI | Your Sexual Health Companion',
    description:
      'Get confidential, accurate sexual health information and advice from Miss Khalifa AI.',
    url: 'https://misskhalifa.com',
    siteName: 'Miss Khalifa AI',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://misskhalifa.com/public/miss_khalifa_ai.png',
        width: 1200,
        height: 630,
        alt: 'Miss Khalifa AI - Sexual Health Education Chatbot',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Miss Khalifa AI | Breaking Barriers in Sexual Health Education',
    description:
      'Empowering conversations about sexual health with AI-driven, confidential advice.',
    images: ['https://misskhalifa.com/miss_khalifa_ai.png'],
  },
  icons: {
    icon: '/miss_khalifa_ai.png',
    apple: '/miss_khalifa_ai.png',
  },
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
      <Toaster />
    </html>
  )
}
