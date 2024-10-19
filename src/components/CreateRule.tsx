"use client";

import { Button, Input, Modal } from "antd";
import { Plus } from "lucide-react";

import { useState } from "react";
import RuleInput from "./ui/RuleInput";

export default function CreateRule({ getRules }: { getRules: () => void }) {
  const [name, setName] = useState("");
  const [ruleString, setRuleString] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const response = await fetch("/api/rules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, ruleString }),
    });
    if (response.ok) {
      getRules();
      setName("");
      setRuleString("");
      setIsModalOpen(false);
    }
    setLoading(false);
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
      <Button type="primary" className="max-sm:w-full" onClick={showModal}>
        <Plus className="h-4 w-4" /> Create
      </Button>
      <Modal
        title="Create rule"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={false}
      >
        <form onSubmit={handleSubmit} className="space-y-3 flex flex-col">
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Rule Name"
            className="w-full p-2 border rounded bg-gray-50"
          />
          <RuleInput
            value={ruleString}
            setValue={setRuleString}
            type="string"
          />
          <Button
            loading={loading}
            htmlType="submit"
            variant="solid"
            type="primary"
            className="self-end"
          >
            Create Rule
          </Button>
        </form>
      </Modal>
    </>
  );
}
