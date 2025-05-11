import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { getCurrentSupabaseUser, getProfile, updateProfile, getUserSkills, Profile, UserSkill, getAllSkills, addUserSkill, removeUserSkill } from '@/services/profileService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Trash2, PlusCircle } from 'lucide-react';

// Placeholder for Profile Display and Form components (we'll create these properly later if needed or integrate here)

export default function ProfilePage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  // Form state for editing profile
  const [fullName, setFullName] = useState('');
  const [department, setDepartment] = useState('');
  const [bio, setBio] = useState('');

  // Form state for adding a new skill
  const [selectedSkillId, setSelectedSkillId] = useState<string>('');
  const [proficiencyLevel, setProficiencyLevel] = useState<number>(3); // Default proficiency

  const { data: authUser, isLoading: isLoadingAuthUser } = useQuery({
    queryKey: ['authUser'],
    queryFn: getCurrentSupabaseUser,
  });

  const { data: profile, isLoading: isLoadingProfile, error: profileError } = useQuery({
    queryKey: ['profile', authUser?.id],
    queryFn: () => {
      if (!authUser?.id) throw new Error('User not authenticated');
      return getProfile(authUser.id);
    },
    enabled: !!authUser?.id,
    onSuccess: (data) => {
      if (data) {
        setFullName(data.full_name);
        setDepartment(data.department);
        setBio(data.bio || '');
      }
    }
  });

  const { data: userSkills, isLoading: isLoadingUserSkills } = useQuery({
    queryKey: ['userSkills', profile?.id],
    queryFn: () => {
      if (!profile?.id) throw new Error('Profile not loaded');
      return getUserSkills(profile.id);
    },
    enabled: !!profile?.id,
  });

  const { data: allSkills, isLoading: isLoadingAllSkills } = useQuery({
    queryKey: ['allSkills'],
    queryFn: getAllSkills,
  });

  const profileUpdateMutation = useMutation({
    mutationFn: (updatedProfileData: Partial<Profile>) => {
      if (!authUser?.id) throw new Error('User not authenticated for update');
      return updateProfile(authUser.id, updatedProfileData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', authUser?.id] });
      toast({ title: "Profile Updated", description: "Your profile has been successfully updated." });
      setIsEditing(false);
    },
    onError: (error: any) => {
      toast({ variant: "destructive", title: "Update Failed", description: error.message });
    }
  });

  const addUserSkillMutation = useMutation({
    mutationFn: (params: { skillId: string; proficiency: number }) => {
        if (!profile?.id) throw new Error("Profile not loaded");
        return addUserSkill(profile.id, params.skillId, params.proficiency);
    },
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['userSkills', profile?.id] });
        toast({ title: "Skill Added", description: "New skill added to your profile." });
        setSelectedSkillId(''); // Reset selection
        setProficiencyLevel(3); // Reset proficiency
    },
    onError: (error: any) => {
        toast({ variant: "destructive", title: "Failed to Add Skill", description: error.message });
    }
  });

  const removeUserSkillMutation = useMutation({
    mutationFn: (userSkillId: string) => removeUserSkill(userSkillId),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['userSkills', profile?.id] });
        toast({ title: "Skill Removed", description: "Skill removed from your profile." });
    },
    onError: (error: any) => {
        toast({ variant: "destructive", title: "Failed to Remove Skill", description: error.message });
    }
  });


  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    profileUpdateMutation.mutate({ full_name: fullName, department, bio });
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSkillId) {
        toast({ variant: "destructive", title: "No Skill Selected", description: "Please select a skill to add."});
        return;
    }
    addUserSkillMutation.mutate({ skillId: selectedSkillId, proficiency: proficiencyLevel });
  };

  if (isLoadingAuthUser || isLoadingProfile) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <Skeleton className="h-12 w-1/2 mb-4" />
        <Skeleton className="h-8 w-1/3 mb-6" />
        <Card><CardContent className="p-6 space-y-4">
          <Skeleton className="h-6 w-1/4" /> <Skeleton className="h-10 w-full" />
          <Skeleton className="h-6 w-1/4" /> <Skeleton className="h-10 w-full" />
          <Skeleton className="h-6 w-1/4" /> <Skeleton className="h-24 w-full" />
        </CardContent></Card>
      </div>
    );
  }

  if (profileError) return <div className="text-red-500 p-4">Error loading profile: {profileError.message}</div>;
  if (!profile) return <div className="p-4">No profile data found. You might need to complete your registration.</div>;

  const availableSkillsToAdd = allSkills?.filter(
    skill => !userSkills?.find(us => us.skill_id === skill.id)
  );

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Your Profile</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">Manage your personal information and skills.</p>
      </header>

      {/* Profile Information Section */}
      <Card className="mb-8 shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl">Personal Information</CardTitle>
            {!isEditing && <Button variant="outline" onClick={() => setIsEditing(true)}>Edit Profile</Button>}
          </div>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <form onSubmit={handleProfileSave} className="space-y-6">
              <div>
                <Label htmlFor="fullName" className="font-semibold">Full Name</Label>
                <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="email" className="font-semibold">Email</Label>
                <Input id="email" value={profile.email} disabled className="mt-1 bg-slate-100 dark:bg-slate-800" />
              </div>
              <div>
                <Label htmlFor="department" className="font-semibold">Department</Label>
                {/* Consider making department a Select if predefined list is strict */}
                <Input id="department" value={department} onChange={(e) => setDepartment(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="bio" className="font-semibold">Bio</Label>
                <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell us a bit about yourself..." className="mt-1 min-h-[100px]" />
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="ghost" onClick={() => {
                  setIsEditing(false);
                  // Reset form fields to original profile data
                  setFullName(profile.full_name);
                  setDepartment(profile.department);
                  setBio(profile.bio || '');
                }}>Cancel</Button>
                <Button type="submit" disabled={profileUpdateMutation.isPending}>
                  {profileUpdateMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <p><strong>Full Name:</strong> {profile.full_name}</p>
              <p><strong>Email:</strong> {profile.email}</p>
              <p><strong>Department:</strong> {profile.department}</p>
              <p><strong>Bio:</strong> {profile.bio || <span className="text-slate-500">No bio provided.</span>}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Teachable Skills Section */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">My Teachable Skills</CardTitle>
          <CardDescription>Manage the skills you can teach others.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingUserSkills ? <Skeleton className="h-10 w-full" /> : (
            userSkills && userSkills.length > 0 ? (
              <ul className="space-y-3 mb-6">
                {userSkills.map(userSkill => (
                  <li key={userSkill.id} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-md">
                    <div>
                      <span className="font-semibold">{userSkill.skills.name}</span> ({userSkill.skills.category})
                      <span className="ml-2 text-sm text-slate-600 dark:text-slate-400">- Proficiency: {userSkill.proficiency_level}/5</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeUserSkillMutation.mutate(userSkill.id)} disabled={removeUserSkillMutation.isPending && removeUserSkillMutation.variables === userSkill.id}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-500 mb-6">You haven't added any teachable skills yet.</p>
            )
          )}

          <form onSubmit={handleAddSkill} className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-semibold">Add New Skill</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                <div>
                    <Label htmlFor="skillToAdd">Skill</Label>
                    {isLoadingAllSkills ? <Skeleton className="h-10 w-full mt-1" /> : (
                    <Select onValueChange={setSelectedSkillId} value={selectedSkillId}>
                        <SelectTrigger id="skillToAdd" className="mt-1">
                        <SelectValue placeholder="Select a skill" />
                        </SelectTrigger>
                        <SelectContent>
                        {availableSkillsToAdd?.map(skill => (
                            <SelectItem key={skill.id} value={skill.id}>{skill.name} ({skill.category})</SelectItem>
                        ))}
                        {availableSkillsToAdd?.length === 0 && <p className="p-2 text-sm text-slate-500">No more skills to add or all skills added.</p>}
                        </SelectContent>
                    </Select>
                    )}
                </div>
                <div>
                    <Label htmlFor="proficiency">Proficiency Level (1-5)</Label>
                    <Input
                        id="proficiency"
                        type="number"
                        min="1" max="5"
                        value={proficiencyLevel}
                        onChange={(e) => setProficiencyLevel(parseInt(e.target.value))}
                        className="mt-1"
                    />
                </div>
            </div>
            <Button type="submit" disabled={addUserSkillMutation.isPending || isLoadingAllSkills || !selectedSkillId} className="gap-2">
              <PlusCircle className="h-5 w-5" /> {addUserSkillMutation.isPending ? 'Adding...' : 'Add Skill'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}