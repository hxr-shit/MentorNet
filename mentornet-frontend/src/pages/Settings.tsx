import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { currentUser, updateProfile } = useApp();
  const { toast } = useToast();

  const [username, setUsername] = useState(currentUser?.username || "");
  const [bio, setBio] = useState(currentUser?.bio || "");
  const [industry, setIndustry] = useState(currentUser?.industry || "");
  const [interests, setInterests] = useState(currentUser?.interests || "");
  const [grade, setGrade] = useState(currentUser?.grade || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ username, bio, industry, interests, grade });
    toast({ title: "Profile updated!" });
  };

  if (!currentUser) return null;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground mb-6">Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Profile Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Username</Label>
              <Input value={username} onChange={e => setUsername(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Bio</Label>
              <Textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell us about yourself..." />
            </div>
            <div className="space-y-2">
              <Label>Industry</Label>
              <Input value={industry} onChange={e => setIndustry(e.target.value)} />
            </div>
            {currentUser.industry === "School Student" && (
              <>
                <div className="space-y-2">
                  <Label>Grade</Label>
                  <Input value={grade} onChange={e => setGrade(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Interests</Label>
                  <Input value={interests} onChange={e => setInterests(e.target.value)} />
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={currentUser.email} disabled className="bg-muted" />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Input value={currentUser.role} disabled className="bg-muted capitalize" />
            </div>
            <Button type="submit" className="bg-accent text-accent-foreground">Save Changes</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
