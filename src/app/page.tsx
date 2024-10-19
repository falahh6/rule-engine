import { RuleView } from "@/components/RuleList";

export default async function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 mt-10">AST Rule Engine</h1>
      <div>
        <RuleView />
      </div>
    </main>
  );
}
