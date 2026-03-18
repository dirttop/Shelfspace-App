# ShelfSpace
## Project Documentation

### Table of Contents
- [ShelfSpace](#shelfspace)
  - [Project Documentation](#project-documentation)
    - [Table of Contents](#table-of-contents)
    - [Project Overview](#project-overview)
    - [Project Health](#project-health)
      - [Schedule: Amber](#schedule-amber)
      - [Scope: Green](#scope-green)
      - [Implementation: Amber](#implementation-amber)
    - [Accomplishments and Roadblocks](#accomplishments-and-roadblocks)
    - [Project Recalibration](#project-recalibration)
    - [Project Timeline](#project-timeline)
    - [Finalized Technology Stack](#finalized-technology-stack)
      - [Frontend](#frontend)
      - [Backend \& API](#backend--api)
      - [AI \& Smart Camera Pipeline](#ai--smart-camera-pipeline)
    - [Implementation Challenges](#implementation-challenges)
    - [Development Environment and Infrastructure](#development-environment-and-infrastructure)
    - [Visual Gantt Chart / Schedule Variance](#visual-gantt-chart--schedule-variance)
  - [Risk and Issue Log](#risk-and-issue-log)
  - [Technical Debt Disclosure](#technical-debt-disclosure)
    - [Prototype Walkthrough](#prototype-walkthrough)
    - [Path to Deployment](#path-to-deployment)

---

### Project Overview
**ShelfSpace** is a social reading application that aims to bring readers together, give them the ability to track and store their digital library, and help them discover new books. The vision for ShelfSpace is to foster an interconnected community of readers, where sharing and discussing books is customizable, enjoyable, expressive, and dynamic. Whether using the app simply to track reading habits, or to engage in deep discussions with other readers, ShelfSpace will empower the user to read more.

**Core Objectives:**
* Create a centralized reading platform combining tracking with social discussion.
* Ensure that the app experience is customizable to the user's preferences.
* Foster community interaction through verbose review systems, threads, and social groups.
* Create a robust book-detection system using novel AI technology.
* Build a scalable framework that grows with the community.

---

### Project Health

#### Schedule: Amber
Currently, we are technically on schedule, with Core Development lasting until the end of March. However, we are at risk of falling behind due to the late start on social features, which may be cut from the Alpha build.

#### Scope: Green
Scope has been trimmed from the original vision to ensure a stable MVP. See [Project Recalibration](#project-recalibration) for details.

#### Implementation: Amber
UI/UX finalization is slightly behind schedule. Backend development remains on track with steady feature additions.

---

### Accomplishments and Roadblocks

**Accomplishments:**
* **Core AI & Vision Pipeline Functional:** Successfully implemented the "Smart Book Scan" feature using Vision API.
* **Book API & Search Integration:** Frontend now aggregates book data via our dedicated Book API.
* **Frontend Foundation & Authentication:** Architecture is established, handling account creation and primary interfaces.

**Blockers:**
* **Time Constraints:** Adjustments to the original vision required scrapping certain planned elements for better-contextualized solutions.
* **Feature Dependencies:** Advanced features (like reviews) are blocked until core book-handling logic is 100% stable.
* **Design Iteration:** More time than expected has been spent on in-app design experimentation and subsequent codebase cleanup.

---

### Project Recalibration
Mid-project reviews have shifted our focus toward a **polished MVP**. The following features are moved to the post-launch roadmap:
1.  **Algorithmic Social Feed:** Replaced by a standard chronological display.
2.  **Clubs Module:** Infrastructure for group roles and dedicated boards is temporarily stashed.
3.  **Advanced Social Graphing:** Deep "friend recommendation" systems are paused.

---

### Project Timeline

| Phase | Description | Timeline |
| :--- | :--- | :--- |
| **Phase 1** | Research, Market Analysis, & Wireframing | Sep 2025 - Nov 2025 |
| **Phase 2** | Design, Prototyping, & User Testing | Nov 2025 - Jan 2026 |
| **Phase 3** | Core Development (Frontend, Backend, Auth) | Feb 2026 - Apr 2026 |
| **Phase 4** | Testing, QA, & Security Audits | Apr 2026 - May 2026 |
| **Phase 5** | Launch & Community Maintenance | May 2026 |

---

### Finalized Technology Stack

#### Frontend
* **Framework:** React Native
* **Language:** TypeScript
* **Styling:** TailwindCSS

#### Backend & API
* **Architecture:** SaaS Backend
* **Database/Auth:** Supabase
* **External Data:** Google Books API / Open Library API
* **Management:** Node.js, Axios, Apollo GraphQL

#### AI & Smart Camera Pipeline
* **Image Processing:** Azure Custom Vision
* **Data Cleaning:** Google Gemini

---

### Implementation Challenges
* **Database Foresight:** Designing schema to avoid destructive data migrations in the future.
* **Custom Components:** Developing a library of reusable React Native components to ensure UI consistency.

---

### Development Environment and Infrastructure
* **CI/CD:** GitHub Actions
* **Infrastructure:** Supabase (Cloud/SaaS)

### Visual Gantt Chart / Schedule Variance
[View ERG Gantt Chart](https://docs.google.com/spreadsheets/d/1Tu0XY3f1Qe9_r5mtnXwPjcgoUnDrHNfY/edit?usp=sharing&ouid=100417717461148394931&rtpof=true&sd=true)

---

## Risk and Issue Log

| Risk | Level | Mitigation |
| :--- | :--- | :--- |
| **Third-Party API Dependency** (Azure) | High | Implement fallback UI for manual entry if the Vision API fails. |
| **External Data Provider Limits** | High | Implement caching at the GraphQL layer; allow manual book creation. |

---

## Technical Debt Disclosure
* **Typography Consistency:** Standardized use of the app text component is inconsistent in older code, requiring a CSS refactor.
* **Feature-First Logic:** Some generalized components require overhauls to support the expanding scope.
* **Cleanup Pass:** A final codebase cleanup is required before entering the official Alpha phase.

---

### Prototype Walkthrough

* **Authentication:** Standard Login/Registration and Password Recovery.
* **Main Navigation:** Home feed with filtering and infinite scrolling reviews and posts.
* **Book Search:** Dedicated tab with debounced search results in a grid layout.
* **Scanning & Vision:** * *Barcode:* Automatic lookup.
    * *Cover Scan:* Azure Vision API integration for title/author retrieval.
* **Profiles & Shelves:** User bios, reading stats, and custom shelf management via dropdowns.
* **Book Info Modal:** Global bottom sheet modal for instant access to book details.

---

### Path to Deployment
Testing begins in **April 2026**. This will include live demos with ERG developers and long-term user surveys. We will prioritize "Alpha" bugs and user flow accessibility before the official May release.