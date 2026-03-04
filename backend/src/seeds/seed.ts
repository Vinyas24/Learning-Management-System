import type { Knex } from 'knex';
import bcrypt from 'bcryptjs';

export async function seed(knex: Knex): Promise<void> {
    // Clean all tables in reverse dependency order
    await knex('video_progress').del();
    await knex('refresh_tokens').del();
    await knex('enrollments').del();
    await knex('videos').del();
    await knex('sections').del();
    await knex('subjects').del();
    await knex('users').del();

    // ── Users ──────────────────────────────────────────────────────
    const passwordHash = await bcrypt.hash('password123', 12);

    await knex('users').insert([
        { id: 1, email: 'demo@learnflow.com', password_hash: passwordHash, name: 'Demo User' },
        { id: 2, email: 'admin@learnflow.com', password_hash: passwordHash, name: 'Admin User' },
    ]);

    // ── Subjects ───────────────────────────────────────────────────
    await knex('subjects').insert([
        {
            id: 1,
            title: 'JavaScript Fundamentals',
            slug: 'javascript-fundamentals',
            description: 'Master the core concepts of JavaScript including variables, functions, objects, and async programming.',
            is_published: true,
        },
        {
            id: 2,
            title: 'React for Beginners',
            slug: 'react-for-beginners',
            description: 'Learn React from scratch — components, hooks, state management, and building real applications.',
            is_published: true,
        },
        {
            id: 3,
            title: 'Node.js Backend Development',
            slug: 'nodejs-backend-development',
            description: 'Build scalable backend services with Node.js, Express, and databases.',
            is_published: false,
        },
    ]);

    // ── Sections (JavaScript Fundamentals) ─────────────────────────
    await knex('sections').insert([
        { id: 1, subject_id: 1, title: 'Getting Started', order_index: 0 },
        { id: 2, subject_id: 1, title: 'Functions & Scope', order_index: 1 },
        { id: 3, subject_id: 1, title: 'Async JavaScript', order_index: 2 },
    ]);

    // ── Sections (React for Beginners) ─────────────────────────────
    await knex('sections').insert([
        { id: 4, subject_id: 2, title: 'Introduction to React', order_index: 0 },
        { id: 5, subject_id: 2, title: 'Hooks Deep Dive', order_index: 1 },
        { id: 6, subject_id: 2, title: 'Building a Project', order_index: 2 },
    ]);

    // ── Videos (JavaScript - Getting Started) ──────────────────────
    await knex('videos').insert([
        {
            id: 1, section_id: 1, title: 'What is JavaScript?',
            description: 'An introduction to JavaScript and its role in web development.',
            youtube_url: 'https://www.youtube.com/watch?v=W6NZfCO5SIk',
            order_index: 0, duration_seconds: 480,
        },
        {
            id: 2, section_id: 1, title: 'Variables & Data Types',
            description: 'Learn about let, const, var and JavaScript data types.',
            youtube_url: 'https://www.youtube.com/watch?v=9emXNzqCKyg',
            order_index: 1, duration_seconds: 720,
        },
        {
            id: 3, section_id: 1, title: 'Operators & Expressions',
            description: 'Arithmetic, comparison, and logical operators in JavaScript.',
            youtube_url: 'https://www.youtube.com/watch?v=FZzyij43A54',
            order_index: 2, duration_seconds: 540,
        },
    ]);

    // ── Videos (JavaScript - Functions & Scope) ────────────────────
    await knex('videos').insert([
        {
            id: 4, section_id: 2, title: 'Function Declarations & Expressions',
            description: 'Different ways to define functions in JavaScript.',
            youtube_url: 'https://www.youtube.com/watch?v=xUI5Tsl2JpY',
            order_index: 0, duration_seconds: 660,
        },
        {
            id: 5, section_id: 2, title: 'Arrow Functions & this',
            description: 'ES6 arrow functions and how this binding works.',
            youtube_url: 'https://www.youtube.com/watch?v=h33Srr5J9nY',
            order_index: 1, duration_seconds: 600,
        },
    ]);

    // ── Videos (JavaScript - Async) ────────────────────────────────
    await knex('videos').insert([
        {
            id: 6, section_id: 3, title: 'Callbacks & Promises',
            description: 'Understanding asynchronous JavaScript with callbacks and promises.',
            youtube_url: 'https://www.youtube.com/watch?v=_8gHHBlbziw',
            order_index: 0, duration_seconds: 900,
        },
        {
            id: 7, section_id: 3, title: 'Async/Await',
            description: 'Modern async patterns with async/await syntax.',
            youtube_url: 'https://www.youtube.com/watch?v=V_Kr9OSfDeU',
            order_index: 1, duration_seconds: 780,
        },
    ]);

    // ── Videos (React - Introduction) ──────────────────────────────
    await knex('videos').insert([
        {
            id: 8, section_id: 4, title: 'What is React?',
            description: 'Introduction to React and what makes it different.',
            youtube_url: 'https://www.youtube.com/watch?v=Tn6-PIqc4UM',
            order_index: 0, duration_seconds: 600,
        },
        {
            id: 9, section_id: 4, title: 'JSX & Components',
            description: 'Writing JSX and creating your first component.',
            youtube_url: 'https://www.youtube.com/watch?v=9YkUCxvaLEk',
            order_index: 1, duration_seconds: 720,
        },
    ]);

    // ── Videos (React - Hooks) ─────────────────────────────────────
    await knex('videos').insert([
        {
            id: 10, section_id: 5, title: 'useState & useEffect',
            description: 'Managing state and side effects with React hooks.',
            youtube_url: 'https://www.youtube.com/watch?v=O6P86uwfdR0',
            order_index: 0, duration_seconds: 840,
        },
        {
            id: 11, section_id: 5, title: 'Custom Hooks',
            description: 'Building reusable logic with custom hooks.',
            youtube_url: 'https://www.youtube.com/watch?v=J-g9ZJha8FE',
            order_index: 1, duration_seconds: 600,
        },
    ]);

    // ── Videos (React - Building a Project) ────────────────────────
    await knex('videos').insert([
        {
            id: 12, section_id: 6, title: 'Project Setup & Structure',
            description: 'Setting up a React project and organizing files.',
            youtube_url: 'https://www.youtube.com/watch?v=b9eMGE7QtTk',
            order_index: 0, duration_seconds: 540,
        },
        {
            id: 13, section_id: 6, title: 'Building the UI',
            description: 'Creating components and wiring up the interface.',
            youtube_url: 'https://www.youtube.com/watch?v=hQAHSlTtcmY',
            order_index: 1, duration_seconds: 960,
        },
    ]);

    console.log('✅ Seed data inserted successfully');
}
