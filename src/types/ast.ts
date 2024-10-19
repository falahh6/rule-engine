type OperandNode = {
  type: "operand";
  value: {
    attribute: string;
    operator: string;
    compareValue: string | number;
  };
};

type OperatorNode = {
  type: "operator";
  operator: "AND" | "OR";
  left: ASTNode;
  right: ASTNode;
};

type ASTNode = OperandNode | OperatorNode;
