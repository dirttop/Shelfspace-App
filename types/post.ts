import { Book } from "./book";

export interface Profile {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
}

export interface Post {
  id: number;
  userId: string;
  body?: string;
  file?: string;
  post_type: 'post' | 'review';
  rating?: number;
  book_isbn?: string;
  created_at: string;
  profiles: Profile;
  books?: Partial<Book>;
  postLikes: { count: number }[];
  comments: { count: number }[];
  isLiked?: boolean; // We will add this during our optimization fetch
}
