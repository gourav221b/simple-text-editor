import NiceLink from "@/components/CoolLink";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <section className='flex flex-col my-10 gap-y-4 relative text-muted-foreground'>
      <h2 className='text-4xl'>ಥ_ಥ</h2>
      <p>Why must you request for resources I dont have. Try these instead</p>
      <div className='flex flex-wrap gap-4'>
        <NiceLink
          href={"/work"}
          className='flex items-center gap-x-2 group text-muted-foreground hover:text-foreground'
        >
          <ArrowUpRight className='h-4 w-4 mr-2 inline-block  group-hover:translate-x-0.5 group-hover:-translate-y-0.5 duration-75' />
          Work
        </NiceLink>
        <NiceLink
          href={"https://github.com/gourav221b"}
          className='flex items-center gap-x-2 group text-muted-foreground hover:text-foreground'
        >
          <ArrowUpRight className='h-4 w-4 mr-2 inline-block  group-hover:translate-x-0.5 group-hover:-translate-y-0.5 duration-75' />
          Github
        </NiceLink>
        <NiceLink
          href={"https://www.linkedin.com/in/gourav-ghosal/"}
          className='flex items-center gap-x-2 group text-muted-foreground hover:text-foreground'
        >
          <ArrowUpRight className='h-4 w-4 mr-2 inline-block  group-hover:translate-x-0.5 group-hover:-translate-y-0.5 duration-75' />
          Linkedin
        </NiceLink>
        <NiceLink
          href={"https://www.instagram.com/webdev.gg/"}
          className='flex items-center gap-x-2 group text-muted-foreground hover:text-foreground'
        >
          <ArrowUpRight className='h-4 w-4 mr-2 inline-block  group-hover:translate-x-0.5 group-hover:-translate-y-0.5 duration-75' />
          Instagram
        </NiceLink>
      </div>
    </section>
  );
}
