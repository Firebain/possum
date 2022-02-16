import { DisplayableError } from "../error";

export class UnexpectedSymbol extends DisplayableError {
  name = "Unexpected symbol";

  constructor(code: string, index: number) {
    super("Unexpected symbol", code, index);
  }
}
