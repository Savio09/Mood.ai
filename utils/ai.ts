import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";
import {
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
} from "@langchain/core/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";

// Define the schema
const schema = z.object({
  mood: z.string().describe("The mood of this journal entry"),
  color: z
    .string()
    .describe(
      "A hexadecimal color code representing the emotions in this journal entry. Example: #0101fe for blue representing happiness"
    ),
  subject: z.string().describe("The subject of this journal entry"),
  negative: z
    .boolean()
    .describe(
      "Whether this journal entry is negative (i.e., does it contain negative emotions?)"
    ),
  summary: z.string().describe("A quick summary of this journal entry"),
});

// Create the parser and get format instructions
const parser = StructuredOutputParser.fromZodSchema(schema);
const format_instructions = parser.getFormatInstructions();

// Create the prompt template
const prompt_template = ChatPromptTemplate.fromPromptMessages([
  SystemMessagePromptTemplate.fromTemplate(
    "You are an assistant that analyzes journal entries."
  ),
  HumanMessagePromptTemplate.fromTemplate("{format_instructions}\n\n{entry}"),
]);

// Function to get formatted messages
const getPrompt = async (content) => {
  const messages = await prompt_template.formatMessages({
    entry: content,
    format_instructions,
  });
  return messages;
};

// Analyze function
export const analyze = async (content) => {
  const messages = await getPrompt(content);

  const model = new ChatOpenAI({
    temperature: 0,
    modelName: "gpt-3.5-turbo",
    apiKey: process.env.OPENAI_API_KEY, // Ensure your API key is set
  });

  const response = await model.invoke(messages);
  const output = response.content;

  try {
    const parsedOutput = await parser.parse(output);
    return parsedOutput;
  } catch (error) {
    console.error("Error parsing AI response:", error);
    throw error;
  }
};
