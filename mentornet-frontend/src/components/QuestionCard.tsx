import { Link } from "react-router-dom";
import { ArrowBigUp, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useApp } from "@/contexts/AppContext";
import { upvoteQuestion } from "@/lib/data";

interface Props {
  id: number;
  title: string;
  content: string;
  tags: string[];
  upvotes: number;
  upvoted_by: number[];
  answerCount: number;
  author?: { username: string; avatar: string } | null;
  created_at: string;
  onVote?: () => void;
}

export function QuestionCard({ id, title, content, tags, upvotes, upvoted_by, answerCount, author, created_at, onVote }: Props) {
  const { currentUser } = useApp();
  const voted = currentUser ? upvoted_by.includes(currentUser.id) : false;

  const handleVote = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    upvoteQuestion(id, currentUser.id);
    onVote?.();
  };

  return (
    <div className="rounded-lg border bg-card p-4 hover:shadow-sm transition-shadow">
      <div className="flex gap-4">
        <div className="flex flex-col items-center gap-1 pt-1">
          <button onClick={handleVote} className={`p-1 rounded-md transition-colors ${voted ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-primary hover:bg-primary/5"}`}>
            <ArrowBigUp className="h-5 w-5" />
          </button>
          <span className={`text-sm font-semibold ${voted ? "text-primary" : "text-muted-foreground"}`}>{upvotes}</span>
        </div>
        <div className="flex-1 min-w-0">
          <Link to={`/q/${id}`} className="block group">
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 text-sm">{title}</h3>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{content}</p>
          </Link>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {tags.map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs font-normal">#{tag}</Badge>
            ))}
          </div>
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            {author && (
              <Link to={`/u/${author.username}`} className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                <Avatar className="h-5 w-5">
                  <AvatarFallback className="text-[10px] bg-primary/10 text-primary">{author.avatar}</AvatarFallback>
                </Avatar>
                {author.username}
              </Link>
            )}
            <span>·</span>
            <span>{created_at}</span>
            <span>·</span>
            <Link to={`/q/${id}`} className="flex items-center gap-1 hover:text-foreground transition-colors">
              <MessageSquare className="h-3.5 w-3.5" /> {answerCount}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
