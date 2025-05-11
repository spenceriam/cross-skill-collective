import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

export interface Profile {
  id: string; // This is the public.users table ID (UUID)
  auth_id: string; // This is the auth.users table ID (UUID)
  full_name: string;
  email: string;
  department: string;
  bio?: string;
  created_at: string;
}

export interface UserSkill {
  id: string;
  user_id: string;
  skill_id: string;
  proficiency_level: number;
  skills: { // Assuming you want to fetch skill name and category
    name: string;
    category: string;
  };
}

// Get the current Supabase authenticated user
export const getCurrentSupabaseUser = async (): Promise<User | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Get user profile from public.users table based on auth_id
export const getProfile = async (authId: string): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('auth_id', authId)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
  return data;
};

// Update user profile
export const updateProfile = async (authId: string, updates: Partial<Profile>): Promise<Profile | null> => {
  // Ensure email and auth_id are not part of the update payload for public.users
  const { email, auth_id, id, created_at, ...validUpdates } = updates as any;
  
  const { data, error } = await supabase
    .from('users')
    .update(validUpdates)
    .eq('auth_id', authId)
    .select()
    .single();

  if (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
  return data;
};

// Get user's teachable skills
export const getUserSkills = async (userId: string): Promise<UserSkill[]> => {
  const { data, error } = await supabase
    .from('user_skills')
    .select(`
      id,
      user_id,
      skill_id,
      proficiency_level,
      skills ( name, category )
    `)
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching user skills:', error);
    throw error;
  }
  return data || [];
};

// Add a skill for a user
export const addUserSkill = async (userId: string, skillId: string, proficiencyLevel: number): Promise<any> => {
  const { data, error } = await supabase
    .from('user_skills')
    .insert({ user_id: userId, skill_id: skillId, proficiency_level: proficiencyLevel })
    .select()
    .single();
  
  if (error) {
    console.error('Error adding user skill:', error);
    throw error;
  }
  return data;
};

// Remove a skill for a user
export const removeUserSkill = async (userSkillId: string): Promise<void> => {
  const { error } = await supabase
    .from('user_skills')
    .delete()
    .eq('id', userSkillId);

  if (error) {
    console.error('Error removing user skill:', error);
    throw error;
  }
};

// Fetch all available skills (for selection)
export const getAllSkills = async (): Promise<{ id: string; name: string; category: string }[]> => {
    const { data, error } = await supabase
        .from('skills')
        .select('id, name, category')
        .order('category')
        .order('name');

    if (error) {
        console.error('Error fetching all skills:', error);
        throw error;
    }
    return data || [];
};