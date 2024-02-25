import { GetProductAnalysisModelQParams } from "./models";
import { NextRequest, NextResponse } from "next/server";
import { safeEndPoint } from "@/libs/jwt";
import { readProductAnalysis } from "@/app/actions/ai-product-summarizer/actions";

export const GET = safeEndPoint(
  async (_req: NextRequest, _, __, { productUrl }) => {
    try {
      const created = await readProductAnalysis({ productUrl });
      return NextResponse.json(created);
    } catch (error) {
      return NextResponse.json({ error }, { status: 500 });
    }
  },
  false,
  undefined,
  undefined,
  GetProductAnalysisModelQParams
);
