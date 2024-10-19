/* eslint-disable @typescript-eslint/no-explicit-any */

interface ASTNode {
  type: "operator" | "operand"; // Type of node
  operator?: string; // Logical operators (AND, OR)
  left?: ASTNode; // Left child node
  right?: ASTNode; // Right child node
  value?: any; // Value for operand nodes
}

interface UserData {
  [key: string]: string | number;
}

// Helper function to create an operand node
function createOperandNode(
  attribute: string,
  operator: string,
  value: any
): ASTNode {
  return {
    type: "operand",
    value: {
      attribute,
      operator,
      compareValue: value,
    },
  };
}

// Helper function to build an operator node
function createOperatorNode(
  operator: string,
  left: ASTNode,
  right: ASTNode
): ASTNode {
  return {
    type: "operator",
    operator,
    left,
    right,
  };
}

// Helper function to determine if a token is an operator
function isOperator(token: string): boolean {
  return token === "AND" || token === "OR";
}

// Function to create AST from rule string
export function createRule(ruleString: string): ASTNode {
  // Tokenize the rule string, keeping parentheses, operators, and conditions as separate tokens
  const tokens = ruleString.match(
    /(\(|\)|AND|OR|[a-zA-Z_]+(?:\s*[><=!]+[=]?\s*[^() ]+)?)/g
  );

  if (!tokens) {
    throw new Error("Invalid rule: Unable to parse tokens.");
  }

  const operatorStack: string[] = [];
  const operandStack: ASTNode[] = [];

  const processOperator = () => {
    const operator = operatorStack.pop();
    const right = operandStack.pop();
    const left = operandStack.pop();

    if (!operator || !right || !left) {
      throw new Error("Invalid rule: Missing operands for operator.");
    }

    const operatorNode = createOperatorNode(operator, left, right);
    operandStack.push(operatorNode);
  };

  for (const token of tokens) {
    if (token === "(") {
      // Push opening parenthesis to operator stack
      operatorStack.push(token);
    } else if (token === ")") {
      // Process operators until matching '('
      while (
        operatorStack.length > 0 &&
        operatorStack[operatorStack.length - 1] !== "("
      ) {
        processOperator();
      }
      operatorStack.pop(); // Remove '('
    } else if (isOperator(token)) {
      // If operator, process previous operators with higher precedence
      while (
        operatorStack.length > 0 &&
        isOperator(operatorStack[operatorStack.length - 1])
      ) {
        processOperator();
      }
      operatorStack.push(token); // Add the new operator to stack
    } else {
      // Parse condition (e.g., age >= 30, department = 'Sales')
      const conditionMatch = token.match(
        /([a-zA-Z_]+)\s*(>=|<=|>|<|=|!=)\s*([^() ]+)/
      );
      if (conditionMatch) {
        const attribute = conditionMatch[1];
        const operator = conditionMatch[2];
        const value = conditionMatch[3].replace(/'/g, ""); // Remove single quotes if present

        const operandNode = createOperandNode(attribute, operator, value);
        operandStack.push(operandNode); // Push operand node to stack
      } else {
        throw new Error(`Invalid condition: ${token}`);
      }
    }
  }

  // Process remaining operators
  while (operatorStack.length > 0) {
    processOperator();
  }

  if (operandStack.length !== 1) {
    throw new Error(
      "Invalid rule: The rule could not be parsed into a single expression."
    );
  }

  return operandStack[0]; // Return the root of the AST
}

function areASTsEqual(ast1: ASTNode, ast2: ASTNode): boolean {
  if (ast1.type !== ast2.type) return false;

  if (ast1.type === "operand") {
    // Compare operand values
    return (
      ast1.value.attribute === ast2.value.attribute &&
      ast1.value.operator === ast2.value.operator &&
      ast1.value.compareValue === ast2.value.compareValue
    );
  }

  // Compare operators and recursively compare children
  return (
    ast1.operator === ast2.operator &&
    areASTsEqual(ast1.left!, ast2.left!) &&
    areASTsEqual(ast1.right!, ast2.right!)
  );
}

function combineTwoASTs(
  ast1: ASTNode,
  ast2: ASTNode,
  operator: string
): ASTNode {
  // Check for redundant checks: if ast1 and ast2 are identical, return one of them
  if (areASTsEqual(ast1, ast2)) {
    return ast1;
  }

  // Create an operator node combining the two ASTs
  return createOperatorNode(operator, ast1, ast2);
}

function wrapRuleString(
  rule1: string,
  rule2: string,
  operator: string
): string {
  return `(${rule1} ${operator} ${rule2})`;
}

export function combineRules(
  rules: string[],
  operator: string = "AND"
): { combinedAST: ASTNode; combinedRuleString: string } {
  if (rules.length === 0) {
    throw new Error("No rules provided for combining.");
  }

  // Parse each rule string into an AST
  const astList: ASTNode[] = rules.map((ruleString) => createRule(ruleString));

  // Initialize the combined AST and rule string
  let combinedAST = astList[0];
  let combinedRuleString = rules[0]; // Start with the first rule string

  for (let i = 1; i < astList.length; i++) {
    combinedAST = combineTwoASTs(combinedAST, astList[i], operator);
    combinedRuleString = wrapRuleString(combinedRuleString, rules[i], operator); // Combine rule strings
  }

  return { combinedAST, combinedRuleString };
}

function compareValues(
  operator: string,
  attributeValue: string | number,
  compareValue: string | number
): boolean {
  switch (operator) {
    case ">":
      return attributeValue > compareValue;
    case "<":
      return attributeValue < compareValue;
    case "=":
      return attributeValue === compareValue;
    case ">=":
      return attributeValue >= compareValue;
    case "<=":
      return attributeValue <= compareValue;
    case "!=":
      return attributeValue !== compareValue;
    default:
      throw new Error(`Invalid operator: ${operator}`);
  }
}

export function evaluateRule(ast: ASTNode, data: UserData): boolean {
  if (ast.type === "operand") {
    const { attribute, operator, compareValue } = ast.value;
    const attributeValue = data[attribute];

    if (attributeValue === undefined) {
      throw new Error(`Missing attribute '${attribute}' in user data`);
    }

    return compareValues(operator, attributeValue, compareValue);
  }

  if (ast.type === "operator") {
    const leftResult = ast.left ? evaluateRule(ast.left, data) : false;
    const rightResult = ast.right ? evaluateRule(ast.right, data) : false;

    if (ast.operator === "AND") {
      return leftResult && rightResult;
    } else if (ast.operator === "OR") {
      return leftResult || rightResult;
    }
  }

  throw new Error("Invalid AST node");
}
