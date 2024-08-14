'use client'; // Add this if you're using the App Router

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import BioPage from '@/components/BioPage';
import PageTransition from '@/gsap-styling/PageTransition';
import './id.css';

const hardcodedProfiles = [
  {
    id: "1",
    uuid: "0a9cbbb9-7c64-4e97-ae31-86e9f7178437",
    name: "Tyrus",
    bio: "Welcome to my multiplayer game ;)",
    avatar_url: "https://example.com/jack.jpg",
    drawing: null
  },
  {
    id: "2",
    uuid: "f1496acf-50d8-4d85-a909-3cdb0edadb69",
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

  if (!profile) return <div className='main'>Loading...</div>;

  return (
    <PageTransition>
      <BioPage profile={profile} />
    </PageTransition>
  );
}