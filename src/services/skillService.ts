import { supabase } from '@/lib/supabase';

export interface TeachableSkill {
  id: string; // user_skills id
  skill_id: string;
  skill_name: string;
  skill_category: string;
  teacher_id: string;
  teacher_name: string;
  teacher_department: string;
  proficiency_level: number;
  teacher_bio?: string; // Optional: if you want to show teacher's bio
}

// Fetches all skills that users are offering to teach
export const getTeachableSkills = async (): Promise<TeachableSkill[]> => {
  const { data, error } = await supabase
    .from('user_skills')
    .select(`
      id,
      skill_id,
      proficiency_level,
      skills (
        name,
        category
      ),
      users (
        id,
        full_name,
        department,
        bio
      )
    `)
    .not('users', 'is', null) // Ensure the teacher profile exists
    .not('skills', 'is', null); // Ensure the skill profile exists

  if (error) {
    console.error('Error fetching teachable skills:', error);
    throw error;
  }

  // Transform data to the TeachableSkill structure
  return data?.map(item => ({
    id: item.id,
    skill_id: item.skill_id,
    skill_name: (item.skills as any)?.name || 'Unknown Skill',
    skill_category: (item.skills as any)?.category || 'Unknown Category',
    teacher_id: (item.users as any)?.id,
    teacher_name: (item.users as any)?.full_name || 'Unknown Teacher',
    teacher_department: (item.users as any)?.department || 'Unknown Department',
    teacher_bio: (item.users as any)?.bio,
    proficiency_level: item.proficiency_level,
  })) || [];
};

// Fetches distinct categories for filtering
export const getSkillCategories = async (): Promise<string[]> => {
    const { data, error } = await supabase
        .from('skills')
        .select('category', { count: 'exact', head: false });

    if (error) {
        console.error('Error fetching skill categories:', error);
        throw error;
    }
    // Use a Set to get unique categories
    const uniqueCategories = new Set(data?.map(item => item.category) || []);
    return Array.from(uniqueCategories);
};

// Fetches distinct departments for filtering
export const getTeacherDepartments = async (): Promise<string[]> => {
    const { data, error } = await supabase
        .from('users')
        .select('department', { count: 'exact', head: false });
    
    if (error) {
        console.error('Error fetching teacher departments:', error);
        throw error;
    }
    const uniqueDepartments = new Set(data?.map(item => item.department) || []);
    return Array.from(uniqueDepartments);
};