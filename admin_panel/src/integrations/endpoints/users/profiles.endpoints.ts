// =============================================================
// FILE: src/integrations/endpoints/public/profiles.endpoints.ts
// FINAL — Profiles RTK (me + public by id)
// Backend: GET/PUT /auth/user (profil alanları + user); /profiles/me kaldırıldı
// - GET  /profiles/:id       (public)  ✅ NEW
// =============================================================

import { baseApi } from "@/integrations/baseApi";
import type { GetMyProfileResp, Profile, UpsertMyProfileReq, UpsertMyProfileResp } from "@/integrations/shared";
import { normalizeProfile } from "@/integrations/shared";

export const profilesApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    getMyProfile: b.query<GetMyProfileResp, void>({
      query: () => ({ url: "/auth/user", method: "GET" }),
      transformResponse: (res: unknown): GetMyProfileResp => {
        if (!res || typeof res !== "object") return null;
        return normalizeProfile(res as any);
      },
      providesTags: ["Profile", "User", "Auth"],
    }),

    upsertMyProfile: b.mutation<UpsertMyProfileResp, UpsertMyProfileReq>({
      query: (body) => ({ url: "/auth/user", method: "PUT", body }),
      transformResponse: (res: unknown): UpsertMyProfileResp => normalizeProfile(res as any),
      invalidatesTags: ["Profile", "User", "Auth"],
    }),

    // ✅ NEW: Public profile by id (author box için)
    getProfileById: b.query<Profile | null, string>({
      query: (id) => ({ url: `/profiles/${encodeURIComponent(id)}`, method: "GET" }),
      transformResponse: (res: unknown): Profile | null => {
        if (!res) return null;
        return normalizeProfile(res as any);
      },
      providesTags: ["Profile"],
      keepUnusedDataFor: 60,
    }),
  }),
  overrideExisting: true,
});

export const { useGetMyProfileQuery, useUpsertMyProfileMutation, useGetProfileByIdQuery } = profilesApi;
