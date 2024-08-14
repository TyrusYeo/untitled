import { supabase } from './supabaseClient';

export const uploadToStorage = async (fileName, blob) => {
    try {
        const { data } = await supabase.storage
        .from('bio_canvas')
        .upload(fileName, blob, {
        cacheControl: '3600',
        upsert: true,
        });

        console.log('SVG uploaded successfully:', data);
    }
    catch (error) {
        console.error('Error uploading SVG:', error);
    }
}

export const downloadFromStorage = async (uuid) => {
    try {
        const { data } = await supabase.storage
        .from('bio_canvas')
        .download(`${uuid}.svg`);

        console.log('SVG downloaded successfully:', data);

        return data
    }
    catch (error) {
        console.error('Error downloading SVG:', error);
    }
}

export async function getFileUrl(bucket, path) {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  }