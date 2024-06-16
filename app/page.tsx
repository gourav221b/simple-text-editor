import React from "react";
import Editor from "./Editor";
import { Metadata } from "next";
import jwt from "jsonwebtoken";
export default function page({ searchParams }: { searchParams: any }) {
  let prev_text = "";
  let prev_filename = "";
  try {
    if (searchParams.text) {
      let decoded: any = jwt.verify(
        searchParams.text,
        `${process.env.JWT_SECRET}`
      );
      prev_text = decoded.text;
      prev_filename = decoded.file;
    }
  } catch (err: any) {
    prev_text = JSON.stringify(err?.message);
    prev_filename = "simple-text.txt";
  }

  async function createURL(text: string, file: string) {
    "use server";
    try {
      let token = jwt.sign({ text, file }, `${process.env.JWT_SECRET}`);
      return { token };
    } catch (err: any) {
      return { error: err?.message };
    }
  }
  return (
    <section className='relative'>
      <Editor
        prev_text={prev_text || ""}
        prev_filename={prev_filename || ""}
        share={createURL}
      />
    </section>
  );
}
export const metadata: Metadata = {
  title: `Simple Text Editor `,
  description: `Experience seamless text editing with our intuitive text editor. Edit, load, create, and download text files effortlessly in various formats including .txt, .csv, and .md files. Simplify your workflow with our user-friendly interface and versatile file handling capabilities. Boost productivity with our comprehensive text editing solution today. `,
  authors: [{ name: "Gourav Ghosal" }],
  openGraph: {
    title: "Simple Text Editor",
    description:
      "Experience seamless text editing with our intuitive text editor. Edit, load, create, and download text files effortlessly in various formats including .txt, .csv, and .md files. Simplify your workflow with our user-friendly interface and versatile file handling capabilities. Boost productivity with our comprehensive text editing solution today.",
  },
  twitter: {
    title: "Simple Text Editor",
    description:
      "Experience seamless text editing with our intuitive text editor. Edit, load, create, and download text files effortlessly in various formats including .txt, .csv, and .md files. Simplify your workflow with our user-friendly interface and versatile file handling capabilities. Boost productivity with our comprehensive text editing solution today.",
  },
};
