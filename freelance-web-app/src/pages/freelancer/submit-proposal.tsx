import { useFormik } from "formik";
import { ArrowRight } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useProject } from "@/hooks/use-projects";
import { useSubmitProposal } from "@/hooks/use-proposals";
import { zodToFormikValidate } from "@/lib/formik-zod";
import { formatCurrency } from "@/lib/format";
import { submitProposalSchema, type SubmitProposalValues } from "@/lib/validation";

export function SubmitProposalPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { data: project, isLoading } = useProject(projectId);
  const submitProposal = useSubmitProposal(projectId ?? "");

  const formik = useFormik<SubmitProposalValues>({
    initialValues: { bidAmount: project?.budget ?? 0, deliveryDays: 14, coverLetter: "" },
    enableReinitialize: true,
    validate: zodToFormikValidate(submitProposalSchema),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await submitProposal.mutateAsync(values);
        toast.success("Proposal submitted successfully.");
        navigate("/freelancer/proposals");
      } catch {
        toast.error("Couldn't submit the proposal. Try again.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  if (isLoading) return <Skeleton className="h-96 w-full" />;
  if (!project) return <p className="text-sm text-muted-foreground">Project not found.</p>;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="text-xs text-muted-foreground">Find Projects / {project.title}</p>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Submit a Proposal</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Client budget: {formatCurrency(project.budget)} {project.paymentStructure} · {project.proposalsCount} proposals submitted
        </p>
      </div>

      <form onSubmit={formik.handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Terms &amp; Bid Amount</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="bidAmount">Total Bid Amount (USD)</Label>
                <Input
                  id="bidAmount"
                  name="bidAmount"
                  type="number"
                  value={formik.values.bidAmount || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.bidAmount && formik.errors.bidAmount && (
                  <p className="text-xs text-destructive">{formik.errors.bidAmount}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="deliveryDays">Estimated Delivery (days)</Label>
                <Input
                  id="deliveryDays"
                  name="deliveryDays"
                  type="number"
                  value={formik.values.deliveryDays || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.deliveryDays && formik.errors.deliveryDays && (
                  <p className="text-xs text-destructive">{formik.errors.deliveryDays}</p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="coverLetter">Cover Letter &amp; Approach</Label>
              <Textarea
                id="coverLetter"
                name="coverLetter"
                rows={8}
                placeholder="Demonstrate relevant systems experience, domain expertise, and velocity..."
                value={formik.values.coverLetter}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.coverLetter && formik.errors.coverLetter && (
                <p className="text-xs text-destructive">{formik.errors.coverLetter}</p>
              )}
            </div>

            <div className="rounded-lg bg-blue-50 p-3 text-xs text-blue-800">
              Upon client acceptance, Milestone 1 must be funded into Escrow before work is initiated. You never
              work unprotected.
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline">
                Save Draft
              </Button>
              <Button type="submit" disabled={formik.isSubmitting}>
                {formik.isSubmitting ? "Submitting..." : "Submit Proposal"}
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
