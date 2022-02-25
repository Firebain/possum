import llvm from "llvm-bindings";
import { Type } from "../../parser";
import { VariableDeclaration } from "../../parser/types";

export const codegen_variable = (
  node: VariableDeclaration,
  builder: llvm.IRBuilder
): llvm.AllocaInst => {
  const init = node.initializer;

  if (node.type._t === "keyword") {
    if (node.type.element === "i8") {
      const type = builder.getInt8Ty();

      const ptr = builder.CreateAlloca(type);
      builder.CreateStore(builder.getInt8(init.value), ptr);

      return ptr;
    }

    if (node.type.element === "i32") {
      const type = builder.getInt32Ty();

      const ptr = builder.CreateAlloca(type);
      builder.CreateStore(builder.getInt32(init.value), ptr);

      return ptr;
    }
  }

  throw new Error("Unexpected type while codegen");
};
