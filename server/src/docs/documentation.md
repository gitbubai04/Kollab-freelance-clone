# Freelance Project Management Platform

## API Documentation

**Backend:** Express.js (Node.js + TypeScript)
**Database:** MongoDB
**ODM:** Mongoose
**Authentication:** JWT + Refresh Token + Google OAuth
**Payments:** Stripe Test Mode
**API Style:** REST
**API Prefix:** `/api/v1`

---

# 1. Authentication

## 1.1 Register

### `POST /api/v1/auth/register`

Create a new client or freelancer account.

### Request

```json
{
  "email": "john@example.com",
  "password": "Password@123",
  "role": "FREELANCER",
  "fullName": "John Doe"
}
```

### Response `201`

```json
{
  "message": "Registration successful. Please verify your email.",
  "user": {
    "id": "<objectId>",
    "email": "john@example.com",
    "role": "FREELANCER",
    "emailVerified": false
  }
}
```

---

# 1.2 Login

### `POST /api/v1/auth/login`

Authenticate using email and password.

### Request

```json
{
  "email": "john@example.com",
  "password": "Password@123"
}
```

### Response

```json
{
  "accessToken": "jwt-access-token",
  "refreshToken": "refresh-token",
  "user": {
    "id": "<objectId>",
    "email": "john@example.com",
    "role": "FREELANCER"
  }
}
```

---

# 1.3 Refresh Token

### `POST /api/v1/auth/refresh`

Generate a new access token.

### Request

```json
{
  "refreshToken": "refresh-token"
}
```

### Response

```json
{
  "accessToken": "new-access-token",
  "refreshToken": "new-refresh-token"
}
```

---

# 1.4 Logout

### `POST /api/v1/auth/logout`

Revoke the current refresh token.

### Authentication

Required.

### Response

```json
{
  "message": "Logged out successfully."
}
```

---

# 1.5 Forgot Password

### `POST /api/v1/auth/forgot-password`

Send password reset email.

### Request

```json
{
  "email": "john@example.com"
}
```

### Response

```json
{
  "message": "If the email exists, a password reset link has been sent."
}
```

---

# 1.6 Reset Password

### `POST /api/v1/auth/reset-password`

Reset password using reset token.

### Request

```json
{
  "token": "reset-token",
  "password": "NewPassword@123"
}
```

### Response

```json
{
  "message": "Password reset successfully."
}
```

---

# 1.7 Verify Email

### `POST /api/v1/auth/verify-email`

Verify user's email address.

### Request

```json
{
  "token": "verification-token"
}
```

### Response

```json
{
  "message": "Email verified successfully."
}
```

---

# 1.8 Resend Verification Email

### `POST /api/v1/auth/resend-verification`

### Request

```json
{
  "email": "john@example.com"
}
```

### Response

```json
{
  "message": "Verification email sent."
}
```

---

# 1.9 Google OAuth

### `GET /api/v1/auth/google`

Redirect user to Google authentication.

---

# 1.10 Google OAuth Callback

### `GET /api/v1/auth/google/callback`

Google redirects here after successful authentication.

If the Google account is new, the backend should redirect the user to a frontend page where they select:

- CLIENT
- FREELANCER

ADMIN must never be selectable during Google registration.

---

# 2. Users & Profile

## 2.1 Get Current User

### `GET /api/v1/users/me`

### Authentication

Required.

### Response

```json
{
  "id": "<objectId>",
  "email": "john@example.com",
  "role": "FREELANCER",
  "status": "ACTIVE",
  "emailVerified": true,
  "profile": {
    "fullName": "John Doe",
    "bio": "Full-stack developer",
    "professionalTitle": "Senior Developer",
    "hourlyRate": 30,
    "experienceYears": 5,
    "availability": "AVAILABLE",
    "location": "Kolkata, India"
  }
}
```

---

# 2.2 Get Public Profile

### `GET /api/v1/users/:userId/profile`

Returns public profile information.

---

# 2.3 Update Profile

### `PATCH /api/v1/users/me/profile`

### Request

