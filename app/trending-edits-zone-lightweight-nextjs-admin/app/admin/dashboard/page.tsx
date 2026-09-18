import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import AdminDashboard from "./ui";

export default async function DashboardPage() {
  if (!(await getSession())) redirect("/admin/login");
  return <AdminDashboard />;
}
