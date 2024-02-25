import { z } from "zod";

export const ReadProductAnalysisModelParams = z.object({
  productUrl: z.string(),
});
