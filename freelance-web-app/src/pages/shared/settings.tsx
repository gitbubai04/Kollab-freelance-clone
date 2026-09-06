import { useFormik } from "formik";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { initials } from "@/lib/format";
import { useAuthStore } from "@/store/auth-store";

export function SettingsPage() {
  const { user, updateUser } = useAuthStore();

  const formik = useFormik({
    initialValues: {
      fullName: user?.fullName ?? "",
      title: user?.title ?? "",
      email: user?.email ?? "",
      company: user?.company ?? "",
    },
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting }) => {
      updateUser(values);
      toast.success("Profile updated.");
      setSubmitting(false);
    },
  });

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Profile &amp; Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your public profile identity and account details.</p>
      </div>

      <form onSubmit={formik.handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Public Identity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="size-16">
                <AvatarImage src={user?.avatarUrl} />
                <AvatarFallback className="text-lg">{initials(user?.fullName ?? "U")}</AvatarFallback>
              </Avatar>
              <div>
                <Button type="button" variant="outline" size="sm">
                  Upload new photo
                </Button>
                <p className="mt-1 text-xs text-muted-foreground">JPG, PNG, or WebP. Max 5MB.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" name="fullName" value={formik.values.fullName} onChange={formik.handleChange} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="title">Professional Title</Label>
                <Input id="title" name="title" value={formik.values.title} onChange={formik.handleChange} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={formik.values.email} onChange={formik.handleChange} disabled />
            </div>

            {user?.role === "client" && (
              <div className="space-y-1.5">
                <Label htmlFor="company">Company</Label>
                <Input id="company" name="company" value={formik.values.company} onChange={formik.handleChange} />
              </div>
            )}

            {user?.role === "freelancer" && (
              <div className="space-y-1.5">
                <Label htmlFor="bio">Bio &amp; Professional Summary</Label>
                <Textarea id="bio" rows={4} placeholder="Senior Systems & Product Designer with 9+ years experience..." />
              </div>
            )}

            <div className="flex justify-end">
              <Button type="submit" disabled={formik.isSubmitting}>
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
