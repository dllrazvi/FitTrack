# FitTrack – Google SWE Interview Prep (Bachelor's Thesis Project)

Context-aware mobile app for personalized fitness and nutrition. Prep package for the same structure as your Linny / Litigation examples.

---

## 1) The 6 bullets (for mock)

- **What it does:** Cross-platform mobile app (React Native) for personalized fitness and nutrition: auth (email + Google), dashboard with Move/Exercise/Steps/Nutrition rings, workout tracking with context-aware muscle-group selection, daily food log with macro goals, meal plans, community (feed, challenges, leaderboard, badges), profile with real-time stats and export (CSV/JSON/HTML).
- **Who uses it:** End users (fitness enthusiasts); developed by you as Bachelor's thesis at UBB under Assoc. Prof. Zsigmond Imre. Thesis explores contextual workout recommendations, nutrition with macro breakdowns, social features, and future wearable/sensor integration.
- **Stack:** Frontend: React Native, TypeScript, React Navigation. Backend: Firebase (Auth, Firestore, Storage). Key libs: react-native-google-signin, react-native-fs, react-native-share, react-native-svg, AsyncStorage. Design: custom UI with light/dark theme (ThemeContext + persistence).
- **What I built:** (1) Auth: email/password and Google Sign-In, Firestore user profile create/update and UserService singleton. (2) WorkoutContext (session history, weekly stats, streak-friendly data) and NutritionContext (daily food log, totals, goals, add/remove meal). (3) Dashboard with circular stats (Move, Exercise, Steps, Nutrition) and navigation. (4) Profile: load user from Firestore, merge real-time stats from workout/nutrition context, streak calculation (current/longest), edit profile, dark mode toggle, export entry point. (5) ExportService: CSV/JSON/HTML report generation from nutrition data, RNFS write + Share. (6) Community screen (feed, challenges, leaderboard, badges) and MealPlan service/screens; SVG body screen for muscle-group selection (context-aware workouts).
- **Hard problems:** (1) Keeping profile stats (streaks, totals) in sync with in-memory WorkoutContext and NutritionContext and deriving current/longest streak from session dates. (2) Export pipeline: mapping NutritionContext + meal structure to DailyNutritionLog, multi-format generation (CSV/JSON/HTML), file write and share on device with clear error handling.
- **Impact / metrics:** Single codebase for iOS/Android; auth and profile backed by Firestore; consistent theme with persistence; users can export nutrition reports and share; thesis delivered with working app and documented architecture.

---

## 2) 60–90 sec project pitch (EN)

"I built FitTrack, a context-aware mobile fitness and nutrition app for my Bachelor's thesis at Babes-Bolyai University. It's a React Native app with Firebase on the backend. Users sign in with email or Google; we store and update their profile in Firestore. The app has a dashboard with four rings—Move, Exercise, Steps, and Nutrition—and modules for workouts and nutrition. I implemented the auth flow and Firestore user profile lifecycle, two main contexts—WorkoutContext for session history and weekly stats, and NutritionContext for the daily food log and macro totals—and the profile screen that loads the user from Firestore and merges real-time stats from those contexts, including streak calculation for consecutive workout days. The trickiest parts were keeping profile stats consistent with in-memory workout and nutrition data and building the export pipeline: transforming the food log into a structured report, generating CSV, JSON, and HTML, then writing to the device and opening the share sheet. I also added a theme system with light and dark mode persisted in AsyncStorage, and an export service so users can share their nutrition data. The codebase is structured for future features like wearable integration and more context-aware recommendations, as described in the thesis."

---

## 3) Stack (EN) – one sentence

"Frontend is React Native with TypeScript and React Navigation; backend is Firebase—Authentication for email and Google Sign-In, Firestore for user profiles and future persistence, and Storage for future use; we use AsyncStorage for theme persistence, react-native-fs and react-native-share for export, and react-native-svg for the body diagram; the app targets both iOS and Android from one codebase."

---

## 4) "What did you personally do?" (EN)