```json
{
  "fullName": "John Doe",
  "bio": "Full-stack developer with 5 years experience.",
  "professionalTitle": "Senior Full Stack Developer",
  "hourlyRate": 35,
  "experienceYears": 5,
  "availability": "AVAILABLE",
  "location": "Kolkata, India"
}
```

---

# 2.4 Update Avatar

### `PATCH /api/v1/users/me/avatar`

Update profile avatar URL.

---

# 3. Skills

## 3.1 Get Skills

### `GET /api/v1/skills`

### Query Parameters

```text
?search=react
```

### Response

```json
[
  {
    "id": "<objectId>",
    "name": "React"
  },
  {
    "id": "<objectId>",
    "name": "React Native"
  }
]
```

---

## 3.2 Add User Skills

### `POST /api/v1/users/me/skills`

### Request

```json
{
  "skillIds": ["skill-id-1", "skill-id-2"]
}
```

---

## 3.3 Remove User Skill

### `DELETE /api/v1/users/me/skills/:skillId`

---

# 4. Client Projects

## 4.1 Create Project

### `POST /api/v1/projects`

### Authentication

CLIENT only.

### Request

```json
{
  "title": "Build a SaaS Dashboard",
  "description": "Need a modern SaaS dashboard using Next.js.",
  "category": "WEB_DEVELOPMENT",
  "projectType": "FIXED",
  "budget": 1500,
  "currency": "USD",
  "deadline": "2026-10-15",
  "skillIds": ["skill-id-1", "skill-id-2"]
}
```

---

# 4.2 Get My Projects

### `GET /api/v1/projects/my`

### Query Parameters

```text
?page=1
&limit=20
&status=OPEN
&search=dashboard
&sortBy=createdAt
&sortOrder=desc
```

### Response

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 0,
    "totalPages": 0
  }
}
```

---

# 4.3 Get Project

### `GET /api/v1/projects/:projectId`

Returns project details.

---

# 4.4 Update Project

### `PATCH /api/v1/projects/:projectId`

CLIENT owner only.

---

# 4.5 Publish Project

### `POST /api/v1/projects/:projectId/publish`

Changes:

```text
DRAFT → OPEN
```

---

# 4.6 Cancel Project

### `POST /api/v1/projects/:projectId/cancel`

---

# 4.7 Complete Project

### `POST /api/v1/projects/:projectId/complete`

Normally available after the associated contract is completed.

---

# 4.8 Browse Open Projects

### `GET /api/v1/projects`

FREELANCER can browse available projects.

### Query Parameters

```text
?page=1
&limit=20
&search=react
&category=WEB_DEVELOPMENT
&projectType=FIXED
&minBudget=500
&maxBudget=3000
&skillId=<objectId>
&sortBy=createdAt
&sortOrder=desc
```

---

# 5. Project Skills

Project skills are managed through project create/update APIs.

### `POST /api/v1/projects/:projectId/skills`

### Request

```json
{
  "skillIds": ["id-1", "id-2"]
}
```

### `DELETE /api/v1/projects/:projectId/skills/:skillId`

---

# 6. Proposals

## 6.1 Submit Proposal

### `POST /api/v1/projects/:projectId/proposals`

FREELANCER only.

### Request

```json
{
  "coverLetter": "I have 5 years of experience building SaaS dashboards.",
  "bidAmount": 1400,
  "currency": "USD",
  "estimatedDays": 20
}
```

---

# 6.2 Get My Proposals

### `GET /api/v1/proposals/my`

### Query Parameters

```text
?page=1
&limit=20
&status=SUBMITTED
```

---

# 6.3 Get Project Proposals

### `GET /api/v1/projects/:projectId/proposals`

CLIENT owner only.

---

# 6.4 Get Proposal Details

### `GET /api/v1/proposals/:proposalId`

---

# 6.5 Accept Proposal

### `POST /api/v1/proposals/:proposalId/accept`

CLIENT only.

### Flow

```text
SUBMITTED
    ↓
ACCEPTED
    ↓
