import { useState } from "react";
import { Star } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useContract } from "@/hooks/use-contracts";
import { cn } from "@/lib/utils";

export function LeaveReviewPage() {
  const { contractId } = useParams<{ contractId: string }>();
  const navigate = useNavigate();
  const { data: contract, isLoading } = useContract(contractId);
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");

  if (isLoading) return <Skeleton className="h-96 w-full" />;
  if (!contract) return <p className="text-sm text-muted-foreground">Contract not found.</p>;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <p className="text-xs text-muted-foreground">Contracts / {contract.id.toUpperCase()} / Complete &amp; Review</p>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Leave a Review</h1>
        <p className="mt-1 text-sm text-muted-foreground">Share your experience working with {contract.clientName} on {contract.projectTitle}.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Overall Performance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} onClick={() => setRating(star)}>
                <Star
                  className={cn("size-8", star <= rating ? "fill-blue-500 text-blue-500" : "text-slate-200")}
                />
              </button>
            ))}
          </div>

          <div className="space-y-1.5">
            <p className="text-sm font-medium text-slate-900">Public Review</p>
            <Textarea
              rows={5}
              placeholder="Share details of your own experience on this project..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />
          </div>

          <div className="rounded-lg bg-slate-50 p-3 text-xs text-muted-foreground">
            Reviews can only be submitted after contract completion. Once published, your feedback is permanent.
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => navigate(`/freelancer/contracts/${contract.id}`)}>
              Cancel
            </Button>
            <Button
              disabled={!review}
              onClick={() => {
                toast.success("Review submitted. Contract handoff complete.");
                navigate("/freelancer/contracts");
              }}
            >
              Submit Review &amp; Complete Handoff
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
