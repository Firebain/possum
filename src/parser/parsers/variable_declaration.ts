import { Cursor } from "../cursor";
import { VariableDeclaration } from "../types";
import * as parsers from ".";

export const variable_declaration = (cursor: Cursor): VariableDeclaration => {
  cursor.next_token();
  cursor.skip_whitespaces();

  cursor.assert_token("ident");
  const name = cursor.get_value();

  cursor.next_token();
  cursor.skip_whitespaces();

  cursor.assert_token("colon");
  cursor.next_token();
  cursor.skip_whitespaces();

  const type = parsers.type_declaration(cursor);

  cursor.skip_whitespaces();
  cursor.assert_token("eq");
  cursor.next_token();
  cursor.skip_empty();

  const token = cursor.get_token();

  if (token.kind.type === "literal") {
    if (token.kind.literal === "number") {
      const value = cursor.get_value();

      cursor.save_next_token();
      cursor.node_end();

      return {
        _t: "variable_declaration",
        name,
        type,
        initializer: {
          _t: "number",
          value: Number(value),
        },
      };
    }
  }

  cursor.unexpected_token();
};
