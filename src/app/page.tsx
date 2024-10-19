import { RuleView } from "@/components/RuleList";
import { Rule } from "@prisma/client";

async function getRules(): Promise<Rule[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/rules`, {
    cache: "no-cache",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch rules");
  }
  return res.json();
}

export default async function Home() {
  let rules: Rule[] = [];

  try {
    rules = await getRules();
  } catch (error) {
    console.error("Failed to fetch rules:", error);
  }
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 mt-10">AST Rule Engine</h1>
      <div>
        <RuleView initialRules={rules} />
      </div>
    </main>
  );
}
