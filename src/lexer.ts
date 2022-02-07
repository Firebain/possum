import { DisplayableError, assert } from "./error";

type Literal = {
  type: "string";
};

type TokenKind =
  | {
      type: "ident";
      value: string;
    }
  | {
      type: "whitespace";
    }
  | {
      type: "literal";
      literal: Literal;
      value: string;
    }
  | {
      type: "new_line";
    }
  | {
      type: "semi"; // ";"
    }
  | {
      type: "comma"; // ","
    }
  | {
      type: "dot"; // "."
    }
  | {
      type: "open_paren"; // "("
    }
  | {
      type: "close_paren"; // ")"
    }
  | {
      type: "open_brace"; // "{"
    }
  | {
      type: "close_brace"; // "}"
    }
  | {
      type: "open_bracket"; // "["
    }
  | {
      type: "close_bracket"; // "]"
    }
  | {
      type: "at"; // "@"
    }
  | {
      type: "pound"; // "#"
    }
  | {
      type: "tilde"; // "~"
    }
  | {
      type: "question"; // "?"
    }
  | {
      type: "colon"; // ":"
    }
  | {
      type: "dollar"; // "$"
    }
  | {
      type: "bang"; // "!"
    }
  | {
      type: "lt"; // "<"
    }
  | {
      type: "gt"; // ">"
    }
  | {
      type: "minus"; // "-"
    }
  | {
      type: "and"; // "&"
    }
  | {
      type: "or"; // "|"
    }
  | {
      type: "plus"; // "+"
    }
  | {
      type: "star"; // "*"
    }
  | {
      type: "slash"; // "/"
    }
  | {
      type: "caret"; // "^"
    }
  | {
      type: "percent"; // "%"
    }
  | {
      type: "eq"; // "="
    };

interface Token {
  kind: TokenKind;
  len: number;
}

class UnexpectedToken extends DisplayableError {
  name = "Unexpected token";

  constructor(code: string, index: number) {
    super("Unexpected token", code, index);
  }
}

const is_alphabet = (char: string) => {
  const number = char?.charCodeAt(0);

  return (number >= 65 && number <= 90) || (number >= 97 && number <= 122);
};

const is_number = (char: string) => {
  const number = char?.charCodeAt(0);

  return number >= 48 && number <= 57;
};

const is_whitespace = (char: string) => {
  const number = char?.charCodeAt(0);

  return (
    number === 9 || // Tab
    number === 32 // Space
  );
};

const is_new_line = (char: string) => char.charCodeAt(0) === 10;

class Cursor {
  private index: number = 0;

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

    throw new UnexpectedToken(this.str, this.index);
  }

  ident(): Token {
    let index = this.index;
    let value = "";

    while (is_alphabet(this.str[index]) || is_number(this.str[index])) {
      value += this.str[index];

      index += 1;
    }

    assert(index - this.index > 0 && value !== "");

    const token: Token = {
      kind: {
        type: "ident",
        value,
      },
      len: index - this.index,
    };

    this.index = index;

    return token;
  }

  whitespace(): Token {
    let index = this.index;
    let value = "";

    while (is_whitespace(this.str[index])) {
      value += this.str[index];

      index += 1;
    }

    assert(index - this.index > 0 && value !== "");

    const token: Token = {
      kind: {
        type: "whitespace",
      },
      len: index - this.index,
    };

    this.index = index;

    return token;
  }

  string(): Token {
    let index = this.index + 1;
    let value = "";

    while (this.str[index] !== '"') {
      assert(this.str[index] !== undefined);

      value += this.str[index];

      index += 1;
    }

    const token: Token = {
      kind: {
        type: "literal",
        literal: {
          type: "string",
        },
        value,
      },
      len: index + 1 - this.index,
    };

    this.index = index + 1;

    return token;
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

  try {
    let token = cursor.next_token();

    while (token !== null) {
      tokens.push(token);

      token = cursor.next_token();
    }
  } catch (err) {
    if (err instanceof UnexpectedToken) {
      err.display();

      return null;
    }

    throw err;
  }

  return tokens;
};
