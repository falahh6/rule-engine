import { NextResponse } from "next/server";
import { evaluateRule } from "@/lib/ast";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    // Parse the request body
    const { ruleId, data } = await request.json();
    console.log("Received Request - Rule ID and Data:", { ruleId, data });

    // Validate the ruleId
    if (!ruleId) {
      return NextResponse.json({ error: "Invalid rule ID" }, { status: 400 });
    }

    // Fetch the rule from the database
    const rule = await prisma.rule.findUnique({
      where: { id: ruleId },
    });

    console.log("Fetched Rule from DB:", rule);

    // Check if the rule exists
    if (!rule) {
      return NextResponse.json({ error: "Rule not found" }, { status: 404 });
    }

    // Parse the AST (Abstract Syntax Tree)
    let ast;
    try {
      ast = JSON.parse(rule.ast!.toString());
    } catch (error) {
      console.error("Failed to parse AST:", error);
      return NextResponse.json(
        { error: "Invalid AST format" },
        { status: 500 }
      );
    }

    // Evaluate the rule with the provided data
    const result = evaluateRule(ast, data);
    console.log("Evaluation Result:", result);

    // Return the evaluation result
    return NextResponse.json({ result });
  } catch (error) {
    console.error("Error occurred during request:", error);
    return NextResponse.json(
      { error: "An internal error occurred" },
      { status: 500 }
    );
  }
}
