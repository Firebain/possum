import { Node } from "../parser";
import llvm from "llvm-bindings";

export const codegen = (nodes: Node[]) => {
  const context = new llvm.LLVMContext();
  const mod = new llvm.Module("main", context);
  const builder = new llvm.IRBuilder(context);

  const mainReturnType = builder.getInt32Ty();
  const mainFunctionType = llvm.FunctionType.get(mainReturnType, false);
  const main = llvm.Function.Create(
    mainFunctionType,
    llvm.Function.LinkageTypes.ExternalLinkage,
    "main",
    mod
  );

  const start = llvm.BasicBlock.Create(context, undefined, main);

  const startVariables: Record<string, llvm.AllocaInst> = {};

  builder.SetInsertPoint(start);

  for (const node of nodes) {
    if (node.type === "variable_declaration") {
      const init = node.initializer;

      if (init.type === "number") {
        const type = builder.getInt32Ty();

        const ptr = builder.CreateAlloca(type, null, node.name);
        builder.CreateStore(builder.getInt32(init.value), ptr);

        startVariables[node.name] = ptr;
      }
    }
  }

  builder.CreateRet(builder.getInt32(0));

  if (llvm.verifyFunction(main)) {
    console.error("Verifying function failed");
    process.exit();
  }

  if (llvm.verifyModule(mod)) {
    console.error("Verifying module failed");
    process.exit();
  }

  return mod;
};
