# Frontend Screens Summary

**1. Screen Name: Home**  
**Flow & Working:** Serves as the public landing page, featuring a hero section, dynamic application statistics, and a visual 3-step guide to onboard potential users.

**2. Screen Name: Login**  
**Flow & Working:** Provides the authentication gateway where returning users securely sign in via Firebase Email/Password or Google OAuth to access the protected workspace.

**3. Screen Name: Register**  
**Flow & Working:** Captures new user credentials and optional baseline health metrics with real-time validation, atomicly generating their Django account and Firestore profile.

**4. Screen Name: Dashboard**  
**Flow & Working:** Acts as the authenticated central command hub, displaying high-level health statistics, recent analysis history, and quick-action navigational links to core features.

**5. Screen Name: New Assessment**  
**Flow & Working:** The core diagnostic interface that manages a two-phase flow: accepting medical reports or raw symptoms, and rendering the hybrid AI’s disease prediction alongside specialized medical agent insights.

**6. Screen Name: Report Analysis**  
**Flow & Working:** A standalone document intelligence tool that processes uploaded medical PDFs via OCR to generate structured, human-readable insights without executing disease prediction models.

**7. Screen Name: Diseases**  
**Flow & Working:** Displays a comprehensive, animated grid of all diagnosable conditions sourced dynamically from the backend’s Neural Network label encoder, utilizing a highly optimized client-side search filter.

**8. Screen Name: History**  
**Flow & Working:** Renders a persistent, reverse-chronological timeline of the user's past assessments from Firestore, complete with animated confidence bars tracking diagnostic probabilities over time.

**9. Screen Name: Profile**  
**Flow & Working:** Manages the user's medical identity via a secure view/edit toggle, allowing updates to baseline clinical bio-markers and integration with a custom AI-generated Avatar picker.

**10. Screen Name: Treatment Exploration**  
**Flow & Working:** Provides a dynamic, multi-system therapeutic deep dive into a specific diagnosis, utilizing expandable, rotating-gradient cards to present clinical, alternative, and lifestyle treatment options.

**11. Screen Name: Navbar Component**  
**Flow & Working:** A fixed, frosted-glass top navigation bar utilized strictly on public entry points to handle smooth scrolling and dynamic CTA rendering based on active session state.

**12. Screen Name: Layout Component**  
**Flow & Working:** The persistent authenticated application shell that wraps all protected routes, providing the sticky top context header and managing the fluid scaling of the workspace area.

**13. Screen Name: Sidebar Component**  
**Flow & Working:** A collapsible side navigation panel utilizing fluid Framer Motion animations to guide users between protected core features while maintaining a secure logout trigger.
