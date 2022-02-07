class UnwrapError {
  name = "UnwrapError";
}

class Ok<A> {
  constructor(readonly value: A) {}

  //   map<B>(f: (a: A) => B): Option<B> {
  //     return Option.none;
  //   }

  // mapNull<B>(f: (a: A) => B | null | undefined): Option<B> {
  //   return Option.none;
  // }

  // chain<B>(f: (a: A) => Option<B>): Option<B> {
  //   return Option.none;
  // }

  // fold<B>(b: B, f: (a: A) => B): B {
  //   return b;
  // }

  // unwrap(): A {
  //   throw new UnwrapError();
  // }

  // unwrapOr(a: A): A {
  //   return a;
  // }

  // unwrapOrElse(f: () => A): A {
  //   return f();
  // }
}

class Err<A> {
  constructor(readonly err: A) {}

  //   map<B>(f: (a: A) => B): Option<B> {
  //     return Option.some(f(this.value));
  //   }

  // mapNull<B>(f: (a: A) => B | null | undefined): Option<B> {
  //   return Option.fromNullable(f(this.value));
  // }

  // chain<B>(f: (a: A) => Option<B>): Option<B> {
  //   return f(this.value);
  // }

  // fold<B>(b: B, f: (a: A) => B): B {
  //   return f(this.value);
  // }

  // unwrap(): A {
  //   return this.value;
  // }

  // unwrapOr(a: A): A {
  //   return this.value;
  // }

  // unwrapOrElse(f: () => A): A {
  //   return this.value;
  // }
}

export type Result<A, E> = Ok<A> | Err<E>;

export namespace Result {
  export const ok = <A>(value: A): Ok<A> => new Ok(value);
  export const err = <E>(err: E): Err<E> => new Err(err);
}
