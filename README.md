# FitTrack — Context-Aware Mobile App (Thesis)

## Overview

This repository contains the **full source code and thesis materials** for **FitTrack**, a **cross-platform mobile application** developed as my **Bachelor’s thesis** at **Babeș-Bolyai University (UBB), Romania**.

FitTrack brings together **workout planning**, **nutrition tracking**, **meal planning**, and **community-oriented motivation** in one coherent product experience. The app is built with **React Native** and **TypeScript**, uses **Firebase** for authentication and cloud data, and integrates **public fitness and nutrition APIs** where practical so the product stays usable without proprietary datasets.

**Author:** Bolchis Răzvan · **Supervisor:** Assoc. Prof. PhD. Zsigmond Imre

---

## Technologies Used

- **Mobile framework:** React Native, React
- **Language:** TypeScript (application logic), JavaScript (ecosystem / tooling)
- **Navigation:** React Navigation (native stack)
- **State & persistence:** React Context API, Async Storage
- **Backend / cloud:** Firebase Authentication, Cloud Firestore, Firebase Storage
- **Auth providers:** Google Sign-In (integrated with Firebase auth flows)
- **UI & motion:** React Native Reanimated, Gesture Handler, Safe Area Context, Screens
- **Graphics & media:** React Native SVG (+ svg-transformer), Image Picker, Video, Share, FS
- **Health & device:** Google Fit integration (platform-dependent permissions)
- **Remote data:** REST consumption — e.g. **wger** exercise catalog, **Open Food Facts** search
- **Android engineering:** Gradle, Kotlin (native / host integration), Google Services plugin
- **iOS engineering:** Swift / Xcode-oriented RN host project (as maintained in-repo)
- **Tooling & quality:** Metro, Babel, ESLint, Prettier, Jest, Node.js ≥ 18, Git

---

## Features

### Dashboard & cross-module overview
- Consolidated **home surface** that connects training, nutrition, and community signals into a glanceable summary.
- Support for **step-style indicators** where the platform grants **activity recognition** permissions.

### Workouts
- **Exercise discovery** and session-oriented flows grounded in a **remote exercise catalog** (notably **wger** in this codebase).
- Routines and workout screens structured for **browsing → selecting → executing** without losing context.

### Nutrition
- **Food logging** with macro-oriented workflows suited to daily adherence.
- **Open Food Facts**-backed search to reduce friction when logging real products.

### Meal plans
- **Structured meal templates** that connect higher-level planning with day-to-day nutrition tracking.

### Community
- **Challenges**, optional **feed-style sharing**, **badges**, and **leaderboards** oriented toward consistency and participation rather than one-off spikes.

### Profile & account layer
- User identity, preferences, and configuration surfaces that tie the modules into a single account experience.

---

## Screenshots

<p align="center">
  <img src="docs/screenshots/01-dashboard.png" alt="Dashboard" width="32%" />
  <img src="docs/screenshots/02-workout.png" alt="Workouts" width="32%" />
  <img src="docs/screenshots/03-nutrition.png" alt="Nutrition" width="32%" />
</p>

<p align="center"><em>Dashboard · Workouts · Nutrition</em></p>

<p align="center">
  <img src="docs/screenshots/04-meal-plans.png" alt="Meal plans" width="32%" />
  <img src="docs/screenshots/05-community.png" alt="Community" width="32%" />
  <img src="docs/screenshots/06-profile.png" alt="Profile" width="32%" />
</p>

<p align="center"><em>Meal plans · Community · Profile</em></p>

Add images under `docs/screenshots/` and align filenames with the paths above (or update the paths). You can also point screenshots to existing assets under `android/screenshots/` if you prefer.

---

## Run locally

Prerequisites: [React Native environment setup](https://reactnative.dev/docs/set-up-your-environment), Node.js **≥ 18**, Android Studio (for Android) and/or Xcode (for iOS).

```bash
npm install
npm start          # Metro, in one terminal
npm run android    # or: npm run ios
```

Place your Firebase **`google-services.json`** under `android/app/` and **`GoogleService-Info.plist`** under the iOS app target as required by Firebase (these files are gitignored in this public repository).

---

## Documentation

- **Thesis PDF:** [Licenta_BolchisRazvan.pdf](./Licenta_BolchisRazvan.pdf) *(rename the link if your file name differs)*  
- **Diagrams / appendices:** place alongside the PDF or under `docs/` as you prefer.

---

## My role & scope

This is an **individual thesis project**. I owned:

- End-to-end **mobile product implementation** (screens, navigation, UX flows).
- **Firebase-backed** persistence and authentication wiring.
- **Integration design** for third-party catalogs (exercise + food search).
- **Android-focused** build and permission configuration for fitness-related capabilities.
- **Thesis writing** and repository packaging (code + documentation).

---

## What I learned

- Structuring a **multi-module RN app** without turning screens into isolated silos.
- Practical **Firebase** usage (Auth / Firestore / Storage) in a mobile client.
- **REST integration** patterns for public APIs (rate limits, partial failures, UX fallbacks).
- **Platform realities**: permissions, Google Fit availability, and “graceful degradation” in UI.
- Shipping a **portfolio-ready** repository: readable README, screenshots, and reproducible setup.

---

## Author

**Bolchis Răzvan**  
Bachelor’s Thesis, Computer Science — English Program  
Babeș-Bolyai University (UBB), Romania  
Supervisor: **Assoc. Prof. PhD. Zsigmond Imre**

Repository: [https://github.com/dllrazvi/FitTrack](https://github.com/dllrazvi/FitTrack)
