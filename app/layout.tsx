import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ecoponto FAECO - Totem de Coleta de Óleo',
  description: 'Sistema de coleta de óleo usado com programa de fidelidade',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className="kiosk-mode">{children}</body>
    </html>
  )
}


