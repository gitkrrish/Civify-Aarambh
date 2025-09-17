"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import useLocalStorage from '@/hooks/use-local-storage';
import { initialUsers, initialIssues, type User, type Issue, type IssueStatus, type IssueCategory } from '@/lib/data';
import { useAuth } from './auth-context';
import { useToast } from '@/hooks/use-toast';

interface DataContextType {
  users: User[];
  issues: Issue[];
  addIssue: (issueData: { title: string; description: string; location: string; category: IssueCategory }) => void;
  updateIssueStatus: (issueId: string, status: IssueStatus) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// By changing the key, we force a reset of the data in local storage
// This ensures that the updated initial data is loaded.
const USERS_STORAGE_KEY = 'civify-users-v2';
const ISSUES_STORAGE_KEY = 'civify-issues-v2';

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [users, setUsers] = useLocalStorage<User[]>(USERS_STORAGE_KEY, initialUsers);
  const [issues, setIssues] = useLocalStorage<Issue[]>(ISSUES_STORAGE_KEY, initialIssues);
  const { user: currentUser } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
    // Initialize with dummy data if localStorage is empty
    const areUsersInitialized = localStorage.getItem(USERS_STORAGE_KEY);
    if (!areUsersInitialized || JSON.parse(areUsersInitialized).length === 0) {
      setUsers(initialUsers);
    }
    const areIssuesInitialized = localStorage.getItem(ISSUES_STORAGE_KEY);
    if (!areIssuesInitialized || JSON.parse(areIssuesInitialized).length === 0) {
      setIssues(initialIssues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addIssue = (issueData: { title: string; description: string; location: string; category: IssueCategory }) => {
    if (!currentUser) return;

    const newIssue: Issue = {
      ...issueData,
      id: `issue-${Date.now()}`,
      status: 'Pending',
      reporterName: currentUser.name,
      createdAt: new Date().toISOString(),
    };

    setIssues(prevIssues => [newIssue, ...prevIssues]);
    
    setUsers(prevUsers => {
      const updatedUsers = prevUsers.map(u => 
        u.name === currentUser.name ? { ...u, points: u.points + 1 } : u
      );
      // Add user if they don't exist
      if (!updatedUsers.find(u => u.name === currentUser.name)) {
        updatedUsers.push({ id: Date.now(), name: currentUser.name, points: 1 });
      }
      return updatedUsers.sort((a, b) => b.points - a.points);
    });

    toast({
      title: "Success!",
      description: "Issue reported successfully.",
    });
  };

  const updateIssueStatus = (issueId: string, status: IssueStatus) => {
    setIssues(prevIssues => 
      prevIssues.map(issue => 
        issue.id === issueId ? { ...issue, status } : issue
      )
    );
  };

  if (!isMounted) {
    return null;
  }

  return (
    <DataContext.Provider value={{ users, issues, addIssue, updateIssueStatus }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
