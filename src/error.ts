import chalk from "chalk";

export const assert = (result: boolean): result is true => {
  if (!result) {
    throw new Error("Assetion failed");
  }

  return true;
};

export class DisplayableError extends Error {
  constructor(
    public message: string,
    public code: string,
    public index: number,
    public len: number = 1
  ) {
    super(message);
  }

  display() {
    const lines = this.code.split("\n");

    let error_line_index: number | null = 0;

    let length = 0;
    for (const [index, line] of lines.entries()) {
      if (length + line.length + 1 >= this.index) {
        error_line_index = index;

        break;
      }

      length += line.length + 1;
    }

    assert(error_line_index !== null);
    console.log(`${chalk.red("Error")}: ${chalk.bold(this.name)}`);
    // console.log(` ${chalk.blue("-->")} src/main.rs:1:1`);
    console.log(`  ${chalk.blue("|")}`);
    console.log(
      `${chalk.blue(error_line_index + 1)} ${chalk.blue("|")} ${
        lines[error_line_index]
      }`
    );
    console.log(
      `  ${chalk.blue("|")}${" ".repeat(this.index - length + 1)}${chalk.red(
        `${"^".repeat(this.len)} ${this.message}`
      )}`
    );
  }
}
