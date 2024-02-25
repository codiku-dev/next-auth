import { readProductAnalysis } from "@/app/actions/ai-product-summarizer/actions";
import { safeEndPoint } from "@/libs/jwt";
import { NextRequest, NextResponse } from "next/server";
import { GetProductAnalysisModelQParams } from "./models";

export const GET = safeEndPoint(
  async (_req: NextRequest, _, __, { productUrl }) => {
    try {
      console.log("in ");
      const created = await readProductAnalysis({ productUrl: "azeaz" });
      return NextResponse.json({});
    } catch (error) {
      return NextResponse.json({ error }, { status: 500 });
    }
  },
  false,
  undefined,
  undefined,
  GetProductAnalysisModelQParams
);
