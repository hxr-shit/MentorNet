import { useParams } from "react-router-dom";
import { getCommunityWithPosts } from "@/lib/data";
import { QuestionCard } from "@/components/QuestionCard";
import { useApp } from "@/contexts/AppContext";

export default function CommunityDetail() {
  const { id } = useParams();
  const { triggerRefresh, refreshKey } = useApp();
  void refreshKey;
  const community = getCommunityWithPosts(Number(id));

  if (!community) return <div className="max-w-4xl mx-auto px-4 py-8 text-center text-muted-foreground">Community not found.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">{community.icon}</span>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{community.name}</h1>
          <p className="text-sm text-muted-foreground">{community.description}</p>
        </div>
      </div>
      <div className="space-y-4">
        {community.questions.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No posts in this community yet.</p>
        ) : (
          community.questions.map(q => <QuestionCard key={q.id} {...q} onVote={triggerRefresh} />)
        )}
      </div>
    </div>
  );
}
