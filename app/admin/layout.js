import AdminShell from "./AdminShell";

export const metadata = {
  title: "Admin Panel"
};

export default function AdminLayout({ children }) {
  return <AdminShell>{children}</AdminShell>;
}
