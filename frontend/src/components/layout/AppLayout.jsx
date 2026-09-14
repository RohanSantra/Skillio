import { useState } from "react";
import { Outlet } from "react-router-dom";

import AppSidebar from "./AppSidebar";
import AppHeader from "./AppHeader";

export default function AppLayout() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);

    const sidebarWidth = collapsed ? "76px" : "264px";

    return (
        <div
            className="
                min-h-screen
                bg-[var(--background)]
                text-[var(--on-surface)]
            "
            style={{
                "--sidebar-width": sidebarWidth,
            }}
        >
            {/* Sidebar */}
            <AppSidebar
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
                collapsed={collapsed}
                setCollapsed={setCollapsed}
            />

            {/* Main application */}
            <div
                className="
                    min-h-screen

                    lg:pl-[var(--sidebar-width)]

                    transition-[padding-left]
                    duration-300
                    ease-out
                "
            >
                <AppHeader
                    setMobileOpen={setMobileOpen}
                />

                <main
                    className="
                        min-h-[calc(100vh-68px)]
                        w-full
                    "
                >
                    <div
                        className="
                            mx-auto
                            w-full
                            max-w-[1800px]
                        "
                    >
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}