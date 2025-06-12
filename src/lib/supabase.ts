import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database tables
export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface ConversionHistory {
  id: string;
  user_id: string;
  original_filename: string;
  converted_filename: string;
  original_format: string;
  target_format: string;
  file_size: number;
  conversion_status: 'pending' | 'processing' | 'completed' | 'failed';
  download_url?: string;
  storage_path?: string;
  error_message?: string;
  created_at: string;
  completed_at?: string;
  downloaded_at?: string;
}

export interface UserStatistics {
  id: string;
  user_id: string;
  total_conversions: number;
  total_files_converted: number;
  favorite_output_format?: string;
  created_at: string;
  updated_at: string;
}

// Auth helper functions
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

// Profile functions
export const getProfile = async (userId: string): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
  
  return data;
};

export const updateProfile = async (userId: string, updates: Partial<Profile>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId);
  
  return { data, error };
};

// Conversion history functions
export const addConversionToHistory = async (conversion: Omit<ConversionHistory, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('conversion_history')
    .insert([conversion])
    .select()
    .single();
  
  return { data, error };
};

export const updateConversionStatus = async (
  conversionId: string, 
  status: ConversionHistory['conversion_status'],
  additionalData?: Partial<ConversionHistory>
) => {
  const updateData = {
    conversion_status: status,
    ...additionalData,
    ...(status === 'completed' && { completed_at: new Date().toISOString() })
  };

  const { data, error } = await supabase
    .from('conversion_history')
    .update(updateData)
    .eq('id', conversionId)
    .select()
    .single();
  
  return { data, error };
};

export const getUserConversions = async (userId: string, limit = 50) => {
  const { data, error } = await supabase
    .from('conversion_history')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  
  return { data, error };
};

export const deleteConversion = async (conversionId: string) => {
  const { data, error } = await supabase
    .from('conversion_history')
    .delete()
    .eq('id', conversionId);
  
  return { data, error };
};

// User statistics functions
export const getUserStatistics = async (userId: string): Promise<UserStatistics | null> => {
  const { data, error } = await supabase
    .from('user_statistics')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error) {
    console.error('Error fetching user statistics:', error);
    return null;
  }
  
  return data;
};

// File storage functions
export const uploadConvertedFile = async (
  userId: string, 
  fileName: string, 
  fileBlob: Blob
): Promise<{ path?: string; error?: any }> => {
  const filePath = `${userId}/${Date.now()}-${fileName}`;
  
  const { data, error } = await supabase.storage
    .from('converted-files')
    .upload(filePath, fileBlob, {
      contentType: fileBlob.type,
      upsert: false
    });
  
  if (error) {
    return { error };
  }
  
  return { path: data.path };
};

export const getFileDownloadUrl = async (filePath: string) => {
  const { data } = await supabase.storage
    .from('converted-files')
    .createSignedUrl(filePath, 3600); // 1 hour expiry
  
  return data?.signedUrl;
};

export const deleteFile = async (filePath: string) => {
  const { data, error } = await supabase.storage
    .from('converted-files')
    .remove([filePath]);
  
  return { data, error };
};

// Real-time subscriptions
export const subscribeToUserConversions = (userId: string, callback: (payload: any) => void) => {
  return supabase
    .channel(`user-conversions-${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'conversion_history',
        filter: `user_id=eq.${userId}`
      },
      callback
    )
    .subscribe();
};