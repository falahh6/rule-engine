import { NextResponse } from "next/server";
import { combineRules } from "@/lib/ast";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const { ruleIds, name } = await request.json();

  const rules = await prisma.rule.findMany({
    where: {
      id: { in: ruleIds },
    },
  });

  const ruleStrings = rules.map((rule) => JSON.stringify(rule.ruleString!));

  const { combinedAST, combinedRuleString } = combineRules(ruleStrings, "AND");

  const newRule = await prisma.rule.create({
    data: {
      name,
      ast: JSON.stringify(combinedAST),
      ruleString: combinedRuleString,
    },
  });

  return NextResponse.json(newRule);
}
