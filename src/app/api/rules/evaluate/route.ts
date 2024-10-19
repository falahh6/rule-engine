import { NextResponse } from "next/server";
import { evaluateRule } from "@/lib/ast";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const { ruleId, data } = await request.json();
  console.log("#1 : ", { ruleId, data });

  const rule = await prisma.rule.findUnique({
    where: { id: ruleId },
  });

  console.log("#2 : ", rule);

  if (!rule) {
    return NextResponse.json({ error: "Rule not found" }, { status: 404 });
  }

  const ast = JSON.parse(rule.ast!.toString());

  const result = evaluateRule(ast, data);
  return NextResponse.json({ result });
}
