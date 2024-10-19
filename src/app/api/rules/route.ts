import { NextResponse } from "next/server";
import { createRule } from "@/lib/ast";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const { name, ruleString }: { name: string; ruleString: string } =
    await request.json();
  console.log("ruleString : ", ruleString);

  const ast = createRule(ruleString);
  console.log("ast : ", ast);

  const rule = await prisma.rule.create({
    data: {
      name,
      ruleString: ruleString ?? null,
      ast: JSON.stringify(ast),
    },
  });

  return NextResponse.json(rule);
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
