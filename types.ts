export interface FamilyMember {
  id: string;
  name: string;
  gender: 'male' | 'female' | 'other';
  birthDate: string;
  deathDate?: string;
  photoUrl?: string;
  bio?: string;
  occupation?: string;
  birthPlace?: string;
  partner?: string; // Name of partner
  children?: FamilyMember[];
}

export interface TreeProps {
  data: FamilyMember;
  onNodeClick: (node: FamilyMember) => void;
}

export interface Coordinates {
  x: number;
  y: number;
}
