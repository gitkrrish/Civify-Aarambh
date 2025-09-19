"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Wand2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useData } from "@/contexts/data-context";
import { issueCategories, type IssueCategory } from "@/lib/data";
import { categorizeIssue } from "@/ai/flows/categorize-issue-flow";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters." }).max(100),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }).max(500),
  location: z.string().min(5, { message: "Location must be at least 5 characters." }).max(100),
  category: z.enum(issueCategories, { required_error: "Please select a category." }),
});

export default function ReportIssuePage() {
  const { addIssue } = useData();
  const router = useRouter();
  const { toast } = useToast();
  const [isCategorizing, setIsCategorizing] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
    },
  });

  const handleCategorize = async () => {
    const description = form.getValues("description");
    if (!description || description.length < 10) {
      toast({
        variant: "destructive",
        title: "Description too short",
        description: "Please enter a description of at least 10 characters to use the AI categorizer.",
      });
      return;
    }

    setIsCategorizing(true);
    try {
      const result = await categorizeIssue({ description });
      if (result && result.category) {
        form.setValue("category", result.category, { shouldValidate: true });
        toast({
          title: "Category Detected!",
          description: `The AI has suggested the "${result.category}" category for your issue.`,
        });
      }
    } catch (error) {
      console.error("Failed to categorize:", error);
       toast({
        variant: "destructive",
        title: "Categorization Failed",
        description: "The AI failed to determine a category. Please select one manually.",
      });
    } finally {
      setIsCategorizing(false);
    }
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    addIssue(values);
    router.push('/my-reports');
  }

  return (
    <div className="container mx-auto max-w-2xl p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold font-headline">Report a New Issue</CardTitle>
          <CardDescription>Fill out the details below to report a civic issue. Your report helps improve our community.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Large pothole on Main Street" {...field} />
                    </FormControl>
                    <FormDescription>A short, descriptive title for the issue.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Provide more details about the issue..." className="min-h-[120px]" {...field} />
                    </FormControl>
                    <FormDescription>Describe the issue in as much detail as possible.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Near City Hall, Kolkata" {...field} />
                    </FormControl>
                    <FormDescription>Provide the approximate location or address.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel>Category</FormLabel>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleCategorize}
                        disabled={isCategorizing}
                        className="relative overflow-hidden bg-primary/10 border-primary/20 text-primary/80 hover:bg-primary/15 hover:text-primary animate-pulse-slow shadow-[0_0_15px_theme(colors.primary/20)]"
                      >
                        <Wand2 className="mr-2 h-4 w-4" />
                        {isCategorizing ? 'Categorizing...' : 'Categorize with AI'}
                      </Button>
                    </div>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an issue category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {issueCategories.map(category => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Choose the category that best fits the issue, or let AI do it for you.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Submitting...' : 'Submit Report'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
