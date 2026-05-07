"use client";

// =============================================================
// FILE: src/components/common/RichContentEditor.tsx
// FINAL — Rich Content Editor (shadcn)
// - No Bootstrap classes
// - Tabs: Visual / HTML Source
// - Toolbar buttons (shadcn Button)
// - Live preview
// - Legacy {"html":"..."} -> plain html normalize
// =============================================================

import type React from "react";
import { useEffect, useRef, useState } from "react";

import {
  Bold,
  Code2,
  Eraser,
  Eye,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  Table2,
  Twitter,
  Type,
  Underline,
  Youtube,
} from "lucide-react";

import { useAdminT } from "@/app/(main)/admin/_components/common/useAdminT";
import { Badge } from "@ensotek/shared-ui/admin/ui/badge";
import { Button } from "@ensotek/shared-ui/admin/ui/button";
import { Card, CardContent, CardHeader } from "@ensotek/shared-ui/admin/ui/card";
import { Label } from "@ensotek/shared-ui/admin/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ensotek/shared-ui/admin/ui/tabs";
import { Textarea } from "@ensotek/shared-ui/admin/ui/textarea";
import { cn } from "@/lib/utils";

export type RichContentEditorProps = {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  height?: string;
  onUploadImage?: (file: File) => Promise<string>;
};

type ActiveTab = "visual" | "source";

const DEFAULT_HEIGHT = "260px";

function normalizeLegacyHtmlValue(raw: string | undefined | null): string {
  if (!raw) return "";
  const trimmed = raw.trim();
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    try {
      const parsed = JSON.parse(trimmed) as any;
      if (parsed && typeof parsed.html === "string") return parsed.html;
    } catch {
      // ignore
    }
  }
  return raw;
}

function insertHtmlAtCursor(html: string) {
  if (typeof window === "undefined") return;

  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return;

  const range = sel.getRangeAt(0);
  range.deleteContents();

  const temp = document.createElement("div");
  temp.innerHTML = html;

  const frag = document.createDocumentFragment();
  let lastNode: ChildNode | null = null;

  while (temp.firstChild) {
    lastNode = temp.firstChild;
    frag.appendChild(temp.firstChild);
  }

  range.insertNode(frag);

  if (lastNode) {
    const after = document.createRange();
    after.setStartAfter(lastNode);
    after.collapse(true);
    sel.removeAllRanges();
    sel.addRange(after);
  }
}

