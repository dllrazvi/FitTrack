# FitTrack

**Development of a Context-Aware Mobile Application for Personalized Fitness and Nutrition**

Bachelor's Thesis · Babeș-Bolyai University (UBB), Faculty of Mathematics and Computer Science

**Author:** Răzvan Bolchis  
**Supervisor:** Assoc. Prof. PhD. Zsigmond Imre


## Overview

FitTrack is a cross-platform mobile application developed as my Bachelor's thesis, designed to bring together workout planning, nutrition tracking, meal planning, and community engagement within a single mobile platform.

Built with **React Native** and **TypeScript**, the application uses **Firebase** for authentication and cloud synchronization while integrating public REST APIs to provide exercise and nutrition data. Instead of treating fitness, nutrition, and social interaction as separate applications, FitTrack combines them into a unified experience where all modules share the same user profile and cloud-backed data model.

## Key Highlights

- Cross-platform mobile application for Android and iOS
- React Native + TypeScript architecture
- Firebase Authentication, Cloud Firestore and Cloud Storage
- Workout, Nutrition, Meal Plans, Dashboard and Community modules
- Public REST API integrations for exercise and nutrition data
- Developed individually as a Bachelor's thesis project

---

## Technology Stack

| Category | Technologies |
|-----------|--------------|
| **Frontend** | React Native, React, TypeScript |
| **Navigation** | React Navigation |
| **State Management** | React Context API, AsyncStorage |
| **Backend & Cloud** | Firebase Authentication, Cloud Firestore, Firebase Storage |
| **Authentication** | Email/Password, Google Sign-In |
| **UI** | React Native SVG, Reanimated, Gesture Handler, Safe Area Context |
| **Media** | Image Picker, Video, Share |
| **External APIs** | Exercise Catalog APIs, USDA FoodData Central, Open Food Facts |
| **Tooling** | Jest, ESLint, Prettier, Metro, Babel, Git |

---

## Architecture

FitTrack follows a modular architecture where each feature is implemented independently while sharing a common authentication layer, cloud data model, and reusable service layer.

React Context manages shared application state, while Firebase provides authentication, persistence, and real-time synchronization across all modules.

<p align="center">
<img src="FitTrack/android/screenshots/Arhitecture.png" width="90%">
</p>

<p align="center">
<img src="FitTrack/android/screenshots/FitTrack_Firestore_ERD.png" width="90%">
</p>

---

## Features

### Dashboard

- Daily activity overview
- Workout and nutrition progress
- Quick access to all application modules
- Activity statistics and notifications

---

### Workouts

- Exercise discovery through public APIs
- Interactive muscle-group selection
- Workout routines and guided sessions
- Weekly planner and workout history

---

### Nutrition

- Food search across multiple data sources
- Daily nutrition journal
- Macronutrient tracking
- Daily goal monitoring

---

### Meal Plans

- Built-in meal templates
- Goal-oriented nutrition plans
- Automatic macro target synchronization

---

### Community

- Social feed
- Fitness challenges
- Achievement badges
- Leaderboards
- Notifications

---

### Profile

- User profile management
- Workout and nutrition statistics
- Theme preferences
- Data export

---

## Screenshots

<p align="center">
<img src="FitTrack/android/screenshots/DashboardPrimary.png" width="31%">
<img src="FitTrack/android/screenshots/WorkoutExerciseList.png" width="31%">
<img src="FitTrack/android/screenshots/NutritionJurnal.png" width="31%">
</p>

<p align="center">
Dashboard • Workouts • Nutrition
</p>

<p align="center">
<img src="FitTrack/android/screenshots/MealPlansDashboard.png" width="31%">
<img src="FitTrack/android/screenshots/CommunityFeed.png" width="31%">
<img src="FitTrack/android/screenshots/ProfilePrimary.png" width="31%">
</p>

<p align="center">
Meal Plans • Community • Profile
</p>

---

## Project Structure

```text
FitTrack/
│
├── android/
├── ios/
├── src/
│   ├── contexts/
│   ├── services/
│   ├── backend/
│   ├── config/
│   ├── models/
│   ├── theme/
│   └── utils/
│
├── App.tsx
├── firestore.rules
├── storage.rules
└── package.json
```

---

## Running the Project

### Requirements

- Node.js 18+
- React Native development environment
- Android Studio and/or Xcode

### Installation

```bash
npm install
npm start
npm run android
# or
npm run ios
```

Firebase configuration files are intentionally excluded from the repository and must be supplied separately.

---

## Repository Contents

- Complete React Native source code
- Firebase security rules
- Architecture diagrams
- Bachelor's thesis document
- Application screenshots

---

## Development Experience

FitTrack was developed entirely as an individual Bachelor's thesis project. Beyond implementing the application itself, the project required designing a scalable architecture, integrating multiple external services, and maintaining a consistent user experience across several independent modules.

Throughout the project I was responsible for:

- Designing the application architecture and Firestore data model.
- Implementing all mobile screens, navigation flows, and reusable UI components.
- Integrating Firebase Authentication, Cloud Firestore, Cloud Storage, and external REST APIs.
- Designing modular services and shared state management using React Context.
- Writing the thesis documentation and preparing the project for public release.

---

## What I Learned

Developing FitTrack provided practical experience far beyond implementing application features. Some of the most valuable lessons included:

- Designing a modular architecture that remains maintainable as the application grows.
- Managing shared state and cloud synchronization across multiple independent modules.
- Integrating third-party REST APIs while handling failures and inconsistent external data gracefully.
- Building responsive mobile interfaces that balance usability with performance.
- Delivering a complete software project, from architecture and implementation to documentation and presentation.

---

## Future Work

Several improvements are planned for future versions of FitTrack:

- AI-assisted workout and nutrition recommendations
- Computer vision for exercise form analysis
- Extended wearable integrations
- Barcode-based food recognition
- Improved offline synchronization
- More advanced community and social features
