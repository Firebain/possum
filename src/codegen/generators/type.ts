import { Type } from "../../parser";

export const codegen_type = (
  type: Type | null,
  builder: llvm.IRBuilder
): llvm.Type => {
  if (type === null) {
    return builder.getVoidTy();
  }

  if (type._t === "keyword") {
    if (type.element === "i8") {
      return builder.getInt8Ty();
    }

    if (type.element === "i32") {
      return builder.getInt32Ty();
    }
  }

  if (type._t === "ref") {
    return builder.getInt8PtrTy();
  }

  throw new Error("Unexpected type while codegen");
};
