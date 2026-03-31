"use server";
/**
 * @fileOverview This file implements a Genkit flow to extract metadata from a past question PDF document.
 *
 * - adminDocumentMetadataExtractor - A function that handles the metadata extraction process from a PDF.
 * - AdminDocumentMetadataExtractorInput - The input type for the adminDocumentMetadataExtractor function.
 * - AdminDocumentMetadataExtractorOutput - The return type for the adminDocumentMetadataExtractor function.
 */

import { ai } from "@/ai/genkit";
import { z } from "genkit";

const AdminDocumentMetadataExtractorInputSchema = z.object({
  pdfDataUri: z
    .string()
    .describe(
      "A past question PDF file, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'.",
    ),
});
export type AdminDocumentMetadataExtractorInput = z.infer<
  typeof AdminDocumentMetadataExtractorInputSchema
>;

const AdminDocumentMetadataExtractorOutputSchema = z.object({
  university: z
    .string()
    .describe("The name of the university found in the document.")
    .default(""),
  department: z
    .string()
    .describe("The name of the academic department found in the document.")
    .default(""),
  courseCode: z
    .string()
    .describe(
      'The alphanumeric code for the course (e.g., "CSC101", "MTH203") found in the document.',
    )
    .default(""),
  year: z
    .string()
    .describe(
      'The academic year(s) or examination year(s) to which the past question paper belongs (e.g., "2023/2024", "2023", "2022-2023").',
    )
    .default(""),
});
export type AdminDocumentMetadataExtractorOutput = z.infer<
  typeof AdminDocumentMetadataExtractorOutputSchema
>;

export async function adminDocumentMetadataExtractor(
  input: AdminDocumentMetadataExtractorInput,
): Promise<AdminDocumentMetadataExtractorOutput> {
  return adminDocumentMetadataExtractorFlow(input);
}

const prompt = ai.definePrompt({
  name: "adminDocumentMetadataExtractorPrompt",
  input: { schema: AdminDocumentMetadataExtractorInputSchema },
  output: { schema: AdminDocumentMetadataExtractorOutputSchema },
  model: "googleai/gemini-1.5-pro",
  prompt: `You are an expert academic document analyst. Your task is to carefully review the provided past question PDF document and extract specific metadata from it.

Extract the following information:
1.  **University Name**: The full name of the university.
2.  **Department Name**: The full name of the academic department.
3.  **Course Code**: The alphanumeric code for the course (e.g., "CSC101", "MTH203").
4.  **Academic Year**: The academic year(s) or examination year(s) to which the past question paper belongs (e.g., "2023/2024", "2023", "2022-2023").

If any information cannot be found, return an empty string for that field.

Provide the output in JSON format, strictly adhering to the following schema:
${"```json"}
{{jsonSchema output.schema}}
${"```"}

PDF Document:
{{media url=pdfDataUri}}`,
});

const adminDocumentMetadataExtractorFlow = ai.defineFlow(
  {
    name: "adminDocumentMetadataExtractorFlow",
    inputSchema: AdminDocumentMetadataExtractorInputSchema,
    outputSchema: AdminDocumentMetadataExtractorOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  },
);
