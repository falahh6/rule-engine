"use client";
import { Rule } from "@prisma/client";
import { Button, Modal, Select } from "antd";
import { CheckCircle, SquareEqual, XCircle } from "lucide-react";

import { useState } from "react";
import RuleInput from "./ui/RuleInput";

export default function EvaluateRule({ rules }: { rules: Rule[] }) {
  const [data, setData] = useState("");
  const [result, setResult] = useState<boolean | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [selectedRule, setSelectedRule] = useState<Rule>();
  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();
    try {
      const response = await fetch("/api/rules/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ruleId: selectedRule?.id,
          data: JSON.parse(data),
        }),
      });
      if (response.ok) {
        const { result } = await response.json();
        setResult(result);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleClear = () => {
    setSelectedRule(undefined);
    setData("");
    setResult(null);
  };

  return (
    <>
      <Button type="default" className="max-sm:w-full" onClick={showModal}>
        <SquareEqual className="h-4 w-4" /> Evaluate
      </Button>
      <Modal
        title="Evaluate rule"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={false}
      >
        <form onSubmit={handleSubmit} className="space-y-3 flex flex-col">
          <div>
            <p className="mb-1">Select the rule to evaluate</p>
            <Select
              placeholder={"experience >= 5 OR age < 25"}
              className="w-full"
              value={selectedRule?.id}
              onChange={(val) => {
                console.log("val : ", val);
                const rule: Rule = rules.find((r) => r?.id === val)!;
                console.log("val Rule : ", rule);
                setSelectedRule(rule);
              }}
              allowClear
              options={rules.map((r) => ({
                label: (
                  <p>
                    <span className="font-semibold">{r.name}</span> -{" "}
                    {r.ruleString}
                  </p>
                ),
                value: r.id,
              }))}
            />
          </div>
          <div>
            <p className="mb-1">Enter the data to evaluate on</p>
            {/* <TextArea
              required
              value={data}
              onChange={(e) => setData(e.target.value)}
              autoSize={{ minRows: 3 }}
              placeholder={`{"salary" : 41200, "department" : "Engineering"}`}
              className="w-full p-2 border rounded bg-gray-50"
            /> */}
            <RuleInput
              value={data}
              setValue={setData}
              type="object"
              placeholder={`{"salary" : 41200, "department" : "Engineering"}`}
            />
          </div>
          <div>
            {result === true && (
              <>
                <div className="p-2 text-xs font-semibold bg-green-100 text-green-500 rounded-md flex flex-row gap-2 items-center">
                  <CheckCircle className="h-3 w-3 inline" />{" "}
                  <p>
                    YES, The user is from the cohort based on selected rule!
                  </p>
                </div>
              </>
            )}
            {result === false && (
              <>
                <div className="p-2 text-xs font-semibold bg-red-100 text-red-500 rounded-md flex flex-row gap-2 items-center">
                  <XCircle className="h-3 w-3 inline" />{" "}
                  <p>
                    NO, The user is not from the cohort based on selected rule!
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="self-end flex flex-row gap-2">
            <Button
              color="danger"
              disabled={loading || !selectedRule || !data}
              variant="solid"
              type="default"
              onClick={handleClear}
            >
              Clear
            </Button>
            <Button
              loading={loading}
              disabled={!selectedRule || loading}
              htmlType="submit"
              variant="solid"
              type="primary"
            >
              Evaludate Rule
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
