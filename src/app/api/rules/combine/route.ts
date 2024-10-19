import { NextResponse } from "next/server";
import { combineRules } from "@/lib/ast";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { ruleIds, name } = await request.json();

    // Fetch the rules from the database
    const rules = await prisma.rule.findMany({
      where: {
        id: { in: ruleIds },
      },
    });

    // Handle case where no rules are found
    if (!rules.length) {
      return NextResponse.json(
        { error: "No rules found for the provided IDs" },
        { status: 404 }
      );
    }

    // Process the rules
    const ruleStrings = rules.map((rule) => JSON.stringify(rule.ruleString!));
    const { combinedAST, combinedRuleString } = combineRules(
      ruleStrings,
      "AND"
    );

    // Create a new combined rule in the database
    const newRule = await prisma.rule.create({
      data: {
        name,
        ast: JSON.stringify(combinedAST),
        ruleString: combinedRuleString,
      },
    });

    return NextResponse.json(newRule);
  } catch (error) {
    console.error("Error in /api/rules/combine:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
