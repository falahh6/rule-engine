import React, { useState } from "react";
import { Button, Drawer, Tree } from "antd";
import { DownOutlined } from "@ant-design/icons";
import type { DataNode } from "antd/es/tree";

const convertASTToTreeData = (node: ASTNode, key: string = "0"): DataNode => {
  if (node.type === "operand") {
    return {
      key,
      title: `${node.value.attribute} ${node.value.operator} ${node.value.compareValue}`,
      isLeaf: true,
    };
  }

  return {
    key,
    title: `${node.operator}`,
    children: [
      convertASTToTreeData(node.left, `${key}-0`),
      convertASTToTreeData(node.right, `${key}-1`),
    ],
  };
};

const TreeUi = ({ ruleAst }: { ruleAst: ASTNode }) => {
  const treeData: DataNode[] = [convertASTToTreeData(ruleAst)];
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button size="small" onClick={() => setOpen(true)}>
        View
      </Button>
      <Drawer
        closable
        destroyOnClose
        title={<p>Abstract Syntax Tree</p>}
        placement="right"
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={{ padding: "20px" }}>
          <Tree
            defaultExpandAll
            className="max-sm:text-xs"
            showLine
            switcherIcon={<DownOutlined />}
            treeData={treeData}
          />
        </div>
      </Drawer>
    </>
  );
};

export default TreeUi;
