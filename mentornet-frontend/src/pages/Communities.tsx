import { getCommunities } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Users } from "lucide-react";

export default function Communities() {
  const communities = getCommunities();

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground mb-6">Communities</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {communities.map(c => (
          <Link key={c.id} to={`/community/${c.id}`}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="text-2xl">{c.icon}</span> {c.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">{c.description}</p>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="text-xs">
                    <Users className="h-3 w-3 mr-1" /> {c.members} members
                  </Badge>
                  <Badge variant="outline" className="text-xs">{c.posts.length} posts</Badge>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
