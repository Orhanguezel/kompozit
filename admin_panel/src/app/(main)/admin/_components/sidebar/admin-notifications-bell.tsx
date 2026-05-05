"use client";

import * as React from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { Badge } from "@ensotek/shared-ui/admin/ui/badge";
import { Button } from "@ensotek/shared-ui/admin/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useListNotificationsQuery, useMarkAllReadMutation } from "@/integrations/hooks";
import { useAdminT } from "@/app/(main)/admin/_components/common/useAdminT";
import { cn } from "@/lib/utils";

export function AdminNotificationsBell() {
  const t = useAdminT();
  const { data: items = [], refetch } = useListNotificationsQuery({
    limit: 5,
    is_read: 0,
  });

  const [markAllRead] = useMarkAllReadMutation();

  const unreadCount = items.filter(n => !n.is_read).length;

  const handleMarkAll = async () => {
    await markAllRead(undefined);
    refetch();
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] text-destructive-foreground"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0 shadow-2xl">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="font-semibold text-sm">Bildirimler</h3>
          {unreadCount > 0 && (
            <button 
              onClick={handleMarkAll}
              className="text-[11px] text-primary hover:underline"
            >
              Hepsini okundu işaretle
            </button>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto">
          {items.length === 0 ? (
            <div className="px-4 py-8 text-center text-muted-foreground text-sm">
              Yeni bildirim yok.
            </div>
          ) : (
            <div className="flex flex-col">
              {items.map((item) => (
                <Link
                  key={item.id}
                  href={`/admin/notifications/${item.id}`}
                  className="flex flex-col gap-1 border-b px-4 py-3 transition-colors hover:bg-muted/50 last:border-0"
                >
                  <p className="font-medium text-xs leading-none">{item.title}</p>
                  <p className="line-clamp-2 text-muted-foreground text-xs">{item.message}</p>
                  <p className="mt-1 text-[10px] text-muted-foreground opacity-60">
                    {new Date(item.created_at).toLocaleDateString()}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
        <div className="border-t p-2">
          <Link href="/admin/notifications">
            <Button variant="ghost" className="w-full justify-center text-xs" size="sm">
              Tüm bildirimleri gör
            </Button>
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
