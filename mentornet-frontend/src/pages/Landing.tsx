import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight, MessageSquare, Users, Star, Shield, BarChart3,
  CalendarCheck, Send, TrendingUp, Award,
} from "lucide-react";

const features = [
  { icon: MessageSquare, title: "Community Discussions", desc: "Ask questions, share insights, and learn from peers across industries." },
  { icon: CalendarCheck, title: "Mentorship Sessions", desc: "Book 1-on-1 sessions with experienced professionals in your field." },
  { icon: Star, title: "Real-time Feedback", desc: "Get ratings and reviews on sessions to ensure quality guidance." },
  { icon: Shield, title: "Role-based System", desc: "Students, mentors, and admins — each with tailored experiences." },
  { icon: BarChart3, title: "Data-driven Insights", desc: "Analytics dashboards powered by structured SQL queries." },
];

const steps = [
  { num: "01", title: "Ask Questions", desc: "Post your career questions to the community and get real answers." },
  { num: "02", title: "Connect with Mentors", desc: "Browse mentor profiles and find the right guidance for your goals." },
  { num: "03", title: "Book Sessions & Get Feedback", desc: "Schedule mentorship sessions and rate your experience." },
];

const analytics = [
  { label: "Most Active Users", items: ["@priya_dev", "@john_mentor", "@sara_ai", "@raj_fin"], icon: Users },
  { label: "Popular Communities", items: ["#AI & ML", "#Finance", "#Consulting", "#Biotech"], icon: TrendingUp },
  { label: "Avg Session Ratings", items: ["Mentoring: 4.8★", "Career Q&A: 4.6★", "Resume Review: 4.9★", "Mock Interview: 4.7★"], icon: Award },
];

export default function Landing() {
  const [question, setQuestion] = useState("");

  const handleAsk = () => {
    if (question.trim()) {
      alert(`Your question: "${question}" — Sign up to post it!`);
    }
  };

  return (
    <div className="min-h-screen scroll-smooth">
      {/* Hero */}
      <section className="bg-background">
        <div className="max-w-3xl mx-auto px-4 pt-32 pb-28 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-foreground">
            Build Your Career with{" "}
            <span className="text-primary">MentorNet</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Connect with mentors, explore communities, and grow with guided career support.
          </p>

          <div className="mt-12 max-w-lg mx-auto">
            <div className="flex items-center gap-2 bg-card border rounded-xl p-1.5 shadow-sm">
              <Input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAsk()}
                placeholder="Ask your career question..."
                className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 h-11 text-base"
              />
              <Button onClick={handleAsk} className="rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shrink-0 h-9 px-5">
                Ask
              </Button>
            </div>
          </div>

          <p className="mt-14 text-sm text-muted-foreground">
            500+ Professionals &nbsp;·&nbsp; 2,000+ Answers &nbsp;·&nbsp; 4.8 Rating
          </p>
        </div>
      </section>

      {/* About */}
      <section id="about" className="max-w-4xl mx-auto px-4 py-24 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
          What is <span className="text-primary">MentorNet</span>?
        </h2>
        <p className="mt-6 text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
          MentorNet is a database-driven career counseling platform where <strong className="text-foreground">students ask career questions</strong>, <strong className="text-foreground">mentors provide expert guidance</strong>, and everyone benefits from a structured system of sessions, feedback, and community discussions. Built as a DBMS project, it showcases real-world database operations — INSERT, SELECT, JOIN, UPDATE — through a clean, modern interface.
        </p>
      </section>

      {/* Features */}
      <section id="features" className="bg-muted/50 py-24">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center">Features</h2>
          <p className="text-muted-foreground text-center mt-3 mb-12">Everything you need for career growth, in one place.</p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <Card key={f.title} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex flex-col items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <f.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground text-lg">{f.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="max-w-5xl mx-auto px-4 py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center">How It Works</h2>
        <p className="text-muted-foreground text-center mt-3 mb-14">Three simple steps to kickstart your career journey.</p>

        <div className="grid md:grid-cols-3 gap-10">
          {steps.map((s) => (
            <div key={s.num} className="text-center">
              <span className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-br from-primary to-accent">
                {s.num}
              </span>
              <h3 className="mt-4 text-xl font-semibold text-foreground">{s.title}</h3>
              <p className="mt-2 text-muted-foreground text-sm">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Analytics */}
      <section id="analytics" className="bg-muted/50 py-24">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center">Platform Analytics</h2>
          <p className="text-muted-foreground text-center mt-3 mb-12">Real data insights powered by SQL queries under the hood.</p>

          <div className="grid md:grid-cols-3 gap-6">
            {analytics.map((a) => (
              <Card key={a.label} className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-9 w-9 rounded-lg bg-accent/10 flex items-center justify-center">
                      <a.icon className="h-5 w-5 text-accent" />
                    </div>
                    <h3 className="font-semibold text-foreground">{a.label}</h3>
                  </div>
                  <ul className="space-y-2">
                    {a.items.map((item) => (
                      <li key={item} className="text-sm text-muted-foreground flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-24">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">Start your journey today</h2>
          <p className="mt-4 text-primary-foreground/80 text-lg">Join hundreds of students and mentors building their careers together.</p>
          <Link to="/signup">
            <Button size="lg" className="mt-8 rounded-lg bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold text-base px-8">
              Join MentorNet <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-10">
        <div className="max-w-5xl mx-auto px-4 flex flex-col items-center gap-4">
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#about" className="hover:text-foreground transition-colors">About</a>
            <a href="#contact" className="hover:text-foreground transition-colors">Contact</a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">GitHub</a>
          </div>
          <p className="text-xs text-muted-foreground">DBMS Project — MentorNet © 2025</p>
        </div>
      </footer>
    </div>
  );
}
