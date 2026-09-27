export interface SessionUser {
  id: string;
  email: string;
  username: string;
  name: string | null;
  age: number | null;
  city: string | null;
  avatar: string | null;
  bio: string | null;
  createdAt: string;
  updatedAt: string;
}

interface UserRecord {
  id: string;
  username: string;
  name: string | null;
  age: number | null;
  city: string | null;
  avatar: string | null;
  bio: string | null;
  createdAt: Date;
  updatedAt: Date;
  credential: { email: string } | null;
}

export function toSessionUser(user: UserRecord): SessionUser {
  if (!user.credential) {
    throw new Error('User credential is missing');
  }

  return {
    id: user.id,
    email: user.credential.email,
    username: user.username,
    name: user.name,
    age: user.age,
    city: user.city,
    avatar: user.avatar,
    bio: user.bio,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}
