import { getSettings } from "@/lib/settings";
import { MessagingManager } from "@/components/admin/MessagingManager";

export const dynamic = "force-dynamic";

export default async function AdminMessagingPage() {
  const settings = await getSettings();
  return <MessagingManager initial={settings} />;
}
