import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";

const schema = z.object({
  mood: z.string().describe("The mood of this journal entry"),
  color: z
    .string()
    .describe(
      "a hexadecimal color code representing the mood of the entry. Example: #0101fe for blue representing happiness"
    ),
  subject: z.string().describe("The subject of this journal entry"),
  negative: z
    .boolean()
    .describe(
      "Whether this journal entry is negative? (i.e. does it contain negative emotions?)"
    ),
  summary: z.string().describe("A quick summary of this journal entry"),
});

export const analyze = async (prompt) => {
  const model = new ChatOpenAI({
    temperature: 0,
    modelName: "gpt-3.5-turbo",
    apiKey: process.env.OPENAI_API_KEY, // Set your API key
  });
  const result = await model.withStructuredOutput(schema).invoke(prompt);
  console.log(result);
};
