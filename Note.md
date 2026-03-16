# Service Marketplace Platform — Implementation Plan

## Context
Building a full-stack **Electrical Services** marketplace from scratch based on `Project.md`. The project is at bare scaffolding: Django project exists with no custom apps, no DRF, no React frontend. Three user roles (Admin, Seller, User). The platform lets users browse and pay for fence and deck experts.

---

## Architectural Decisions

- **Rating field**: Add `rating` (DecimalField 3,2, default 0.0) directly to the `Service` model — it's displayed on both list and detail screens but not in any model spec.
- **JWT storage**: Store access/refresh tokens in `localStorage` as `userInfo` JSON blob `{ token, refreshToken, id, username, email, role, merchant_id }`.
- **PayPal**: Use `@paypal/react-paypal-js` on the frontend only. No server-side PayPal SDK. Set `payee.merchant_id` in the purchase unit to route payment to the seller. Capture `orderID` from `onApprove` and POST to `/api/v1/orders/create/`.
- **AI Chatbot**: `openai` Python package, `gpt-4o-mini`, stateless (no conversation history). System prompt constrains responses to platform topics.
- **Media files**: `sample_image` goes to `media/services/`. Django serves in dev via `static()` appended to `urlpatterns`.
- **CORS**: `http://localhost:3000` added to `CORS_ALLOWED_ORIGINS`.

---

## Packages to Install

### Backend (into existing venv)
```
pip install djangorestframework djangorestframework-simplejwt django-cors-headers Pillow openai
```

### Frontend (new React app at `frontend/`)
```
npx create-react-app frontend
cd frontend
npm install react-redux @reduxjs/toolkit axios react-router-dom @paypal/react-paypal-js
```

---

## Stage 1: Foundation & Authentication
**Goal**: Working JWT auth API + React app with SignIn/SignUp screens and Redux store.

### Backend
- Install all 5 packages above
- Update `backend/settings.py`:
  - Add to `INSTALLED_APPS`: `rest_framework`, `rest_framework_simplejwt`, `corsheaders`, `users`
  - Add `CorsMiddleware` first in `MIDDLEWARE`
  - Add `CORS_ALLOWED_ORIGINS`, `AUTH_USER_MODEL = 'users.CustomUser'`, `REST_FRAMEWORK` config with JWT default auth, `SIMPLE_JWT` config, `MEDIA_URL`/`MEDIA_ROOT`
- `python manage.py startapp users`
- `users/models.py`: `CustomUser(AbstractUser)` — add `phone_number`, `location`, `gender`, `role` (choices: user/seller/admin, default user), `merchant_id`; set `USERNAME_FIELD = 'email'`
- `users/serializers.py`: `UserSerializer`, `RegisterSerializer` (validates password match, calls `set_password`), `MyTokenObtainPairSerializer` (adds role/merchant_id/email to token payload)
- `users/views.py`: `MyTokenObtainPairView`, `RegisterView` (AllowAny), `UserProfileView` (IsAuthenticated), `AdminUserListView` (admin-only)
- `users/urls.py`: `login/`, `register/`, `profile/`, `admin/users/`, `admin/users/<pk>/`
- Update `backend/urls.py`: add `/api/v1/users/` include + media static serving
- `makemigrations users` → `migrate` → `createsuperuser`

### Frontend
- Scaffold React app at `frontend/`, install packages, clean CRA boilerplate
- Create structure: `actions/`, `constants/`, `reducers/`, `screens/`, `components/`, `store.js`, `axiosInstance.js`
- `store.js`: RTK `configureStore`, initial state reads `localStorage`
- `axiosInstance.js`: baseURL `http://localhost:8000`, request interceptor sets `Authorization: Bearer <token>`
- `userConstants.js`, `userReducers.js`, `userActions.js` (login, logout, register)
- `SignIn.jsx`: email+password form → dispatches `login` → redirects to `/`
- `SignUp.jsx`: all 8 fields + confirm_password → dispatches `register` → redirects to `/signin`
- `App.js`: BrowserRouter + Provider + routes `/signin`, `/register`

