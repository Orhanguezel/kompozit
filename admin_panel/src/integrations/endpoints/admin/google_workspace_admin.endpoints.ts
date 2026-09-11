import { baseApi } from "@/integrations/baseApi";

export type GoogleWorkspaceAccount = {
  id: string;
  email: string;
  display_name: string | null;
  token_expiry: string | null;
  scopes: string | null;
  status: "connected" | "expired" | "error" | "disconnected";
  last_synced_at: string | null;
};

export const googleWorkspaceAdminApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    listGoogleWorkspaceAccounts: build.query<GoogleWorkspaceAccount[], void>({
      query: () => "/admin/google-workspace/accounts",
      providesTags: ["Settings"],
    }),
    googleWorkspaceConnectUrl: build.query<{ url: string; callback_url: string }, void>({
      query: () => "/admin/google-workspace/connect",
    }),
    disconnectGoogleWorkspace: build.mutation<void, string>({
      query: (id) => ({ url: `/admin/google-workspace/accounts/${encodeURIComponent(id)}`, method: "DELETE" }),
      invalidatesTags: ["Settings"],
    }),
  }),
});

export const {
  useListGoogleWorkspaceAccountsQuery,
  useLazyGoogleWorkspaceConnectUrlQuery,
  useDisconnectGoogleWorkspaceMutation,
} = googleWorkspaceAdminApi;
