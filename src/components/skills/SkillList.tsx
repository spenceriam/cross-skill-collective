import { TeachableSkill } from '@/services/skillService';
import SkillCard from './SkillCard';
import { Skeleton } from '@/components/ui/skeleton';

interface SkillListProps {
  skills: TeachableSkill[];
  isLoading: boolean;
  onRequestSession: (skill: TeachableSkill) => void;
}

export default function SkillList({ skills, isLoading, onRequestSession }: SkillListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <CardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (skills.length === 0) {
    return <p className="text-center text-muted-foreground py-10">No skills found matching your criteria.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {skills.map(skill => (
        <SkillCard key={skill.id} skill={skill} onRequestSession={onRequestSession} />
      ))}
    </div>
  );
}

const CardSkeleton = () => (
    <div className="flex flex-col space-y-3 p-4 border rounded-lg shadow">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="space-y-2 pt-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
        </div>
        <Skeleton className="h-10 w-full mt-3" />
    </div>
);