import { TokenKind, Token } from "./types";
import { UnexpectedSymbol } from "./error";

const is_alphabet = (char: string) => {
  const code = char.charCodeAt(0);

  return (code >= 65 && code <= 90) || (code >= 97 && code <= 122);
};

const is_number = (char: string) => {
  const code = char.charCodeAt(0);

  return code >= 48 && code <= 57;
};

const is_whitespace = (char: string) => {
  const code = char.charCodeAt(0);

  return (
    code === 9 || // Tab
    code === 32 // Space
  );
};

const is_new_line = (char: string) => char.charCodeAt(0) === 10;

class Cursor {
  private index = 0;

  constructor(private str: string) {}

  next_token(): Token | null {
    if (this.str[this.index] === undefined) {
      return null;
    }

    if (is_alphabet(this.str[this.index])) {
      return this.ident();
    }

    if (is_new_line(this.str[this.index])) {
      return this.one_symbol("new_line");
    }

    if (is_whitespace(this.str[this.index])) {
      return this.whitespace();
    }

    if (is_number(this.str[this.index])) {
      return this.number();
    }

    switch (this.str[this.index]) {
      case '"':
        return this.string();
      case "=":
        return this.one_symbol("eq");
      case "(":
        return this.one_symbol("open_paren");
      case ")":
        return this.one_symbol("close_paren");
      case ";":
        return this.one_symbol("semi");
      case ",":
        return this.one_symbol("comma");
      case ".":
        return this.one_symbol("dot");
      case "{":
        return this.one_symbol("open_brace");
      case "}":
        return this.one_symbol("close_brace");
      case "[":
        return this.one_symbol("open_bracket");
      case "]":
        return this.one_symbol("close_bracket");
      case "?":
        return this.one_symbol("question");
      case ":":
        return this.one_symbol("colon");
      case "!":
        return this.one_symbol("bang");
      case "<":
        return this.one_symbol("lt");
      case ">":
        return this.one_symbol("gt");
      case "-":
        return this.one_symbol("minus");
      case "&":
        return this.one_symbol("and");
      case "|":
        return this.one_symbol("or");
      case "+":
        return this.one_symbol("plus");
      case "/":
        return this.one_symbol("slash");
      case "%":
        return this.one_symbol("percent");
      case "@":
        return this.one_symbol("at");
      case "#":
        return this.one_symbol("pound");
      case "~":
        return this.one_symbol("tilde");
      case "$":
        return this.one_symbol("dollar");
      case "*":
        return this.one_symbol("star");
      case "^":
        return this.one_symbol("caret");
    }

    throw new UnexpectedSymbol(this.str, this.index);
  }

  find_len(predicate: (char: string) => boolean): number {
    let index = this.index;

    while (predicate(this.str[index])) {
      index += 1;
    }

    const len = index - this.index;

    this.index = index;

    return len;
  }

  ident(): Token {
    return {
      kind: {
        type: "ident",
      },
      len: this.find_len((c) => is_alphabet(c) || is_number(c)),
    };
  }

  whitespace(): Token {
    return {
      kind: {
        type: "whitespace",
      },
      len: this.find_len((c) => is_whitespace(c)),
    };
  }

  number(): Token {
    return {
      kind: {
        type: "literal",
        literal: "number",
      },
      len: this.find_len((c) => is_number(c)),
    };
  }

  string(): Token {
    const len = this.find_len((c) => c !== '"' && c !== undefined);

    this.index = this.index + 1;

    return {
      kind: {
        type: "literal",
        literal: "string",
      },
      len,
    };
  }

  one_symbol(type: Exclude<TokenKind["type"], "ident" | "whitespace">): Token {
    this.index += 1;

    return {
      kind: {
        type: type as any,
      },
      len: 1,
    };
  }
}

export const tokenize = (str: string) => {
  const cursor = new Cursor(str);

  const tokens: Token[] = [];

  let token = cursor.next_token();

  while (token !== null) {
    tokens.push(token);

    token = cursor.next_token();
  }

  return tokens;
};

export { Token } from "./types";
export { UnexpectedSymbol } from "./error";
