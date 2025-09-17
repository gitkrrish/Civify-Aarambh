# **App Name**: Civitas

## Core Features:

- User Authentication: Dummy login with user and admin roles, redirecting to appropriate dashboards.
- Issue Reporting: Allow users to report civic issues with title, description, location, and category. Dynamically update the Community Feed, My Reports, and Admin Panel.
- Community Feed: Display all reported issues, sorted by newest first. Include issue details and status.
- My Reports: Display issues reported by the logged-in user, with real-time status updates.
- Admin Dashboard: Provide a summary of total, pending, in-progress, and resolved issues. Allow admins to manage and update issue statuses, reflecting changes across the app.
- Leaderboard: Track user points based on reported issues, auto-sort to display a Leaderboard showing the user rankings. Award digital medals using generative AI tool that analyses username
- Data Persistence: Persist issue, user, and leaderboard data in localStorage to prevent data loss on refresh.

## Style Guidelines:

- Primary color: Teal (#008080) to evoke a sense of civic responsibility and trust.
- Background color: Light gray (#F0F0F0) to provide a clean and neutral backdrop.
- Accent color: Forest Green (#228B22) for CTAs and positive status indicators like 'Resolved'.
- Body and headline font: 'PT Sans', a humanist sans-serif for a modern yet approachable feel.
- Responsive design with mobile-first approach: cards stack vertically on mobile, grid/tables on desktop.
- Cards and tables: rounded corners, subtle shadows, and hover animations for an interactive feel.
- Simple, recognizable icons to represent issue categories and statuses, enhancing usability.