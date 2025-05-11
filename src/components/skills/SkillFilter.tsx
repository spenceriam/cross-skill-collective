import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface SkillFilterProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedDepartment: string;
  setSelectedDepartment: (department: string) => void;
  categories: string[];
  departments: string[];
  isLoadingCategories: boolean;
  isLoadingDepartments: boolean;
}

export default function SkillFilter({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedDepartment,
  setSelectedDepartment,
  categories,
  departments,
  isLoadingCategories,
  isLoadingDepartments,
}: SkillFilterProps) {

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedDepartment('');
  };

  const hasActiveFilters = searchTerm || selectedCategory || selectedDepartment;

  return (
    <div className="mb-8 p-6 bg-card border rounded-lg shadow">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        <div>
          <Label htmlFor="search-term" className="font-semibold">Search by Skill Name</Label>
          <Input
            id="search-term"
            type="text"
            placeholder="e.g., JavaScript, Public Speaking"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="category-filter" className="font-semibold">Filter by Category</Label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger id="category-filter" className="mt-1">
              <SelectValue placeholder={isLoadingCategories ? "Loading..." : "All Categories"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="department-filter" className="font-semibold">Filter by Teacher's Dept.</Label>
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger id="department-filter" className="mt-1">
              <SelectValue placeholder={isLoadingDepartments ? "Loading..." : "All Departments"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Departments</SelectItem>
              {departments.map(department => (
                <SelectItem key={department} value={department}>{department}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {hasActiveFilters && (
            <Button onClick={handleClearFilters} variant="ghost" className="w-full md:w-auto gap-2">
                <X className="h-4 w-4" /> Clear Filters
            </Button>
        )}
      </div>
    </div>
  );
}