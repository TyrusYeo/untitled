'use client'; // Add this if you're using the App Router

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Bio from '@/components/BioPage';
import Canvas from '@/components/Canvas';

// Hardcoded profiles
const hardcodedProfiles = [
  {
    id: "1",
    name: "Jack",
    bio: "Hi, I'm Jack!",
    avatar_url: "https://example.com/jack.jpg",
    drawing: null
  },
  {
    id: "2",
    name: "Jayce",
    bio: "Hello, I'm Jayce!",
    avatar_url: "https://example.com/jayce.jpg",
    drawing: null
  },
];

export default function ProfilePage() {
  const router = useRouter();
  const { id } = router.query;
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (id) {
      const foundProfile = hardcodedProfiles.find(p => p.id === id);
      setProfile(foundProfile || null);
    }
  }, [id]);

  if (!profile) return <div>Loading...</div>;

  return (
      <div>
        <Bio profile={profile} />
        {/* <Canvas savedDrawing={profile.drawing} /> */}
      </div>
  );
}