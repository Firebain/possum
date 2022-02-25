import { type_declaration } from "./type_declaration";
import { Cursor } from "../cursor";
import { FunctionDeclaration, FunctionParameter, Type } from "../types";
import { InnerNode } from "..";

export const function_declaration = (cursor: Cursor): FunctionDeclaration => {
  cursor.next_token();
  cursor.skip_whitespaces();

  cursor.assert_token("ident");

  const name = cursor.get_value();

  cursor.next_token();
  cursor.assert_token("open_paren");
  cursor.next_token();
  cursor.skip_empty();

  const parameters: FunctionParameter[] = [];
  while (true) {
    if (cursor.get_token().kind.type === "close_paren") {
      cursor.next_token();

      break;
    }

    cursor.assert_token("ident");

    const name = cursor.get_value();

    cursor.next_token();
    cursor.skip_whitespaces();
    cursor.assert_token("colon");
    cursor.next_token();
    cursor.skip_whitespaces();

    const type = type_declaration(cursor);

    parameters.push({
      name,
      type,
    });

    if (cursor.get_token().kind.type === "comma") {
      cursor.next_token();
      cursor.skip_empty();
    }
  }

  cursor.skip_whitespaces();

  let return_type: Type | null = null;

  if (cursor.get_token().kind.type === "colon") {
    cursor.next_token();
    cursor.skip_whitespaces();

    return_type = type_declaration(cursor);

    cursor.skip_whitespaces();
  }

  cursor.assert_token("open_brace");
  cursor.next_token();
  cursor.skip_empty();

  const nodes: InnerNode[] = [];

  if (cursor.get_token().kind.type !== "close_brace") {
    let node = cursor.next_inner_node();

    while (node !== null) {
      nodes.push(node);

      node = cursor.next_inner_node();
    }
  }

  cursor.assert_token("close_brace");
  cursor.next_token();

  return {
    _t: "function_declaration",
    name,
    parameters,
    return: return_type,
    block: nodes,
  };
};
