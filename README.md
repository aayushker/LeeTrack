# LeetTracker

A personal competitive programming tracker built for serious LeetCode contestants. Log every contest you attend, visualise your rank history over time, and gain deep insights into your performance — all in one self-hosted dashboard.

---

## Features

- **Contest Tracking** — Log LeetCode Weekly and Biweekly contest results (rank, problems solved, time taken). Filter by status (attended / practiced / missed) and contest type.
- **Rank Analytics** — Interactive trend chart of your rank across all attended contests with a recent-improvement indicator.
- **Activity Heatmap** — GitHub-style heatmap of the last 52 weeks showing attended, practiced, and missed contests at a glance.
- **Deep Analytics** — Problems solved per contest, monthly participation rate, difficulty breakdown donut chart, and top-8 topic bar chart.
- **Practice Tracker** — Log problems solved after the contest. Grouped by contest, filterable by difficulty and topic.
- **Performance Insights** — Auto-generated banners that surface participation rate, best rank, and improvement trends.
- **Auth** — Secure JWT-based authentication (7-day tokens, HttpOnly cookies) with bcrypt password hashing. Signup, login, and password reset flows included.

---

## Tech Stack

| Layer     | Technology                                     |
| --------- | ---------------------------------------------- |
| Framework | [Next.js 16](https://nextjs.org) (App Router)  |
| Language  | TypeScript 5                                   |
| UI        | React 19, Lucide React, Recharts               |
| Styling   | Tailwind CSS v4                                |
| Database  | MongoDB via [Mongoose](https://mongoosejs.com) |
| Auth      | JSON Web Tokens (`jsonwebtoken`) + `bcryptjs`  |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A MongoDB instance (local or [Atlas](https://www.mongodb.com/atlas))

### 1. Clone and install

```bash
git clone https://github.com/your-username/leettracker.git
cd leettracker
npm install
```

### 2. Environment variables

Create a `.env.local` file in the project root:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/leettracker
JWT_SECRET=your-super-secret-key-here
```

| Variable      | Description                                  |
| ------------- | -------------------------------------------- |
| `MONGODB_URI` | Connection string for your MongoDB database  |
| `JWT_SECRET`  | A long random string used to sign JWT tokens |

### 3. Seed contest data (optional)

If you have a `data.json` file with LeetCode contest history, place it in the project root. The schema expected is:

```json
{
  "contests": [
    {
      "id": "weekly-contest-400",
      "title": "Weekly Contest 400",
      "type": "weekly",
      "contestNumber": 400,
      "date": "2024-04-28T02:30:00.000Z",
      "url": "https://leetcode.com/contest/weekly-contest-400/"
    }
  ]
}
```

The migration runs automatically on the first server request and is idempotent — safe to re-run.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Scripts

| Command         | Description                              |
| --------------- | ---------------------------------------- |
| `npm run dev`   | Start development server with hot reload |
| `npm run build` | Build for production                     |
| `npm run start` | Start production server                  |
| `npm run lint`  | Run ESLint                               |

---

## Project Structure

```
├── app/
│   ├── page.tsx              # Landing page
│   ├── dashboard/            # Main dashboard (stats, charts, heatmap)
│   ├── analytics/            # Detailed analytics page
│   ├── contests/             # Contest explorer + [id] detail view
│   ├── practice/             # Practice problem tracker
│   ├── login/                # Login page
│   ├── signup/               # Signup page
│   ├── reset-password/       # Password reset page
│   └── api/
│       ├── auth/             # login, logout, signup, me, reset-password
│       ├── contests/         # Public contest list
│       └── user/             # User data, contests, questions
├── components/               # Reusable UI components
├── context/                  # AuthContext, TrackerContext
├── lib/                      # mongodb, jwt, auth helpers, migration
├── models/                   # Mongoose models (User, Contest, UserContestStat, UserQuestion)
└── public/
```

---

## API Routes

| Method            | Route                      | Description                                    |
| ----------------- | -------------------------- | ---------------------------------------------- |
| `POST`            | `/api/auth/signup`         | Create a new account                           |
| `POST`            | `/api/auth/login`          | Login and receive JWT cookie                   |
| `POST`            | `/api/auth/logout`         | Clear auth cookie                              |
| `GET`             | `/api/auth/me`             | Get current authenticated user                 |
| `POST`            | `/api/auth/reset-password` | Reset password                                 |
| `GET`             | `/api/contests`            | List all contests                              |
| `GET`             | `/api/user`                | Get current user's contest stats and questions |
| `POST`            | `/api/user/contests`       | Log a contest result                           |
| `POST/PUT/DELETE` | `/api/user/questions`      | Create, update, or delete a question entry     |

---

## License

[MIT](LICENSE)
