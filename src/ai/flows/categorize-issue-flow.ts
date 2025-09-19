'use server';
/**
 * @fileOverview An AI flow to categorize a civic issue based on its description.
 *
 * - categorizeIssue - A function that handles the issue categorization.
 * - CategorizeIssueInput - The input type for the categorizeIssue function.
 * - CategorizeIssueOutput - The return type for the categorizeIssue function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import { issueCategories } from '@/lib/data';

const CategorizeIssueInputSchema = z.object({
  description: z.string().describe('The detailed description of the civic issue provided by the user.'),
});
export type CategorizeIssueInput = z.infer<typeof CategorizeIssueInputSchema>;

const CategorizeIssueOutputSchema = z.object({
  category: z.enum(issueCategories as [string, ...string[]]).describe(`The most relevant category for the issue. Must be one of: ${issueCategories.join(', ')}`),
});
export type CategorizeIssueOutput = z.infer<typeof CategorizeIssueOutputSchema>;

export async function categorizeIssue(input: CategorizeIssueInput): Promise<CategorizeIssueOutput> {
  return categorizeIssueFlow(input);
}

const prompt = ai.definePrompt({
  name: 'categorizeIssuePrompt',
  input: {schema: CategorizeIssueInputSchema},
  output: {schema: CategorizeIssueOutputSchema},
  prompt: `You are an expert at categorizing civic issue reports. Your task is to analyze the user's description and determine the most appropriate category from the provided list.

  Available Categories:
  - Pothole
  - Garbage
  - Streetlight
  - Water

  Based on the following description, please select the single best category.

  User's Description:
  "{{{description}}}"
`,
});

const categorizeIssueFlow = ai.defineFlow(
  {
    name: 'categorizeIssueFlow',
    inputSchema: CategorizeIssueInputSchema,
    outputSchema: CategorizeIssueOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
