import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

import Link from "next/link";

export default function Footer() {
  return (
    <div className='fixed right-8 md:right-12 bottom-10'>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant={"ghost"}
            className='rounded-full p-4 text-lg opacity-60 hover:opacity-100 shadow dark:bg-slate-600 border border-background'
          >
            ?
          </Button>
        </DialogTrigger>{" "}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>About this project</DialogTitle>
            <DialogDescription>
              This project was made by{" "}
              <Link
                href={"https://github.com/gourav221b"}
                className='underline text-blue-400'
                target='_blank'
                rel='noopener noreferrer'
              >
                Gourav Ghosal
              </Link>
              .
            </DialogDescription>
          </DialogHeader>
          <>
            <p>
              The simple text editor inspired by{" "}
              <Link
                href={"https://www.breck-mckye.com/dead-simple-text/"}
                className='underline text-blue-400'
                target='_blank'
                rel='noopener noreferrer'
              >
                Jimmy Breck-McKye
              </Link>{" "}
              is a minimalistic implementation of a web based text editor with a
              few additional features.
            </p>
            <ol type='1' className='list-decimal list-inline px-4 space-y-2'>
              <li>
                Whatever you write is saved on your local machine and no one
                else has access to it.
              </li>
              <li>Data is saved locally, and not lost on page reload.</li>
              <li>This editor supports markdown preview.</li>
              <li>This editor can be used while being offline as well.</li>
              <li>Data can be exported as .txt, .csv or .md formats.</li>
              <li>
                Clicking on share, returns a tokenized url which others can use
                to view your content. (editing on their end will not affect your
                version)
              </li>
            </ol>
          </>
          <DialogFooter>
            <DialogTrigger asChild>
              <Button variant={"outline"}> Close</Button>
            </DialogTrigger>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
