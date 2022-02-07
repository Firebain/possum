import { tokenize } from "./lexer";

console.log(
  tokenize(
    `const url % = "https://www.freecodecamp.org/news/the-programming-language-pipeline-91d3f449c919";
const http = new  HttpClient(url);`
  )
);
