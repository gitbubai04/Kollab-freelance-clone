import { simulateRequest } from "@/api/mock-utils";
import { mockProjects } from "@/lib/mock-data";
import type { PostProjectValues } from "@/lib/validation";
import type { Project } from "@/types";

export async function getProjects(): Promise<Project[]> {
  return simulateRequest(mockProjects);
}

export async function getProjectById(id: string): Promise<Project | undefined> {
  return simulateRequest(mockProjects.find((p) => p.id === id));
}

export async function createProject(values: PostProjectValues): Promise<Project> {
  const project: Project = {
    id: `prj-${Math.floor(Math.random() * 90000 + 10000)}`,
    code: `PRJ-${Math.floor(Math.random() * 90000 + 10000)}`,
    title: values.title,
    description: values.description,
    category: values.category,
    budget: values.budget,
    paymentStructure: values.paymentStructure,
    status: "open",
    proposalsCount: 0,
    deadline: values.deadline,
    clientName: "Elena Rostova",
    clientCompany: "TechCorp Labs",
    clientRating: 4.98,
    skills: [],
    postedAt: new Date().toISOString(),
    milestones: [],
  };
  return simulateRequest(project, 700);
}
