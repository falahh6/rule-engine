"use client";
import { useState } from "react";
import TextArea from "antd/es/input/TextArea";

interface RuleInputProps {
  value: string;
  setValue: (value: string) => void;
  placeholder?: string;
  type: "string" | "object";
}

interface ValidationResult {
  isValid: boolean;
  errorMessage: string;
}

function RuleInput({
  value,
  setValue,
  placeholder = "Enter rule string or object",
  type,
}: RuleInputProps) {
  const [error, setError] = useState<string | null>(null);

  const validateInput = (input: string): boolean => {
    if (type === "string") {
      const result = validateStringRule(input);
      setError(result.errorMessage);
      return result.isValid;
    } else if (type === "object") {
      return validateObjectRule(input);
    }

    setError("Invalid type specified");
    return false;
  };

  const validateStringRule = (rule: string): ValidationResult => {
    if (rule.trim() === "") {
      return { isValid: false, errorMessage: "Rule cannot be empty." };
    }

    const tokens = tokenize(rule);
    return validateTokens(tokens);
  };

  const tokenize = (input: string): string[] => {
    const tokens = input.split(/\s+/);
    return tokens;
  };

  const validateTokens = (tokens: string[]): ValidationResult => {
    let expectingField = true;
    let expectingOperator = false;
    let expectingValue = false;
    let expectingLogicalOperator = false;
    let parenthesesStack = 0; // To track the depth of parentheses

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i].trim();

      // Handle opening parenthesis
      if (token === "(") {
        if (!expectingField && !expectingLogicalOperator) {
          return {
            isValid: false,
            errorMessage: `Unexpected token before '(': ${tokens[i - 1]}`,
          };
        }
        parenthesesStack++;
        expectingField = true; // After an opening parenthesis, we expect a field or another opening parenthesis
        continue;
      }

      // Handle closing parenthesis
      if (token === ")") {
        if (parenthesesStack === 0) {
          return {
            isValid: false,
            errorMessage: "Unmatched closing parenthesis",
          };
        }
        if (expectingField || expectingOperator || expectingValue) {
          return {
            isValid: false,
            errorMessage: "Incomplete condition inside parentheses",
          };
        }
        parenthesesStack--;
        expectingLogicalOperator = true; // After closing a parenthesis, expect a logical operator or end
        continue;
      }

      // Handle logical operators (AND, OR)
      if (token.toUpperCase() === "AND" || token.toUpperCase() === "OR") {
        if (!expectingLogicalOperator) {
          return {
            isValid: false,
            errorMessage: `Unexpected logical operator: ${token}`,
          };
        }
        expectingField = true; // After a logical operator, we expect a field or an opening parenthesis
        expectingLogicalOperator = false;
        continue;
      }

      // Handle field
      if (expectingField) {
        // This should be a field name (add more specific checks if needed)
        expectingField = false;
        expectingOperator = true; // After a field, expect an operator
        continue;
      }

      // Handle operators (>, <, =, !=, >=, <=)
      if (expectingOperator) {
        if (![">", "<", "=", "!=", ">=", "<="].includes(token)) {
          return { isValid: false, errorMessage: `Invalid operator: ${token}` };
        }
        expectingOperator = false;
        expectingValue = true; // After an operator, expect a value
        continue;
      }

      // Handle value (you can add specific checks for valid values if necessary)
      if (expectingValue) {
        expectingValue = false;
        expectingLogicalOperator = true; // After a value, expect a logical operator or closing parenthesis
        continue;
      }

      // If we get here, we have an unexpected token
      return { isValid: false, errorMessage: `Unexpected token: ${token}` };
    }

    // If we're still expecting something at the end, the expression is incomplete
    if (expectingField || expectingOperator || expectingValue) {
      return { isValid: false, errorMessage: "Incomplete condition" };
    }

    // Check if all opened parentheses are closed
    if (parenthesesStack > 0) {
      return { isValid: false, errorMessage: "Unmatched opening parenthesis" };
    }

    return { isValid: true, errorMessage: "" };
  };

  const validateObjectRule = (input: string): boolean => {
    try {
      const parsedObject = JSON.parse(input);
      if (typeof parsedObject !== "object" || Array.isArray(parsedObject)) {
        setError("Input must be a valid object in JSON format.");
        return false;
      } else {
        setError(null); // No errors
        return true;
      }
    } catch (e) {
      console.error(e);
      setError("Invalid JSON format for object data.");
      return false;
    }
  };

  // Handle input change and validation
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value;
    setValue(inputValue);
    if (inputValue.length == 0) {
      setError(null);
    } else {
      validateInput(inputValue);
    }
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
