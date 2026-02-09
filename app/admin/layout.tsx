import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="admin-wrapper bg-black">
      {/* You can add an admin-specific navbar here later if you want */}
      {children}
    </section>
  );
}