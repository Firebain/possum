// import * as E from "fp-ts/Either";
// import { flow, pipe } from "fp-ts/lib/function";
// import * as Bool from "fp-ts/lib/boolean";
// import { splitStringAt } from "./utils/string";
// import * as Tuple from "fp-ts/lib/Tuple";

// type StringExpression = {
//   type: "string";
//   value: string;
// };

// type ValueExpression = StringExpression;

// type Expression = ValueExpression;

// type InitVarInstruction = {
//   type: "init_var";
//   mutable: boolean;
//   name: string;
//   expression: Expression;
// };

// type Instruction = InitVarInstruction;

// // ===========================================================================

// type ParseResult<Output> = E.Either<string, [string, Output]>;
// type Parser<Output> = (input: string) => ParseResult<Output>;

// export const literal =
//   (expected: string): Parser<string> =>
//   (input) =>
//     pipe(
//       input.startsWith(expected),
//       Bool.fold(
//         () => E.left(input),
//         () => pipe(input, splitStringAt(expected.length), Tuple.swap, E.right)
//       )
//     );

// export const pair =
//   <R2>(parser2: Parser<R2>) =>
//   <R1>(parser1: Parser<R1>): Parser<[R1, R2]> =>
//   (input) =>
//     pipe(
//       parser1(input),
//       E.chain(
//         ([input2, res1]): ParseResult<[R1, R2]> =>
//           pipe(
//             parser2(input2),
//             E.map(([input3, res2]) => [input3, [res1, res2]])
//           )
//       ),
//       E.mapLeft(() => input)
//     );

// const map =
//   <A, B>(fn: (a: A) => B) =>
//   (parser: Parser<A>): Parser<B> =>
//     flow(
//       parser,
//       E.map(([output, res]) => [output, fn(res)])
//     );

// const left =
//   <R2>(parser2: Parser<R2>) =>
//   <R1>(parser1: Parser<R1>): Parser<R1> =>
//     pipe(
//       pair(parser2)(parser1),
//       map(([left]) => left)
//     );

// const right =
//   <R2>(parser2: Parser<R2>) =>
//   <R1>(parser1: Parser<R1>): Parser<R2> =>
//     pipe(
//       pair(parser2)(parser1),
//       map(([_left, right]) => right)
//     );

// const zero_or_more =
//   <R>(parser: Parser<R>): Parser<R[]> =>
//   (input) => {
//     const parse: Parser<R[]> = flow(
//       parser,
//       E.fold(
//         (input) => E.right([input, []]),
//         ([input, res]) =>
//           pipe(
//             parse(input),
//             E.map(([input, res2]) => [input, [res, ...res2]])
//           )
//       )
//     );

//     return parse(input);
//   };

// const one_or_more = <R>(parser: Parser<R>): Parser<R[]> =>
//   pipe(
//     parser,
//     pair(zero_or_more(parser)),
//     map(([head, tail]) => [head, ...tail])
//   );

// const any_char: Parser<string> = (input: string) => {
//   if (input === "") {
//     return E.left(input);
//   } else {
//     const [head, ...tail] = input;

//     return E.right([tail.join(""), head]);
//   }
// };

// const pred =
//   <R>(parser: Parser<R>, predicate: (input: R) => boolean): Parser<R> =>
//   (input) =>
//     pipe(
//       parser(input),
//       E.filterOrElse(
//         ([_input, res]) => predicate(res),
//         () => input
//       )
//     );

// const or =
//   <R>(parser1: Parser<R>) =>
//   (parser2: Parser<R>): Parser<R> =>
//     flow(parser1, E.orElse(parser2));

// const whitespace_char: Parser<string> = pred(any_char, (char) => char === " ");
// const new_line_char: Parser<string> = pred(any_char, (char) => char === "\n");

// const space1: Parser<string[]> = one_or_more(whitespace_char);
// const space0: Parser<string[]> = zero_or_more(whitespace_char);

// const new_line_char1: Parser<string[]> = one_or_more(new_line_char);
// const new_line_char0: Parser<string[]> = zero_or_more(new_line_char);

// const space_or_new_line1: Parser<string[]> = one_or_more(
//   or(whitespace_char)(new_line_char)
// );
// const space_or_new_line0: Parser<string[]> = zero_or_more(
//   or(whitespace_char)(new_line_char)
// );

// const not_whitespace_char: Parser<string> = pred(
//   any_char,
//   (char) => char !== " "
// );

// // ===========================================================================

// const ident: Parser<string> = pipe(
//   one_or_more(not_whitespace_char),
//   map((chars) => chars.join(""))
// );

// const var_keyword: Parser<string> = or(literal("const"))(literal("let"));

// const eq_sign = pipe(space0, right(literal("=")), left(space0));

// const var_init = pipe(var_keyword, left(space1), pair(ident), left(eq_sign));

// const instruction_end = pipe(space0, right(or(literal("\n"))(literal(";"))));

// const quoted_string: Parser<Expression> = pipe(
//   literal('"'),
//   right(
//     pipe(
//       zero_or_more(pred(any_char, (char) => char !== '"')),
//       left(literal('"'))
//     )
//   ),
//   map((chars) => ({ type: "string", value: chars.join("") }))
// );

// const variable: Parser<InitVarInstruction> = pipe(
//   space0,
//   right(var_init),
//   pair(quoted_string),
//   left(instruction_end),
//   map(([meta, expression]) => ({
//     type: "init_var",
//     mutable: meta[0] === "let",
//     name: meta[1],
//     expression,
//   }))
// );

// const input = `const url = "https://www.freecodecamp.org/news/the-programming-language-pipeline-91d3f449c919"
// `;

// const result = variable(input);

// if (result._tag === "Right") {
//   console.log(result.right);
// } else {
//   console.log(result);
// }
