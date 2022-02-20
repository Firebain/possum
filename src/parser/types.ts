export type RefType = {
  type: "ref";
  element: Type;
};

export type ArrayType = {
  type: "array_type";
  element: Type;
};

export type KeywordType = {
  type: "keyword";
  element: "i8" | "i32" | "string";
};

export type Type = KeywordType | ArrayType | RefType;

export type FunctionParameter = {
  name: string;
  type: Type;
};

export type NumberLiteral = {
  type: "number";
  value: number;
};

export type Initializer = NumberLiteral;

export interface VariableDeclaration {
  type: "variable_declaration";
  name: string;
  initializer: Initializer;
}

export interface ExternDeclaration {
  type: "extern_declaration";
  name: string;
  parameters: FunctionParameter[];
  return: Type;
}

export type Node = VariableDeclaration | ExternDeclaration;
