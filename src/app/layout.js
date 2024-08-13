import { Inter } from 'next/font/google'
import { AuthProvider } from '@/context/AuthContext'
import { GeolocationProvider } from '@/context/GeolocationContext'
// import Header from '../components/Header'
// import Footer from '../components/Footer'
import '../styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Nearby Connect',
  description: 'Connect with people nearby',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <GeolocationProvider>
            <div className="flex flex-col min-h-screen">
              {/* <Header /> */}
              <main className="flex-grow container mx-auto px-4 py-8">
                {children}
              </main>
              {/* <Footer /> */}
            </div>
          </GeolocationProvider>
        </AuthProvider>
      </body>
    </html>
  )
}