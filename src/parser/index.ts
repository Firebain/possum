import { Token } from "../lexer";
import {
  Type,
  TopNode,
  VariableDeclaration,
  ExternDeclaration,
  FunctionParameter,
} from "./types";
import { UnexpectedEOF } from "./error";
import { Cursor } from "./cursor";

// const extern_declaration_parser = (cursor: Cursor): ExternDeclaration => {
//   cursor.next_token();
//   cursor.skip_empty();

//   cursor.assert_token("ident");
//   const name = cursor.get_value();

//   cursor.next_token();
//   cursor.skip_empty();
//   cursor.assert_token("open_paren");
//   cursor.next_token();

//   const parameters: FunctionParameter[] = [];
//   while (true) {
//     cursor.skip_empty();

//     cursor.assert_token("ident");
//     const name = cursor.get_value();

//     cursor.next_token();
//     cursor.skip_empty();
//     cursor.assert_token("colon");
//     cursor.next_token();
//     cursor.skip_empty();

//     const type = type_parser(cursor);

//     cursor.skip_empty();

//     parameters.push({
//       name,
//       type,
//     });

//     if (cursor.get_token().kind.type === "comma") {
//       cursor.next_token();

//       continue;
//     }

//     if (cursor.get_token().kind.type === "close_paren") {
//       cursor.next_token();

//       break;
//     }

//     cursor.unexpected_token();
//   }

//   cursor.assert_token("colon");
//   cursor.next_token();
//   cursor.skip_empty();

//   const return_type = type_parser(cursor);

//   cursor.node_end();

//   return {
//     type: "extern_declaration",
//     name,
//     parameters,
//     return: return_type,
//   };
// };

export const parse = (code: string, tokens: Token[]) => {
  const cursor = new Cursor(code, tokens);

  const nodes: TopNode[] = [];

  let node = cursor.next_top_node();

  while (node !== null) {
    nodes.push(node);

    node = cursor.next_top_node();
  }

  return nodes;
};

export { TopNode, InnerNode, Type, FunctionDeclaration } from "./types";
export { UnexpectedEOF, UnexpectedToken } from "./error";
