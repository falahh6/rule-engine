"use client";

import { Rule } from "@prisma/client";
import { Checkbox, Empty, Spin } from "antd";

import React, { useState } from "react";
import TreeUi from "./ui/TreeUi";
import CreateRule from "./CreateRule";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import CombineRule from "./CombineRule";
import EvaluateRule from "./EvaluateRule";

export const RuleView = ({ initialRules }: { initialRules: Rule[] }) => {
  const [rules, setRules] = useState<Rule[]>(initialRules);
  const [loading, setLoading] = useState(false);

  const [selectedRules, setSelectedRules] = useState<Rule[]>([]);

  const getRules = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/rules`, {
        cache: "no-cache",
      });
      if (!res.ok) {
        throw new Error("Failed to fetch rules");
      }
      const data: Rule[] = await res.json();
      setRules(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (
    event: CheckboxChangeEvent,
    rule: Rule
  ): void => {
    if (event.target.checked) {
      setSelectedRules((prev) => [...prev, rule]);
    } else {
      setSelectedRules((prev) => prev.filter((r) => rule.id !== r.id));
    }
  };

  return (
    <div>
      <div className="w-full flex flex-row gap-2 justify-end mb-4 ">
        <CreateRule getRules={getRules} />
        <CombineRule
          selectedRules={selectedRules}
          setSelectedRules={setSelectedRules}
          getRules={getRules}
        />
        <EvaluateRule rules={rules} />
      </div>
      <div className="max-sm:text-xs border rounded-lg w-full h-fit">
        <div className="w-full bg-gray-200 flex flex-row justify-between text-left p-4 font-bold gap-2 border-b items-center">
          <Checkbox className="mx-2 invisible" onChange={() => {}} />
          <div className="w-[10%] ml-4 text-center">Rule Id</div>
          <div className="w-[20%]">Name</div>
          <div className="w-[70%]">Rule String</div>
          <div className="w-[10%]">AST</div>
        </div>
        <>
          {loading && (
            <div className="py-32 h-auto w-[90vw] absolute bg-gray-50 flex items-center justify-center z-20 opacity-70">
              <Spin />
            </div>
          )}
          {rules.length > 0 ? (
            <>
              {rules.map((rule, i) => (
                <div
                  key={i}
                  className={`w-full flex flex-row justify-between text-left p-4 ${
                    rules.length !== i + 1 && "border-b"
                  } items-center gap-2 hover:bg-gray-50`}
                >
                  <Checkbox
                    className="mx-2"
                    checked={selectedRules.includes(rule)}
                    onChange={(e) => handleCheckboxChange(e, rule)}
                  />
                  <div className="w-[10%] ml-4 text-center">{rule.id}</div>
                  <div className="w-[20%]">{rule.name}</div>
                  <div className="w-[70%] text-blue-500 font-semibold">
                    {rule.ruleString}
                  </div>
                  <div className="w-[10%]">
                    <TreeUi ruleAst={JSON.parse(`${rule.ast}`)} />
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="py-10">
              <Empty
                description={
                  <div>
                    No rules exists, Please Create one{" "}
                    <div className=" mt-4">
                      {" "}
                      <CreateRule getRules={getRules} />
                    </div>
                  </div>
                }
              />
            </div>
          )}
        </>
      </div>
    </div>
  );
};
