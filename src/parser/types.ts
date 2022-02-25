export type RefType = {
  _t: "ref";
  element: Type;
};

export type ArrayType = {
  _t: "array_type";
  element: Type;
};

export type KeywordType = {
  _t: "keyword";
  element: "i8" | "i32";
};

export type Type = KeywordType | ArrayType | RefType;

export type FunctionParameter = {
  name: string;
  type: Type;
};

export type NumberLiteral = {
  _t: "number";
  value: number;
};

export type Initializer = NumberLiteral;

export interface VariableDeclaration {
  _t: "variable_declaration";
  name: string;
  type: Type;
  initializer: Initializer;
}

export interface ExternDeclaration {
  _t: "extern_declaration";
  name: string;
  parameters: FunctionParameter[];
  return: Type | null;
}

export interface FunctionDeclaration {
  _t: "function_declaration";
  name: string;
  parameters: FunctionParameter[];
  return: Type | null;
  block: InnerNode[];
}

export interface ReturnDeclaration {
  _t: "return_declaration";
  return: Initializer;
}

export type InnerNode = VariableDeclaration | ReturnDeclaration;

export type TopNode = FunctionDeclaration | ExternDeclaration;