**Success criteria**: Register creates user (201), login returns JWT + role, profile returns 401 without token, React forms store token and reflect logged-in state.

---

## Stage 2: Services & Seller Application Flow
**Goal**: Sellers apply, admins approve/decline, sellers manage services, all users browse.

### Backend
- `python manage.py startapp applications` + `startapp services`
- Add both to `INSTALLED_APPS`
- `applications/models.py`: `SellerApplication` — `user` (OneToOneField), `status` (pending/approved/declined), `decline_reason`, `created_at`
- `applications/views.py`: `SubmitApplicationView` (IsAuthenticated, sets user=request.user), `ListApplicationView` (admin-only), `ApproveApplicationView` (sets role=seller, generates merchant_id via `uuid4().hex[:12].upper()`), `DeclineApplicationView` (sets decline_reason)
- `applications/urls.py`: `apply/`, `list/`, `<pk>/approve/`, `<pk>/decline/`
- `services/models.py`: `Service` — `seller` (FK→CustomUser), `service_name`, `description`, `price`, `duration_of_service`, `sample_image`, `rating` (default 0.0)
- `services/serializers.py`: `ServiceSerializer` with `seller_name` (SerializerMethodField) and absolute URL for `sample_image` via `to_representation`
- `services/views.py`: `ServiceListView` (AllowAny), `ServiceDetailView` (AllowAny), `SellerServiceManageView` (IsAuthenticated, filters by seller), `SellerServiceDetailView` (owner-only CRUD)
- `services/urls.py`: `list/`, `<pk>/`, `manage/`, `manage/<pk>/`
- Update root `urls.py`, run migrations

### Frontend
- Add: `serviceActions.js`, `applicationActions.js` + matching constants/reducers
- `HomeScreen.jsx`: dispatch `listServices`, render card grid (image, name, description, rating) → click → `/services/:id`
- `DetailScreen.jsx`: dispatch `getServiceDetail(id)`, show all fields including seller name
- `ApplySeller.jsx`: protected, submit button → `submitApplication`, show success/disable after
- `SellerDashboard.jsx`: protected (role=seller), form to add service (uses FormData for image), table of own services with edit/delete
- Add routes: `/`, `/services/:id`, `/apply`, `/seller/dashboard`

**Success criteria**: Service list/detail work unauthenticated; seller can CRUD own services; approve sets role+merchant_id; service images serve from `/media/services/`.

---

## Stage 3: Orders & PayPal
**Goal**: Users pay via PayPal, orders are recorded, order history shown on profile.

### Backend
- `python manage.py startapp orders`
- `orders/models.py`: `Order` — `buyer` (FK→CustomUser), `service` (FK→Service, PROTECT), `paypal_transaction_id` (unique CharField), `price_paid`, `date_purchased`
- `orders/views.py`: `CreateOrderView` (IsAuthenticated, sets buyer=request.user, guards duplicate transaction_id), `UserOrderHistoryView` (filters by request.user)
- `orders/urls.py`: `create/`, `history/`
- Update root `urls.py`, run migrations

### Frontend
- Add `orderActions.js` + constants/reducers
- `DetailScreen.jsx` update: wrap "Avail Service" in `PayPalScriptProvider` (client-id from `REACT_APP_PAYPAL_CLIENT_ID`); `createOrder` sets `amount.value`, `description`, `payee.merchant_id`; `onApprove` dispatches `createOrder({ service, paypal_transaction_id, price_paid })`
- `UserProfile.jsx`: protected, show user info + orders table (service name, price, date)
- Add `.env`: `REACT_APP_PAYPAL_CLIENT_ID=<sandbox_client_id>`
- Add route `/profile`

**Success criteria**: PayPal sandbox button renders, completing payment creates Order record, duplicate transaction_id returns 400, order history populates on profile.

---

## Stage 4: Admin Panel & AI Chatbot
**Goal**: Admin manages users and applications via UI; chatbot answers platform questions.

