import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'COVID-19 Detection',
  description: 'Upload X-ray images to detect COVID-19',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

