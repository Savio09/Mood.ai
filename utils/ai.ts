import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";
import {
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
} from "@langchain/core/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";

import { Document } from "langchain/document";
import { loadQARefineChain } from "langchain/chains";
import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

// Keep provider upgrades configurable without another application release.
const createModel = () => new ChatOpenAI({
  modelName: process.env.OPENAI_MODEL || "gpt-6-luna",
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 20000,
  maxRetries: 1,
  modelKwargs: { temperature: undefined, reasoning_effort: "none" },
});

// Define the schema
const schema = z.object({
  mood: z.string().describe("The mood of this journal entry"),
  color: z
    .string()
    .describe(
      "A hexadecimal color code representing the emotions in this journal entry. Example: #0101fe for blue representing happiness"
    ),
  sentimentScore: z
    .number()
    .describe(
      "sentiment of the text and rated on a scale from -10 to 10, where -10 is extremely negative, 0 is neutral, and 10 is extremely positive."
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

  const model = createModel();

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

export const qa = async (question, entries) => {
  if (!entries.length) return "Write a journal entry first, then ask about it.";
  // Learning about vector databases
  const docs = entries.map((entry) => {
    return new Document({
      pageContent: entry.content,
      metadata: { id: entry.id, createdAt: entry.createdAt },
    });
  });

  const model = createModel();
  const chain = loadQARefineChain(model);
  const embeddings = new OpenAIEmbeddings({ modelName: "text-embedding-3-small", timeout: 20000, maxRetries: 1 });
  const store = await MemoryVectorStore.fromDocuments(docs, embeddings);
  const relevantDocs = await store.similaritySearch(question);

  const res = await chain.invoke({
    input_documents: relevantDocs,
    question,
  });

  return res.output_text;
};
