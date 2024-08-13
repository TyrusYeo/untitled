import { createContext, useContext, useState, useEffect } from 'react'

const GeolocationContext = createContext()

export function GeolocationProvider({ children }) {
  const [location, setLocation] = useState(null)

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          })
        },
        (error) => {
          console.error("Error getting location:", error)
        }
      )
    } else {
      console.log("Geolocation is not available")
    }
  }, [])

  return (
    <GeolocationContext.Provider value={{ location }}>
      {children}
    </GeolocationContext.Provider>
  )
}

export function useGeolocation() {
  return useContext(GeolocationContext)
}