const API = "https://mentornet-production.up.railway.app";

export type Role = "student" | "professional" | "admin";

export interface User {
  id: number;
  username: string;
  email: string;
  role: Role;
  industry: string;
  bio: string;
  avatar: string;
  grade?: string;
  interests?: string;
  created_at: string;
}

export interface Topic {
  id: number;
  name: string;
  slug: string;
  icon: string;
  count: number;
}

export interface Question {
  id: number;
  title: string;
  content: string;
  author_id: number;
  author?: { id: number; username: string; avatar: string };
  tags: string[];
  upvotes: number;
  upvoted_by: number[];
  hidden?: boolean;
  answerCount?: number;
  created_at: string;
}

export interface Answer {
  id: number;
  question_id: number;
  author_id: number;
  author?: { id: number; username: string; avatar: string };
  content: string;
  upvotes: number;
  upvoted_by: number[];
  is_top: boolean;
  hidden?: boolean;
  created_at: string;
}

export interface Community {
  id: number;
  name: string;
  description: string;
  icon: string;
  members: number;
  posts: number[];
}

export interface Session {
  id: number;
  mentor_id: number;
  mentor?: { id: number; username: string; avatar: string };
  title: string;
  description: string;
  date: string;
  capacity: number;
  attendees: number[];
}

export interface Feedback {
  id: number;
  session_id: number;
  user_id: number;
  rating: number;
  comment: string;
  created_at: string;
}

// ─── CACHE (in-memory for upvotes/joins since API is read-heavy) ───
let _users: User[] = [];
let _questions: Question[] = [];
let _answers: Answer[] = [];
let _communities: Community[] = [];
let _sessions: Session[] = [];
let _feedbacks: Feedback[] = [];
let _loaded = false;

export async function loadAll() {
  if (_loaded) return;
  const [users, posts, communities, sessions, feedbacks] = await Promise.all([
    fetch(`${API}/users`).then(r => r.json()),
    fetch(`${API}/posts`).then(r => r.json()),
    fetch(`${API}/communities`).then(r => r.json()),
    fetch(`${API}/sessions`).then(r => r.json()),
    fetch(`${API}/feedback`).then(r => r.json()),
  ]);
  _users = users;
  _questions = posts;
  _communities = communities;
  _sessions = sessions;
  _feedbacks = feedbacks;
  _loaded = true;
}

// ─── USERS ───────────────────────────────────────────────
export function getUserById(id: number) { return _users.find(u => u.id === id); }
export function getUserByEmail(email: string) { return _users.find(u => u.email === email); }
export function getUserByUsername(username: string) { return _users.find(u => u.username === username); }

export async function addUser(username: string, email: string, role: Role, industry: string, grade?: string, interests?: string): Promise<User> {
  const res = await fetch(`${API}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: username, email, user_type: role === "professional" ? "counselor" : role }),
  });
  const data = await res.json();
  const user: User = {
    id: data.id, username, email, role, industry,
    bio: "", avatar: username.slice(0, 2).toUpperCase(),
    grade, interests,
    created_at: new Date().toISOString().slice(0, 10),
  };
  _users.push(user);
  return user;
}

export function updateUser(id: number, updates: Partial<Pick<User, "username" | "bio" | "industry" | "interests" | "grade">>) {
  const u = _users.find(u => u.id === id);
  if (u) Object.assign(u, updates);
  return u;
}

// ─── QUESTIONS / POSTS ───────────────────────────────────
export function getQuestionsWithAuthors() {
  return _questions
    .filter(q => !q.hidden)
    .map(q => ({ ...q, author: q.author || getUserById(q.author_id), answerCount: q.answerCount || 0 }))
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export function getAllQuestionsAdmin() {
  return _questions
    .map(q => ({ ...q, author: q.author || getUserById(q.author_id), answerCount: q.answerCount || 0 }))
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function getQuestionWithAnswers(id: number) {
  const q = _questions.find(q => q.id === id);
  if (!q) return null;
  const res = await fetch(`${API}/posts/${id}`);
  const data = await res.json();
  _answers = [..._answers.filter(a => a.question_id !== id), ...(data.answers || [])];
  const qAnswers = (data.answers || []).map((a: Answer) => ({ ...a, author: a.author || getUserById(a.author_id) }));
  return { ...q, author: q.author || getUserById(q.author_id), answers: qAnswers };
}

export async function addQuestion(title: string, content: string, authorId: number, tags: string[]): Promise<Question> {
  const res = await fetch(`${API}/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content, user_id: authorId, community_id: 1 }),
  });
  const data = await res.json();
  const q: Question = {
    id: data.id, title, content, author_id: authorId,
    tags, upvotes: 0, upvoted_by: [],
    created_at: new Date().toISOString().slice(0, 10),
  };
  _questions.unshift(q);
  return q;
}

