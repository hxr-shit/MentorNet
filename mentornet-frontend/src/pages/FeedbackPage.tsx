import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { getSessions, getFeedbacks, addFeedback } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function FeedbackPage() {
  const { currentUser, triggerRefresh, refreshKey } = useApp();
  void refreshKey;
  const sessions = getSessions();
  const feedbacks = getFeedbacks();
  const { toast } = useToast();

  const [sessionId, setSessionId] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !sessionId || !rating) return;
    addFeedback(Number(sessionId), currentUser.id, rating, comment);
    setSessionId(""); setRating(0); setComment("");
    triggerRefresh();
    toast({ title: "Feedback submitted!" });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground mb-6">Feedback</h1>

      {currentUser?.role === "student" && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Submit Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Session</Label>
                <Select value={sessionId} onValueChange={setSessionId}>
                  <SelectTrigger><SelectValue placeholder="Select a session" /></SelectTrigger>
                  <SelectContent>
                    {sessions.map(s => <SelectItem key={s.id} value={String(s.id)}>{s.title}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Rating</Label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(n => (
                    <button key={n} type="button" onClick={() => setRating(n)}>
                      <Star className={`h-6 w-6 ${n <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Comment</Label>
                <Textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Share your experience..." />
              </div>
              <Button type="submit" className="bg-accent text-accent-foreground" disabled={!sessionId || !rating}>Submit Feedback</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <h2 className="text-lg font-semibold mb-4">Recent Feedback</h2>
      <div className="space-y-3">
        {feedbacks.map(f => (
          <Card key={f.id}>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map(n => (
                    <Star key={n} className={`h-4 w-4 ${n <= f.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">by {f.user?.username}</span>
                {f.session && <span className="text-xs text-muted-foreground">• {f.session.title}</span>}
              </div>
              <p className="text-sm">{f.comment}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
