"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useLayoutEffect, useState } from "react";
import Editor from "./Editor";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { db } from "@/config/db";
import { useLiveQuery } from "dexie-react-hooks";
const localStorage = typeof window !== "undefined" ? window.localStorage : null;
const EditorWrapper = () => {
  const [tabs, setTabs] = useState(() => [
    { name: "loading...", content: "", id: 1 },
  ]);
  const availableTabs = useLiveQuery(() => db.editors.toArray());
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (localStorage && localStorage.getItem("activeTab"))
      return localStorage.getItem("activeTab") ?? "0";
    else return "0";
  });
  async function addEditorTab() {
    try {
      // Add the new tab!
      const id = await db.editors.add({
        name: "Untitled.txt",
        content: "",
      });
      setActiveTab(() => `${id}`);
    } catch (error) {
      console.log(error);
    }
  }
  async function deleteEditorTab(id: any) {
    try {
      const index = tabs.findIndex((tab) => tab.id == id);

      await db.editors.delete(id);
      if (tabs) {
        if (index > 0) setActiveTab(() => `${tabs[index - 1]?.id}`);
        else if (index == 0) {
          setActiveTab(() => `${tabs[1]?.id}`);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  useLayoutEffect(() => {
    if (availableTabs) setTabs(() => availableTabs);
  }, [availableTabs]);

  useLayoutEffect(() => {
    if (tabs.length == 0) addEditorTab();
  }, [tabs]);

  useLayoutEffect(() => {
    if (tabs.length > 0) {
      let idx = tabs.findIndex((tab) => `${tab.id}` == activeTab);
      if (idx !== -1) localStorage?.setItem("activeTab", `${tabs[idx].id}`);
    }
  }, [activeTab, tabs]);

  if (tabs.length > 0)
    return (
      <Tabs
        defaultValue={`${tabs[0]?.id}`}
        value={activeTab}
        className='h-full flex flex-col justify-between'
      >
        <TabsList className='flex flex-nowrap w-full justify-start p-0 max-w-screen overflow-scroll no-scrollbar rounded-none dark:bg-gray-800 '>
          {tabs.map(
            (
              tab: {
                name: string;
                content: string;
                id: number;
              },
              idx: number
            ) => (
              <TabsTrigger
                value={`${tab.id}`}
                key={`${tab.id}-${idx}`}
                className='flex-shrink-[3]  overflow-hidden text-xs h-10 max-w-1/12 px-4 group relative cursor-pointer rounded-none '
                asChild
              >
                <div
                  onClick={() => {
                    setActiveTab(() => `${tab.id}`);
                  }}
                  title={tab.name}
                >
                  <span className='w-full max-w-20 overflow-hidden'>
                    {tab.name}
                  </span>
                  <Button
                    variant={"ghost"}
                    size={"icon"}
                    className='inline-block ml-2 size-4 rounded-none hover:text-red-500'
                    onClick={async () => {
                      deleteEditorTab(tab.id);
                    }}
                  >
                    <X className='size-4' />
                  </Button>
                </div>
              </TabsTrigger>
            )
          )}

          <Button
            variant={"ghost"}
            size={"icon"}
            className='size-8 text-xl rounded-full scale-95 hover:bg-gray-200 dark:hover:bg-gray-700'
            onClick={() => {
              addEditorTab();
              setActiveTab(() => `new-tab-${tabs.length}`);
            }}
          >
            +
          </Button>
        </TabsList>
        {tabs.map((tab, idx) => (
          <TabsContent value={`${tab.id}`} key={`${tab.name}-${idx}`} asChild>
            <>
              <Editor
                name={`${tab.id}`}
                editor={tab}
                key={`${tab.id}-${tab.name}`}
              />
            </>
          </TabsContent>
        ))}
      </Tabs>
    );
};

export default EditorWrapper;
