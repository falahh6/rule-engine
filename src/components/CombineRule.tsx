"use client";

import { Rule } from "@prisma/client";
import { JsonValue } from "@prisma/client/runtime/library";
import { Button, Input, Modal } from "antd";
import { Combine } from "lucide-react";
import React, { useState, FormEvent } from "react";

export default function CombineRule({
  selectedRules,
  setSelectedRules,
  getRules,
}: {
  selectedRules: Rule[];
  setSelectedRules: React.Dispatch<
    React.SetStateAction<
      {
        name: string;
        id: number;
        ast: JsonValue;
        ruleString: string | null;
        createdAt: Date;
      }[]
    >
  >;
  getRules: () => void;
}): JSX.Element {
  const [name, setName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleCombine = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/rules/combine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ruleIds: selectedRules.map((r) => r.id), name }),
      });
      if (response.ok) {
        getRules();
        setSelectedRules([]); // Clear selections
      } else {
        console.error("Failed to combine rules");
      }
    } catch (error) {
      console.error("Error combining rules:", error);
      alert("An error occurred while combining rules.");
    } finally {
      setLoading(false);
      handleCancel();
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

  return (
    <>
      <Button
        className="max-sm:w-full"
        disabled={selectedRules.length <= 1}
        type="primary"
        onClick={showModal}
      >
        <Combine className="h-4 w-4" /> Combine
      </Button>
      <Modal
        title="Combine rule"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={false}
      >
        <form onSubmit={handleCombine} className="space-y-3 flex flex-col">
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Rule Name"
            className="w-full p-2 border rounded bg-gray-50"
          />
          <div>
            <p className="mb-2 font-semibold">Selected Rules to Combine</p>
            <div className="flex flex-col gap-2 max-h-[60vh] overflow-auto">
              {selectedRules.map((rule, i) => (
                <p key={i} className="bg-gray-100 p-2 rounded-md">
                  {rule.ruleString}
                </p>
              ))}
            </div>
          </div>
          <Button
            loading={loading}
            disabled={loading}
            htmlType="submit"
            variant="solid"
            type="primary"
            className="self-end"
          >
            Combine
          </Button>
        </form>
      </Modal>
    </>
  );
}
