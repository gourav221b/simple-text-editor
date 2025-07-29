"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, X, FileText, ChevronDown, ChevronRight } from "lucide-react";
import { db, Editor as EditorType } from "@/config/db";
import { useLiveQuery } from "dexie-react-hooks";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getFileTypeColor } from "@/lib/tab-colors";

interface SearchResult {
  editor: EditorType;
  matches: {
    line: number;
    content: string;
    startIndex: number;
    endIndex: number;
  }[];
}

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResult?: (editorId: number, line?: number) => void;
}

export default function GlobalSearch({ isOpen, onClose, onSelectResult }: GlobalSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isRegex, setIsRegex] = useState(false);
  const [isCaseSensitive, setIsCaseSensitive] = useState(false);
  const [expandedFiles, setExpandedFiles] = useState<Set<number>>(new Set());

  const editors = useLiveQuery(() => db.editors.toArray());

  const searchResults = useMemo(() => {
    if (!searchQuery.trim() || !editors) return [];

    const results: SearchResult[] = [];
    
    for (const editor of editors) {
      const matches: SearchResult['matches'] = [];
      const lines = editor.content.split('\n');
      
      for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
        const line = lines[lineIndex];
        let searchPattern: RegExp;
        
        try {
          if (isRegex) {
            searchPattern = new RegExp(searchQuery, isCaseSensitive ? 'g' : 'gi');
          } else {
            const escapedQuery = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            searchPattern = new RegExp(escapedQuery, isCaseSensitive ? 'g' : 'gi');
          }
          
          let match;
          while ((match = searchPattern.exec(line)) !== null) {
            matches.push({
              line: lineIndex + 1,
              content: line,
              startIndex: match.index,
              endIndex: match.index + match[0].length,
            });
            
            // Prevent infinite loop for zero-length matches
            if (match.index === searchPattern.lastIndex) {
              searchPattern.lastIndex++;
            }
          }
        } catch (error) {
          // Invalid regex, skip this editor
          continue;
        }
      }
      
      if (matches.length > 0) {
        results.push({ editor, matches });
      }
    }
    
    return results;
  }, [searchQuery, editors, isRegex, isCaseSensitive]);

  const totalMatches = searchResults.reduce((sum, result) => sum + result.matches.length, 0);

  const toggleFileExpansion = (editorId: number) => {
    setExpandedFiles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(editorId)) {
        newSet.delete(editorId);
      } else {
        newSet.add(editorId);
      }
      return newSet;
    });
  };

  const handleResultClick = (editorId: number, line?: number) => {
    onSelectResult?.(editorId, line);
    onClose();
  };

  const highlightMatch = (content: string, startIndex: number, endIndex: number) => {
    const before = content.substring(0, startIndex);
    const match = content.substring(startIndex, endIndex);
    const after = content.substring(endIndex);
    
    return (
      <>
        {before}
        <mark className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">{match}</mark>
        {after}
      </>
    );
  };

  // Auto-expand files when search results change
  useEffect(() => {
    if (searchResults.length > 0) {
      const newExpanded = new Set<number>();
      searchResults.forEach(result => {
        newExpanded.add(result.editor.id);
      });
      setExpandedFiles(newExpanded);
    }
  }, [searchResults]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Global Search
            {totalMatches > 0 && (
              <Badge variant="secondary">
                {totalMatches} match{totalMatches !== 1 ? 'es' : ''} in {searchResults.length} file{searchResults.length !== 1 ? 's' : ''}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 flex-1 flex flex-col min-h-0">
          {/* Search Controls */}
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  placeholder="Search across all files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                  autoFocus
                />
              </div>
              <Button
                variant={isRegex ? "default" : "outline"}
                size="sm"
                onClick={() => setIsRegex(!isRegex)}
                title="Use Regular Expression"
              >
                .*
              </Button>
              <Button
                variant={isCaseSensitive ? "default" : "outline"}
                size="sm"
                onClick={() => setIsCaseSensitive(!isCaseSensitive)}
                title="Match Case"
              >
                Aa
              </Button>
            </div>
          </div>

          {/* Search Results */}
          <ScrollArea className="flex-1 border rounded-md">
            <div className="p-4">
              {searchQuery.trim() === '' ? (
                <div className="text-center text-muted-foreground py-8">
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Enter a search term to find content across all files</p>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No matches found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {searchResults.map((result) => {
                    const isExpanded = expandedFiles.has(result.editor.id);
                    const fileColor = getFileTypeColor(result.editor.name);
                    
                    return (
                      <div key={result.editor.id} className="border rounded-lg">
                        {/* File Header */}
                        <button
                          className="w-full flex items-center gap-2 p-3 hover:bg-accent rounded-t-lg"
                          onClick={() => toggleFileExpansion(result.editor.id)}
                        >
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: fileColor }}
                          />
                          <span className="font-medium">{result.editor.name}</span>
                          <Badge variant="secondary" className="ml-auto">
                            {result.matches.length} match{result.matches.length !== 1 ? 'es' : ''}
                          </Badge>
                        </button>
                        
                        {/* Match Results */}
                        {isExpanded && (
                          <div className="border-t">
                            {result.matches.map((match, matchIndex) => (
                              <button
                                key={matchIndex}
                                className="w-full text-left p-3 hover:bg-accent border-b last:border-b-0 font-mono text-sm"
                                onClick={() => handleResultClick(result.editor.id, match.line)}
                              >
                                <div className="flex items-start gap-3">
                                  <span className="text-muted-foreground min-w-[3rem] text-right">
                                    {match.line}
                                  </span>
                                  <div className="flex-1 overflow-hidden">
                                    <code className="whitespace-pre-wrap break-all">
                                      {highlightMatch(match.content, match.startIndex, match.endIndex)}
                                    </code>
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
