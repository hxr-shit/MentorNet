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
  tags: string[];
  upvotes: number;
  upvoted_by: number[];
  hidden?: boolean;
  created_at: string;
}

export interface Answer {
  id: number;
  question_id: number;
  author_id: number;
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

// ============ SEED DATA ============

let nextUserId = 6;
export const users: User[] = [
  { id: 1, username: "alex_dev", email: "alex@dev.io", role: "student", industry: "Technology", bio: "CS student exploring career paths in tech.", avatar: "AD", created_at: "2025-01-10" },
  { id: 2, username: "sarah_pm", email: "sarah@work.com", role: "professional", industry: "Product Management", bio: "Senior PM at a Fortune 500. 10+ years in tech.", avatar: "SP", created_at: "2025-01-05" },
  { id: 3, username: "mike_finance", email: "mike@hedge.co", role: "professional", industry: "Finance", bio: "Investment analyst. Happy to help with finance career questions.", avatar: "MF", created_at: "2024-12-20" },
  { id: 4, username: "priya_ai", email: "priya@ml.edu", role: "student", industry: "AI / Machine Learning", bio: "ML researcher looking to break into industry.", avatar: "PA", created_at: "2025-02-01" },
  { id: 5, username: "james_consult", email: "james@mckinsey.com", role: "professional", industry: "Consulting", bio: "Management consultant. Ask me about MBB prep.", avatar: "JC", created_at: "2025-01-15" },
  { id: 6, username: "admin_user", email: "admin@mentornet.com", role: "admin", industry: "Technology", bio: "Platform administrator.", avatar: "AU", created_at: "2025-01-01" },
];

export const topics: Topic[] = [
  { id: 1, name: "Artificial Intelligence", slug: "ai", icon: "🤖", count: 128 },
  { id: 2, name: "Finance", slug: "finance", icon: "💰", count: 95 },
  { id: 3, name: "Consulting", slug: "consulting", icon: "📊", count: 73 },
  { id: 4, name: "Software Engineering", slug: "swe", icon: "💻", count: 210 },
  { id: 5, name: "Biotech", slug: "biotech", icon: "🧬", count: 42 },
  { id: 6, name: "Product Management", slug: "pm", icon: "🎯", count: 88 },
  { id: 7, name: "Data Science", slug: "data-science", icon: "📈", count: 156 },
  { id: 8, name: "UX Design", slug: "ux", icon: "🎨", count: 67 },
];

let nextQuestionId = 6;
export const questions: Question[] = [
  { id: 1, title: "How do I break into AI without a PhD?", content: "I have a CS degree and some ML projects on GitHub. Is a PhD necessary to get into AI/ML roles at top companies, or can strong projects and experience compensate?", author_id: 4, tags: ["AI", "Career Switch", "Education"], upvotes: 42, upvoted_by: [1, 2, 3, 5], created_at: "2025-03-01" },
  { id: 2, title: "Is consulting worth it for the long term?", content: "I got an offer from a Big 3 consulting firm. The pay is good but I've heard the hours are brutal. For those who did consulting — was it worth it for your career trajectory?", author_id: 1, tags: ["Consulting", "Work-Life Balance"], upvotes: 38, upvoted_by: [2, 3, 4], created_at: "2025-03-02" },
  { id: 3, title: "Best resources for system design interviews?", content: "I have FAANG interviews coming up. What are the best resources for system design preparation? Books, courses, YouTube channels — anything helps.", author_id: 1, tags: ["SWE", "Interviews", "FAANG"], upvotes: 67, upvoted_by: [2, 4, 5], created_at: "2025-03-05" },
  { id: 4, title: "Transitioning from finance to tech PM", content: "I'm currently an investment banking analyst and want to move into product management at a tech company. What skills should I focus on and how should I position my experience?", author_id: 3, tags: ["PM", "Finance", "Career Switch"], upvotes: 29, upvoted_by: [1, 4], created_at: "2025-03-07" },
  { id: 5, title: "How important is networking really?", content: "I keep hearing 'networking is everything' but as an introvert, it feels exhausting. For those who've advanced in their careers — how much did networking actually matter vs. pure skill?", author_id: 4, tags: ["Networking", "Career Growth"], upvotes: 55, upvoted_by: [1, 2, 3, 5], created_at: "2025-03-10" },
];

let nextAnswerId = 6;
export const answers: Answer[] = [
  { id: 1, question_id: 1, author_id: 2, content: "PhD is definitely not required anymore. I've hired ML engineers with strong portfolios and no PhD. Focus on: 1) Strong projects with real datasets, 2) Contributing to open source ML libraries, 3) Publishing blog posts about your work.", upvotes: 28, upvoted_by: [1, 4], is_top: true, created_at: "2025-03-01" },
  { id: 2, question_id: 1, author_id: 5, content: "I'd add that getting ML certifications from credible platforms (Stanford Online, fast.ai) can help bridge the gap.", upvotes: 15, upvoted_by: [4], is_top: false, created_at: "2025-03-02" },
  { id: 3, question_id: 2, author_id: 5, content: "Did 3 years at McKinsey. Absolutely worth it. The structured thinking, executive exposure, and alumni network are unmatched.", upvotes: 22, upvoted_by: [1, 3], is_top: true, created_at: "2025-03-03" },
  { id: 4, question_id: 3, author_id: 2, content: "Top resources: 1) 'Designing Data-Intensive Applications' by Martin Kleppmann, 2) System Design Primer on GitHub, 3) Alex Xu's System Design Interview books.", upvotes: 45, upvoted_by: [1, 4, 5], is_top: true, created_at: "2025-03-06" },
  { id: 5, question_id: 5, author_id: 3, content: "In finance, networking is about 60% of getting hired, especially for buy-side roles.", upvotes: 19, upvoted_by: [1, 4], is_top: true, created_at: "2025-03-11" },
];

let nextCommunityId = 5;
export const communities: Community[] = [
  { id: 1, name: "AI & Machine Learning", description: "Discuss careers in AI, ML, and data science.", icon: "🤖", members: 1240, posts: [1] },
  { id: 2, name: "Finance & Banking", description: "Investment banking, hedge funds, and fintech careers.", icon: "💰", members: 890, posts: [4] },
  { id: 3, name: "Consulting", description: "MBB prep, case interviews, and consulting life.", icon: "📊", members: 670, posts: [2] },
  { id: 4, name: "Software Engineering", description: "SWE interviews, system design, and tech careers.", icon: "💻", members: 2100, posts: [3] },
];

let nextSessionId = 4;
export const sessions: Session[] = [
  { id: 1, mentor_id: 2, title: "PM Career Path Q&A", description: "Ask anything about breaking into product management.", date: "2025-04-10", capacity: 20, attendees: [1, 4] },
  { id: 2, mentor_id: 3, title: "Finance Interview Prep", description: "Mock interviews and tips for finance roles.", date: "2025-04-12", capacity: 15, attendees: [1] },
  { id: 3, mentor_id: 5, title: "Consulting Case Workshop", description: "Practice case interviews with a McKinsey consultant.", date: "2025-04-15", capacity: 10, attendees: [4] },
];

let nextFeedbackId = 3;
export const feedbacks: Feedback[] = [
  { id: 1, session_id: 1, user_id: 1, rating: 5, comment: "Amazing session! Sarah was super helpful.", created_at: "2025-04-10" },
  { id: 2, session_id: 2, user_id: 1, rating: 4, comment: "Great tips on finance interviews.", created_at: "2025-04-12" },
];

// ============ CRUD Operations ============

export function getUserById(id: number) { return users.find(u => u.id === id); }
export function getUserByEmail(email: string) { return users.find(u => u.email === email); }
export function getUserByUsername(username: string) { return users.find(u => u.username === username); }

export function addUser(username: string, email: string, role: Role, industry: string, grade?: string, interests?: string): User {
  const u: User = {
    id: nextUserId++, username, email, role, industry,
    bio: "", avatar: username.slice(0, 2).toUpperCase(),
    grade, interests,
    created_at: new Date().toISOString().slice(0, 10),
  };
  users.push(u);
  return u;
}

export function updateUser(id: number, updates: Partial<Pick<User, "username" | "bio" | "industry" | "interests" | "grade">>) {
  const u = users.find(u => u.id === id);
  if (u) Object.assign(u, updates);
  return u;
}

export function getQuestionsWithAuthors() {
  return questions
    .filter(q => !q.hidden)
    .map(q => ({ ...q, author: getUserById(q.author_id), answerCount: answers.filter(a => a.question_id === q.id && !a.hidden).length }))
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export function getAllQuestionsAdmin() {
  return questions
    .map(q => ({ ...q, author: getUserById(q.author_id), answerCount: answers.filter(a => a.question_id === q.id).length }))
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export function getQuestionWithAnswers(id: number) {
  const q = questions.find(q => q.id === id);
  if (!q) return null;
  const qAnswers = answers
    .filter(a => a.question_id === id && !a.hidden)
    .map(a => ({ ...a, author: getUserById(a.author_id) }))
    .sort((a, b) => (b.is_top ? 1 : 0) - (a.is_top ? 1 : 0) || b.upvotes - a.upvotes);
  return { ...q, author: getUserById(q.author_id), answers: qAnswers };
}

export function addQuestion(title: string, content: string, authorId: number, tags: string[]): Question {
  const q: Question = {
    id: nextQuestionId++, title, content, author_id: authorId,
    tags, upvotes: 0, upvoted_by: [],
    created_at: new Date().toISOString().slice(0, 10),
  };
  questions.unshift(q);
  return q;
}

export function addAnswer(questionId: number, authorId: number, content: string): Answer {
  const a: Answer = {
    id: nextAnswerId++, question_id: questionId, author_id: authorId,
    content, upvotes: 0, upvoted_by: [], is_top: false,
    created_at: new Date().toISOString().slice(0, 10),
  };
  answers.push(a);
  return a;
}

export function toggleHideQuestion(questionId: number) {
  const q = questions.find(q => q.id === questionId);
  if (q) q.hidden = !q.hidden;
}

export function deleteQuestion(questionId: number) {
  const idx = questions.findIndex(q => q.id === questionId);
  if (idx !== -1) questions.splice(idx, 1);
}

export function toggleHideAnswer(answerId: number) {
  const a = answers.find(a => a.id === answerId);
  if (a) a.hidden = !a.hidden;
}

export function upvoteQuestion(questionId: number, userId: number) {
  const q = questions.find(q => q.id === questionId);
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
  const a = answers.find(a => a.id === answerId);
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
  return questions.filter(q => q.author_id === userId && !q.hidden).map(q => ({
    ...q, author: getUserById(q.author_id), answerCount: answers.filter(a => a.question_id === q.id).length,
  }));
}

export function getAnswersByUser(userId: number) {
  return answers.filter(a => a.author_id === userId && !a.hidden).map(a => ({
    ...a, author: getUserById(a.author_id), question: questions.find(q => q.id === a.question_id),
  }));
}

export function getTopContributors() {
  const counts: Record<number, number> = {};
  answers.forEach(a => { counts[a.author_id] = (counts[a.author_id] || 0) + 1; });
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id, count]) => ({ user: getUserById(Number(id))!, answerCount: count }));
}

