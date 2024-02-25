import { IdParamsModel } from "@/libs/models";
import { z } from "zod";

export const GetProductAnalysisModelQParams = z.object({
  productUrl: z.string(),
});
