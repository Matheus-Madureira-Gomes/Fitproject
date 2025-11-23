import { Trainer, Post, UserRole } from "./types";
import { Users, User, MapPin } from "lucide-react";

export const MOCK_TRAINERS: Trainer[] = [
  { id: 't1', name: 'Ramon Dino', specialty: 'Hypertrophy / Posing', location: 'São Paulo, BR', rating: 4.9, isOnline: true, studentsCount: 1542 },
  { id: 't2', name: 'Chris Bumstead', specialty: 'Classic Physique', location: 'Ottawa, CA', rating: 5.0, isOnline: false, studentsCount: 8500 },
  { id: 't3', name: 'Local Coach John', specialty: 'Weight Loss', location: 'New York, NY', rating: 4.5, isOnline: true, studentsCount: 24 },
];

export const MOCK_POSTS: Post[] = [
  {
    id: 'p1',
    author: 'Sarah Fit',
    role: UserRole.USER,
    content: 'Finally hit a PR on deadlift today! 140kg moving easy. Thanks to the AI PPL split.',
    likes: 124,
    comments: 12,
    timestamp: '2h ago',
    image: 'https://picsum.photos/seed/gym1/600/400'
  },
  {
    id: 'p2',
    author: 'Coach Mike',
    role: UserRole.TRAINER,
    content: 'Remember, consistency > intensity. Don’t skip the deload weeks provided in your plans.',
    likes: 856,
    comments: 45,
    timestamp: '5h ago'
  }
];