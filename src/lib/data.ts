export type User = {
  id: number;
  name: string;
  points: number;
};

export type Role = 'user' | 'admin';

export type LoggedInUser = {
  name: string;
  role: Role;
};

export type IssueCategory = 'Pothole' | 'Garbage' | 'Streetlight' | 'Water';
export const issueCategories: IssueCategory[] = ['Pothole', 'Garbage', 'Streetlight', 'Water'];

export type IssueStatus = 'Pending' | 'In-Progress' | 'Resolved';
export const issueStatuses: IssueStatus[] = ['Pending', 'In-Progress', 'Resolved'];

export type Issue = {
  id: string;
  title: string;
  description: string;
  location: string;
  category: IssueCategory;
  status: IssueStatus;
  reporterName: string;
  createdAt: string;
};

export const initialUsers: User[] = [
  { id: 1, name: "Krrish Shaw", points: 5 },
  { id: 2, name: "Rishu Singh", points: 4 },
  { id: 3, name: "Ankan Ghosh", points: 3 },
  { id: 4, name: "Rahul Verma", points: 2 },
  { id: 5, name: "Aman Yadav", points: 1 }
];

export const initialIssues: Issue[] = [
  {
    id: 'issue-1',
    title: 'Pothole on MG Road, Kolkata',
    description: 'A large pothole near the main intersection is causing traffic issues.',
    location: 'MG Road, Kolkata',
    category: 'Pothole',
    status: 'Pending',
    reporterName: 'Rahul Verma',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'issue-2',
    title: 'Streetlight not working in Sector 15, Noida',
    description: 'The streetlight on the corner of the park has been out for a week.',
    location: 'Sector 15, Noida',
    category: 'Streetlight',
    status: 'Pending',
    reporterName: 'Rishu Singh',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'issue-3',
    title: 'Garbage dump overflowing near Howrah Station',
    description: 'The public garbage bin is overflowing, creating a health hazard.',
    location: 'Howrah Station Area',
    category: 'Garbage',
    status: 'In-Progress',
    reporterName: 'Krrish Shaw',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];
