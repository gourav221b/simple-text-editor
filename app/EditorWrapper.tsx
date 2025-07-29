"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useLayoutEffect, useState, useRef } from "react";
import Editor from "./Editor";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Pin, History, Keyboard } from "lucide-react";
import { db, Editor as EditorType } from "@/config/db";
import { useLiveQuery } from "dexie-react-hooks";
import TabContextMenu from "@/components/TabContextMenu";
import { getFileTypeColor, hexToRgba, getContrastColor } from "@/lib/tab-colors";

import { useKeyboardShortcuts, createCommonShortcuts } from "@/hooks/use-keyboard-shortcuts";
import GlobalSearch from "@/components/GlobalSearch";
import FindInFile from "@/components/FindInFile";
// import TemplateSelector from "@/components/TemplateSelector";
import VersionHistory from "@/components/VersionHistory";
import KeyboardShortcutsDialog from "@/components/KeyboardShortcutsDialog";
// import { useAutoSave } from "@/hooks/use-auto-save";
import { saveVersionToHistory } from "@/components/VersionHistory";
// import { getTemplateSuggestions } from "@/lib/templates";

const localStorage = typeof window !== "undefined" ? window.localStorage : null;
const EditorWrapper = () => {
  const [tabs, setTabs] = useState<EditorType[]>([]);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [isFindInFileOpen, setIsFindInFileOpen] = useState(false);
  // const [isTemplateSelectorOpen, setIsTemplateSelectorOpen] = useState(false);
  const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(false);
  const [isKeyboardShortcutsOpen, setIsKeyboardShortcutsOpen] = useState(false);
  const [isTabsOverflowing, setIsTabsOverflowing] = useState(false);
  // const [templateSuggestedExtension, setTemplateSuggestedExtension] = useState<string>("");

  // Track if initial tab creation has been attempted
  const initialTabCreated = useRef(false);
  const tabsListRef = useRef<HTMLDivElement>(null);

  const availableTabs = useLiveQuery(() =>
    db.editors.orderBy('order').toArray()
  );

  const [activeTab, setActiveTab] = useState<string>(() => {
    if (typeof window !== 'undefined' && localStorage && localStorage.getItem("activeTab")) {
      return localStorage.getItem("activeTab") ?? "";
    }
    return "";
  });

  // Get current active tab
  const currentTab = tabs.find(tab => tab.id.toString() === activeTab);
  const currentTabIndex = tabs.findIndex(tab => tab.id.toString() === activeTab);

  // Auto-save is handled by individual Editor components
  // const { manualSave, isContentChanged } = useAutoSave(
  //   currentTab?.id || null,
  //   currentTab?.content || '',
  //   {
  //     onSave: (success) => {
  //       if (success && currentTab) {
  //         // Save version to history periodically
  //         saveVersionToHistory(currentTab.id, currentTab.content);
  //       }
  //     },
  //     onError: (error) => {
  //       console.error('Auto-save error:', error);
  //     }
  //   }
  // );

  // Manual save function for keyboard shortcut
  const manualSave = async () => {
    if (currentTab) {
      try {
        await db.editors.update(currentTab.id, {
          updatedAt: new Date()
        });
        console.log(`Manually saved ${currentTab.name}`);
      } catch (error) {
        console.error('Manual save failed:', error);
      }
    }
  };

  // For compatibility, we'll assume content is always changed since we don't track it here
  const isContentChanged = false;
  async function addEditorTab(name?: string, content?: string) {
    try {
      const maxOrder = await db.editors.orderBy('order').last();
      const fileName = name || "Untitled.txt";
      const id = await db.editors.add({
        name: fileName,
        content: content || "",
        isPinned: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        order: (maxOrder?.order || 0) + 1,
      });
      setActiveTab(`${id}`);

      // Save initial version to history if content is provided
      if (content) {
        saveVersionToHistory(id as number, content);
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Create new blank tab directly
  function createNewTab() {
    addEditorTab();
  }
  async function deleteEditorTab(id: any) {
    try {
      const index = tabs.findIndex((tab) => tab.id == id);

      await db.editors.delete(id);
      if (tabs) {
        if (index > 0 && tabs[index - 1]) {
          setActiveTab(`${tabs[index - 1].id}`);
        } else if (index === 0 && tabs[1]) {
          setActiveTab(`${tabs[1].id}`);
        } else if (tabs.length === 1) {
          // If this was the last tab, create a new one
          addEditorTab();
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Keyboard shortcut actions
  const handleNewTab = () => {
    createNewTab();
  };

  const handleCloseTab = () => {
    if (currentTab) {
      deleteEditorTab(currentTab.id);
    }
  };

  const handleNextTab = () => {
    if (tabs.length <= 1) return;
    const nextIndex = (currentTabIndex + 1) % tabs.length;
    setActiveTab(tabs[nextIndex].id.toString());
  };

  const handlePrevTab = () => {
    if (tabs.length <= 1) return;
    const prevIndex = (currentTabIndex - 1 + tabs.length) % tabs.length;
    setActiveTab(tabs[prevIndex].id.toString());
  };

  const handleSave = async () => {
    await manualSave();
  };

  const handleDuplicateTab = async () => {
    if (currentTab) {
      try {
        const maxOrder = await db.editors.orderBy('order').last();
        const duplicateName = `${currentTab.name} (Copy)`;

        const newId = await db.editors.add({
          name: duplicateName,
          content: currentTab.content,
          color: currentTab.color,
          // groupId: currentTab.groupId,
          isPinned: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          order: (maxOrder?.order || 0) + 1,
        });

        setActiveTab(newId.toString());
      } catch (error) {
        console.error('Failed to duplicate tab:', error);
      }
    }
  };

  const handlePinTab = async () => {
    if (currentTab) {
      try {
        await db.editors.update(currentTab.id, {
          isPinned: !currentTab.isPinned,
          updatedAt: new Date()
        });
      } catch (error) {
        console.error('Failed to pin/unpin tab:', error);
      }
    }
  };

  const handleFind = () => {
    setIsFindInFileOpen(true);
  };

  const handleFindGlobal = () => {
    setIsGlobalSearchOpen(true);
  };

  const handleToggleSidebar = () => {
    // This will be handled by the sidebar component
  };

  const handleShowKeyboardShortcuts = () => {
    setIsKeyboardShortcutsOpen(true);
  };

  // Set up keyboard shortcuts
  useKeyboardShortcuts([
    ...createCommonShortcuts({
      newTab: handleNewTab,
      closeTab: handleCloseTab,
      nextTab: handleNextTab,
      prevTab: handlePrevTab,
      save: handleSave,
      find: handleFind,
      findGlobal: handleFindGlobal,
      duplicateTab: handleDuplicateTab,
      pinTab: handlePinTab,
    }),
    // Additional shortcuts
    {
      key: '?',
      ctrlKey: true,
      action: handleShowKeyboardShortcuts,
      description: 'Show Keyboard Shortcuts',
    },
    {
      key: '?',
      metaKey: true,
      action: handleShowKeyboardShortcuts,
      description: 'Show Keyboard Shortcuts (Mac)',
    },
  ]);

  const handleGlobalSearchSelect = (editorId: number, line?: number) => {
    setActiveTab(editorId.toString());
    // TODO: Scroll to line if provided
  };

  // const handleTemplateSelect = (templateName: string, content: string) => {
  //   // Generate filename based on template
  //   let fileName = "Untitled";
  //   if (templateName.includes("HTML")) fileName = "index.html";
  //   else if (templateName.includes("React")) fileName = "Component.tsx";
  //   else if (templateName.includes("JavaScript")) fileName = "script.js";
  //   else if (templateName.includes("TypeScript")) fileName = "types.ts";
  //   else if (templateName.includes("CSS")) fileName = "styles.css";
  //   else if (templateName.includes("Python")) fileName = "script.py";
  //   else if (templateName.includes("Markdown")) fileName = "README.md";
  //   else if (templateName.includes("JSON")) fileName = "config.json";
  //   else if (templateName.includes("README")) fileName = "README.md";
  //   else fileName = "Untitled.txt";

  //   addEditorTab(fileName, content);
  // };

  const handleVersionRestore = (content: string) => {
    if (currentTab) {
      db.editors.update(currentTab.id, {
        content,
        updatedAt: new Date()
      });
    }
  };

  const getTabColor = (tab: EditorType): string | null => {
    // Only return color if explicitly set by user, not auto-detected
    return tab.color || null;
  };

  const getTabDisplayColor = (tab: EditorType): string => {
    // For display purposes (dot indicator), use user color or auto-detected
    return tab.color || getFileTypeColor(tab.name);
  };

  const getSortedTabs = () => {
    if (!tabs) return [];

    // Separate pinned and unpinned tabs
    const pinnedTabs = tabs.filter(tab => tab.isPinned);
    const unpinnedTabs = tabs.filter(tab => !tab.isPinned);

    // Return pinned tabs first, then unpinned tabs
    return [...pinnedTabs, ...unpinnedTabs];
  };

  // Check if tabs are overflowing
  const checkTabsOverflow = () => {
    if (tabsListRef.current) {
      const container = tabsListRef.current;
      const isOverflowing = container.scrollWidth > container.clientWidth;
      setIsTabsOverflowing(isOverflowing);
    }
  };

  // Handle tab initialization
  useLayoutEffect(() => {
    if (availableTabs !== undefined) {
      setTabs(availableTabs);

      // Set active tab if we have tabs but no active tab set
      if (availableTabs.length > 0 && !activeTab) {
        setActiveTab(availableTabs[0].id.toString());
      }
    }
  }, [availableTabs, activeTab]);

  // Create initial tab only if no tabs exist - run only once
  useLayoutEffect(() => {
    const createInitialTab = async () => {
      if (!initialTabCreated.current && availableTabs !== undefined && availableTabs.length === 0) {
        initialTabCreated.current = true;
        await addEditorTab();
      }
    };

    createInitialTab();
  }, [availableTabs]);

  useLayoutEffect(() => {
    if (tabs.length > 0 && activeTab) {
      let idx = tabs.findIndex((tab) => `${tab.id}` === activeTab);
      if (idx !== -1 && typeof window !== 'undefined') {
        localStorage?.setItem("activeTab", `${tabs[idx].id}`);
      }
    }
  }, [activeTab, tabs]);

  // Monitor tab overflow
  useLayoutEffect(() => {
    checkTabsOverflow();

    const handleResize = () => {
      checkTabsOverflow();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [tabs]);

  // Also check overflow when tabs change
  useLayoutEffect(() => {
    // Small delay to ensure DOM has updated
    const timer = setTimeout(checkTabsOverflow, 50);
    return () => clearTimeout(timer);
  }, [tabs.length, activeTab]);

  const sortedTabs = getSortedTabs();

  // New Tab Button Component
  const NewTabButton = ({ className = "", style = {} }: { className?: string; style?: React.CSSProperties }) => (
    <Button
      variant={"ghost"}
      size={"icon"}
      className={`size-10 text-lg hover:bg-accent hover:text-accent-foreground rounded-none transition-colors duration-200 font-semibold ${className}`}
      style={style}
      onClick={createNewTab}
      title="New Blank Tab (Ctrl+T)"
    >
      +
    </Button>
  );

  if (tabs.length > 0)
    return (
      <div className='h-full flex flex-col'>
        {/* Header */}
        {/* <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
          <h1 className="text-lg font-semibold">Simple Text Editor</h1>

          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsKeyboardShortcutsOpen(true)}
              title="Keyboard Shortcuts (Ctrl+?)"
            >
              <Keyboard className="w-4 h-4" />
            </Button>
            {currentTab && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsVersionHistoryOpen(true)}
                  title="Version History"
                >
                  <History className="w-4 h-4" />
                </Button>
                {isContentChanged && (
                  <Badge variant="secondary" className="text-xs">
                    Unsaved
                  </Badge>
                )}
              </>
            )}
          </div>
        </header> */}

        <Tabs
          defaultValue={`${tabs[0]?.id}`}
          value={activeTab}
          className='flex-1 flex flex-col'
        >
          <div className="relative flex w-full">
            <TabsList
              ref={tabsListRef}
              className={`flex flex-nowrap flex-1 justify-start p-0 ${isTabsOverflowing ? 'pr-12' : 'pr-0'} overflow-x-auto overflow-y-hidden no-scrollbar rounded-none dark:bg-gray-800 relative`}
            >
              {/* Render all tabs */}
              {sortedTabs.map((tab, idx) => {
                // Dynamic tab sizing based on number of tabs
                const tabCount = sortedTabs.length;
                let tabWidth = 'min-w-[120px] max-w-[200px]';
                if (tabCount > 8) {
                  tabWidth = 'min-w-[80px] max-w-[120px]';
                } else if (tabCount > 5) {
                  tabWidth = 'min-w-[100px] max-w-[150px]';
                }

                const tabColor = getTabColor(tab);
                const displayColor = getTabDisplayColor(tab);
                const isActive = activeTab === `${tab.id}`;

                return (
                  <TabContextMenu
                    key={`${tab.id}-${idx}`}
                    editor={tab}
                    onClose={() => deleteEditorTab(tab.id)}
                    onDuplicate={() => { }}
                  >
                    <TabsTrigger
                      value={`${tab.id}`}
                      className={`flex-shrink-0 overflow-hidden text-xs h-10 ${tabWidth} px-2 group relative cursor-pointer rounded-none border-b-2 border-transparent transition-all duration-200 ${isActive
                        ? 'bg-background text-foreground border-b-primary'
                        : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                        }`}
                      style={tabColor ? {
                        backgroundColor: isActive ? tabColor : hexToRgba(tabColor, 0.1),
                        borderBottomColor: tabColor,
                        color: isActive ? getContrastColor(tabColor) : undefined,
                      } : {}}
                      asChild
                    >
                      <div
                        onClick={() => setActiveTab(`${tab.id}`)}
                        title={tab.name}
                        className='flex items-center gap-1 w-full h-full px-1'
                      >
                        {tab.isPinned && (
                          <Pin className='size-3 flex-shrink-0' />
                        )}
                        <div
                          className='w-2 h-2 rounded-full flex-shrink-0'
                          style={{ backgroundColor: displayColor }}
                        />
                        <span className='flex-1 overflow-hidden truncate text-left text-xs'>
                          {tab.name}
                        </span>
                        <Button
                          variant={"ghost"}
                          size={"icon"}
                          className='flex-shrink-0 size-4 rounded-none hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all duration-200'
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteEditorTab(tab.id);
                          }}
                        >
                          <X className='size-3' />
                        </Button>
                      </div>
                    </TabsTrigger>
                  </TabContextMenu>
                );
              })}

              {/* Inline New Tab Button - shown when tabs are not overflowing */}
              {!isTabsOverflowing && (
                <div className="flex items-center h-10 border-l border-border bg-muted/30 hover:bg-muted/50 transition-colors">
                  <NewTabButton className="hover:bg-transparent" />
                </div>
              )}
            </TabsList>

            {/* Fade gradient for scroll indication - only when overflowing */}
            {isTabsOverflowing && (
              <div className="absolute right-10 top-0 h-full w-8 bg-gradient-to-l from-background to-transparent pointer-events-none"></div>
            )}

            {/* Fixed New Tab Button - only when overflowing */}
            {isTabsOverflowing && (
              <div className="absolute right-0 top-0 h-full bg-background border-l border-border flex items-center shadow-sm z-10">
                <NewTabButton />
              </div>
            )}
          </div>
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

        {/* Global Search Dialog */}
        <GlobalSearch
          isOpen={isGlobalSearchOpen}
          onClose={() => setIsGlobalSearchOpen(false)}
          onSelectResult={handleGlobalSearchSelect}
        />

        {/* Find in File Dialog */}
        {currentTab && (
          <FindInFile
            isOpen={isFindInFileOpen}
            onClose={() => setIsFindInFileOpen(false)}
            content={currentTab.content}
            onContentChange={(newContent) => {
              db.editors.update(currentTab.id, {
                content: newContent,
                updatedAt: new Date()
              });
            }}
          />
        )}

        {/* Template Selector Dialog - Commented Out */}
        {/* <TemplateSelector
          isOpen={isTemplateSelectorOpen}
          onClose={() => setIsTemplateSelectorOpen(false)}
          onSelectTemplate={handleTemplateSelect}
          suggestedExtension={templateSuggestedExtension}
        /> */}

        {/* Version History Dialog */}
        {
          currentTab && (
            <VersionHistory
              isOpen={isVersionHistoryOpen}
              onClose={() => setIsVersionHistoryOpen(false)}
              editorId={currentTab.id}
              currentContent={currentTab.content}
              onRestore={handleVersionRestore}
            />
          )
        }

        {/* Keyboard Shortcuts Dialog */}
        <KeyboardShortcutsDialog
          isOpen={isKeyboardShortcutsOpen}
          onClose={() => setIsKeyboardShortcutsOpen(false)}
        />
      </div>
    );
};

export default EditorWrapper;
