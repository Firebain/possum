import llvm from "llvm-bindings";
import * as generators from ".";
import { FunctionDeclaration } from "../../parser";

export const codegen_function = (
  node: FunctionDeclaration,
  context: llvm.LLVMContext,
  builder: llvm.IRBuilder,
  mod: llvm.Module
) => {
  const return_type = generators.codegen_type(node.return, builder);

  const params = node.parameters.map((parameter) =>
    generators.codegen_type(parameter.type, builder)
  );

  const function_type = llvm.FunctionType.get(return_type, params, false);

  const variables: Record<string, llvm.Value> = {};

  const fn = llvm.Function.Create(
    function_type,
    llvm.Function.LinkageTypes.ExternalLinkage,
    node.name,
    mod
  );

  for (const [i, param] of node.parameters.entries()) {
    const value = fn.getArg(i);

    variables[param.name] = value;
  }

  const start = llvm.BasicBlock.Create(context, undefined, fn);

  builder.SetInsertPoint(start);

  let hasReturn = false;

  for (const el of node.block) {
    if (el._t === "variable_declaration") {
      variables[el.name] = generators.codegen_variable(el, builder);
    }

    if (el._t === "return_declaration") {
      hasReturn = true;

      generators.codegen_return(el, builder, node.return);
    }
  }

  if (!hasReturn) {
    builder.CreateRetVoid();
  }

  if (llvm.verifyFunction(fn)) {
    console.error("Verifying function failed");
    process.exit();
  }
};
