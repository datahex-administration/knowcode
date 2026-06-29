-- Seed: 6 starter courses (basic + advanced for coding, design, gaming).
-- Safe to re-run: upserts on slug.
insert into public.courses (slug, title, category, summary, description, duration, level, price, published)
values
  ('coding-foundations', 'Coding Foundations', 'coding',
   'Start from zero. Learn HTML, CSS and JavaScript and build your first real website.',
   E'A beginner-friendly start to coding.\n\nWhat you learn:\n- How the web works\n- HTML structure & CSS styling\n- JavaScript basics & logic\n- Git & GitHub\n- Build & publish your first website\n\nNo experience needed. Hands-on from day one.',
   '2 Months', 'Foundation', 'Free', true),

  ('full-stack-pro', 'Full-Stack Pro', 'coding',
   'Go from basics to building & shipping complete web apps with React, Next.js and a database.',
   E'The advanced track for serious builders.\n\nWhat you learn:\n- React & Next.js\n- Node & APIs\n- Databases (Supabase/Postgres)\n- Auth, payments & deployment\n- Build 3+ portfolio projects\n\nFinish job-ready with real products you can show.',
   '6 Months', 'Advanced', NULL, true),

  ('design-foundations', 'Design Foundations', 'design',
   'Learn design thinking, color, typography and Figma — design your first clean interface.',
   E'Your first step into design.\n\nWhat you learn:\n- Design principles & layout\n- Color & typography\n- Figma essentials\n- Icons, spacing & components\n- Design your first app screen\n\nGreat for total beginners.',
   '2 Months', 'Foundation', 'Free', true),

  ('uiux-mastery', 'UI/UX Mastery', 'design',
   'Master product design end-to-end: research, design systems, prototyping and a real portfolio.',
   E'The advanced design track.\n\nWhat you learn:\n- UX research & wireframing\n- Design systems & components\n- Interactive prototyping\n- Handoff to developers\n- Build a professional portfolio\n\nFinish with case studies that get you hired.',
   '6 Months', 'Advanced', NULL, true),

  ('game-dev-basics', 'Game Dev Basics', 'gaming',
   'Make your first playable 2D game. Learn game logic and an engine the fun way.',
   E'Turn play into making.\n\nWhat you learn:\n- Game logic & loops\n- Sprites, movement & scoring\n- Intro to a game engine (Unity)\n- Build & share a 2D game\n\nNo coding experience needed to start.',
   '2 Months', 'Foundation', 'Free', true),

  ('advanced-game-dev', 'Advanced Game Development', 'gaming',
   'Build and publish a complete game with Unity and C#, including 3D and game feel.',
   E'The advanced gaming track.\n\nWhat you learn:\n- Unity & C# in depth\n- 2D & 3D mechanics\n- Physics, UI & audio\n- Polish, optimization & game feel\n- Publish a finished game\n\nShip a real game you can put in your portfolio.',
   '6 Months', 'Advanced', NULL, true)
on conflict (slug) do update set
  title = excluded.title,
  category = excluded.category,
  summary = excluded.summary,
  description = excluded.description,
  duration = excluded.duration,
  level = excluded.level,
  price = excluded.price,
  published = excluded.published;
