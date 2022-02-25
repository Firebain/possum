import { TopNode, InnerNode } from "./types";
import * as parsers from "./parsers";
import { Token } from "../lexer";
import { UnexpectedEOF, UnexpectedToken } from "./error";

export class Cursor {
  private index = 0;
  private code_index = 0;

  constructor(private code: string, private tokens: Token[]) {}

  next_top_node(): TopNode | null {
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

      if (name == "fn") {
        return parsers.function_declaration(this);
      }

      // if (name === "extern") {
      //   return extern_declaration_parser(cursor);
      // }
    }

    this.unexpected_token();
  }

  next_inner_node(): InnerNode | null {
    try {
      this.skip_empty();
    } catch (err) {
      if (err instanceof UnexpectedEOF) {
        return null;
      }

      throw err;
    }

    const token = this.get_token();

    if (token.kind.type === "close_brace") {
      return null;
    }

    if (token.kind.type === "ident") {
      const name = this.get_value();

      if (name === "let") {
        return parsers.variable_declaration(this);
      }

      if (name === "return") {
        return parsers.return_declaration(this);
      }
    }

    this.unexpected_token();
  }

  save_next_token() {
    this.code_index += this.get_token().len;
    this.index += 1;
  }

  next_token() {
    this.save_next_token();

    if (this.get_token() === undefined) {
      throw new UnexpectedEOF();
    }
  }

  node_end() {
    if (this.get_token() === undefined) {
      return;
    }

    this.skip_whitespaces();
    this.assert_token("semi", "new_line");
    this.save_next_token();
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
