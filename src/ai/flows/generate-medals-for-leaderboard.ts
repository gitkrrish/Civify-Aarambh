'use server';
/**
 * @fileOverview Generates medal images for the top 3 users on the leaderboard.
 *
 * - generateMedalsForLeaderboard - A function that generates medal images for the top 3 users.
 * - GenerateMedalsForLeaderboardInput - The input type for the generateMedalsForLeaderboard function.
 * - GenerateMedalsForLeaderboardOutput - The return type for the generateMedalsForLeaderboard function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const GenerateMedalsForLeaderboardInputSchema = z.object({
  topUsernames: z.array(z.string()).describe('The usernames of the top 3 users on the leaderboard.'),
});
export type GenerateMedalsForLeaderboardInput = z.infer<typeof GenerateMedalsForLeaderboardInputSchema>;

const GenerateMedalsForLeaderboardOutputSchema = z.object({
  medalImages: z.array(z.string()).describe('An array of data URIs, each representing a medal image for the corresponding user.'),
});
export type GenerateMedalsForLeaderboardOutput = z.infer<typeof GenerateMedalsForLeaderboardOutputSchema>;

export async function generateMedalsForLeaderboard(input: GenerateMedalsForLeaderboardInput): Promise<GenerateMedalsForLeaderboardOutput> {
  return generateMedalsForLeaderboardFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMedalsForLeaderboardPrompt',
  input: {schema: GenerateMedalsForLeaderboardInputSchema},
  output: {schema: GenerateMedalsForLeaderboardOutputSchema},
  prompt: `You are tasked with generating visually appealing medal images for the top 3 users on a leaderboard.

  For each username provided, create a unique medal image that reflects the user's name and their achievement.

  Usernames: {{{topUsernames}}}

  Return an array of data URIs, where each URI represents a PNG image of a medal corresponding to the username at the same index in the input array.
  The medal should have the username inscribed. Be creative with the design, making each medal distinct and celebratory.
`,
});

const generateMedalsForLeaderboardFlow = ai.defineFlow(
  {
    name: 'generateMedalsForLeaderboardFlow',
    inputSchema: GenerateMedalsForLeaderboardInputSchema,
    outputSchema: GenerateMedalsForLeaderboardOutputSchema,
  },
  async input => {
    const medalImages: string[] = [];
    for (const username of input.topUsernames) {
      const {media} = await ai.generate({
        model: 'googleai/imagen-4.0-fast-generate-001',
        prompt: `Generate a gold medal image with the username "${username}" inscribed on it.`,
      });
      if (media && media.url) {
        medalImages.push(media.url);
      } else {
        medalImages.push(''); // Placeholder if image generation fails
      }
    }

    return {medalImages};
  }
);
