import { safeAction } from "@/libs/request";
import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import fs from "fs";
import path from "path";
import { ReadProductAnalysisModelParams } from "./models";

async function readReviewsFile(): Promise<string> {
  const filePath = path.resolve(process.cwd(), "reviews.json");
  try {
    const data = await fs.promises.readFile(filePath, "utf8");
    return data;
  } catch (error) {
    console.error("Error reading the reviews file:", error);
    throw error;
  }
}

export const readProductAnalysis = safeAction(async ({ productUrl }): Promise<ReviewSummary> => {
  const reviews = await readReviewsFile();
  console.log("The reviews", reviews);
  const chatModel = new ChatOllama({
    baseUrl: "http://localhost:11434", // Default value
    model: "mistral",
    temperature: 0.3,
    cache: false,
  });

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", `You are an Amazon product review summarizer.`],
    [
      "user",
      `Summarize Amazon reviews highlighting key pros and cons with frequency estimates. {input}. Desired output is JSON, it's important : {{"summary": "", "pros":[{{"description":"","frequency":"X%"}},{{"description":"","frequency":"Y%"}}],"cons":[{{"description":"","frequency":"Z%"}},{{"description":"","frequency":"W%"}}]}}`,
    ],
  ]);
  /*
  console.log("prompt...");
  const chain = prompt.pipe(chatModel);
  console.log("thinking...");
  const resp = await chain.invoke({
    input: reviews,
  });
  console.log(resp.content);
  const response = JSON.parse(resp.content as string) as ReviewSummary;
  return response;
  */
  return { cons: [], pros: [], summary: "" };
}, ReadProductAnalysisModelParams);
