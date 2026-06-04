import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { getSessions, joinSession, addSession } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Users, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Sessions() {
  const { currentUser, triggerRefresh, refreshKey } = useApp();
  void refreshKey;
  const sessions = getSessions();
  const { toast } = useToast();
  const isMentor = currentUser?.role === "professional";
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [date, setDate] = useState("");
  const [capacity, setCapacity] = useState("10");

  const handleJoin = (sessionId: number) => {
    if (!currentUser) return;
    joinSession(sessionId, currentUser.id);
    triggerRefresh();
    toast({ title: "Joined session!" });
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    addSession(currentUser.id, title, desc, date, Number(capacity));
    setTitle(""); setDesc(""); setDate(""); setCapacity("10"); setShowCreate(false);
    triggerRefresh();
    toast({ title: "Session created!" });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Mentorship Sessions</h1>
        {isMentor && (
          <Button onClick={() => setShowCreate(!showCreate)} className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Plus className="h-4 w-4 mr-1" /> Create Session
          </Button>
        )}
      </div>

      {showCreate && isMentor && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Session title" required />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="What will this session cover?" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input type="date" value={date} onChange={e => setDate(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Capacity</Label>
                  <Input type="number" value={capacity} onChange={e => setCapacity(e.target.value)} min="1" required />
                </div>
              </div>
              <Button type="submit" className="bg-accent text-accent-foreground">Create</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {sessions.map(s => {
          const joined = currentUser ? s.attendees.includes(currentUser.id) : false;
          const full = s.attendees.length >= s.capacity;
          return (
            <Card key={s.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{s.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">{s.description}</p>
                <div className="flex items-center gap-3 flex-wrap">
                  <Badge variant="secondary" className="text-xs"><Calendar className="h-3 w-3 mr-1" /> {s.date}</Badge>
                  <Badge variant="outline" className="text-xs"><Users className="h-3 w-3 mr-1" /> {s.attendees.length}/{s.capacity}</Badge>
                  {s.mentor && <Badge className="text-xs bg-primary/10 text-primary">Mentor: {s.mentor.username}</Badge>}
                </div>
                {currentUser?.role === "student" && (
                  <Button
                    size="sm"
                    className="mt-3"
                    disabled={joined || full}
                    onClick={() => handleJoin(s.id)}
                  >
                    {joined ? "Joined ✓" : full ? "Full" : "Join Session"}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
