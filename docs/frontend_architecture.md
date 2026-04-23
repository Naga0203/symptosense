# Frontend Screen Architecture & Flow

SymptoSense utilizes a modern, component-driven Single Page Application (SPA) architecture built with React 19, TypeScript, and Vite. The user interface leverages Tailwind CSS for styling and Framer Motion for hardware-accelerated animations. 

The frontend architecture consists of **13 primary UI components** logically divided into Layouts, Public Routes, and Protected Workspace Routes.

---

## 1. High-Level Navigation Flow

```text
[Landing / Public] ─────> [Authentication] ─────> [Protected Workspace]
      │                          │                          │
   Home (/)               Login (/login)           Dashboard (/dashboard)
      │                   Register (/register)              │
      ▼                                                     ▼
 [External Links]                                  [Core Features]
  - Features                                        - New Assessment (/assessment)
  - How it Works                                    - Treatment Exploration
  - About                                           - Report Analysis (/report-analysis)
                                                    - Diseases Database (/diseases)
                                                    - Medical History (/history)
                                                    - User Profile (/profile)
```

---

## 2. Layout & Shared Infrastructure (Screens 1-3)

To ensure a consistent user experience and modular codebase, the application utilizes three core shared architectural components:

1. **Navbar (`components/landing/Navbar.tsx`)**
   - **Role:** Fixed-position global header utilized exclusively on public entry points (Home, Login, Register).
   - **Features:** Employs a frosted-glass backdrop (`nav-blur`), dynamic conditional rendering based on authentication state (shows "Dashboard" if logged in, else "Sign In/Get Started"), and handles smooth scroll-anchoring to landing page marketing sections.

2. **Dashboard Layout (`components/Layout.tsx`)**
   - **Role:** The authenticated application shell functioning as a persistent state wrapper component.
   - **Features:** It features a sticky top header showing real-time user workspace context ("Health Intelligence > Workspace Matrix") and a Profile preview badge. It controls the `Sidebar`'s collapsible state using animated flex-box properties allowing the main content `children` to resize fluidly.

3. **Sidebar Navigation (`components/Sidebar.tsx`)**
   - **Role:** The primary navigation hub for the protected workspace.
   - **Features:** Implements a collapsible side panel containing six core routing links (`NavLink`). Utilizes Framer Motion's `layoutId` API to create a fluid, sliding active-state indicator that travels between navigation items. It also contains the secure logout trigger.

---

## 3. Public Screens (Screens 4-6)

Accessible without authentication, these screens onboard and convert users.

4. **Home (`pages/Home.tsx` | Route: `/`)**
   - **Role:** Main marketing and application entry page.
   - **Working:** Showcases the platform's value proposition via a Hero section, animated application statistics counters, and a vertical chronological "How it Works" flowchart. Utilizes staggered fade-in entrance animations.

5. **Login (`pages/Login.tsx` | Route: `/login`)**
   - **Role:** User authentication gateway.
   - **Working:** Wraps the shared `AuthForm` component in login mode. Communicates with Firebase Authentication for Email/Password and Google OAuth sign-in methods. Real-time form validation is enforced using Zod schemas via React Hook Form.

6. **Register (`pages/Register.tsx` | Route: `/register`)**
   - **Role:** New user onboarding.
   - **Working:** A comprehensive 7-field form capturing basic identity and optional clinical baselines (Blood Pressure/Sugar). Features live username availability checking via a debounced API query. Successful registration atomicly creates a Firebase Auth identity, a backend Django User, and a Firestore profile document.

---

## 4. Protected Workspace Screens (Screens 7-13)

These screens form the core functional application and are gated by a `ProtectedRoute` Higher-Order Component (HOC) that enforces active session validation.

7. **Dashboard (`pages/Dashboard.tsx` | Route: `/dashboard`)**
   - **Role:** The user's health command center.
   - **Working:** Fetches parallel API promises to hydrate four top-level metric cards (Total Assessments, Average AI Confidence, Analysis Count, Blood Group) and a Recent Activity feed. Serves as a navigational router to deeper platform functionalities using quick-action cards.

8. **New Assessment (`pages/NewAssessment.tsx` | Route: `/assessment`)**
   - **Role:** The core diagnostic engine interface.
   - **Working:** Operates a complex two-phase state machine:
     - **Phase 1 (Input):** Accepts direct text via an intelligent `SymptomInput` autocomplete component or processes unstructured medical documents via the DocTR OCR pipeline route (`/api/assessment/extract/`).
     - **Phase 2 (Results):** Orchestrates the display of hybrid AI results. Renders a radial confidence gauge for the Neural Net prediction alongside a 2x2 grid housing outputs from the 4 LangChain agents (Clinical Insights, Guidelines, Treatments, Lifestyle). Features recursive JSON renderers to handle diverse agent schema structures.

9. **Report Analysis (`pages/ReportAnalysis.tsx` | Route: `/report-analysis`)**
   - **Role:** Standalone document intelligence interface.
   - **Working:** Bypasses disease prediction entirely to focus on translating complex medical reports into human-readable insights. Accepts file uploads to trigger the OCR-to-LLM pipeline. Results are distributed across five distinct, color-coded functional cards (Executive Summary, Lifestyle, Diet, Metrics, Next Steps).

10. **Diseases Database (`pages/Diseases.tsx` | Route: `/diseases`)**
    - **Role:** Translucent view into the Neural Network's classification capabilities.
    - **Working:** Consumes the backend's `label_encoder.classes_` array to display every condition the AI can diagnose. Implements a highly optimized client-side search filter that recalculates grid layout using Framer Motion's `popLayout` orchestration for smooth card rearrangements.

11. **Medical History (`pages/History.tsx` | Route: `/history`)**
    - **Role:** Persistent timeline of user health engagements.
    - **Working:** Queries Firestore horizontally to render a reverse-chronological list of all assessments. Each history card features an animated gradient progress bar representing the historical prediction confidence, allowing users to track condition probabilities over time.

12. **Profile Identity (`pages/Profile.tsx` | Route: `/profile`)**
    - **Role:** Comprehensive medical identity management.
    - **Working:** Employs a View/Edit context toggle. Secures user demographics alongside clinical bio-markers in a read-only state until authorized for editing. Features a custom `AvatarPicker` sub-system offering 21+ procedural/AI-generated avatar styles across "Realistic" and "Illustrated" categories alongside custom file upload support.

13. **Treatment Exploration (`pages/TreatmentExploration.tsx` | Route: `/:diseaseName/treatment-exploration`)**
    - **Role:** Deep-dive therapeutic analysis logic.
    - **Working:** Uses dynamic URL routing to extract the predicted condition. Renders six expanding category cards (Ayurvedic, Allopathy, Homeopathy, Modern Medicine, Lifestyle, Recommendations). Utilizes CSS-in-JS (Styled Components) for complex conic-gradient rotating border animations. Uses dynamic grid-column manipulation (`grid-column: 1 / -1`) to prioritize and expand the user's selected category.