### Backend
- `python manage.py startapp chat`
- `chat/views.py`: `AIChatbotView` (IsAuthenticated POST) — reads `message` from body, calls OpenAI `gpt-4o-mini` with system prompt: `"You are a helpful assistant for a Fence & Deck Services marketplace. Answer only questions about fence and deck services, how to hire experts, pricing, how to become a seller, or how to place orders. Decline anything outside this scope."`, returns `{ "reply": "..." }`
- `chat/urls.py`: `ask/`
- Add `OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY', '')` to `settings.py`
- Add `AdminUserDetailView` (RetrieveUpdateDestroyAPIView) at `admin/users/<pk>/`
- Update root `urls.py`, no migration needed for chat

### Frontend
- `UserScreen.jsx`: admin-only protected; tabs via local state
  - Users Tab: dispatch `listAllUsers` → table with first_name, last_name, email + Edit/Delete CTAs
  - Seller Applications Tab: dispatch `listApplications` → table with applicant + status + Approve/Decline CTAs
- `DeclineModal.jsx`: modal with textarea for reason; dispatches `declineApplication(id, reason)` on confirm
- `Chatbot.jsx`: floating button (bottom-right), toggles chat window; dispatches `sendChatMessage` → POST to `/api/v1/chat/ask/`; renders AI reply; auth-only
- Mount `<Chatbot />` globally in `App.js`
- Add route `/admin/users` (redirect to `/` if role ≠ admin)

**Success criteria**: Chatbot returns contextual answers, rejects off-topic questions; admin can approve/decline applications from UI; decline stores reason; non-admin redirect works.

---

## Stage 5: Polish, Protection & Integration QA
**Goal**: All routes protected correctly, forms validated, images load, full e2e journey works.

### Backend
- Custom `IsSeller` and `IsAdmin` permission classes
- Add validators (`MinValueValidator(0)`) on `price` and `rating`
- Ensure correct HTTP status codes on all views (201, 200, 204, 400)
- `ALLOWED_HOSTS = ['localhost', '127.0.0.1']`

### Frontend
- `ProtectedRoute.jsx`: reads Redux `userInfo`; redirects to `/signin` if falsy; accepts optional `requiredRole` prop
- Apply to all auth-required routes; non-matching role redirects to `/`
- Form validation: `SignUp` (required, email format, password ≥8 chars, match), `SellerDashboard` (required name, positive price), `DeclineModal` (required reason)
- Axios interceptor: catch 401 → dispatch logout → redirect `/signin`
- `Loading.jsx` spinner for loading states
- Fix image URLs: prefix relative media paths with `http://localhost:8000` in dev

**Final route map**:
| Route | Screen | Protection |
|---|---|---|
| `/` | HomeScreen | Public |
| `/services/:id` | DetailScreen | Public (PayPal for auth only) |
| `/signin` | SignIn | Redirect to `/` if logged in |
| `/register` | SignUp | Redirect to `/` if logged in |
| `/apply` | ApplySeller | ProtectedRoute |
| `/seller/dashboard` | SellerDashboard | ProtectedRoute (role=seller) |
| `/admin/users` | UserScreen | ProtectedRoute (role=admin) |
| `/profile` | UserProfile | ProtectedRoute |

**Success criteria**: Full journey — Register → Login → Browse → Pay → View order in profile. Unauthenticated/wrong-role redirects work. All forms validate client-side before API calls.

---

## Critical Files

| File | Purpose |
|---|---|
| `backend/backend/settings.py` | All app registrations, JWT, CORS, AUTH_USER_MODEL, media config |
| `backend/backend/urls.py` | Root URL dispatcher for all 5 app namespaces + media |
| `backend/users/models.py` | CustomUser — must be defined before first migration |
| `frontend/src/store.js` | Redux store — shared state across all screens |
| `frontend/src/axiosInstance.js` | Auth header injection for all API calls |
| `frontend/src/App.js` | All routes and global components (Chatbot, Provider) |
