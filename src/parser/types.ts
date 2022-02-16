export type NumberLiteral = {
  type: "number";
  value: string;
};

export type Initializer = NumberLiteral;

export interface VariableDeclaration {
  type: "variable_declaration";
  name: string;
  initializer: Initializer;
}

export type Node = VariableDeclaration;