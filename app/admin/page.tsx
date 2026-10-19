import { redirect } from "next/navigation";
import { getAuthenticatedAdmin } from "@/lib/auth";
import { getPortfolioContent } from "@/lib/portfolio-data";
import AdminDashboardClient from "@/components/admin/AdminDashboardClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Admin Dashboard | Portfolio",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminPage() {
  // Enforce server-side authentication
  const auth = await getAuthenticatedAdmin();
  if (!auth.authenticated || !auth.username) {
    redirect("/admin/login");
  }

  // Load persistent content directly on server
  const content = getPortfolioContent();

  return (
    <AdminDashboardClient
      initialContent={content}
      username={auth.username}
    />
  );
}
