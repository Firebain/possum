import { Node, Type } from "../parser";
import llvm from "llvm-bindings";

const codegen_type = (type: Type, builder: llvm.IRBuilder): llvm.Type => {
  if (type.type === "keyword") {
    if (type.element === "i8") {
      return builder.getInt8Ty();
    }

    if (type.element === "i32") {
      return builder.getInt32Ty();
    }

    if (type.element === "string") {
      return builder.getInt8PtrTy();
    }
  }

  if (type.type === "ref") {
    return builder.getInt8PtrTy();
  }

  // if (type.type === "array_type") {
  //   return builder.getInt8PtrTy();
  // }

  throw new Error("Unexpected type while codegen");
};

export const codegen = (nodes: Node[]) => {
  const context = new llvm.LLVMContext();
  const mod = new llvm.Module("main", context);
  const builder = new llvm.IRBuilder(context);

  for (const node of nodes) {
    if (node.type === "extern_declaration") {
      const return_type = codegen_type(node.return, builder);
      const params = node.parameters.map((parameter) =>
        codegen_type(parameter.type, builder)
      );
      const function_type = llvm.FunctionType.get(return_type, params, false);

      const fn = llvm.Function.Create(
        function_type,
        llvm.Function.LinkageTypes.ExternalLinkage,
        node.name,
        mod
      );

      if (llvm.verifyFunction(fn)) {
        console.error("Verifying function failed");
        process.exit();
      }
    }
  }

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
