import llvm from "llvm-bindings";
import { Type } from "../../parser";
import { ReturnDeclaration } from "../../parser/types";

export const codegen_return = (
  node: ReturnDeclaration,
  builder: llvm.IRBuilder,
  return_type: Type | null
) => {
  const init = node.return;

  if (return_type) {
    if (return_type._t === "keyword") {
      if (return_type.element === "i8") {
        return builder.CreateRet(builder.getInt8(init.value));
      }

      if (return_type.element === "i32") {
        return builder.CreateRet(builder.getInt32(init.value));
      }
    }
  } else {
    return builder.CreateRetVoid();
  }

  throw new Error("Unexpected type while codegen");
};
