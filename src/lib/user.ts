
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from './firebase'; // Import the initialized app

export interface User {
  id: string;
  name: string;
  avatarUrl: string;
}

const db = getFirestore(app); // Use the imported, initialized app

export async function getUsers(): Promise<User[]> {
  // In a real app, this would fetch from Firestore. For now, using mock data.
  // const usersCol = collection(db, 'users');
  // const usersSnapshot = await getDocs(usersCol);
  // const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
  // return usersList;
  return Promise.resolve(mockUsers);
}

export const mockUsers: User[] = [
  {
    id: 'user1',
    name: 'PixelPioneer',
    avatarUrl: 'https://i.pravatar.cc/100?u=user1',
  },
  {
    id: 'user2',
    name: 'SynthwaveSamurai',
    avatarUrl: 'https://i.pravatar.cc/100?u=user2',
  },
  {
    id: 'user3',
    name: 'GlitchGuardian',
    avatarUrl: 'https://i.pravatar.cc/100?u=user3',
  },
  {
    id: 'user4',
    name: 'QuantumQueen',
    avatarUrl: 'https://i.pravatar.cc/100?u=user4',
  },
  {
    id: 'user5',
    name: 'CyberRonin',
    avatarUrl: 'https://i.pravatar.cc/100?u=user5',
  },
  {
    id: 'user6',
    name: 'DataDuchess',
    avatarUrl: 'https://i.pravatar.cc/100?u=user6',
  },
];
