"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X, ChevronUp, ChevronDown, Replace } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FindInFileProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  onContentChange?: (newContent: string) => void;
  onHighlight?: (matches: { start: number; end: number }[]) => void;
}

export default function FindInFile({ 
  isOpen, 
  onClose, 
  content, 
  onContentChange,
  onHighlight 
}: FindInFileProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [replaceQuery, setReplaceQuery] = useState("");
  const [isReplaceMode, setIsReplaceMode] = useState(false);
  const [isRegex, setIsRegex] = useState(false);
  const [isCaseSensitive, setIsCaseSensitive] = useState(false);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [matches, setMatches] = useState<{ start: number; end: number }[]>([]);
  
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Find matches in content
  useEffect(() => {
    if (!searchQuery.trim()) {
      setMatches([]);
      setCurrentMatchIndex(0);
      onHighlight?.([]);
      return;
    }

    const newMatches: { start: number; end: number }[] = [];
    
    try {
      let searchPattern: RegExp;
      
      if (isRegex) {
        searchPattern = new RegExp(searchQuery, isCaseSensitive ? 'g' : 'gi');
      } else {
        const escapedQuery = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        searchPattern = new RegExp(escapedQuery, isCaseSensitive ? 'g' : 'gi');
      }
      
      let match;
      while ((match = searchPattern.exec(content)) !== null) {
        newMatches.push({
          start: match.index,
          end: match.index + match[0].length,
        });
        
        // Prevent infinite loop for zero-length matches
        if (match.index === searchPattern.lastIndex) {
          searchPattern.lastIndex++;
        }
      }
    } catch (error) {
      // Invalid regex, clear matches
    }
    
    setMatches(newMatches);
    setCurrentMatchIndex(newMatches.length > 0 ? 0 : -1);
    onHighlight?.(newMatches);
  }, [searchQuery, content, isRegex, isCaseSensitive, onHighlight]);

  // Focus search input when opened
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
      searchInputRef.current.select();
    }
  }, [isOpen]);

  const goToNextMatch = () => {
    if (matches.length === 0) return;
    setCurrentMatchIndex((prev) => (prev + 1) % matches.length);
  };

  const goToPrevMatch = () => {
    if (matches.length === 0) return;
    setCurrentMatchIndex((prev) => (prev - 1 + matches.length) % matches.length);
  };

  const replaceCurrentMatch = () => {
    if (matches.length === 0 || currentMatchIndex === -1 || !onContentChange) return;
    
    const currentMatch = matches[currentMatchIndex];
    const newContent = 
      content.substring(0, currentMatch.start) + 
      replaceQuery + 
      content.substring(currentMatch.end);
    
    onContentChange(newContent);
    
    // Update search query to trigger re-search with new content
    const tempQuery = searchQuery;
    setSearchQuery("");
    setTimeout(() => setSearchQuery(tempQuery), 0);
  };

  const replaceAllMatches = () => {
    if (matches.length === 0 || !onContentChange) return;
    
    let newContent = content;
    let offset = 0;
    
    for (const match of matches) {
      const adjustedStart = match.start + offset;
      const adjustedEnd = match.end + offset;
      
      newContent = 
        newContent.substring(0, adjustedStart) + 
        replaceQuery + 
        newContent.substring(adjustedEnd);
      
      offset += replaceQuery.length - (match.end - match.start);
    }
    
    onContentChange(newContent);
    
    // Clear search to show results
    setSearchQuery("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        goToPrevMatch();
      } else {
        goToNextMatch();
      }
      e.preventDefault();
    } else if (e.key === 'Escape') {
      onClose();
      e.preventDefault();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-0 right-0 z-50 bg-background border border-border rounded-lg shadow-lg p-4 m-4 min-w-80">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            <span className="font-medium text-sm">Find in File</span>
            {matches.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {currentMatchIndex + 1} of {matches.length}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsReplaceMode(!isReplaceMode)}
              className="h-6 w-6 p-0"
              title="Toggle Replace Mode"
            >
              <Replace className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Search Input */}
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              ref={searchInputRef}
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-8 text-sm"
            />
          </div>
          <Button
            variant={isRegex ? "default" : "outline"}
            size="sm"
            onClick={() => setIsRegex(!isRegex)}
            className="h-8 px-2 text-xs"
            title="Use Regular Expression"
          >
            .*
          </Button>
          <Button
            variant={isCaseSensitive ? "default" : "outline"}
            size="sm"
            onClick={() => setIsCaseSensitive(!isCaseSensitive)}
            className="h-8 px-2 text-xs"
            title="Match Case"
          >
            Aa
          </Button>
        </div>

        {/* Replace Input */}
        {isReplaceMode && (
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="Replace with..."
                value={replaceQuery}
                onChange={(e) => setReplaceQuery(e.target.value)}
                className="h-8 text-sm"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={replaceCurrentMatch}
              disabled={matches.length === 0 || currentMatchIndex === -1}
              className="h-8 px-2 text-xs"
              title="Replace Current"
            >
              Replace
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={replaceAllMatches}
              disabled={matches.length === 0}
              className="h-8 px-2 text-xs"
              title="Replace All"
            >
              All
            </Button>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPrevMatch}
              disabled={matches.length === 0}
              className="h-7 w-7 p-0"
              title="Previous Match (Shift+Enter)"
            >
              <ChevronUp className="w-3 h-3" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={goToNextMatch}
              disabled={matches.length === 0}
              className="h-7 w-7 p-0"
              title="Next Match (Enter)"
            >
              <ChevronDown className="w-3 h-3" />
            </Button>
          </div>
          
          {searchQuery && matches.length === 0 && (
            <span className="text-xs text-muted-foreground">No matches found</span>
          )}
        </div>
      </div>
    </div>
  );
}
