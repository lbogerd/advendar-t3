/** Conditional type that checks if the generic `T` extends an object with a property items.
 * If `T` does have an `items` property, it infers the type of `items` and assigns it to `U`.
 * The type `ItemsArrayType<T>` will then be the same as the type of `items` (`U`).
 * If `T` does not have an `items` property, `ArrayType<T>` will be never. */
export type ItemsArrayType<T> = T extends { items: infer U } ? U : never;
