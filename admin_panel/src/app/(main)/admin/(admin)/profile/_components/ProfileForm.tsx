"use client";

import * as React from "react";

import { Camera, Loader2, Save, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

import { useAdminT } from "@/app/(main)/admin/_components/common/useAdminT";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@ensotek/shared-ui/admin/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@ensotek/shared-ui/admin/ui/card";
import { Input } from "@ensotek/shared-ui/admin/ui/input";
import { Label } from "@ensotek/shared-ui/admin/ui/label";
import { useCreateAssetAdminMutation } from "@/integrations/endpoints/admin/storage_admin.endpoints";
import {
  useAuthUpdateMutation,
  useGetMyProfileQuery,
  useStatusQuery,
  useUpsertMyProfileMutation,
} from "@/integrations/hooks";
import { getInitials } from "@/lib/utils";

export function ProfileForm() {
  const t = useAdminT();
  const { data: statusData } = useStatusQuery();
  const { data: profileData, isLoading: isProfileLoading } = useGetMyProfileQuery();
  const [upsertProfile, { isLoading: isUpdatingProfile }] = useUpsertMyProfileMutation();
  const [updateAuthUser, { isLoading: isUpdatingAuth }] = useAuthUpdateMutation();
  const [createAsset, { isLoading: isUploading }] = useCreateAssetAdminMutation();

  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [avatarUrl, setAvatarUrl] = React.useState("");

  React.useEffect(() => {
    if (profileData) {
      setFullName(profileData.full_name || "");
      setAvatarUrl(profileData.avatar_url || "");
    }
  }, [profileData]);

  React.useEffect(() => {
    if (statusData?.user) {
      setEmail(statusData.user.email || "");
    }
  }, [statusData]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error(t("admin.profile.avatarUploadFailed"));
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error(t("admin.profile.avatarTooLarge"));
      e.target.value = "";
      return;
    }

    try {
      const asset = await createAsset({
        file,
        bucket: "avatars",
        folder: "profiles",
      }).unwrap();

      if (asset.url) {
        setAvatarUrl(asset.url);
        await upsertProfile({
          profile: {
            full_name: fullName.trim() || profileData?.full_name || undefined,
            avatar_url: asset.url,
          },
        }).unwrap();
        toast.success(t("admin.profile.avatarUploaded"));
      }
    } catch (_err) {
      toast.error(t("admin.profile.avatarUploadFailed"));
    } finally {
      e.target.value = "";
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      await upsertProfile({
        profile: {
          full_name: fullName.trim() || profileData?.full_name || undefined,
          avatar_url: "",
        },
      }).unwrap();
      setAvatarUrl("");
      toast.success(t("admin.profile.avatarRemoved"));
    } catch {
      toast.error(t("admin.profile.updateFailed"));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // 1. Update Profile (Full Name, Avatar)
      const updatedProfile = await upsertProfile({
        profile: {
          full_name: fullName.trim(),
          avatar_url: avatarUrl,
        },
      }).unwrap();
      setFullName(updatedProfile.full_name || "");
      setAvatarUrl(updatedProfile.avatar_url || "");

      // 2. Update Auth User (Email)
      if (email !== statusData?.user?.email) {
        await updateAuthUser({
          email,
        }).unwrap();
      }

      toast.success(t("admin.profile.updated"));
    } catch (_err) {
      toast.error(t("admin.profile.updateFailed"));
    }
  };

  const isAnyLoading = isProfileLoading || isUpdatingProfile || isUpdatingAuth || isUploading;

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{t("admin.profile.personalInfo")}</CardTitle>
          <CardDescription>{t("admin.profile.personalInfoDesc")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <div className="group relative">
              <Avatar className="h-20 w-20 border-2 border-muted">
                <AvatarImage src={avatarUrl || undefined} alt={fullName} />
                <AvatarFallback className="text-xl">{getInitials(fullName || email || "A")}</AvatarFallback>
              </Avatar>
              <label
                htmlFor="avatar-upload"
                className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                {isUploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Camera className="h-6 w-6" />}
              </label>
              <input
                id="avatar-upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isAnyLoading}
              />
            </div>
            <div className="flex-1 space-y-1 text-center sm:text-left">
              <h4 className="font-semibold">{fullName || email || t("admin.profile.defaultName")}</h4>
              <p className="text-muted-foreground text-sm">{avatarUrl ? t("admin.profile.avatarSet") : t("admin.profile.noAvatar")}</p>
              <div className="flex flex-wrap justify-center gap-2 pt-2 sm:justify-start">
                <Button type="button" variant="outline" size="sm" asChild disabled={isAnyLoading}>
                  <label htmlFor="avatar-upload" className="cursor-pointer">
                    <Upload className="mr-2 size-4" />
                    {t("admin.profile.uploadAvatar")}
                  </label>
                </Button>
                {avatarUrl && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveAvatar}
                    disabled={isAnyLoading}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="mr-2 size-4" />
                    {t("admin.profile.removeAvatar")}
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{t("admin.profile.avatarHelp")}</p>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="full-name">{t("admin.profile.name")}</Label>
              <Input
                id="full-name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                disabled={isAnyLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">{t("admin.profile.email")}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                disabled={isAnyLoading}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isAnyLoading} className="w-full sm:w-auto">
            {isUpdatingProfile || isUpdatingAuth ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("admin.common.saving")}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {t("admin.common.save")}
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
