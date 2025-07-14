'use client';

import { useUserStore } from "@/store/userStore";
import { usePreferencesStore } from "@/store/preferencesStore";

export default function SettingsPage() {
  const user = useUserStore((s) => s.user);
  const preferences = usePreferencesStore((s) => s.preferences);
  console.log("[SettingsPage] User:", user);
  console.log("[SettingsPage] Preferences:", preferences);
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <p>Manage your account settings here.</p>
      {/* Add more settings content here */}
    </div>
  );
}