"I designed and implemented the core flows end-to-end: Firebase Auth with email/password and Google Sign-In, and the Firestore user profile—create and update via a singleton UserService. I built the WorkoutContext and NutritionContext so the rest of the app could consume workout history and daily food log with totals and goals. I implemented the dashboard with the four circular stats and navigation, and the profile screen that loads the user from Firestore, merges real-time stats from both contexts, and computes current and longest workout streaks from session dates. I wrote the ExportService: converting nutrition data to CSV, JSON, and HTML, writing files with react-native-fs and sharing with react-native-share, plus the ExportModal and its integration in the nutrition flow. I added the ThemeContext with light and dark themes and persistence in AsyncStorage, and the dark mode toggle on profile. I also implemented the Community screen structure—feed, challenges, leaderboard, badges—and the meal-plan model and service; the SVG body screen for muscle-group selection is in place for context-aware workout recommendations. The data models for User, Workout, Nutrition, and MealPlan are mine, and I integrated everything in a single React Native app as part of my thesis."

---

## 5) Hard technical problem #1 (EN)

"Profile stats—total workouts, calories burned, current streak, longest streak—had to reflect the same data as the in-memory WorkoutContext and NutritionContext, without duplicating logic or getting out of sync. I solved it by making the profile screen the single place that derives stats: it subscribes to workoutHistory and dailyTotals from the contexts and, in a useEffect, recomputes totals and streaks whenever that data changes, then merges those into the user object we display. For streaks, I iterate over sorted session dates and compute consecutive-day runs, with special handling for 'today' so the current streak doesn’t break before the user has worked out. The Firestore user document still holds join date and any server-side stats we want later; the UI always shows the live-derived values so the user sees an accurate, up-to-date profile without a round-trip to the backend."

---

## 6) Hard technical problem #2 (EN)

"The export feature had to take the in-memory nutrition state—meal entries with items and per-meal and daily totals—and produce shareable CSV, JSON, and HTML reports for a date range. I built an ExportService that accepts a list of DailyNutritionLog and ExportOptions (format, date range, what to include). For CSV I serialize meals and items into rows and optionally append daily totals; for JSON I structure the same data plus a summary with averages; for HTML I generate a full report with sections per day and a summary table. The tricky part was mapping the context’s meal structure—breakfast, lunch, dinner, snacks—to this log shape and then writing the file to the device with react-native-fs and opening the native share sheet with react-native-share. I made sure errors (e.g. write or share failure) are caught and surfaced so the user gets clear feedback. The ExportModal lets the user pick format and date range and then calls this service; the file is written under the app’s document directory and shared from there."

---

## 7) Data model / schema (EN)

"User profiles live in Firestore in a `users` collection, keyed by Firebase Auth UID. Each document has profile (name, age, gender, height, weight, activity level, fitness goal), goals (daily calories, steps, weekly workouts, target weight), preferences (dietary restrictions, workout duration, notifications), and stats (total workouts, calories burned, streaks, join date). Workout and nutrition data are currently in React state: WorkoutContext holds WorkoutSession list (date, routine name, duration, calories, exercises count) and derives weekly stats; NutritionContext holds MealEntry list (meal type, items with nutrition, totalNutrition) and daily totals and goals. The MealEntry and FoodItem models support full nutrition (calories, protein, carbs, fat, fiber, sugar). MealPlan has category, target macros, duration, and nested meals (breakfast, lunch, dinner, snacks) with items and instructions. Export consumes a list of DailyNutritionLog, which groups meals by day with totals; we build that from the context data when the user triggers export."

---

## 8) Auth / Security (EN)

"Auth is Firebase Authentication with two sign-in methods: email/password and Google Sign-In via react-native-google-signin. After sign-in we ensure the user has a Firestore profile: we read from `users/{uid}` and create or update as needed so the app always has a consistent profile. We don’t expose Firebase config secrets in a way that would allow arbitrary backend access—the client SDK is used for its intended purpose. Theme preference is stored in AsyncStorage; no sensitive data is stored there. Export runs on the device and writes to the app’s document directory; the user explicitly shares the file, so we don’t upload data without consent. Future steps would be moving sensitive config (e.g. API keys) to env or a secure config layer and enforcing Firestore rules so users can only read/write their own documents."

---

## 9) Trade-off (EN)

"We keep workout and nutrition state in React context instead of persisting every change to Firestore. The trade-off is simplicity and offline-friendly UI versus durability: if the app is killed, session and food log are lost until we add local persistence or sync. We chose this for the thesis scope so we could ship the dashboard, profile, and export flow quickly; export still produces a durable artifact (file) the user can keep. Another trade-off: export uses HTML as a stand-in for PDF (we generate HTML and share it) to avoid adding a native PDF library; we could add proper PDF generation later. For the profile, we derive stats from context in the client rather than storing them in Firestore on every workout or meal change, which keeps the backend simple and avoids write volume and consistency issues during development."

