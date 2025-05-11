import { TeachableSkill } from '@/services/skillService';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, BookOpen, Briefcase, Star } from 'lucide-react'; // Icons

interface SkillCardProps {
  skill: TeachableSkill;
  onRequestSession: (skill: TeachableSkill) => void; // Callback for requesting a session
}

export default function SkillCard({ skill, onRequestSession }: SkillCardProps) {
  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <CardTitle className="text-xl font-semibold">{skill.skill_name}</CardTitle>
        </div>
        <CardDescription>
            <Badge variant="secondary">{skill.skill_category}</Badge>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>Taught by: <span className="font-medium text-foreground">{skill.teacher_name}</span></span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Briefcase className="h-4 w-4" />
            <span>Department: {skill.teacher_department}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Star className="h-4 w-4 text-yellow-500" />
            <span>Proficiency: {skill.proficiency_level}/5</span>
        </div>
        {skill.teacher_bio && (
            <p className="text-sm text-muted-foreground pt-2 border-t mt-3">
                <span className="font-semibold text-foreground">Teacher's Bio:</span> {skill.teacher_bio.substring(0, 100)}{skill.teacher_bio.length > 100 ? '...' : ''}
            </p>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={() => onRequestSession(skill)}
          aria-label={`Request session for ${skill.skill_name} from ${skill.teacher_name}`}
        >
          Request Session
        </Button>
      </CardFooter>
    </Card>
  );
}