const RichContentEditor: React.FC<RichContentEditorProps> = ({
  label,
  value,
  onChange,
  disabled = false,
  height = DEFAULT_HEIGHT,
  onUploadImage,
}) => {
  const t = useAdminT();
  const editorRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [activeTab, setActiveTab] = useState<ActiveTab>("visual");
  const [html, setHtml] = useState<string>(normalizeLegacyHtmlValue(value));

  useEffect(() => {
    const normalized = normalizeLegacyHtmlValue(value);
    setHtml(normalized);

    if (editorRef.current && activeTab === "visual") {
      if (editorRef.current.innerHTML !== normalized) {
        editorRef.current.innerHTML = normalized || "";
      }
    }

    // legacy normalize
    if (
      typeof value === "string" &&
      value.trim().startsWith("{") &&
      value.trim().endsWith("}") &&
      normalized !== value
    ) {
      onChange(normalized);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, activeTab, onChange]);

  useEffect(() => {
    if (activeTab === "visual" && editorRef.current) {
      if (editorRef.current.innerHTML !== html) editorRef.current.innerHTML = html || "";
    }
  }, [activeTab, html]);

  const propagateChange = (next: string) => {
    setHtml(next);
    onChange(next);
  };

  const handleVisualInput = (e: React.FormEvent<HTMLDivElement>) => {
    if (disabled) return;
    propagateChange(e.currentTarget.innerHTML);
  };

  const focusEditor = () => editorRef.current?.focus();

  const exec = (command: string, valueArg?: string) => {
    if (disabled) return;
    if (typeof document === "undefined") return;

    focusEditor();
    try {
      document.execCommand(command, false, valueArg);
      if (editorRef.current) propagateChange(editorRef.current.innerHTML);
    } catch {
      // ignore
    }
  };

  const insertTable = () => {
    focusEditor();
    // minimal theme-friendly table (no bootstrap)
    const tableHtml = `
      <table style="width:100%; border-collapse:collapse;" border="1">
        <thead>
          <tr>
            <th style="padding:8px; text-align:left;">${t("common.editor.tableHeader1")}</th>
            <th style="padding:8px; text-align:left;">${t("common.editor.tableHeader2")}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding:8px;">${t("common.editor.tableCell1")}</td>
            <td style="padding:8px;">${t("common.editor.tableCell2")}</td>
          </tr>
        </tbody>
      </table>
      <p></p>
    `.trim();
    insertHtmlAtCursor(tableHtml);
    if (editorRef.current) propagateChange(editorRef.current.innerHTML);
  };

  const insertImage = async () => {
    if (disabled) return;

    if (onUploadImage && fileInputRef.current) {
      fileInputRef.current.click();
      return;
    }

    if (typeof window !== "undefined") {
      const url = window.prompt(t("common.editor.promptImageUrl"));
      if (url?.trim()) {
        const safeUrl = url.trim();
        const imgHtml = `<img src="${safeUrl}" alt="" style="max-width:100%; height:auto;" />`;
        focusEditor();
        insertHtmlAtCursor(imgHtml);
        if (editorRef.current) propagateChange(editorRef.current.innerHTML);
      }
    }
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onUploadImage) return;
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    try {
      const url = await onUploadImage(file);
      if (!url) return;

      const safeAlt = file.name.replace(/"/g, "&quot;");
      const imgHtml = `<img src="${url}" alt="${safeAlt}" style="max-width:100%; height:auto;" />`;

      focusEditor();
      insertHtmlAtCursor(imgHtml);
      if (editorRef.current) propagateChange(editorRef.current.innerHTML);
    } catch {
      // parent isterse toast basar
    }
  };

  const insertLink = () => {
    if (disabled || typeof window === "undefined") return;
    const url = window.prompt(t("common.editor.promptLinkUrl") || "Link URL:");
    if (!url?.trim()) return;
    const sel = window.getSelection();
    const text = sel && sel.toString().trim() ? sel.toString() : url;
    focusEditor();
    exec("insertHTML", `<a href="${url.trim()}" target="_blank" rel="noopener noreferrer">${text}</a>`);
  };

  const insertHr = () => {
    if (disabled) return;
    focusEditor();
    insertHtmlAtCursor("<hr /><p></p>");
    if (editorRef.current) propagateChange(editorRef.current.innerHTML);
  };

  const insertYoutube = () => {
    if (disabled || typeof window === "undefined") return;
    const url = window.prompt(t("common.editor.promptYoutubeUrl") || "YouTube URL:");
    if (!url?.trim()) return;

    const shortsMatch = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
    const watchMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    const videoId = (shortsMatch ?? watchMatch)?.[1];
    if (!videoId) return;

    const isShorts = Boolean(shortsMatch);
    const containerStyle = isShorts
      ? 'style="width:100%;max-width:320px;margin:1rem auto;aspect-ratio:9/16;"'
      : 'style="width:100%;max-width:100%;margin:1rem 0;aspect-ratio:16/9;"';
    const html = `<div class="${isShorts ? "yt-shorts-embed" : "yt-video-embed"}" ${containerStyle} contenteditable="false"><iframe src="https://www.youtube.com/embed/${videoId}" title="YouTube" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen style="width:100%;height:100%;border:0;border-radius:6px;"></iframe></div><p></p>`;
    focusEditor();
    insertHtmlAtCursor(html);
    if (editorRef.current) propagateChange(editorRef.current.innerHTML);
  };

  const insertTwitter = () => {
    if (disabled || typeof window === "undefined") return;
    const url = window.prompt(t("common.editor.promptTwitterUrl") || "Tweet URL (x.com veya twitter.com):");
    if (!url?.trim()) return;

    const safeUrl = url.trim().replace("twitter.com", "x.com");
    const html = `<blockquote class="twitter-tweet" data-dnt="true"><a href="${safeUrl}"></a></blockquote><p></p>`;
    focusEditor();
    insertHtmlAtCursor(html);
    if (editorRef.current) propagateChange(editorRef.current.innerHTML);
  };

  const ToolbarButton = (props: React.ComponentProps<typeof Button>) => (
    <Button type="button" variant="outline" size="sm" {...props} />
  );

  return (
    <Card>
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <Label className="text-sm">{label || t("common.editor.content")}</Label>
          <Badge variant="secondary" className="gap-1">
            <Eye className="size-3.5" />
            {t("common.editor.livePreview")}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ActiveTab)}>
          <TabsList className="w-fit">
            <TabsTrigger value="visual" disabled={disabled}>
              {t("common.editor.visualEditor")}
            </TabsTrigger>
            <TabsTrigger value="source" disabled={disabled}>
              {t("common.editor.sourceHtml")}
            </TabsTrigger>
          </TabsList>

          <div className="mt-3 rounded-md border">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 border-b bg-muted/30 p-2">
              <ToolbarButton
                onMouseDown={(e) => (e.preventDefault(), exec("bold"))}
                disabled={disabled || activeTab !== "visual"}
                title={t("common.editor.bold")}
              >
                <Bold className="size-4" />
              </ToolbarButton>
              <ToolbarButton
                onMouseDown={(e) => (e.preventDefault(), exec("italic"))}
                disabled={disabled || activeTab !== "visual"}
                title={t("common.editor.italic")}
              >
                <Italic className="size-4" />
              </ToolbarButton>
              <ToolbarButton
                onMouseDown={(e) => (e.preventDefault(), exec("underline"))}
                disabled={disabled || activeTab !== "visual"}
                title={t("common.editor.underline")}
              >
                <Underline className="size-4" />
              </ToolbarButton>

              <span className="mx-1 h-5 w-px bg-border" />

              <ToolbarButton
                onMouseDown={(e) => (e.preventDefault(), exec("formatBlock", "<p>"))}
                disabled={disabled || activeTab !== "visual"}
                title={t("common.editor.paragraph")}
              >
                <Type className="size-4" />
              </ToolbarButton>
              <ToolbarButton
                onMouseDown={(e) => (e.preventDefault(), exec("formatBlock", "<h2>"))}
                disabled={disabled || activeTab !== "visual"}
                title={t("common.editor.heading2")}
              >
                <Heading2 className="size-4" />
              </ToolbarButton>
              <ToolbarButton
                onMouseDown={(e) => (e.preventDefault(), exec("formatBlock", "<h3>"))}
                disabled={disabled || activeTab !== "visual"}
                title={t("common.editor.heading3")}
              >
                <Heading3 className="size-4" />
              </ToolbarButton>

              <span className="mx-1 h-5 w-px bg-border" />

              <ToolbarButton
                onMouseDown={(e) => (e.preventDefault(), exec("insertUnorderedList"))}
                disabled={disabled || activeTab !== "visual"}
                title={t("common.editor.unorderedList")}
              >
                <List className="size-4" />
              </ToolbarButton>
              <ToolbarButton
                onMouseDown={(e) => (e.preventDefault(), exec("insertOrderedList"))}
                disabled={disabled || activeTab !== "visual"}
                title={t("common.editor.orderedList")}
              >
                <ListOrdered className="size-4" />
              </ToolbarButton>

              <span className="mx-1 h-5 w-px bg-border" />

              <ToolbarButton
                onMouseDown={(e) => (e.preventDefault(), insertTable())}
                disabled={disabled || activeTab !== "visual"}
                title={t("common.editor.insertTable")}
              >
                <Table2 className="size-4" />
              </ToolbarButton>

              <ToolbarButton
                onMouseDown={(e) => (e.preventDefault(), void insertImage())}
                disabled={disabled || activeTab !== "visual"}
                title={onUploadImage ? t("common.editor.uploadAndInsertImage") : t("common.editor.insertImage")}
              >
                <ImageIcon className="size-4" />
              </ToolbarButton>

              <ToolbarButton
                onMouseDown={(e) => (e.preventDefault(), insertLink())}
                disabled={disabled || activeTab !== "visual"}
                title={t("common.editor.insertLink") || "Link ekle"}
              >
                <Link2 className="size-4" />
              </ToolbarButton>

              <ToolbarButton
                onMouseDown={(e) => (e.preventDefault(), insertHr())}
                disabled={disabled || activeTab !== "visual"}
                title={t("common.editor.insertHr") || "Yatay çizgi"}
              >
                <Minus className="size-4" />
              </ToolbarButton>

              <span className="mx-1 h-5 w-px bg-border" />

              <ToolbarButton
                onMouseDown={(e) => (e.preventDefault(), insertYoutube())}
                disabled={disabled || activeTab !== "visual"}
                title={t("common.editor.insertYoutube") || "YouTube video ekle"}
              >
                <Youtube className="size-4" />
              </ToolbarButton>

              <ToolbarButton
                onMouseDown={(e) => (e.preventDefault(), insertTwitter())}
                disabled={disabled || activeTab !== "visual"}
                title={t("common.editor.insertTwitter") || "Tweet embed ekle"}
              >
                <Twitter className="size-4" />
              </ToolbarButton>

              <span className="mx-1 h-5 w-px bg-border" />

              <ToolbarButton
                onMouseDown={(e) => (e.preventDefault(), exec("removeFormat"))}
                disabled={disabled || activeTab !== "visual"}
                title={t("common.editor.clearFormatting")}
              >
                <Eraser className="size-4" />
              </ToolbarButton>

              {onUploadImage ? (
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileInputChange}
                />
              ) : null}
            </div>

            <TabsContent value="visual" className="m-0">
              <div
                ref={editorRef}
                className={cn(
                  "px-3 py-2 text-sm outline-none",
                  disabled ? "cursor-not-allowed bg-muted/20" : "bg-background",
                )}
                style={{
                  minHeight: height,
                  maxHeight: "600px",
                  overflowY: "auto",
                }}
                contentEditable={!disabled}
                onInput={handleVisualInput}
                suppressContentEditableWarning
              />
            </TabsContent>

            <TabsContent value="source" className="m-0">
              <div className="p-2">
                <div className="mb-2 flex items-center gap-2 text-muted-foreground text-xs">
                  <Code2 className="size-4" />
                  {t("common.editor.htmlSource")}
                </div>
                <Textarea
                  value={html}
                  onChange={(e) => propagateChange(e.target.value)}
                  disabled={disabled}
                  className="font-mono text-xs leading-5"
                  style={{ height, maxHeight: "600px", resize: "vertical" }}
                  placeholder={t("common.editor.htmlPlaceholder")}
                />
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <div className="space-y-2">
          <div className="text-muted-foreground text-xs">{t("common.editor.preview")}</div>
          <div className="rounded-md border bg-background p-3">
            {html?.trim() ? (
              <div
                className="prose prose-sm max-w-none"
                // biome-ignore lint/security/noDangerouslySetInnerHtml: live preview of editor HTML in admin
                dangerouslySetInnerHTML={{ __html: html }}
              />
            ) : (
              <div className="text-muted-foreground text-sm">
                {t("common.editor.emptyPreview")}
              </div>
            )}
          </div>
          <div className="text-muted-foreground text-xs">
            {t("common.editor.compatibilityNote")}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RichContentEditor;
