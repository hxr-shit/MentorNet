import { useParams } from "react-router-dom";
import { getUserByUsername, getQuestionsByUser, getAnswersByUser } from "@/lib/data";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QuestionCard } from "@/components/QuestionCard";
import { Link } from "react-router-dom";
import { ArrowBigUp } from "lucide-react";
import { useApp } from "@/contexts/AppContext";

export default function Profile() {
  const { username } = useParams();
  const { refreshKey, triggerRefresh } = useApp();
  void refreshKey;

  const user = getUserByUsername(username || "");
  if (!user) return <div className="max-w-3xl mx-auto px-4 py-12 text-center text-muted-foreground">User not found.</div>;

  const userQuestions = getQuestionsByUser(user.id);
  const userAnswers = getAnswersByUser(user.id);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Profile Header */}
      <div className="bg-card rounded-xl border p-6 flex flex-col sm:flex-row items-start gap-5">
        <Avatar className="h-16 w-16">
          <AvatarFallback className="text-xl bg-primary/10 text-primary">{user.avatar}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-xl font-bold text-foreground">{user.username}</h1>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <Badge variant="secondary" className="capitalize">{user.role}</Badge>
            <Badge variant="outline">{user.industry}</Badge>
          </div>
          {user.bio && <p className="mt-2 text-sm text-muted-foreground">{user.bio}</p>}
          <p className="text-xs text-muted-foreground mt-2">Joined {user.created_at}</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="questions" className="mt-6">
        <TabsList>
          <TabsTrigger value="questions">Questions ({userQuestions.length})</TabsTrigger>
          <TabsTrigger value="answers">Answers ({userAnswers.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="questions" className="space-y-4 mt-4">
          {userQuestions.length === 0 ? (
            <p className="text-muted-foreground text-sm py-8 text-center">No questions yet.</p>
          ) : (
            userQuestions.map(q => <QuestionCard key={q.id} {...q} onVote={triggerRefresh} />)
          )}
        </TabsContent>
        <TabsContent value="answers" className="space-y-4 mt-4">
          {userAnswers.length === 0 ? (
            <p className="text-muted-foreground text-sm py-8 text-center">No answers yet.</p>
          ) : (
            userAnswers.map(a => (
              <div key={a.id} className="bg-card rounded-xl border p-5">
                {a.question && (
                  <Link to={`/q/${a.question.id}`} className="text-sm text-primary hover:underline font-medium">
                    Re: {a.question.title}
                  </Link>
                )}
                <p className="mt-2 text-foreground/80 text-sm">{a.content}</p>
                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                  <ArrowBigUp className="h-3.5 w-3.5" /> {a.upvotes} upvotes · {a.created_at}
                </div>
              </div>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
