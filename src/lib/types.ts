export type Course = {
  id: string;
  slug: string;
  title: string;
  category: string;
  summary: string | null;
  description: string | null;
  duration: string | null;
  level: string | null;
  price: string | null;
  poster_url: string | null;
  published: boolean;
  created_at: string;
};

export type Blog = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  cover_url: string | null;
  author: string | null;
  published: boolean;
  created_at: string;
};

export type Banner = {
  id: string;
  title: string | null;
  subtitle: string | null;
  image_url: string;
  link_url: string | null;
  sort_order: number;
  active: boolean;
  created_at: string;
};

export type Application = {
  id: string;
  course_id: string | null;
  course_title: string | null;
  name: string;
  mobile: string;
  address: string | null;
  gender: string | null;
  age: number | null;
  status: string;
  notified: boolean;
  created_at: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string | null;
  mobile: string | null;
  subject: string | null;
  message: string;
  handled: boolean;
  created_at: string;
};

export const CATEGORIES = [
  { key: "coding", label: "Coding" },
  { key: "design", label: "Design" },
  { key: "gaming", label: "Gaming" },
  { key: "other", label: "Other Skills" },
];
