import { tokenize, UnexpectedSymbol } from "./lexer";
import { parse, UnexpectedToken, UnexpectedEOF } from "./parser";

const main = () => {
  try {
    const code = "let a = 2; let b = 3;";
    const tokens = tokenize(code);

    const ast = parse(code, tokens);

    console.log(ast);
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

// import llvm from "llvm-bindings";

// const context = new llvm.LLVMContext();
// const mod = new llvm.Module("main", context);
// const builder = new llvm.IRBuilder(context);

// const str = builder.CreateGlobalString("Hello World", "str", 0, mod);

// const putsReturnType = builder.getInt32Ty();
// const putsParamsTypes = [builder.getInt8PtrTy()];
// const putsFunctionType = llvm.FunctionType.get(
//   putsReturnType,
//   putsParamsTypes,
//   false
// );
// const puts = llvm.Function.Create(
//   putsFunctionType,
//   llvm.Function.LinkageTypes.ExternalLinkage,
//   "puts",
//   mod
// );

// const mainReturnType = builder.getInt32Ty();
// const mainFunctionType = llvm.FunctionType.get(mainReturnType, false);
// const main = llvm.Function.Create(
//   mainFunctionType,
//   llvm.Function.LinkageTypes.ExternalLinkage,
//   "main",
//   mod
// );

// const start = llvm.BasicBlock.Create(context, undefined, main);
// builder.SetInsertPoint(start);

// const call = builder.CreateCall(puts, [
//   builder.CreatePointerCast(str, builder.getInt8PtrTy(), "test"),
// ]);

// const result = builder.getInt32(0);
// builder.CreateRet(result);

// if (llvm.verifyFunction(main)) {
//   console.error("Verifying function failed");
//   process.exit();
// }

// if (llvm.verifyFunction(puts)) {
//   console.error("Verifying function failed");
//   process.exit();
// }

// if (llvm.verifyModule(mod)) {
//   console.error("Verifying module failed");
//   process.exit();
// }

// mod.print();