Contract created
```

A notification is sent to the freelancer.

---

# 6.6 Reject Proposal

### `POST /api/v1/proposals/:proposalId/reject`

CLIENT only.

---

# 7. Contracts

## 7.1 Get My Contracts

### `GET /api/v1/contracts/my`

Available to CLIENT and FREELANCER.

### Query Parameters

```text
?page=1
&limit=20
&status=ACTIVE
```

---

# 7.2 Get Contract

### `GET /api/v1/contracts/:contractId`

Returns:

- Project
- Client
- Freelancer
- Proposal
- Contract amount
- Milestones
- Status

---

# 7.3 Start Contract

### `POST /api/v1/contracts/:contractId/start`

Changes:

```text
PENDING → ACTIVE
```

---

# 7.4 Complete Contract

### `POST /api/v1/contracts/:contractId/complete`

Changes:

```text
ACTIVE → COMPLETED
```

---

# 8. Milestones

## 8.1 Create Milestone

### `POST /api/v1/contracts/:contractId/milestones`

CLIENT only.

### Request

```json
{
  "title": "Frontend Development",
  "description": "Build dashboard UI.",
  "amount": 500,
  "currency": "USD",
  "sequence": 1,
  "dueDate": "2026-09-20"
}
```

---

# 8.2 Get Contract Milestones

### `GET /api/v1/contracts/:contractId/milestones`

---

# 8.3 Get Milestone

### `GET /api/v1/milestones/:milestoneId`

---

# 8.4 Update Milestone

### `PATCH /api/v1/milestones/:milestoneId`

Allowed before work starts.

---

# 8.5 Fund Milestone

### `POST /api/v1/milestones/:milestoneId/fund`

CLIENT only.

This creates a Stripe PaymentIntent.

### Response

```json
{
  "paymentId": "<objectId>",
  "clientSecret": "stripe-client-secret"
}
```

---

# 8.6 Submit Milestone Work

### `POST /api/v1/milestones/:milestoneId/submit`

FREELANCER only.

### Request

```json
{
  "message": "The frontend dashboard has been completed."
}
```

Changes:

```text
IN_PROGRESS → SUBMITTED
```

---

# 8.7 Request Revision

### `POST /api/v1/milestones/:milestoneId/request-revision`

CLIENT only.

### Request

```json
{
  "message": "Please update the dashboard chart layout."
}
```

Changes:

```text
SUBMITTED → REVISION_REQUESTED
```

---

# 8.8 Approve Milestone

### `POST /api/v1/milestones/:milestoneId/approve`

CLIENT only.

Changes:

```text
SUBMITTED → APPROVED
```

The milestone payment can then be released.

---

# 8.9 Get Milestone Submissions

### `GET /api/v1/milestones/:milestoneId/submissions`

---

# 9. Payments

## 9.1 Create Payment Intent

### `POST /api/v1/payments/milestones/:milestoneId`

CLIENT only.

### Response

```json
{
  "paymentId": "<objectId>",
  "paymentIntentId": "pi_xxx",
  "clientSecret": "secret_xxx"
}
```

---

# 9.2 Get My Payments

### `GET /api/v1/payments/my`

### Query Parameters

```text
?page=1
&limit=20
&status=SUCCEEDED
&type=MILESTONE
```

---

# 9.3 Get Payment

### `GET /api/v1/payments/:paymentId`

---

# 9.4 Stripe Webhook

### `POST /api/v1/payments/webhook`

This endpoint is called by Stripe.

Important events:

```text
payment_intent.succeeded
payment_intent.payment_failed
payment_intent.canceled
```

The webhook updates:

```text
payments
milestones
wallets
wallet_transactions
notifications
```

Stripe webhook signature verification is required.

---

# 10. Wallet

## 10.1 Get Wallet

### `GET /api/v1/wallet`

FREELANCER only.

### Response

```json
{
  "availableBalance": 1200,
  "pendingBalance": 500,
  "totalEarned": 8500,
  "currency": "USD"
}
```

---

# 10.2 Get Wallet Transactions

### `GET /api/v1/wallet/transactions`

### Query Parameters

```text
?page=1
&limit=20
&type=EARNING
&status=COMPLETED
```

---

# 10.3 Request Payout

### `POST /api/v1/wallet/payout`

FREELANCER only.

### Request

```json
{
  "amount": 500
}
```

### Response

```json
{
  "message": "Payout request submitted.",
  "transactionId": "<objectId>"
}
```

For this practice project, payout processing is simulated.

---

# 10.4 Admin Complete Payout

### `POST /api/v1/admin/wallet/payouts/:transactionId/complete`

ADMIN only.

Changes payout transaction:

```text
PENDING → COMPLETED
```

---

# 11. Conversations

## 11.1 Create Conversation

### `POST /api/v1/conversations`

### Request

```json
{
  "clientId": "<objectId>",
  "freelancerId": "<objectId>",
  "projectId": "<objectId>"
}
```

Usually automatically created when required rather than manually by the frontend.

---

# 11.2 Get My Conversations

### `GET /api/v1/conversations`

### Query Parameters

```text
?page=1
&limit=20
```

---

# 11.3 Get Conversation

### `GET /api/v1/conversations/:conversationId`

---

# 11.4 Send Message

### `POST /api/v1/conversations/:conversationId/messages`

### Request

```json
{
  "content": "Hello, I have reviewed your proposal."
}
```

---

# 11.5 Get Messages

### `GET /api/v1/conversations/:conversationId/messages`

### Query Parameters

```text
?page=1
&limit=50
```

---

# 11.6 Mark Message as Read

### `PATCH /api/v1/messages/:messageId/read`

---

# 12. Message Files

## 12.1 Upload Message File

### `POST /api/v1/messages/:messageId/files`

Multipart upload.

Allowed files should be restricted by:

- MIME type
- File size
- Extension

---

# 12.2 Delete Message File

### `DELETE /api/v1/message-files/:fileId`

---

# 13. Notifications

## 13.1 Get Notifications

### `GET /api/v1/notifications`

### Query Parameters

```text
?page=1
&limit=20
&unread=true
```

---

# 13.2 Get Unread Count

### `GET /api/v1/notifications/unread-count`

### Response

```json
{
  "count": 5
}
```

---

# 13.3 Mark Notification as Read

### `PATCH /api/v1/notifications/:notificationId/read`

---

# 13.4 Mark All Notifications as Read

### `PATCH /api/v1/notifications/read-all`

---

# 14. Reviews

## 14.1 Create Review

### `POST /api/v1/contracts/:contractId/reviews`

### Request

```json
{
  "revieweeId": "<freelancerObjectId>",
  "rating": 5,
  "comment": "Excellent work and communication."
}
```

The reviewer is taken from the authenticated user.

---

# 14.2 Get Contract Reviews

### `GET /api/v1/contracts/:contractId/reviews`

---

# 14.3 Get User Reviews

### `GET /api/v1/users/:userId/reviews`

---

# 15. Admin

All `/admin` endpoints require:

```text
JWT
+
ADMIN role
```

---

## 15.1 Admin Dashboard

### `GET /api/v1/admin/dashboard`

### Response

```json
{
  "users": {
    "total": 1200,
    "clients": 500,
    "freelancers": 690,
    "admins": 10
  },
  "projects": {
    "total": 850,
    "open": 120,
    "inProgress": 250,
    "completed": 430
  },
  "payments": {
    "total": 125000,
    "successful": 118000,
    "failed": 7000
  },
  "wallet": {
    "totalAvailable": 45000,
    "totalPending": 12000
  }
}
```

---

# 15.2 Admin Users

### `GET /api/v1/admin/users`

### Query Parameters

```text
?page=1
&limit=20
&search=john
&role=FREELANCER
&status=ACTIVE
```

---

# 15.3 Admin User Details

### `GET /api/v1/admin/users/:userId`

---

# 15.4 Update User Status

### `PATCH /api/v1/admin/users/:userId/status`

### Request

```json
{
  "status": "SUSPENDED"
}
```

---

# 15.5 Admin Projects

### `GET /api/v1/admin/projects`

### Query Parameters

```text
?page=1
&limit=20
&status=OPEN
&search=dashboard
```

---

# 15.6 Admin Project Details

### `GET /api/v1/admin/projects/:projectId`

---

# 15.7 Admin Payments

### `GET /api/v1/admin/payments`

### Query Parameters

```text
?page=1
&limit=20
&status=SUCCEEDED
&type=MILESTONE
```

---

# 15.8 Admin Payment Details

### `GET /api/v1/admin/payments/:paymentId`

---

# 15.9 Admin Wallet Transactions

### `GET /api/v1/admin/wallet/transactions`

---

# 15.10 Admin Payout Requests

### `GET /api/v1/admin/wallet/payouts`

---

# 15.11 Complete Payout

### `POST /api/v1/admin/wallet/payouts/:transactionId/complete`

---

# 16. Common HTTP Responses

## 200 — Success

```json
{
  "message": "Operation successful."
}
```

## 201 — Created

```json
{
  "message": "Resource created successfully.",
  "data": {}
}
```

## 400 — Bad Request

```json
{
  "statusCode": 400,
  "message": "Invalid request data",
  "error": "Bad Request"
}
```

## 401 — Unauthorized

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

## 403 — Forbidden

```json
{
  "statusCode": 403,
  "message": "You do not have permission to perform this action."
}
```

## 404 — Not Found

```json
{
  "statusCode": 404,
  "message": "Resource not found."
}
```

## 409 — Conflict

```json
{
  "statusCode": 409,
  "message": "Resource already exists."
}
```

---

# 17. Authentication Rules

Every protected endpoint receives:

```http
Authorization: Bearer <access_token>
```

### Role hierarchy

```text
CLIENT
FREELANCER
ADMIN
```

ADMIN access should be protected using a dedicated `adminMiddleware`.

---

# 18. Important Business Rules

### Project

```text
Only CLIENT can create projects.
Only project owner can edit/publish/cancel.
```

### Proposal

```text
Only FREELANCER can submit proposals.
One freelancer can submit only one proposal per project.
Client can accept/reject proposals.
```

### Contract

```text
One project can have one contract.
Contract is created when a proposal is accepted.
```

### Milestone

```text
Milestones belong to a contract.
Milestone sequence must be unique inside a contract.
```

### Payment

```text
Only CLIENT can fund milestones.
Stripe handles payment processing.
Card details are never stored.
```

### Wallet

```text
Wallet belongs to FREELANCER.
Successful milestone payments increase wallet balance.
Payout reduces available balance.
```

### Review

```text
Only contract participants can leave reviews.
One review per reviewer per contract.
Rating must be 1–5.
```

### Messaging

```text
Only conversation participants can read/send messages.
```

---

# 19. Notification Events

The backend should create notifications for:

```text
NEW_PROPOSAL
PROPOSAL_ACCEPTED
PROPOSAL_REJECTED

CONTRACT_CREATED

MILESTONE_FUNDED
MILESTONE_SUBMITTED
REVISION_REQUESTED
MILESTONE_APPROVED

PAYMENT_SUCCEEDED
PAYMENT_FAILED

NEW_MESSAGE

PAYOUT_REQUESTED
PAYOUT_COMPLETED

REVIEW_RECEIVED

SYSTEM
```

---

# 20. Recommended Express Module Structure

```text
src/
├── constant/
├── controllers/
├── interface/
├── middleware/
├── models/
├── openapi/
├── routes/
├── utils/
├── validators/
├── app.ts
└── index.ts
```

---

# 21. API Development Order

Recommended implementation order:

```text
1. Mongoose + Database
2. Users + Profiles
3. Authentication
4. Skills
5. Projects
6. Proposals
7. Contracts
8. Milestones
9. Payments
10. Wallet
11. Conversations
12. Messages
13. Notifications
14. Reviews
15. Admin
16. Stripe Webhook
17. Validation + Error Handling
18. Swagger Documentation
```

This order follows the project's actual business dependency chain.
