"use server";
/**
 * @fileOverview An AI-powered study assistant that generates practice questions or highlights key topics for a given course and study topic.
 *
 * - aiExamStudyAssistant - A function that handles the generation of study materials.
 * - AiExamStudyAssistantInput - The input type for the aiExamStudyAssistant function.
 * - AiExamStudyAssistantOutput - The return type for the aiExamStudyAssistant function.
 */

import { ai } from "@/ai/genkit";
import { z } from "genkit";

const AiExamStudyAssistantInputSchema = z.object({
  courseCode: z
    .string()
    .describe(
      'The course code for which to generate study materials (e.g., "CSC 101").',
    ),
  studyTopic: z
    .string()
    .describe(
      "The specific topic within the course for which to generate study materials.",
    ),
});
export type AiExamStudyAssistantInput = z.infer<
  typeof AiExamStudyAssistantInputSchema
>;

const AiExamStudyAssistantOutputSchema = z.object({
  practiceQuestions: z
    .array(z.string())
    .describe(
      "A list of practice questions for the given study topic. Can be empty if key topics are provided.",
    ),
  keyTopics: z
    .array(z.string())
    .describe(
      "A list of key topics or concepts to focus on for the given study topic. Can be empty if practice questions are provided.",
    ),
});
export type AiExamStudyAssistantOutput = z.infer<
  typeof AiExamStudyAssistantOutputSchema
>;

export async function aiExamStudyAssistant(
  input: AiExamStudyAssistantInput,
): Promise<AiExamStudyAssistantOutput> {
  return aiExamStudyAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: "aiExamStudyAssistantPrompt",
  input: { schema: AiExamStudyAssistantInputSchema },
  output: { schema: AiExamStudyAssistantOutputSchema },
  prompt: `You are an AI-powered study assistant designed to help university students prepare for exams.
Given a course code and a specific study topic, your task is to generate either practice exam questions or highlight key areas to focus on. You can provide both if appropriate.

Course Code: {{{courseCode}}}
Study Topic: {{{studyTopic}}}

Please provide the output in JSON format with two fields: 'practiceQuestions' (an array of strings) and 'keyTopics' (an array of strings). If you provide practice questions, they should be well-formed questions suitable for an exam. If you provide key topics, they should be concise bullet points of important concepts. Ensure at least one of these arrays is non-empty.`,
});

const aiExamStudyAssistantFlow = ai.defineFlow(
  {
    name: "aiExamStudyAssistantFlow",
    inputSchema: AiExamStudyAssistantInputSchema,
    outputSchema: AiExamStudyAssistantOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error("Failed to generate study materials.");
    }
    return output;
  },
);
