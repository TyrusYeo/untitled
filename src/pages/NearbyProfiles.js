import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/utils/supabaseClient';
import './NearbyProfiles.css'

export default function NearbyProfiles({ latitude, longitude }) {
  const [profiles, setProfiles] = useState([]);

  const fetchProfiles = async () => {
    const { data, error } = await supabase
      .rpc('user_location', { 
        user_lat: latitude, 
        user_lon: longitude, 
        radius: 0.5 
      });
    if (error) console.error('Error fetching profiles:', error);
    else setProfiles(data);
  };
  console.log("profiles", profiles)
  useEffect(() => {
    // fetchProfiles();
    setProfiles([
      {
        id: "1",
        name: "Tyrus"
      },
      {
        id: "2",
        name: "jayce"
      },
    ])
    // const subscription = supabase
    //   .from('profiles')
    //   .on('*', (payload) => {
    //     // Update profiles based on the real-time event
    //     setProfiles(currentProfiles => {
    //       const index = currentProfiles.findIndex(p => p.id === payload.new.id);
    //       if (index !== -1) {
    //         return [
    //           ...currentProfiles.slice(0, index),
    //           payload.new,
    //           ...currentProfiles.slice(index + 1)
    //         ];
    //       }
    //       return [...currentProfiles, payload.new];
    //     });
    //   })
    //   .subscribe();

    // return () => {
    //   supabase.removeSubscription(subscription);
    // };
  }, [latitude, longitude]);

  return (
    <div className="main">
      <ul className="profile-list">
        {profiles.map(profile => (
          <li key={profile.id} className="profile-item">
            <Link href={`/profile/${profile.id}`}>
              <div>{profile.name}</div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}