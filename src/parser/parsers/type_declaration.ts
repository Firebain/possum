import { Type } from "../types";
import { Cursor } from "../cursor";

export const type_declaration = (cursor: Cursor): Type => {
  const token = cursor.get_token();

  if (token.kind.type === "ident") {
    const value = cursor.get_value();

    switch (value) {
      case "i8":
      case "i32":
        cursor.next_token();

        return {
          _t: "keyword",
          element: value,
        };
      default:
        cursor.unexpected_token();
    }
  }

  if (token.kind.type === "and") {
    cursor.next_token();

    return {
      _t: "ref",
      element: type_declaration(cursor),
    };
  }

  if (token.kind.type === "open_bracket") {
    cursor.next_token();

    const type: Type = {
      _t: "array_type",
      element: type_declaration(cursor),
    };

    cursor.assert_token("close_bracket");
    cursor.next_token();

    return type;
  }

  cursor.unexpected_token();
};
