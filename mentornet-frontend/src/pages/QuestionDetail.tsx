import { useParams } from "react-router-dom";
import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { getQuestionWithAnswers, addAnswer, upvoteQuestion, upvoteAnswer } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowBigUp, CheckCircle2, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

export default function QuestionDetail() {
  const { id } = useParams();
  const { currentUser, triggerRefresh, refreshKey } = useApp();
  const [answerText, setAnswerText] = useState("");

  void refreshKey;
  const data = getQuestionWithAnswers(Number(id));
  if (!data) return <div className="max-w-3xl mx-auto px-4 py-12 text-center text-muted-foreground">Question not found.</div>;

  const voted = currentUser ? data.upvoted_by.includes(currentUser.id) : false;

  const handleVoteQuestion = () => {
    if (!currentUser) return;
    upvoteQuestion(data.id, currentUser.id);
    triggerRefresh();
  };

  const handleVoteAnswer = (answerId: number) => {
    if (!currentUser) return;
    upvoteAnswer(answerId, currentUser.id);
    triggerRefresh();
  };

  const handleSubmitAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !answerText.trim()) return;
    addAnswer(data.id, currentUser.id, answerText.trim());
    setAnswerText("");
    triggerRefresh();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Question */}
      <div className="bg-card rounded-xl border p-6">
        <div className="flex gap-4">
          <div className="flex flex-col items-center gap-1">
            <button onClick={handleVoteQuestion} className={`p-1.5 rounded-md transition-colors ${voted ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-primary hover:bg-primary/5"}`}>
              <ArrowBigUp className="h-6 w-6" />
            </button>
            <span className={`text-sm font-bold ${voted ? "text-primary" : "text-muted-foreground"}`}>{data.upvotes}</span>
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground">{data.title}</h1>
            <p className="mt-3 text-foreground/80 leading-relaxed">{data.content}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {data.tags.map(tag => <Badge key={tag} variant="secondary" className="text-xs">#{tag}</Badge>)}
            </div>
            <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
              {data.author && (
                <Link to={`/u/${data.author.username}`} className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                  <Avatar className="h-5 w-5"><AvatarFallback className="text-[10px] bg-primary/10 text-primary">{data.author.avatar}</AvatarFallback></Avatar>
                  {data.author.username}
                </Link>
              )}
              <span>· {data.created_at}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Answers */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <MessageSquare className="h-5 w-5" /> {data.answers.length} Answers
        </h2>
        <div className="space-y-4">
          {data.answers.map(a => {
            const aVoted = currentUser ? a.upvoted_by.includes(currentUser.id) : false;
            return (
              <div key={a.id} className={`bg-card rounded-xl border p-5 ${a.is_top ? "ring-2 ring-accent/30" : ""}`}>
                {a.is_top && (
                  <div className="flex items-center gap-1.5 text-accent text-xs font-medium mb-3">
                    <CheckCircle2 className="h-4 w-4" /> Top Answer
                  </div>
                )}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center gap-1">
                    <button onClick={() => handleVoteAnswer(a.id)} className={`p-1 rounded-md transition-colors ${aVoted ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-primary hover:bg-primary/5"}`}>
                      <ArrowBigUp className="h-5 w-5" />
                    </button>
                    <span className={`text-xs font-semibold ${aVoted ? "text-primary" : "text-muted-foreground"}`}>{a.upvotes}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-foreground/80 leading-relaxed">{a.content}</p>
                    <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                      {a.author && (
                        <Link to={`/u/${a.author.username}`} className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                          <Avatar className="h-5 w-5"><AvatarFallback className="text-[10px] bg-accent/10 text-accent">{a.author.avatar}</AvatarFallback></Avatar>
                          {a.author.username}
                        </Link>
                      )}
                      <span>· {a.created_at}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Post Answer */}
      {currentUser && (
        <form onSubmit={handleSubmitAnswer} className="mt-8 bg-card rounded-xl border p-5">
          <h3 className="font-semibold mb-3">Your Answer</h3>
          <Textarea
            placeholder="Share your experience or advice..."
            value={answerText}
            onChange={e => setAnswerText(e.target.value)}
            className="min-h-[120px]"
            required
          />
          <Button type="submit" className="mt-3 bg-accent text-accent-foreground hover:bg-accent/90">Post Answer</Button>
        </form>
      )}
    </div>
  );
}
