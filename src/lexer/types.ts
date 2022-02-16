export type Literal = "string" | "number";

export type TokenKind =
  | {
      type: "literal";
      literal: Literal;
    }
  | {
      type:
        | "ident"
        | "whitespace"
        | "new_line"
        | "semi" // ";"
        | "comma" // ","
        | "dot" // "."
        | "open_paren" // "("
        | "close_paren" // ")"
        | "open_brace" // "{"
        | "close_brace" // "}"
        | "open_bracket" // "["
        | "close_bracket" // "]"
        | "at" // "@"
        | "pound" // "#"
        | "tilde" // "~"
        | "question" // "?"
        | "colon" // ":"
        | "dollar" // "$"
        | "bang" // "!"
        | "lt" // "<"
        | "gt" // ">"
        | "minus" // "-"
        | "plus" // "+"
        | "and" // "&"
        | "or" // "|"
        | "star" // "*"
        | "slash" // "/"
        | "caret" // "^"
        | "percent" // "%"
        | "eq"; // "=";
    };

export interface Token {
  kind: TokenKind;
  len: number;
}
