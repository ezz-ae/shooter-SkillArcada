
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from './firebase';

export interface User {
  id: string;
  name: string;
  avatarUrl: string;
}

const db = getFirestore(app);

export async function getUsers(): Promise<User[]> {
  const usersCol = collection(db, 'users');
  const usersSnapshot = await getDocs(usersCol);
  const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
  return usersList;
}

export const mockUsers: User[] = [
  {
    id: 'user1',
    name: 'PixelPioneer',
    avatarUrl: 'https://placehold.co/100x100/FFC107/000000/png?text=PP',
  },
  {
    id: 'user2',
    name: 'SynthwaveSamurai',
    avatarUrl: 'https://placehold.co/100x100/E91E63/FFFFFF/png?text=SS',
  },
];
