"use client";

import type React from "react";
import { useMemo, useRef, useState } from "react";

import { ExternalLink, FileText, Loader2, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

import { useAdminT } from "@/app/(main)/admin/_components/common/useAdminT";
import { Button } from "@ensotek/shared-ui/admin/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@ensotek/shared-ui/admin/ui/card";
import { Input } from "@ensotek/shared-ui/admin/ui/input";
import { Label } from "@ensotek/shared-ui/admin/ui/label";
import {
  useCreateAssetAdminMutation,
  useCreateLibraryFileAdminMutation,
  useListLibraryFilesAdminQuery,
  useRemoveLibraryFileAdminMutation,
} from "@/integrations/hooks";
import type { LibraryFileCreatePayload, LibraryFileDto, StorageAsset } from "@/integrations/shared";

export type LibraryFilesSectionProps = {
  libraryId: string;
  locale?: string;
  disabled?: boolean;
};

const safeText = (v: unknown) => (v === null || v === undefined ? "" : String(v));
const norm = (v: unknown) => String(v ?? "").trim();

function normalizeLocale(raw?: string, fallback = "tr") {
  const s = String(raw ?? "").trim();
  if (!s) return fallback;
  const [short] = s.split("-");
  return (short || fallback).toLowerCase();
}

function getObj(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null ? (value as Record<string, unknown>) : null;
}

function extractErrMsg(err: unknown, fallback: string): string {
  const errObj = getObj(err);
  const data = getObj(errObj?.data);
  const nestedError = getObj(data?.error);

  return (
    safeText(nestedError?.message) ||
    safeText(data?.message) ||
    safeText(errObj?.error) ||
    safeText(errObj?.message) ||
    fallback
  );
}

export const LibraryFilesSection: React.FC<LibraryFilesSectionProps> = ({ libraryId, locale, disabled = false }) => {
  const t = useAdminT("admin.library");
  const effectiveLocale = useMemo(() => normalizeLocale(locale, "tr"), [locale]);

  const {
    data: files,
    isLoading,
    isFetching,
    refetch,
  } = useListLibraryFilesAdminQuery({ id: libraryId, locale: effectiveLocale }, { skip: !libraryId });

  const [createFile, { isLoading: isCreatingFile }] = useCreateLibraryFileAdminMutation();
  const [removeFile, { isLoading: isRemoving }] = useRemoveLibraryFileAdminMutation();
  const [createAsset, { isLoading: isUploadingAsset }] = useCreateAssetAdminMutation();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [overrideName, setOverrideName] = useState("");
  const [bucket, setBucket] = useState("public");
  const [folder, setFolder] = useState("uploads/catalog");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const loading = isLoading || isFetching;
  const uploading = isUploadingAsset || isCreatingFile;

  const handleUpload = async () => {
    if (!libraryId) return;

    if (!selectedFile) {
      toast.error(t("filesSection.selectFileError"));
      return;
    }

    try {
      const storage = await createAsset({
        file: selectedFile,
        bucket,
        folder: folder || undefined,
        metadata: {
          module_key: "library",
          library_id: libraryId,
          original_name: selectedFile.name,
          mime: selectedFile.type || "application/octet-stream",
          locale: effectiveLocale,
        },
      }).unwrap();

      const uploadedAsset = storage as StorageAsset;
      const storageId = norm(uploadedAsset.id);
      const storageUrl = norm(uploadedAsset.url);
      const storageMime = norm(uploadedAsset.mime) || norm(selectedFile.type) || "application/octet-stream";
      const storageSize = uploadedAsset.size;

      if (!storageId) throw new Error(t("filesSection.uploadMissingAssetId"));
      if (!storageUrl) throw new Error(t("filesSection.uploadMissingUrl"));

      const displayName = overrideName.trim() || selectedFile.name;
      const payload: LibraryFileCreatePayload = {
        asset_id: storageId,
        name: displayName,
        file_url: storageUrl,
        size_bytes: typeof storageSize === "number" ? storageSize : null,
        mime_type: storageMime || null,
      };

      await createFile({
        id: libraryId,
        locale: effectiveLocale,
        payload,
      }).unwrap();

      toast.success(t("filesSection.uploadSuccess"));

      setSelectedFile(null);
      setOverrideName("");
      if (fileInputRef.current) fileInputRef.current.value = "";

      void refetch();
    } catch (err: unknown) {
      toast.error(extractErrMsg(err, t("filesSection.defaultError")));
    }
  };

  const handleRemove = async (file: LibraryFileDto) => {
    const fileId = norm(file.id);
    if (!libraryId || !fileId) return;

    if (!confirm(t("filesSection.confirmDelete", { title: safeText(file.name) }))) return;

    try {
      await removeFile({ id: libraryId, fileId, locale: effectiveLocale }).unwrap();
      toast.success(t("filesSection.deleteSuccess"));
    } catch (err: unknown) {
      const errObj = getObj(err);
      const status = errObj?.status ?? errObj?.originalStatus;
      if (status === 404) toast.success(t("filesSection.alreadyDeleted"));
      else toast.error(extractErrMsg(err, t("filesSection.defaultError")));
    } finally {
      void refetch();
    }
  };

  const list = (files || []) as LibraryFileDto[];

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b bg-muted/30 py-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 font-semibold text-sm">
            <FileText className="h-4 w-4 text-primary" />
            {t("filesSection.title")}
          </CardTitle>
          {loading && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        {list.length === 0 && !loading && (
          <div className="rounded-lg border-2 border-dashed bg-muted/10 py-6 text-center text-muted-foreground text-xs italic">
            {t("filesSection.empty")}
          </div>
        )}

        {list.length > 0 && (
          <div className="space-y-2">
            {list.map((f) => {
              const href = norm(f.file_url);
              const label = safeText(f.name) || t("filesSection.fileFallback");
              const fileTypeLabel = norm(f.mime_type?.split("/")?.pop()) || "file";
              const sizeKb =
                typeof f.size_bytes === "number" && f.size_bytes > 0 ? (f.size_bytes / 1024).toFixed(1) : null;

              return (
                <div
                  key={f.id || `${label}-${href}`}
                  className="flex items-center justify-between gap-3 rounded-lg border bg-card p-3 text-xs transition-all hover:shadow-sm"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 truncate font-medium" title={label}>
                      {href ? (
                        <a
                          href={href}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-primary hover:underline"
                        >
                          {label}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        label
                      )}
                    </div>
                    <div className="mt-0.5 flex items-center gap-2 truncate text-[10px] text-muted-foreground">
                      <span className="rounded bg-muted px-1.5 py-0.5 uppercase tracking-tighter">{fileTypeLabel}</span>
                      {sizeKb && <span>• {sizeKb} KB</span>}
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0 text-destructive hover:bg-destructive/10"
                    disabled={disabled || isRemoving}
                    onClick={() => handleRemove(f)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}

        <div className="space-y-3 border-t pt-4">
          <div className="grid gap-3 rounded-lg border bg-muted/20 p-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="library-file-upload"
                className="font-bold text-[10px] text-muted-foreground uppercase tracking-wider"
              >
                {t("filesSection.fileInputLabel")}
              </Label>
              <Input
                id="library-file-upload"
                ref={fileInputRef}
                type="file"
                className="h-9 cursor-pointer bg-background text-xs"
                accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/zip"
                onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
                disabled={disabled || uploading}
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="library-file-display-name"
                className="font-bold text-[10px] text-muted-foreground uppercase tracking-wider"
              >
                {t("filesSection.displayName")}
              </Label>
              <Input
                id="library-file-display-name"
                className="h-9 bg-background text-xs"
                value={overrideName}
                onChange={(e) => setOverrideName(e.target.value)}
                disabled={disabled || uploading}
                placeholder={t("filesSection.displayNamePlaceholder")}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label
                  htmlFor="library-file-bucket"
                  className="font-bold text-[10px] text-muted-foreground uppercase tracking-wider"
                >
                  Bucket
                </Label>
                <Input
                  id="library-file-bucket"
                  className="h-9 bg-background text-xs"
                  value={bucket}
                  onChange={(e) => setBucket(e.target.value)}
                  disabled={disabled || uploading}
                />
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="library-file-folder"
                  className="font-bold text-[10px] text-muted-foreground uppercase tracking-wider"
                >
                  Folder
                </Label>
                <Input
                  id="library-file-folder"
                  className="h-9 bg-background text-xs"
                  value={folder}
                  onChange={(e) => setFolder(e.target.value)}
                  disabled={disabled || uploading}
                />
              </div>
            </div>

            <Button
              className="mt-1 h-9 w-full text-xs"
              disabled={disabled || uploading || !selectedFile}
              onClick={handleUpload}
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  {t("filesSection.uploading")}
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-3 w-3" />
                  {t("filesSection.uploadAndSave")}
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
