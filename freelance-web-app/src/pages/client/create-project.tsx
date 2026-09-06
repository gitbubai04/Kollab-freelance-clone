import { useFormik } from "formik";
import { ArrowRight, Clock, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateProject } from "@/hooks/use-projects";
import { zodToFormikValidate } from "@/lib/formik-zod";
import { cn } from "@/lib/utils";
import { postProjectSchema, type PostProjectValues } from "@/lib/validation";

const CATEGORIES = ["Web & Mobile Development", "Design Systems", "Web & Browser Dev", "Backend", "AI & Data"];

export function CreateProjectPage() {
  const navigate = useNavigate();
  const createProject = useCreateProject();

  const formik = useFormik<PostProjectValues>({
    initialValues: {
      title: "",
      category: "",
      subcategory: "",
      description: "",
      paymentStructure: "fixed",
      budget: 0,
      deadline: "",
      expertiseLevel: "expert",
    },
    validate: zodToFormikValidate(postProjectSchema),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const project = await createProject.mutateAsync(values);
        toast.success("Project published to vetted freelancers.");
        navigate(`/client/projects/${project.id}`);
      } catch {
        toast.error("Couldn't publish the project. Try again.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Create a New Project</h1>
        <p className="mt-1 text-sm text-muted-foreground">Fill in the details below to publish your project to vetted, elite freelancers.</p>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="title">Project Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Senior Full-Stack Engineer for Next.js SaaS Platform"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.title && formik.errors.title && <p className="text-xs text-destructive">{formik.errors.title}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Select value={formik.values.category} onValueChange={(v) => formik.setFieldValue("category", v)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formik.touched.category && formik.errors.category && <p className="text-xs text-destructive">{formik.errors.category}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="subcategory">Subcategory</Label>
                <Input
                  id="subcategory"
                  name="subcategory"
                  placeholder="Full-Stack Development"
                  value={formik.values.subcategory}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.subcategory && formik.errors.subcategory && <p className="text-xs text-destructive">{formik.errors.subcategory}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Detailed Description</Label>
              <Textarea
                id="description"
                name="description"
                rows={6}
                placeholder="Describe scope, deliverables, and success criteria..."
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.description && formik.errors.description && <p className="text-xs text-destructive">{formik.errors.description}</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contract Type &amp; Budget</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <PaymentOption
                icon={<DollarSign className="size-4" />}
                title="Fixed Price"
                description="Pay upon milestone completion through escrow protection."
                selected={formik.values.paymentStructure === "fixed"}
                onClick={() => formik.setFieldValue("paymentStructure", "fixed")}
              />
              <PaymentOption
                icon={<Clock className="size-4" />}
                title="Hourly Rate"
                description="Pay per logged hour with weekly caps and activity verification."
                selected={formik.values.paymentStructure === "hourly"}
                onClick={() => formik.setFieldValue("paymentStructure", "hourly")}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="budget">Total Milestone Budget (USD)</Label>
                <Input
                  id="budget"
                  name="budget"
                  type="number"
                  placeholder="8500"
                  value={formik.values.budget || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.budget && formik.errors.budget && <p className="text-xs text-destructive">{formik.errors.budget}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="deadline">Estimated Project Deadline</Label>
                <Input
                  id="deadline"
                  name="deadline"
                  type="date"
                  value={formik.values.deadline}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.deadline && formik.errors.deadline && <p className="text-xs text-destructive">{formik.errors.deadline}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Target Expertise Level</Label>
              <div className="grid grid-cols-3 gap-3">
                {(["junior", "intermediate", "expert"] as const).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => formik.setFieldValue("expertiseLevel", level)}
                    className={cn(
                      "rounded-lg border px-3 py-2 text-left text-sm font-medium capitalize transition-colors",
                      formik.values.expertiseLevel === level
                        ? "border-blue-300 bg-blue-50 text-blue-700"
                        : "border-border bg-white text-slate-700 hover:bg-slate-50",
                    )}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline">
            Save as Draft
          </Button>
          <Button type="submit" disabled={formik.isSubmitting}>
            {formik.isSubmitting ? "Publishing..." : "Publish Project"}
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}

function PaymentOption({
  icon,
  title,
  description,
  selected,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-lg border p-4 text-left transition-colors",
        selected ? "border-blue-300 bg-blue-50" : "border-border bg-white hover:bg-slate-50",
      )}
    >
      <div className="flex size-8 items-center justify-center rounded-md bg-blue-100 text-blue-700">{icon}</div>
      <p className="mt-2 text-sm font-semibold text-slate-900">{title}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </button>
  );
}
