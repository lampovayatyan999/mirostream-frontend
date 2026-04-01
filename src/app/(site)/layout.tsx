import Header from "@/src/components/layout/header/Header";
import { PropsWithChildren } from "react";
import "@/src/styles/globals.css"
import { Sidebar } from "@/src/components/layout/sidebar/Sidebar";
import { LayoutContainer } from "@/src/components/layout/LayoutContainer";

export default function SiteLayout({ children }: PropsWithChildren<unknown>) {
  return (
    <div className="flex min-h-screen flex-col bg-(--background) text-(--foreground)">
      <header className="fixed inset-x-0 top-0 z-50 h-18.75 w-full bg-(--card) border-b border-(--border)">
        <Header />
      </header>
      <Sidebar />
      <LayoutContainer> 
            {children}
      </LayoutContainer>
    </div>
  );
}