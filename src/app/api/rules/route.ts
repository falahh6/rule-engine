import { NextResponse } from "next/server";
import { createRule } from "@/lib/ast";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    // Parse and validate request data
    const { name, ruleString }: { name: string; ruleString: string } =
      await request.json();

    if (!name || !ruleString) {
      return NextResponse.json(
        { error: "Name and ruleString are required" },
        { status: 400 }
      );
    }

    console.log("Received ruleString:", ruleString);

    // Create AST from rule string
    let ast;
    try {
      ast = createRule(ruleString);
    } catch (error) {
      console.error("Failed to create AST from ruleString:", error);
      return NextResponse.json(
        { error: "Invalid ruleString format" },
        { status: 400 }
      );
    }

    console.log("Generated AST:", ast);

    // Save the rule to the database
    const rule = await prisma.rule.create({
      data: {
        name,
        ruleString: ruleString ?? null,
        ast: JSON.stringify(ast),
      },
    });

    // Return the newly created rule
    return NextResponse.json(rule);
  } catch (error) {
    console.error("Error occurred in POST /api/rules:", error);
    return NextResponse.json(
      { error: "An internal error occurred" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const rules = await prisma.rule.findMany();
    return NextResponse.json(rules);
  } catch (error) {
    console.error("Failed to fetch rules:", error);
    return NextResponse.json(
      { error: "Failed to fetch rules" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
