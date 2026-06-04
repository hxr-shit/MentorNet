import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Role } from "@/lib/data";

const industries = ["Technology", "Finance", "Consulting", "Product Management", "AI / Machine Learning", "Data Science", "UX Design", "Biotech", "School Student", "Other"];

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [industry, setIndustry] = useState("");
  const [role, setRole] = useState<Role>("student");
  const [grade, setGrade] = useState("");
  const [interests, setInterests] = useState("");
  const { signup } = useApp();
  const navigate = useNavigate();

  const isSchoolStudent = industry === "School Student";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signup(username, email, password, industry || "General", role, isSchoolStudent ? grade : undefined, isSchoolStudent ? interests : undefined);
    navigate("/feed");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Join MentorNet</CardTitle>
          <CardDescription>Create your account and start exploring</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" placeholder="cool_username" value={username} onChange={e => setUsername(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>I am a...</Label>
              <Select value={role} onValueChange={v => setRole(v as Role)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student / Career Seeker</SelectItem>
                  <SelectItem value="professional">Professional / Mentor</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Industry</Label>
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger><SelectValue placeholder="Select your industry" /></SelectTrigger>
                <SelectContent>
                  {industries.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            {isSchoolStudent && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="grade">Class / Grade</Label>
                  <Input id="grade" placeholder="e.g. 10th, 12th" value={grade} onChange={e => setGrade(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="interests">Interests</Label>
                  <Input id="interests" placeholder="e.g. Science, Technology, Arts" value={interests} onChange={e => setInterests(e.target.value)} />
                </div>
              </>
            )}
            <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">Create Account</Button>
          </form>
          <p className="text-sm text-center mt-4 text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">Log in</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
