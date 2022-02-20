import { Token } from "../lexer";
import { Node, VariableDeclaration } from "./types";
import { UnexpectedEOF, UnexpectedToken } from "./error";

class Cursor {
  private index = 0;
  private code_index = 0;

  constructor(private code: string, private tokens: Token[]) {}

  next_node(): Node | null {
    try {
      this.skip_whitespaces();
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
    }

    this.unexpected_token();
  }

  variable_declaration(): VariableDeclaration {
    this.next_token();
    this.skip_whitespaces();

    const name = this.get_value();

    this.next_token();
    this.skip_whitespaces();
    this.assert_token("eq");
    this.next_token();
    this.skip_whitespaces();

    const token = this.get_token();

    if (token.kind.type === "literal") {
      if (token.kind.literal === "number") {
        const value = this.get_value();

        this.next_token();
        this.skip_whitespaces();
        this.assert_token("semi", "new_line");
        this.save_next_token();

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

export { Node } from "./types";
export { UnexpectedEOF, UnexpectedToken } from "./error";
