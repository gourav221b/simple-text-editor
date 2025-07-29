"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Plus, Search, X } from "lucide-react";
import { db, Template } from "@/config/db";
import { useLiveQuery } from "dexie-react-hooks";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { BUILT_IN_TEMPLATES, processTemplate, extractTemplateVariables } from "@/lib/templates";
import { getFileTypeName } from "@/lib/tab-colors";

interface TemplateSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate?: (name: string, content: string) => void;
  suggestedExtension?: string;
}

export default function TemplateSelector({ 
  isOpen, 
  onClose, 
  onSelectTemplate,
  suggestedExtension 
}: TemplateSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [templateVariables, setTemplateVariables] = useState<Record<string, string>>({});
  const [isCustomizing, setIsCustomizing] = useState(false);
  const { toast } = useToast();

  const customTemplates = useLiveQuery(() => db.templates.toArray());

  // Initialize built-in templates in database if not exists
  useEffect(() => {
    const initializeTemplates = async () => {
      const existingTemplates = await db.templates.where('isBuiltIn').equals(true).toArray();
      
      if (existingTemplates.length === 0) {
        for (const template of BUILT_IN_TEMPLATES) {
          await db.templates.add({
            ...template,
            createdAt: new Date(),
          });
        }
      }
    };
    
    initializeTemplates();
  }, []);

  // Get all templates (built-in + custom)
  const allTemplates = customTemplates || [];

  // Filter templates based on search and suggested extension
  const filteredTemplates = allTemplates.filter(template => {
    const matchesSearch = !searchQuery || 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesExtension = !suggestedExtension || 
      template.fileExtension === suggestedExtension;
    
    return matchesSearch && matchesExtension;
  });

  const handleTemplateSelect = (template: Template) => {
    const variables = extractTemplateVariables(template.content);
    
    if (variables.length > 0) {
      setSelectedTemplate(template);
      setTemplateVariables({});
      setIsCustomizing(true);
    } else {
      // No variables to customize, use template directly
      const processedContent = processTemplate(template.content);
      onSelectTemplate?.(template.name, processedContent);
      onClose();
    }
  };

  const handleUseTemplate = () => {
    if (!selectedTemplate) return;
    
    const processedContent = processTemplate(selectedTemplate.content, templateVariables);
    onSelectTemplate?.(selectedTemplate.name, processedContent);
    onClose();
    setIsCustomizing(false);
    setSelectedTemplate(null);
    setTemplateVariables({});
  };

  const handleVariableChange = (variable: string, value: string) => {
    setTemplateVariables(prev => ({
      ...prev,
      [variable]: value
    }));
  };

  const handleClose = () => {
    onClose();
    setIsCustomizing(false);
    setSelectedTemplate(null);
    setTemplateVariables({});
    setSearchQuery("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            {isCustomizing ? 'Customize Template' : 'Select Template'}
            {suggestedExtension && (
              <Badge variant="secondary">
                {getFileTypeName(`file${suggestedExtension}`)}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 flex-1 flex flex-col min-h-0">
          {!isCustomizing ? (
            <>
              {/* Search */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search templates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Template List */}
              <ScrollArea className="flex-1 border rounded-md">
                <div className="p-4">
                  {filteredTemplates.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No templates found</p>
                      {suggestedExtension && (
                        <p className="text-sm mt-2">
                          Try searching for templates or create a blank file
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="grid gap-3">
                      {filteredTemplates.map((template) => (
                        <button
                          key={template.id}
                          className="text-left p-4 border rounded-lg hover:bg-accent transition-colors"
                          onClick={() => handleTemplateSelect(template)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-medium">{template.name}</h3>
                                <Badge variant="outline" className="text-xs">
                                  {template.fileExtension}
                                </Badge>
                                {template.isBuiltIn && (
                                  <Badge variant="secondary" className="text-xs">
                                    Built-in
                                  </Badge>
                                )}
                              </div>
                              {template.description && (
                                <p className="text-sm text-muted-foreground">
                                  {template.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </>
          ) : (
            <>
              {/* Template Customization */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Customize Template: {selectedTemplate?.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Fill in the template variables below:
                  </p>
                </div>

                <ScrollArea className="max-h-64 border rounded-md p-4">
                  <div className="space-y-3">
                    {extractTemplateVariables(selectedTemplate?.content || '').map((variable) => (
                      <div key={variable} className="space-y-1">
                        <Label htmlFor={variable} className="text-sm font-medium">
                          {variable.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                        </Label>
                        <Input
                          id={variable}
                          placeholder={`Enter ${variable.toLowerCase()}`}
                          value={templateVariables[variable] || ''}
                          onChange={(e) => handleVariableChange(variable, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Preview */}
                <div>
                  <Label className="text-sm font-medium">Preview:</Label>
                  <ScrollArea className="h-32 border rounded-md p-3 mt-1">
                    <pre className="text-xs whitespace-pre-wrap font-mono">
                      {processTemplate(selectedTemplate?.content || '', templateVariables)}
                    </pre>
                  </ScrollArea>
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          {isCustomizing ? (
            <>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsCustomizing(false);
                  setSelectedTemplate(null);
                  setTemplateVariables({});
                }}
              >
                Back
              </Button>
              <Button onClick={handleUseTemplate}>
                Use Template
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  onSelectTemplate?.('Blank File', '');
                  onClose();
                }}
              >
                Create Blank File
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
