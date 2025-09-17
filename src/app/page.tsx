"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Role } from '@/lib/data';
import { Building2 } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [role, setRole] = useState<Role>('user');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }
    setError('');
    login(name.trim(), role);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center gap-2 mb-2">
            <Building2 className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-headline font-bold">Civify</h1>
          </div>
          <CardTitle className="text-2xl">Welcome!</CardTitle>
          <CardDescription>Log in to report and track civic issues.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input 
              id="name" 
              placeholder="e.g., Krrish Shaw" 
              value={name}
              onChange={(e) => setName(e.target.value)} 
              required 
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="role">Role</Label>
            <Select onValueChange={(value: Role) => setRole(value)} defaultValue={role}>
              <SelectTrigger id="role">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {error && <p className="text-sm font-medium text-destructive">{error}</p>}
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleLogin}>
            Log In
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
