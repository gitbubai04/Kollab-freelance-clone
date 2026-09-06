import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { AdminLayout } from "@/layouts/admin-layout";
import { AuthLayout } from "@/layouts/auth-layout";
import { ClientLayout } from "@/layouts/client-layout";
import { FreelancerLayout } from "@/layouts/freelancer-layout";
import { AdminOverviewPage } from "@/pages/admin/overview";
import { AdminPaymentsPage } from "@/pages/admin/payments";
import { AdminProjectsPage } from "@/pages/admin/projects";
import { AdminUsersPage } from "@/pages/admin/users";
import { AdminWalletsPage } from "@/pages/admin/wallets";
import { CompleteAccountPage } from "@/pages/auth/complete-account";
import { ForgotPasswordPage } from "@/pages/auth/forgot-password";
import { SignInPage } from "@/pages/auth/sign-in";
import { SignUpPage } from "@/pages/auth/sign-up";
import { VerifyEmailPage } from "@/pages/auth/verify-email";
import { ClientOverviewPage } from "@/pages/client/overview";
import { ClientPaymentsPage } from "@/pages/client/payments";
import { ClientProjectDetailPage } from "@/pages/client/project-detail";
import { ClientProjectsListPage } from "@/pages/client/projects-list";
import { ClientProposalsListPage } from "@/pages/client/proposals-list";
import { CreateProjectPage } from "@/pages/client/create-project";
import { ReviewMilestonePage } from "@/pages/client/review-milestone";
import { FindProjectsPage } from "@/pages/freelancer/find-projects";
import { FreelancerOverviewPage } from "@/pages/freelancer/overview";
import { FreelancerProjectDetailPage } from "@/pages/freelancer/project-detail";
import { FreelancerWalletPage } from "@/pages/freelancer/wallet";
import { LeaveReviewPage } from "@/pages/freelancer/leave-review";
import { MyProposalsPage } from "@/pages/freelancer/my-proposals";
import { SubmitProposalPage } from "@/pages/freelancer/submit-proposal";
import { SubmitWorkPage } from "@/pages/freelancer/submit-work";
import { ContractDetailPage } from "@/pages/shared/contract-detail";
import { ContractsListPage } from "@/pages/shared/contracts-list";
import { ForbiddenPage } from "@/pages/shared/forbidden";
import { MessagesPage } from "@/pages/shared/messages";
import { NotFoundPage } from "@/pages/shared/not-found";
import { NotificationsPage } from "@/pages/shared/notifications";
import { SettingsPage } from "@/pages/shared/settings";
import { useAuthStore } from "@/store/auth-store";

export function App() {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Navigate
            to={
              !isAuthenticated
                ? "/sign-in"
                : user?.role === "client"
                  ? "/client/overview"
                  : user?.role === "admin"
                    ? "/admin/overview"
                    : "/freelancer/overview"
            }
            replace
          />
        }
      />

      <Route element={<AuthLayout />}>
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/complete-account" element={<CompleteAccountPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
      </Route>

      <Route path="/settings" element={<ProtectedRoute allow={["client", "freelancer", "admin"]} />}>
        <Route index element={<SettingsPage />} />
      </Route>

      <Route element={<ProtectedRoute allow={["client"]} />}>
        <Route path="/client" element={<ClientLayout />}>
          <Route path="overview" element={<ClientOverviewPage />} />
          <Route path="projects" element={<ClientProjectsListPage />} />
          <Route path="projects/new" element={<CreateProjectPage />} />
          <Route path="projects/:projectId" element={<ClientProjectDetailPage />} />
          <Route path="projects/:projectId/proposals" element={<ClientProposalsListPage />} />
          <Route path="proposals" element={<ClientProposalsListPage />} />
          <Route path="contracts" element={<ContractsListPage />} />
          <Route path="contracts/:contractId" element={<ContractDetailPage />} />
          <Route path="contracts/:contractId/milestones/:milestoneId/review" element={<ReviewMilestonePage />} />
          <Route path="payments" element={<ClientPaymentsPage />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allow={["freelancer"]} />}>
        <Route path="/freelancer" element={<FreelancerLayout />}>
          <Route path="overview" element={<FreelancerOverviewPage />} />
          <Route path="find-projects" element={<FindProjectsPage />} />
          <Route path="find-projects/:projectId" element={<FreelancerProjectDetailPage />} />
          <Route path="find-projects/:projectId/apply" element={<SubmitProposalPage />} />
          <Route path="proposals" element={<MyProposalsPage />} />
          <Route path="contracts" element={<ContractsListPage />} />
          <Route path="contracts/:contractId" element={<ContractDetailPage />} />
          <Route path="contracts/:contractId/milestones/:milestoneId/submit" element={<SubmitWorkPage />} />
          <Route path="contracts/:contractId/review" element={<LeaveReviewPage />} />
          <Route path="wallet" element={<FreelancerWalletPage />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allow={["admin"]} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="overview" element={<AdminOverviewPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="projects" element={<AdminProjectsPage />} />
          <Route path="contracts" element={<ContractsListPage />} />
          <Route path="payments" element={<AdminPaymentsPage />} />
          <Route path="wallets" element={<AdminWalletsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
        </Route>
      </Route>

      <Route path="/403" element={<ForbiddenPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
