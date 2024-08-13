import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import Biography from '@/components/Biography';
import DrawingCanvas from '@/components/DrawingCanvas';

export default function ProfilePage() {
  const router = useRouter();
  const { id } = router.query;
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (id) {
      fetchProfile();
    }
  }, [id]);

  async function fetchProfile() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
    } else {
      setProfile(data);
    }
  }

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="profile-page">
      <img src={profile.avatar_url} alt="Profile" className="profile-picture" />
      <Biography bio={profile.bio} />
      <DrawingCanvas savedDrawing={profile.drawing} />
    </div>
  );
}