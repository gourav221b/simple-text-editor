"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { History, RotateCcw, Eye, X, Clock } from "lucide-react";
import { db } from "@/config/db";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

interface Version {
  id: string;
  content: string;
  timestamp: Date;
  size: number;
}

interface VersionHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  editorId: number;
  currentContent: string;
  onRestore?: (content: string) => void;
}

export default function VersionHistory({ 
  isOpen, 
  onClose, 
  editorId,
  currentContent,
  onRestore 
}: VersionHistoryProps) {
  const [versions, setVersions] = useState<Version[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<Version | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Load version history from localStorage
  useEffect(() => {
    if (!isOpen || !editorId) return;

    const loadVersions = () => {
      const key = `version_history_${editorId}`;
      const stored = localStorage.getItem(key);
      
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const versionList = parsed.map((v: any) => ({
            ...v,
            timestamp: new Date(v.timestamp)
          }));
          setVersions(versionList);
        } catch (error) {
          console.error('Failed to load version history:', error);
          setVersions([]);
        }
      } else {
        setVersions([]);
      }
    };

    loadVersions();
  }, [isOpen, editorId]);

  const handleRestore = (version: Version) => {
    onRestore?.(version.content);
    onClose();
  };

  const handlePreview = (version: Version) => {
    setSelectedVersion(version);
    setIsPreviewMode(true);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getContentDiff = (oldContent: string, newContent: string) => {
    const oldLines = oldContent.split('\n').length;
    const newLines = newContent.split('\n').length;
    const lineDiff = newLines - oldLines;
    
    if (lineDiff > 0) {
      return `+${lineDiff} lines`;
    } else if (lineDiff < 0) {
      return `${lineDiff} lines`;
    } else {
      return 'No line changes';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            {isPreviewMode ? 'Version Preview' : 'Version History'}
            <Badge variant="secondary">
              {versions.length} version{versions.length !== 1 ? 's' : ''}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 flex-1 flex flex-col min-h-0">
          {!isPreviewMode ? (
            <>
              {/* Current Version */}
              <div className="border rounded-lg p-4 bg-accent/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <h3 className="font-medium">Current Version</h3>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(new Blob([currentContent]).size)} • {currentContent.split('\n').length} lines
                      </p>
                    </div>
                  </div>
                  <Badge variant="default">Current</Badge>
                </div>
              </div>

              {/* Version List */}
              <ScrollArea className="flex-1 border rounded-md">
                <div className="p-4">
                  {versions.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No version history available</p>
                      <p className="text-sm mt-2">
                        Versions are automatically saved as you work
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {versions.map((version, index) => {
                        const isLatest = index === 0;
                        const previousVersion = index < versions.length - 1 ? versions[index + 1] : null;
                        const diff = previousVersion ? getContentDiff(previousVersion.content, version.content) : null;
                        
                        return (
                          <div
                            key={version.id}
                            className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${isLatest ? 'bg-blue-500' : 'bg-gray-400'}`}></div>
                                <div>
                                  <h3 className="font-medium">
                                    {formatDistanceToNow(version.timestamp, { addSuffix: true })}
                                  </h3>
                                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <span>{formatFileSize(version.size)}</span>
                                    <span>{version.content.split('\n').length} lines</span>
                                    {diff && <span className="text-blue-600">{diff}</span>}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handlePreview(version)}
                                >
                                  <Eye className="w-3 h-3 mr-1" />
                                  Preview
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleRestore(version)}
                                >
                                  <RotateCcw className="w-3 h-3 mr-1" />
                                  Restore
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </>
          ) : (
            <>
              {/* Version Preview */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">
                    Version from {formatDistanceToNow(selectedVersion!.timestamp, { addSuffix: true })}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(selectedVersion!.size)} • {selectedVersion!.content.split('\n').length} lines
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRestore(selectedVersion!)}
                  >
                    <RotateCcw className="w-3 h-3 mr-1" />
                    Restore This Version
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsPreviewMode(false);
                      setSelectedVersion(null);
                    }}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              <ScrollArea className="flex-1 border rounded-md">
                <div className="p-4">
                  <pre className="text-sm whitespace-pre-wrap font-mono">
                    {selectedVersion?.content}
                  </pre>
                </div>
              </ScrollArea>
            </>
          )}
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

// Utility function to save version to history
export function saveVersionToHistory(editorId: number, content: string) {
  const key = `version_history_${editorId}`;
  const maxVersions = 10; // Keep last 10 versions
  
  try {
    const existing = localStorage.getItem(key);
    let versions: Version[] = existing ? JSON.parse(existing) : [];
    
    // Don't save if content is the same as the last version
    if (versions.length > 0 && versions[0].content === content) {
      return;
    }
    
    const newVersion: Version = {
      id: Date.now().toString(),
      content,
      timestamp: new Date(),
      size: new Blob([content]).size
    };
    
    // Add new version at the beginning
    versions.unshift(newVersion);
    
    // Keep only the last maxVersions
    versions = versions.slice(0, maxVersions);
    
    localStorage.setItem(key, JSON.stringify(versions));
  } catch (error) {
    console.error('Failed to save version to history:', error);
  }
}
