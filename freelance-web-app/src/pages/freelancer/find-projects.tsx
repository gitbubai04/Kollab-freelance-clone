import { useState } from "react";
import { Bookmark, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useProjects } from "@/hooks/use-projects";
import { formatCurrency, formatDate } from "@/lib/format";

const CATEGORIES = ["Design & Creative", "Web & Software Dev", "AI & Machine Learning", "Mobile Development", "DevOps"];

export function FindProjectsPage() {
  const { data: projects } = useProjects();
  const [search, setSearch] = useState("");

  const openProjects = (projects ?? []).filter(
    (p) => p.status === "open" && p.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr]">
      <aside className="space-y-6">
        <div>
          <h2 className="mb-3 text-sm font-semibold text-slate-900">Categories</h2>
          <div className="space-y-2 text-sm">
            {CATEGORIES.map((c) => (
              <label key={c} className="flex items-center gap-2 text-muted-foreground">
                <input type="checkbox" className="size-3.5 rounded border-border" />
                {c}
              </label>
            ))}
          </div>
        </div>
        <div className="rounded-lg bg-blue-50 p-3 text-xs text-blue-800">
          <p className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="size-3.5" /> 100% Escrow Guarantee
          </p>
          <p className="mt-1">Funds for active milestones are pre-funded by clients before you begin working.</p>
        </div>
      </aside>

      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Find Projects</h1>
          <p className="mt-1 text-sm text-muted-foreground">Browse and apply to verified high-impact client projects.</p>
        </div>
        <Input
          placeholder="Search by title, keywords, tech stack..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-white"
        />

        <div className="space-y-4">
          {openProjects.map((project) => (
            <Card key={project.id}>
              <CardContent>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-emerald-50 text-emerald-700">
                        ★ {project.clientRating} Verified Client
                      </Badge>
                      <span className="text-xs text-muted-foreground">Posted {formatDate(project.postedAt)}</span>
                    </div>
                    <Link to={`/freelancer/find-projects/${project.id}`}>
                      <h3 className="mt-2 text-base font-semibold text-slate-900 hover:text-blue-600">{project.title}</h3>
                    </Link>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{project.description}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {project.skills.slice(0, 5).map((skill) => (
                        <span key={skill} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="w-40 shrink-0 text-right">
                    <p className="text-lg font-semibold text-slate-900">{formatCurrency(project.budget)}</p>
                    <p className="text-xs text-muted-foreground capitalize">{project.paymentStructure} Price</p>
                    <button className="mt-2 inline-flex text-muted-foreground hover:text-slate-700">
                      <Bookmark className="size-4" />
                    </button>
                    <Button asChild size="sm" className="mt-2 w-full">
                      <Link to={`/freelancer/find-projects/${project.id}`}>View Project</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
