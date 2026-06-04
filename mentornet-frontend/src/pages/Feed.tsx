import { useApp } from "@/contexts/AppContext";
import { getQuestionsWithAuthors, getTopContributors, getTrendingTags, getStats } from "@/lib/data";
import { QuestionCard } from "@/components/QuestionCard";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { TrendingUp, Plus, Calendar, MessageSquare, Star, Users } from "lucide-react";

export default function Feed() {
  const { currentUser, refreshKey, triggerRefresh } = useApp();
  const navigate = useNavigate();
  const questions = getQuestionsWithAuthors();
  const topContributors = getTopContributors();
  const trendingTags = getTrendingTags();
  const stats = getStats();

  void refreshKey;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          {greeting()}, {currentUser?.username} 👋
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Here's what's happening on MentorNet today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalQuestions}</p>
                <p className="text-xs text-muted-foreground">Total Posts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalSessions}</p>
                <p className="text-xs text-muted-foreground">Active Sessions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <Star className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.avgRating}</p>
                <p className="text-xs text-muted-foreground">Feedback Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
                <p className="text-xs text-muted-foreground">Community</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      {currentUser?.role === "student" && (
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => navigate("/ask")} className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Plus className="h-4 w-4 mr-1" /> Ask Question
          </Button>
          <Button variant="outline" onClick={() => navigate("/sessions")}>
            <Calendar className="h-4 w-4 mr-1" /> Join Session
          </Button>
          <Button variant="outline" onClick={() => navigate("/communities")}>
            <Users className="h-4 w-4 mr-1" /> Communities
          </Button>
          <Button variant="outline" onClick={() => navigate("/feedback")}>
            <Star className="h-4 w-4 mr-1" /> Feedback
          </Button>
        </div>
      )}

      {/* Feed + Sidebar */}
      <div className="flex gap-6">
        <div className="flex-1 min-w-0">
          <Card>
            <CardContent className="p-5">
              <h2 className="font-semibold text-foreground mb-4">Your Feed</h2>
              <div className="space-y-4">
                {questions.map(q => (
                  <QuestionCard key={q.id} {...q} onVote={triggerRefresh} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <aside className="hidden xl:block w-64 shrink-0 space-y-4">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-sm flex items-center gap-2 mb-3">
                <TrendingUp className="h-4 w-4 text-primary" /> Trending
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {trendingTags.map(({ tag }) => (
                  <Badge key={tag} variant="secondary" className="text-xs cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-sm mb-3">Top Contributors</h3>
              <div className="space-y-3">
                {topContributors.map(({ user, answerCount }) => (
                  <Link key={user.id} to={`/u/${user.username}`} className="flex items-center gap-2 hover:bg-muted rounded-lg p-1.5 -mx-1.5 transition-colors">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="text-[10px] bg-primary/10 text-primary">{user.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{user.username}</p>
                      <p className="text-xs text-muted-foreground">{answerCount} answers</p>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
