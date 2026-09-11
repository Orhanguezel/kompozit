import type { FetchArgs } from "@reduxjs/toolkit/query";

import { baseApi } from "@/integrations/baseApi";

export type MarketingChannel = { enabled: boolean; url: string };
export type SocialPlatform = "facebook" | "instagram" | "linkedin" | "x";
export type SocialPost = {
  id: string;
  platform: SocialPlatform;
  title: string | null;
  caption: string;
  media_url: string | null;
  link_url: string | null;
  status: "draft" | "scheduled" | "published" | "failed" | "cancelled";
  scheduled_at: string | null;
  created_at: string;
};
export type SocialConnectionStatus = {
  platform: SocialPlatform;
  configured: boolean;
  missing: string[];
  connection: null | {
    status: "connected" | "expired" | "error";
    external_account_id: string;
    external_account_name: string | null;
  };
};
export type SocialLivePost = {
  id: string;
  platform: SocialPlatform;
  caption: string;
  status: string;
  media_url: string | null;
  permalink: string | null;
  created_at: string | null;
};
export type MarketingSettings = {
  analytics_integrations?: {
    ga4?: { enabled?: boolean };
    search_console?: { enabled?: boolean };
    google_ads?: { enabled?: boolean };
  };
  ga4_property_id?: string;
  ga4_stream_id?: string;
  ga4_measurement_id?: string;
  gtm_container_id?: string;
  gsc_site_url?: string;
  google_ads_enabled?: boolean;
  social_channels?: Record<string, MarketingChannel>;
};

export type MarketingOverview = {
  range_days: number;
  totals: { views: number; visitors: number; errors: number };
  top_pages: Array<{ path: string; views: number; visitors: number }>;
  daily: Array<{ date: string; views: number; visitors: number }>;
  integrations: MarketingSettings;
};

export type UrlInspection = {
  url: string;
  inspected_at: string;
  result: {
    inspectionResult?: {
      indexStatusResult?: {
        verdict?: string;
        coverageState?: string;
        robotsTxtState?: string;
        indexingState?: string;
        lastCrawlTime?: string;
        pageFetchState?: string;
      };
    };
  };
};

export type Ga4Report = {
  totals: { users: number; sessions: number; views: number; conversions: number };
  channels: Array<{ label: string; value: number }>;
  pages: Array<{ label: string; value: number }>;
  devices: Array<{ label: string; value: number }>;
};
export type GscReport = {
  totals: { clicks: number; impressions: number; ctr: number; position: number };
  queries: Array<{ key: string; clicks: number; impressions: number; ctr: number; position: number }>;
  pages: Array<{ key: string; clicks: number; impressions: number; ctr: number; position: number }>;
};
export type GtmSummary = {
  public_id: string;
  name: string;
  domains: string[];
  workspace: string | null;
  tags: number;
  triggers: number;
  variables: number;
};
export type GoogleConnectionStatus = {
  connected: boolean;
  ga4: boolean;
  gsc: boolean;
  gtm: boolean;
  ads: boolean;
};

export const marketingAdminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMarketingOverview: builder.query<MarketingOverview, number | void>({
      query: (days = 30): FetchArgs => ({ url: "/admin/marketing/overview", params: { days } }),
      providesTags: ["Settings"],
    }),
    updateMarketingSettings: builder.mutation<MarketingSettings, MarketingSettings>({
      query: (body): FetchArgs => ({ url: "/admin/marketing/settings", method: "PUT", body }),
      invalidatesTags: ["Settings"],
    }),
    getUrlInspection: builder.query<{ item: UrlInspection | null }, string>({
      query: (url): FetchArgs => ({ url: "/admin/marketing/url-inspection", params: { url } }),
      providesTags: ["Settings"],
    }),
    inspectUrl: builder.mutation<UrlInspection, string>({
      query: (url): FetchArgs => ({ url: "/admin/marketing/url-inspection", method: "POST", body: { url } }),
      invalidatesTags: ["Settings"],
    }),
    getGoogleConnectionStatus: builder.query<GoogleConnectionStatus, void>({
      query: (): FetchArgs => ({ url: "/admin/marketing/google/status" }),
    }),
    getGa4Report: builder.query<Ga4Report, number | void>({
      query: (days = 28): FetchArgs => ({ url: "/admin/marketing/google/ga4", params: { days } }),
    }),
    getGscReport: builder.query<GscReport, number | void>({
      query: (days = 28): FetchArgs => ({ url: "/admin/marketing/google/gsc", params: { days } }),
    }),
    getGtmSummary: builder.query<GtmSummary, void>({
      query: (): FetchArgs => ({ url: "/admin/marketing/google/gtm" }),
    }),
    listSocialStatuses: builder.query<{ items: SocialConnectionStatus[] }, void>({
      query: () => ({ url: "/admin/social-oauth" }),
      providesTags: ["Settings"],
    }),
    startSocialConnection: builder.mutation<{ authorization_url: string }, SocialPlatform>({
      query: (platform) => ({ url: `/admin/social-oauth/${platform}/start`, method: "POST" }),
    }),
    disconnectSocialConnection: builder.mutation<{ ok: boolean }, SocialPlatform>({
      query: (platform) => ({ url: `/admin/social-oauth/${platform}`, method: "DELETE" }),
      invalidatesTags: ["Settings"],
    }),
    listSocialPosts: builder.query<{ items: SocialPost[] }, SocialPlatform>({
      query: (platform) => ({ url: `/admin/social-channels/${platform}/posts` }),
      providesTags: ["Settings"],
    }),
    listSocialLivePosts: builder.query<{ items: SocialLivePost[]; total: number }, SocialPlatform>({
      query: (platform) => ({ url: `/admin/social-oauth/${platform}/posts` }),
      providesTags: ["Settings"],
    }),
    createSocialPost: builder.mutation<
      { id: string; status: string },
      { platform: SocialPlatform; body: { title: string | null; caption: string; media_url: string | null; link_url: string | null; scheduled_at: string | null } }
    >({
      query: ({ platform, body }) => ({ url: `/admin/social-channels/${platform}/posts`, method: "POST", body }),
      invalidatesTags: ["Settings"],
    }),
  }),
});

export const {
  useGetMarketingOverviewQuery,
  useUpdateMarketingSettingsMutation,
  useGetUrlInspectionQuery,
  useInspectUrlMutation,
  useGetGoogleConnectionStatusQuery,
  useGetGa4ReportQuery,
  useGetGscReportQuery,
  useGetGtmSummaryQuery,
  useListSocialStatusesQuery,
  useStartSocialConnectionMutation,
  useDisconnectSocialConnectionMutation,
  useListSocialPostsQuery,
  useListSocialLivePostsQuery,
  useCreateSocialPostMutation,
} = marketingAdminApi;