export function getTrendingTags() {
  const tagCounts: Record<string, number> = {};
  questions.forEach(q => q.tags.forEach(t => { tagCounts[t] = (tagCounts[t] || 0) + 1; }));
  return Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([tag, count]) => ({ tag, count }));
}

// Sessions
export function getSessions() { return sessions.map(s => ({ ...s, mentor: getUserById(s.mentor_id) })); }
export function joinSession(sessionId: number, userId: number) {
  const s = sessions.find(s => s.id === sessionId);
  if (s && !s.attendees.includes(userId) && s.attendees.length < s.capacity) {
    s.attendees.push(userId);
  }
}
export function addSession(mentorId: number, title: string, description: string, date: string, capacity: number): Session {
  const s: Session = { id: nextSessionId++, mentor_id: mentorId, title, description, date, capacity, attendees: [] };
  sessions.push(s);
  return s;
}

// Communities
export function getCommunities() { return communities; }
export function getCommunityWithPosts(id: number) {
  const c = communities.find(c => c.id === id);
  if (!c) return null;
  const posts = questions.filter(q => c.posts.includes(q.id)).map(q => ({
    ...q, author: getUserById(q.author_id), answerCount: answers.filter(a => a.question_id === q.id).length,
  }));
  return { ...c, questions: posts };
}

// Feedback
export function getFeedbacks() { return feedbacks.map(f => ({ ...f, user: getUserById(f.user_id), session: sessions.find(s => s.id === f.session_id) })); }
export function addFeedback(sessionId: number, userId: number, rating: number, comment: string): Feedback {
  const f: Feedback = { id: nextFeedbackId++, session_id: sessionId, user_id: userId, rating, comment, created_at: new Date().toISOString().slice(0, 10) };
  feedbacks.push(f);
  return f;
}

// Stats
export function getStats() {
  return {
    totalUsers: users.length,
    totalQuestions: questions.filter(q => !q.hidden).length,
    totalSessions: sessions.length,
    totalFeedbacks: feedbacks.length,
    avgRating: feedbacks.length ? (feedbacks.reduce((s, f) => s + f.rating, 0) / feedbacks.length).toFixed(1) : "N/A",
  };
}
