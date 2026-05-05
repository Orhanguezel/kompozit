// =============================================================
// FILE: src/navigation/sidebar/sidebar-items.ts
// FINAL — GuezelWebDesign — Sidebar items (labels are dynamic via site_settings.ui_admin)
// - Dashboard base: /admin/dashboard
// - Admin pages: /admin/...  (route group "(admin)" URL'e dahil olmaz)
// =============================================================

import {
  Bell,
  DollarSign,
  FileSearch,
  FileText,
  Folders,
  HardDrive,
  Images,
  Layers,
  LayoutDashboard,
  type LucideIcon,
  MessageSquare,
  Newspaper,
  Puzzle,
  RefreshCcw,
  Settings,
  Users,
} from "lucide-react";

import type { TranslateFn } from "@/i18n";

export interface NavSubItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavMainItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  subItems?: NavSubItem[];
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export type AdminNavItemKey =
  | "dashboard"
  | "site_settings"
  | "custom_pages"
  | "categories"
  | "subcategories"
  | "library"
  | "products"
  | "sparepart"
  | "services"
  | "sliders"
  | "menu_items"
  | "footer_sections"
  | "faqs"
  | "contacts"
  | "reviews"
  | "mail"
  | "users"
  | "email_templates"
  | "notifications"
  | "storage"
  | "cache"
  | "db"
  | "audit"
  | "reports"
  | "offers"
  | "catalog_requests"
  | "support"
  | "telegram"
  | "chat"
  | "references"
  | "kompozit_products"
  | "kompozit_categories"
  | "kompozit_gallery"
  | "kompozit_solutions"
  | "kompozit_offers"
  | "kompozit_blog"
  | "kompozit_blog_comments"
  | "kompozit_corporate"
  | "kompozit_legal"
  | "kompozit_settings";

export type AdminNavGroupKey = "general" | "content" | "moe_kompozit" | "marketing" | "communication" | "system";

export type AdminNavConfigItem = {
  key: AdminNavItemKey;
  url: string;
  icon?: LucideIcon;
};

export type AdminNavConfigGroup = {
  id: number;
  key: AdminNavGroupKey;
  items: AdminNavConfigItem[];
};

export const adminNavConfig: AdminNavConfigGroup[] = [
  {
    id: 1,
    key: "general",
    items: [{ key: "dashboard", url: "/admin/dashboard", icon: LayoutDashboard }],
  },
  {
    id: 2,
    key: "moe_kompozit",
    items: [
      { key: "kompozit_products", url: "/admin/products?type=kompozit", icon: Layers },
      { key: "kompozit_categories", url: "/admin/categories?module=kompozit", icon: Folders },
      { key: "kompozit_gallery", url: "/admin/gallery", icon: Images },
      { key: "kompozit_solutions", url: "/admin/solutions", icon: Puzzle },
      { key: "kompozit_offers", url: "/admin/offer?source=kompozit", icon: DollarSign },
      { key: "kompozit_blog", url: "/admin/custompage?module=kompozit_blog", icon: Newspaper },
      { key: "kompozit_blog_comments", url: "/admin/reviews?target_type=custom_page", icon: MessageSquare },
      { key: "kompozit_corporate", url: "/admin/custompage?module=kompozit_about", icon: FileText },
      { key: "kompozit_legal", url: "/admin/custompage?module=kompozit_legal", icon: FileSearch },
      { key: "kompozit_settings", url: "/admin/site-settings", icon: Settings },
    ],
  },
  {
    id: 3,
    key: "system",
    items: [
      { key: "users", url: "/admin/users", icon: Users },
      { key: "notifications", url: "/admin/notifications", icon: Bell },
      { key: "storage", url: "/admin/storage", icon: HardDrive },
      { key: "cache", url: "/admin/cache", icon: RefreshCcw },
      { key: "audit", url: "/admin/audit", icon: FileSearch },
    ],
  },
];

export type AdminNavCopy = {
  labels: Record<AdminNavGroupKey, string>;
  items: Record<AdminNavItemKey, string>;
};

// Fallback titles for when translations are missing
const FALLBACK_TITLES: Record<AdminNavItemKey, string> = {
  dashboard: "Dashboard",
  site_settings: "Site Settings",
  custom_pages: "Custom Pages",
  categories: "Categories",
  subcategories: "Subcategories",
  library: "Library",
  products: "Products",
  sparepart: "Spare Parts",
  services: "Services",
  sliders: "Sliders",
  menu_items: "Menu Items",
  footer_sections: "Footer Sections",
  faqs: "FAQs",
  offers: "Offers",
  catalog_requests: "Catalog Requests",
  contacts: "Contacts",
  reviews: "Reviews",
  mail: "Mail",
  users: "Users",
  email_templates: "Email Templates",
  notifications: "Notifications",
  support: "Support Tickets",
  storage: "Storage",
  cache: "Cache Management",
  db: "Database",
  audit: "Audit",
  reports: "Reports",
  telegram: "Telegram",
  chat: "Chat & AI",
  references: "References",
  kompozit_products: "Kompozit Products",
  kompozit_categories: "Kompozit Categories",
  kompozit_gallery: "Gallery",
  kompozit_solutions: "Solutions",
  kompozit_offers: "Kompozit Offers",
  kompozit_blog: "Kompozit Blog",
  kompozit_blog_comments: "Kompozit Blog Comments",
  kompozit_corporate: "Kompozit Corporate Pages",
  kompozit_legal: "Kompozit Legal Pages",
  kompozit_settings: "Kompozit Site Settings",
};

type SidebarGroupTranslationKey = `admin.sidebar.groups.${AdminNavGroupKey}`;
type SidebarItemTranslationKey = `admin.dashboard.items.${AdminNavItemKey}`;

export function buildAdminSidebarItems(copy?: Partial<AdminNavCopy> | null, t?: TranslateFn): NavGroup[] {
  const labels = copy?.labels ?? ({} as AdminNavCopy["labels"]);
  const items = copy?.items ?? ({} as AdminNavCopy["items"]);

  return adminNavConfig.map((group) => {
    // 1. Try copy.labels[group.key]
    // 2. Try t(`admin.sidebar.groups.${group.key}`)
    // 3. Fallback to empty (or key)
    const label =
      labels[group.key] || (t ? t(`admin.sidebar.groups.${group.key}` as SidebarGroupTranslationKey) : "") || "";

    return {
      id: group.id,
      label,
      items: group.items.map((item) => {
        // 1. Try copy.items[item.key]
        // 2. Try t(`admin.dashboard.items.${item.key}`)
        // 3. Fallback to FALLBACK_TITLES
        // 4. Fallback to key
        const title =
          items[item.key] ||
          (t ? t(`admin.dashboard.items.${item.key}` as SidebarItemTranslationKey) : "") ||
          FALLBACK_TITLES[item.key] ||
          item.key;

        return {
          title,
          url: item.url,
          icon: item.icon,
        };
      }),
    };
  });
}
