import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" className="h-full">
      <Head />
      <body className="h-full overscroll-none bg-yellow-100/15">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
