import { Token } from "../lexer";
import {
  Type,
  Node,
  VariableDeclaration,
  ExternDeclaration,
  FunctionParameter,
} from "./types";
import { UnexpectedEOF, UnexpectedToken } from "./error";

class Cursor {
  private index = 0;
  private code_index = 0;

  constructor(private code: string, private tokens: Token[]) {}

  next_node(): Node | null {
    try {
      this.skip_empty();
    } catch (err) {
      if (err instanceof UnexpectedEOF) {
        return null;
      }

      throw err;
    }

    const token = this.get_token();

    if (token.kind.type === "ident") {
      const name = this.get_value();

      if (name === "let") {
        return this.variable_declaration();
      }

      if (name === "extern") {
        return this.extern_declaration();
      }
    }

    this.unexpected_token();
  }

  extern_declaration(): ExternDeclaration {
    this.next_token();
    this.skip_empty();

    this.assert_token("ident");
    const name = this.get_value();

    this.next_token();
    this.skip_empty();
    this.assert_token("open_paren");
    this.next_token();

    const parameters: FunctionParameter[] = [];
    while (true) {
      this.skip_empty();

      this.assert_token("ident");
      const name = this.get_value();

      this.next_token();
      this.skip_empty();
      this.assert_token("colon");
      this.next_token();
      this.skip_empty();

      const type = this.type();

      this.skip_empty();

      parameters.push({
        name,
        type,
      });

      if (this.get_token().kind.type === "comma") {
        this.next_token();

        continue;
      }

      if (this.get_token().kind.type === "close_paren") {
        this.next_token();

        break;
      }

      this.unexpected_token();
    }

    this.assert_token("colon");
    this.next_token();
    this.skip_empty();

    const return_type = this.type();

    this.node_end();

    return {
      type: "extern_declaration",
      name,
      parameters,
      return: return_type,
    };
  }

  type(): Type {
    const token = this.get_token();

    if (token.kind.type === "ident") {
      const value = this.get_value();

      switch (value) {
        case "i8":
        case "i32":
        case "string":
          this.next_token();

          return {
            type: "keyword",
            element: value,
          };
        default:
          this.unexpected_token();
      }
    }

    if (token.kind.type === "and") {
      this.next_token();

      return {
        type: "ref",
        element: this.type(),
      };
    }

    if (token.kind.type === "open_bracket") {
      this.next_token();

      const type: Type = {
        type: "array_type",
        element: this.type(),
      };

      this.assert_token("close_bracket");
      this.next_token();

      return type;
    }

    this.unexpected_token();
  }

  variable_declaration(): VariableDeclaration {
    this.next_token();
    this.skip_empty();

    this.assert_token("ident");
    const name = this.get_value();

    this.next_token();
    this.skip_empty();
    this.assert_token("eq");
    this.next_token();
    this.skip_empty();

    const token = this.get_token();

    if (token.kind.type === "literal") {
      if (token.kind.literal === "number") {
        const value = this.get_value();

        this.save_next_token();
        this.node_end();

        return {
          type: "variable_declaration",
          name,
          initializer: {
            type: "number",
            value: Number(value),
          },
        };
      }
    }

    this.unexpected_token();
  }

  node_end() {
    if (this.get_token() === undefined) {
      return;
    }

    this.skip_whitespaces();
    this.assert_token("semi", "new_line");
    this.save_next_token();
  }

  next_token() {
    this.save_next_token();

    if (this.get_token() === undefined) {
      throw new UnexpectedEOF();
    }
  }

  save_next_token() {
    this.code_index += this.get_token().len;
    this.index += 1;
  }

  assert_token(...types: Token["kind"]["type"][]) {
    if (!types.some((type) => type === this.get_token().kind.type)) {
      this.unexpected_token();
    }
  }

  skip_whitespaces() {
    if (this.get_token() === undefined) {
      throw new UnexpectedEOF();
    }

    while (this.get_token().kind.type === "whitespace") {
      this.next_token();
    }
  }

  skip_empty() {
    if (this.get_token() === undefined) {
      throw new UnexpectedEOF();
    }

    while (["whitespace", "new_line"].includes(this.get_token().kind.type)) {
      this.next_token();
    }
  }

  get_token() {
    return this.tokens[this.index];
  }

  get_value() {
    return this.code.substring(
      this.code_index,
      this.code_index + this.get_token().len
    );
  }

  unexpected_token(): never {
    throw new UnexpectedToken(this.code, this.code_index, this.get_token().len);
  }
}

export const parse = (code: string, tokens: Token[]) => {
  const cursor = new Cursor(code, tokens);

  const nodes: Node[] = [];

  let node = cursor.next_node();

  while (node !== null) {
    nodes.push(node);

    node = cursor.next_node();
  }

  return nodes;
};

export { Node, Type } from "./types";
export { UnexpectedEOF, UnexpectedToken } from "./error";
