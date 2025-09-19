'use server';
/**
 * @fileOverview An AI flow to summarize a civic issue report.
 *
 * - summarizeIssue - A function that handles the issue summarization.
 * - SummarizeIssueInput - The input type for the summarizeIssue function.
 * - SummarizeIssueOutput - The return type for the summarizeIssue function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const SummarizeIssueInputSchema = z.object({
  description: z.string().describe('The detailed description of the civic issue provided by the user.'),
});
export type SummarizeIssueInput = z.infer<typeof SummarizeIssueInputSchema>;

const SummarizeIssueOutputSchema = z.object({
  title: z.string().describe('A short, concise title (under 10 words) that summarizes the issue.'),
  summarizedDescription: z.string().describe('A polished, well-written, and clear summary of the original issue description.'),
});
export type SummarizeIssueOutput = z.infer<typeof SummarizeIssueOutputSchema>;

export async function summarizeIssue(input: SummarizeIssueInput): Promise<SummarizeIssueOutput> {
  return summarizeIssueFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeIssuePrompt',
  input: {schema: SummarizeIssueInputSchema},
  output: {schema: SummarizeIssueOutputSchema},
  prompt: `You are an expert at summarizing civic issue reports. Your task is to take a user's raw description of a problem and transform it into a clear and concise report.

  Based on the following description, please generate:
  1. A short, descriptive title (less than 10 words).
  2. A polished and summarized version of the description.

  User's Description:
  "{{{description}}}"
`,
});

const summarizeIssueFlow = ai.defineFlow(
  {
    name: 'summarizeIssueFlow',
    inputSchema: SummarizeIssueInputSchema,
    outputSchema: SummarizeIssueOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
