import chalk from "chalk";
import { DisplayableError } from "../error";

export class UnexpectedToken extends DisplayableError {
  name = "Unexpected token";

  constructor(code: string, index: number, len: number) {
    super("Unexpected token", code, index, len);
  }
}

export class UnexpectedEOF extends Error {
  name = "Unexpected EOF";

  constructor() {
    super("Unexpected EOF");
  }

  display() {
    console.log(`${chalk.red("Error")}: ${chalk.bold(this.name)}`);
  }
}
