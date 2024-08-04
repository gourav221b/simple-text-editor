"use client";
import { Suspense } from "react";
import EditorWrapper from "./EditorWrapper";
export default function page() {
  return (
    <Suspense fallback={<>Loading editor</>}>
      <section className='relative h-full'>
        <EditorWrapper />
      </section>
    </Suspense>
  );
}
