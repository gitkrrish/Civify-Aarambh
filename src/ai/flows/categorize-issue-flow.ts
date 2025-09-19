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

// Internal schema for a less strict AI response
const AIGuessSchema = z.object({
  categoryGuess: z.string().describe(`The best guess for the issue category. Should be one of: ${issueCategories.join(', ')}`),
});

export async function categorizeIssue(input: CategorizeIssueInput): Promise<CategorizeIssueOutput> {
  return categorizeIssueFlow(input);
}

const prompt = ai.definePrompt({
  name: 'categorizeIssuePrompt',
  input: {schema: CategorizeIssueInputSchema},
  output: {schema: AIGuessSchema},
  prompt: `You are an expert at categorizing civic issue reports. Your task is to analyze the user's description and determine the most appropriate category from the provided list.

  Available Categories:
  ${issueCategories.map(c => `- ${c}`).join('\n')}

  Based on the following description, please select the single best category.

  User's Description:
  "{{{description}}}"
`,
});

// Function to find the closest match
function findClosestCategory(guess: string): CategorizeIssueOutput['category'] {
  const lowerCaseGuess = guess.toLowerCase();
  for (const category of issueCategories) {
    if (lowerCaseGuess.includes(category.toLowerCase())) {
      return category;
    }
  }
  // As a last resort, pick the first category if no match is found.
  // This should be rare with the improved prompt.
  return issueCategories[0];
}


const categorizeIssueFlow = ai.defineFlow(
  {
    name: 'categorizeIssueFlow',
    inputSchema: CategorizeIssueInputSchema,
    outputSchema: CategorizeIssueOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("AI did not return an output.");
    }
    
    // Find the closest valid category from the AI's guess
    const matchedCategory = findClosestCategory(output.categoryGuess);

    return { category: matchedCategory };
  }
);
