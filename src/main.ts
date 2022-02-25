import { tokenize, UnexpectedSymbol } from "./lexer";
import { parse, UnexpectedToken, UnexpectedEOF } from "./parser";
import { codegen } from "./codegen";
import path from "path";
import fs from "fs";

const main = () => {
  try {
    const code = `
      fn main(a: i32, b: i32): i32 {
          let c: i32 = 44;
          let d: i32 = 55;

          return 22;
      }
    `;

    const tokens = tokenize(code);

    const ast = parse(code, tokens);

    const module = codegen(ast);

    const file_name = "main.ll";
    const build_dir = path.join(__dirname, "..", "build");
    if (!fs.existsSync(build_dir)) {
      fs.mkdirSync(build_dir);
    }

    const file_path = path.join(build_dir, file_name);
    module.print(file_path);
    module.print();
  } catch (err) {
    if (err instanceof UnexpectedSymbol) {
      err.display();

      process.exit(1);
    }

    if (err instanceof UnexpectedToken) {
      err.display();

      process.exit(2);
    }

    if (err instanceof UnexpectedEOF) {
      err.display();

      process.exit(3);
    }

    throw err;
  }
};

main();
