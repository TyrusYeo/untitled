import { supabase } from './supabaseClient';

export async function uploadFile(bucket, path, file) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file);

  if (error) {
    console.error('Error uploading file:', error);
    return null;
  }

  return data.path;
}

export async function getFileUrl(bucket, path) {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}