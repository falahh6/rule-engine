"use client";
import { useState } from "react";
import TextArea from "antd/es/input/TextArea";

interface RuleInputProps {
  value: string;
  setValue: (value: string) => void;
  placeholder?: string; // Optional placeholder
  type: "string" | "object"; // Determines the input type
}

function RuleInput({
  value,
  setValue,
  placeholder = "Enter rule string or object",
  type,
}: RuleInputProps) {
  const [error, setError] = useState<string | null>(null);
  const validateInput = (input: string) => {
    let isValid = true;

    if (type === "string") {
      // Updated regex pattern to match conditions like age > 27, department = 'Sales'
      const rulePattern = /^[a-zA-Z_]+\s*(>|<|>=|<=|=|!=)\s*(\d+|'[^']+')$/;

      // Split by logical operators (AND/OR), allowing for spaces around operators
      const ruleParts = input.split(/\s+(AND|OR)\s+/);

      // Validate each part of the rule separately
      for (const part of ruleParts) {
        const trimmedPart = part.trim();
        if (!rulePattern.test(trimmedPart)) {
          setError(
            `Invalid rule format! Part of the rule failed validation: "${trimmedPart}"`
          );
          isValid = false;
          break;
        }
      }

      if (isValid) {
        setError(null);
      }
    } else if (type === "object") {
      // Object validation (e.g., { "age": 25 })
      try {
        const parsedObject = JSON.parse(input);
        if (typeof parsedObject !== "object" || Array.isArray(parsedObject)) {
          setError("Input must be a valid object in JSON format.");
          isValid = false;
        } else {
          setError(null); // No errors
        }
      } catch (e) {
        console.error(e);
        setError("Invalid JSON format for object data.");
        isValid = false;
      }
    }

    return isValid;
  };
  // Handle input change and validation
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value;
    setValue(inputValue);
    validateInput(inputValue);
  };

  return (
    <div>
      <TextArea
        value={value}
        autoSize={{ minRows: 3 }}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="w-full p-2 border rounded bg-gray-50"
      />
      {error && <div className="text-red-500 mt-1 py-2 text-xs">{error}</div>}
    </div>
  );
}

export default RuleInput;
