"use client";

import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { ArrowUp } from "lucide-react";
export default function ToTop() {
  const pathname = usePathname();
  if (pathname == "/editor") return null;
  return (
    <Button
      variant={"secondary"}
      className='rounded-full  fixed right-5 bottom-5 xl:right-10 xl:bottom-10 px-4 py-6 group'
      onClick={() => window?.scrollTo(0, 0)}
      name='go to top'
      id='al'
      aria-label='go to top'
    >
      <ArrowUp className='h-6 w-4 group-hover:-translate-y-1 duration-75' />
    </Button>
  );
}
