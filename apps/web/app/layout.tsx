import type { Metadata } from 'next'
import './globals.css'
import { MotionProvider } from '@/lib/motion/provider'
import { CommandPalette } from '@/components/CommandPalette'

export const metadata: Metadata = {
  title: 'LensQA — Frontend Quality Cloud',
  description: 'Visual, accessibility, performance, and runtime QA that protects checkout revenue.',
  authors: [{ name: 'KhyFee', url: 'https://github.com/KhyFee' }],
  creator: 'KhyFee',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" data-motion="on">
      <body>
        <MotionProvider>
          {children}
          <footer className="creator-credit">
            LensQA by <a href="https://github.com/KhyFee">KhyFee</a>
          </footer>
          <CommandPalette />
        </MotionProvider>
      </body>
    </html>
  )
}