export async function addAnswer(questionId: number, authorId: number, content: string): Promise<Answer> {
  const res = await fetch(`${API}/posts/${questionId}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, user_id: authorId }),
  });
  const data = await res.json();
  const a: Answer = {
    id: data.id, question_id: questionId, author_id: authorId,
    content, upvotes: 0, upvoted_by: [], is_top: false,
    created_at: new Date().toISOString().slice(0, 10),
  };
  _answers.push(a);
  return a;
}

export function toggleHideQuestion(questionId: number) {
  const q = _questions.find(q => q.id === questionId);
  if (q) q.hidden = !q.hidden;
}

export function deleteQuestion(questionId: number) {
  const idx = _questions.findIndex(q => q.id === questionId);
  if (idx !== -1) _questions.splice(idx, 1);
}

export function toggleHideAnswer(answerId: number) {
  const a = _answers.find(a => a.id === answerId);
  if (a) a.hidden = !a.hidden;
}

export function upvoteQuestion(questionId: number, userId: number) {
  const q = _questions.find(q => q.id === questionId);
  if (!q) return;
  if (q.upvoted_by.includes(userId)) {
    q.upvoted_by = q.upvoted_by.filter(id => id !== userId);
    q.upvotes--;
  } else {
    q.upvoted_by.push(userId);
    q.upvotes++;
  }
}

export function upvoteAnswer(answerId: number, userId: number) {
  const a = _answers.find(a => a.id === answerId);
  if (!a) return;
  if (a.upvoted_by.includes(userId)) {
    a.upvoted_by = a.upvoted_by.filter(id => id !== userId);
    a.upvotes--;
  } else {
    a.upvoted_by.push(userId);
    a.upvotes++;
  }
}

export function getQuestionsByUser(userId: number) {
  return _questions.filter(q => q.author_id === userId && !q.hidden).map(q => ({
    ...q, author: q.author || getUserById(q.author_id),
    answerCount: _answers.filter(a => a.question_id === q.id).length,
  }));
}

export function getAnswersByUser(userId: number) {
  return _answers.filter(a => a.author_id === userId && !a.hidden).map(a => ({
    ...a, author: a.author || getUserById(a.author_id),
    question: _questions.find(q => q.id === a.question_id),
  }));
}

export function getTopContributors() {
  const counts: Record<number, number> = {};
  _answers.forEach(a => { counts[a.author_id] = (counts[a.author_id] || 0) + 1; });
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id, count]) => ({ user: getUserById(Number(id))!, answerCount: count }));
}

export function getTrendingTags() {
  const tagCounts: Record<string, number> = {};
  _questions.forEach(q => q.tags.forEach(t => { tagCounts[t] = (tagCounts[t] || 0) + 1; }));
  return Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([tag, count]) => ({ tag, count }));
}

// ─── TOPICS (static for now) ─────────────────────────────
export const topics: Topic[] = [
  { id: 1, name: "Artificial Intelligence", slug: "ai", icon: "🤖", count: 0 },
  { id: 2, name: "Finance", slug: "finance", icon: "💰", count: 0 },
  { id: 3, name: "Consulting", slug: "consulting", icon: "📊", count: 0 },
  { id: 4, name: "Software Engineering", slug: "swe", icon: "💻", count: 0 },
  { id: 5, name: "Biotech", slug: "biotech", icon: "🧬", count: 0 },
  { id: 6, name: "Product Management", slug: "pm", icon: "🎯", count: 0 },
  { id: 7, name: "Data Science", slug: "data-science", icon: "📈", count: 0 },
  { id: 8, name: "UX Design", slug: "ux", icon: "🎨", count: 0 },
];

// ─── COMMUNITIES ─────────────────────────────────────────
export function getCommunities() { return _communities; }

export async function getCommunityWithPosts(id: number) {
  const c = _communities.find(c => c.id === id);
  if (!c) return null;
  const posts = _questions.map(q => ({
    ...q, author: q.author || getUserById(q.author_id),
    answerCount: _answers.filter(a => a.question_id === q.id).length,
  }));
  return { ...c, questions: posts };
}

// ─── SESSIONS ────────────────────────────────────────────
export function getSessions() {
  return _sessions.map(s => ({ ...s, mentor: s.mentor || getUserById(s.mentor_id) }));
}

export function joinSession(sessionId: number, userId: number) {
  const s = _sessions.find(s => s.id === sessionId);
  if (s && !s.attendees.includes(userId) && s.attendees.length < s.capacity) {
    s.attendees.push(userId);
  }
}

export async function addSession(mentorId: number, title: string, description: string, date: string, capacity: number): Promise<Session> {
  // find or create a service for this mentor
  const res = await fetch(`${API}/sessions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ scheduled_time: date, duration: 60, mode: "Online", svc_id: 1 }),
  });
  const data = await res.json();
  const s: Session = { id: data.id, mentor_id: mentorId, title, description, date, capacity, attendees: [] };
  _sessions.push(s);
  return s;
}

// ─── FEEDBACK ────────────────────────────────────────────
export function getFeedbacks() {
  return _feedbacks.map(f => ({
    ...f,
    user: getUserById(f.user_id),
    session: _sessions.find(s => s.id === f.session_id),
  }));
}

export async function addFeedback(sessionId: number, userId: number, rating: number, comment: string): Promise<Feedback> {
  const res = await fetch(`${API}/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_id: sessionId, user_id: userId, rating, comment }),
  });
  const data = await res.json();
  const f: Feedback = { id: data.id, session_id: sessionId, user_id: userId, rating, comment, created_at: new Date().toISOString().slice(0, 10) };
  _feedbacks.push(f);
  return f;
}

// ─── STATS ───────────────────────────────────────────────
export async function getStats() {
  const res = await fetch(`${API}/stats`);
  return res.json();
}
