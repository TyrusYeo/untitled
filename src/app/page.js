'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useGeolocation } from '@/context/GeolocationContext'
import NearbyProfiles from '@/pages/NearbyProfiles'
import LoginPage from '@/pages/LoginPage'

export default function Home() {
  const { user } = useAuth()
  const { location } = useGeolocation()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // if (user !== undefined && location !== null) {
    //   setIsLoading(false)
    // }
    if (location !== null) {
      setIsLoading(false)
    }
  }, [user, location])

  if (isLoading) {
    return <div>Loading...</div>
  }

  // if (!user) {
  //   return (
  //     <div className="max-w-md mx-auto">
  //       <h1 className="text-3xl font-bold mb-6">Welcome to Nearby Connect</h1>
  //       <LoginPage />
  //     </div>
  //   )
  // }
  // console.log("location", location)
  return (
      <div className="main">
      <h2>Say hi!</h2>
      {location ? (
        <NearbyProfiles latitude={location.latitude} longitude={location.longitude} />
      ) : (
        <p>Unable to get your location. Please enable location services.</p>
      )}
    </div>
  )
}