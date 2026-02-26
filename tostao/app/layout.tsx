import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Tostão — Educação Financeira',
  description: 'Aprende finanças de forma simples e gamificada.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <body>{children}</body>
    </html>
  )
}