---

## 10) Metrics / impact (EN)

"The app runs on both iOS and Android from one codebase. Auth and profile are backed by Firebase so users have a persistent identity and profile. The dashboard and profile give a single place to see Move, Exercise, Steps, Nutrition and real-time stats and streaks. The export feature lets users share nutrition reports in CSV, JSON, or HTML. Theme persistence improves UX across sessions. The thesis documents the architecture, context-aware goals, and future wearable/sensor integration. Delivered as a working product with clear separation between auth, contexts, UI, and export."

---

## 11) "What would you improve next?" (EN)

"I’d persist workout and nutrition data—either to Firestore with real-time listeners or to local storage (e.g. AsyncStorage or SQLite) and optionally sync to Firestore so it survives app restarts and can be used across devices. I’d add Firestore security rules so each user can only access their own documents. I’d introduce structured logging and basic metrics (e.g. screen views, export success/failure) for observability. For export, I’d consider a proper PDF library for PDF output and maybe a background job for large date ranges. I’d add unit tests for streak logic, ExportService formatting, and context reducers, and integration tests for auth and profile load. Moving API keys and config to environment variables or a secure config service would be a priority before any public or production deployment."

---

## 12) Quick Q&A (EN) – when the recruiter goes into detail

**Q: Why this stack?**  
"React Native gave one codebase for iOS and Android and fit the thesis timeline. Firebase provided auth and Firestore with minimal backend code so I could focus on features and UX. TypeScript and clear models (User, Workout, Nutrition, MealPlan) kept the codebase maintainable."

**Q: How do profile stats stay in sync with workouts and nutrition?**  
"The profile screen reads workoutHistory and dailyTotals from the contexts and recomputes totals and streaks in a useEffect whenever that data changes. Streaks are derived from sorted session dates by counting consecutive days. The Firestore user doc holds join date and optional server-side stats; the UI always shows the live-derived values so we don’t need to write back to Firestore on every workout or meal."

**Q: How does export work?**  
"ExportModal lets the user choose format (CSV, JSON, HTML) and date range. We build DailyNutritionLog from the nutrition context for that range, then ExportService generates the file content, writes it with react-native-fs to the app document directory, and opens the share sheet with react-native-share so the user can save or send the file."

**Q: Why in-memory context instead of Firestore for workouts and meals?**  
"For the thesis scope we prioritized shipping the full flow—dashboard, profile, export—without backend sync complexity. Context made it easy to share state and keep the UI responsive. Next step would be persisting to Firestore or local DB and optionally syncing."

**Q: How did you handle auth and profile creation?**  
"After Firebase Auth sign-in (email or Google), we check Firestore `users/{uid}`. If the doc exists we load it; otherwise we create a default profile (from auth display name, email, and sensible defaults) and write it. UserService is a singleton that centralizes getCurrentUser, createUserProfile, updateUserProfile, and updateUserStats."

**Q: What was the hardest decision?**  
"Choosing to derive profile stats from context in the client instead of writing every workout and meal to Firestore. I wanted accurate streaks and totals without adding sync logic and write rules in the first version; the downside is data loss on app kill until we add persistence."

**Q: How does the theme work?**  
"ThemeContext holds light and dark theme objects (colors, typography, spacing). The selected mode is stored in AsyncStorage and restored on app start. A toggle on the profile screen calls toggleTheme; the whole app uses the context so screens don’t need to pass theme props."

**Q: If you had more time, what would you improve?**  
"Persistence for workouts and meals, Firestore rules, observability, automated tests for streak logic and export, and moving secrets to env or a secure config. I’d also complete wearable integration and more context-aware recommendations as in the thesis plan."

---

## 13) 2-line resume summary (EN)

"Built FitTrack, a context-aware React Native fitness and nutrition app (Bachelor’s thesis, UBB): Firebase Auth (email + Google) and Firestore user profiles, WorkoutContext and NutritionContext, dashboard with Move/Exercise/Steps/Nutrition rings, profile with real-time stats and streak calculation, and ExportService for CSV/JSON/HTML nutrition reports with device share. Implemented theme system with persistence, Community and MealPlan modules, and SVG body screen for muscle-group selection; single codebase for iOS and Android."

---

*Good luck with the Google interview.*
