import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTeachableSkills, getSkillCategories, getTeacherDepartments, TeachableSkill } from '@/services/skillService';
import SkillList from '@/components/skills/SkillList';
import SkillFilter from '@/components/skills/SkillFilter';
import { useToast } from '@/hooks/use-toast';
// Placeholder for a "Request Session" modal or navigation
// import RequestSessionModal from '@/components/sessions/RequestSessionModal';

export default function SkillMarketplacePage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');

  // State for managing the "Request Session" modal/dialog
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedSkillForRequest, setSelectedSkillForRequest] = useState<TeachableSkill | null>(null);

  const { data: teachableSkills, isLoading: isLoadingSkills, error: skillsError } = useQuery({
    queryKey: ['teachableSkills'],
    queryFn: getTeachableSkills,
  });

  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['skillCategories'],
    queryFn: getSkillCategories,
  });

  const { data: departments, isLoading: isLoadingDepartments } = useQuery({
    queryKey: ['teacherDepartments'],
    queryFn: getTeacherDepartments,
  });

  const filteredSkills = useMemo(() => {
    if (!teachableSkills) return [];
    return teachableSkills.filter(skill => {
      const matchesSearchTerm = skill.skill_name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory ? skill.skill_category === selectedCategory : true;
      const matchesDepartment = selectedDepartment ? skill.teacher_department === selectedDepartment : true;
      return matchesSearchTerm && matchesCategory && matchesDepartment;
    });
  }, [teachableSkills, searchTerm, selectedCategory, selectedDepartment]);

  const handleRequestSession = (skill: TeachableSkill) => {
    // For MVP, we might navigate to a new page or show a simple alert.
    // A modal would be a good enhancement.
    setSelectedSkillForRequest(skill);
    // setIsRequestModalOpen(true); // Uncomment when modal is ready
    toast({
      title: "Request Session (Placeholder)",
      description: `You requested a session for "${skill.skill_name}" from ${skill.teacher_name}. This feature will be fully implemented soon.`,
    });
    console.log("Requesting session for:", skill);
  };

  if (skillsError) {
    toast({ variant: "destructive", title: "Error", description: "Could not load skills. Please try again later." });
    return <div className="text-center text-red-500 py-10">Error loading skills. Please try refreshing the page.</div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Skill Marketplace</h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Discover skills offered by your colleagues and request learning sessions.
        </p>
      </header>

      <SkillFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedDepartment={selectedDepartment}
        setSelectedDepartment={setSelectedDepartment}
        categories={categories || []}
        departments={departments || []}
        isLoadingCategories={isLoadingCategories}
        isLoadingDepartments={isLoadingDepartments}
      />

      <SkillList
        skills={filteredSkills}
        isLoading={isLoadingSkills}
        onRequestSession={handleRequestSession}
      />

      {/*
      Placeholder for Request Session Modal.
      This would typically be a Dialog component from ShadCN.
      When `isRequestModalOpen` is true, this modal would show.
      It would contain a form to confirm the request.
      */}
      {/* {isRequestModalOpen && selectedSkillForRequest && (
        <RequestSessionModal
          skill={selectedSkillForRequest}
          isOpen={isRequestModalOpen}
          onClose={() => setIsRequestModalOpen(false)}
          // onSubmitRequest={ (details) => { console.log("Session request submitted", details); }}
        />
      )} */}
    </div>
  );
}