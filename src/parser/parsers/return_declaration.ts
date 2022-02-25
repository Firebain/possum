import { Cursor } from "../cursor";
import { VariableDeclaration, Type, ReturnDeclaration } from "../types";
import * as parsers from ".";

export const return_declaration = (cursor: Cursor): ReturnDeclaration => {
  cursor.next_token();
  cursor.skip_whitespaces();

  const token = cursor.get_token();

  if (token.kind.type === "literal") {
    if (token.kind.literal === "number") {
      const value = cursor.get_value();

      cursor.save_next_token();
      cursor.node_end();

      return {
        _t: "return_declaration",
        return: {
          _t: "number",
          value: Number(value),
        },
      };
    }
  }

  cursor.unexpected_token();
};
