import { useMemo, useState } from "react";

import {
  LayoutDashboard,
  UserRound,
  BriefcaseBusiness,
  FileText,
  BrainCircuit,
  Video,
  Bot,
  Send,
  Settings,
  X,
  Sparkles,
  ChevronDown,
  LogOut,
  User,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

import {
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";

import useAuthStore from "../../features/auth/store/auth.store";
import useAuth from "../../features/auth/hooks/useAuth";

import SkillioLogo from "../SkillioLogo";
import SkillioIcon from "../SkillioIcon";


/* =========================================================
   NAVIGATION
========================================================= */

const navigation = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Career Profile",
    path: "/career-profile",
    icon: UserRound,
  },
  {
    name: "Job Workspaces",
    path: "/job-workspaces",
    icon: BriefcaseBusiness,
  },
  {
    name: "Resumes",
    path: "/resumes",
    icon: FileText,
  },
  {
    name: "Preparation",
    path: "/preparation",
    icon: BrainCircuit,
  },
  {
    name: "Interviews",
    path: "/interviews",
    icon: Video,
  },
  {
    name: "Career Coach",
    path: "/career-coach",
    icon: Bot,
    online: true,
  },
  {
    name: "Applications",
    path: "/applications",
    icon: Send,
  },
];


/* =========================================================
   SIDEBAR
========================================================= */

export default function AppSidebar({
  mobileOpen,
  setMobileOpen,
  collapsed,
  setCollapsed,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const user = useAuthStore(
    (state) => state.user
  );

  const { logout } = useAuth();


  /* =====================================================
     USER INFORMATION
  ===================================================== */

  const userName = useMemo(() => {
    if (user?.name) {
      return user.name;
    }

    if (user?.firstName) {
      return `${user.firstName} ${user.lastName || ""}`.trim();
    }

    if (user?.email) {
      return user.email.split("@")[0];
    }

    return "Skillio User";
  }, [user]);


  const userEmail = user?.email || "Welcome to Skillio";

  const avatar = user?.avatar || null;


  const initials = useMemo(() => {
    return userName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) =>
        word.charAt(0).toUpperCase()
      )
      .join("");
  }, [userName]);


  /* =====================================================
     NAVIGATION HELPERS
  ===================================================== */

  const isNavigationActive = (path) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard";
    }

    return (
      location.pathname === path ||
      location.pathname.startsWith(`${path}/`)
    );
  };


  const closeMobileSidebar = () => {
    setMobileOpen(false);
  };


  const handleNavigation = () => {
    setUserMenuOpen(false);
    closeMobileSidebar();
  };


  const toggleCollapsed = () => {
    setCollapsed((previous) => !previous);
    setUserMenuOpen(false);
  };


  /* =====================================================
     LOGOUT
  ===================================================== */

  const handleLogout = async () => {
    try {
      await logout();

      setUserMenuOpen(false);
      closeMobileSidebar();

      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };


  /* =====================================================
     AVATAR
  ===================================================== */

  const UserAvatar = ({
    size = "md",
  }) => {
    const sizes = {
      sm: "h-8 w-8 text-[10px]",
      md: "h-9 w-9 text-xs",
      lg: "h-10 w-10 text-sm",
    };

    return (
      <div
        className={`
                    ${sizes[size]}

                    relative
                    shrink-0
                    overflow-hidden
                    rounded-full

                    bg-[var(--primary-fixed)]

                    font-bold
                    text-[var(--on-primary-fixed)]
                `}
      >
        {avatar ? (
          <img
            src={avatar}
            alt={userName}
            className="
                            h-full
                            w-full
                            object-cover
                        "
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div
            className="
                            flex
                            h-full
                            w-full
                            items-center
                            justify-center
                        "
          >
            {initials || "SU"}
          </div>
        )}
      </div>
    );
  };


  return (
    <>
      {/* =====================================================
                MOBILE BACKDROP
            ===================================================== */}

      <div
        onClick={closeMobileSidebar}
        className={`
                    fixed
                    inset-0
                    z-40

                    bg-black/30
                    backdrop-blur-[2px]

                    transition-opacity
                    duration-300

                    lg:hidden

                    ${mobileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
          }
                `}
      />


      {/* =====================================================
                SIDEBAR
            ===================================================== */}

      <aside
        className={`
                    fixed
                    inset-y-0
                    left-0
                    z-50

                    flex
                    flex-col

                    border-r
                    border-[var(--outline-variant)]/60

                    bg-[var(--surface)]

                    transition-[width,transform]
                    duration-300
                    ease-out

                    ${collapsed
            ? "lg:w-[76px]"
            : "lg:w-[264px]"
          }

                    w-[280px]

                    ${mobileOpen
            ? "translate-x-0"
            : "-translate-x-full"
          }

                    lg:translate-x-0

                    shadow-[0_20px_60px_rgba(0,0,0,0.10)]

                    lg:shadow-none
                `}
      >
        <div
          className="
                        flex
                        h-full
                        min-h-0
                        flex-col
                    "
        >

          {/* =================================================
                        TOP / BRAND
                    ================================================= */}

          <div
            className={`
                            flex
                            h-[68px]
                            shrink-0
                            items-center

                            border-b
                            border-[var(--outline-variant)]/50

                            ${collapsed
                ? "justify-center px-3"
                : "justify-between px-4"
              }
                        `}
          >

            {/* BRAND */}

            <NavLink
              to="/dashboard"
              onClick={handleNavigation}
              aria-label="Skillio Dashboard"
              className="
                                flex
                                min-w-0
                                items-center
                                justify-center
                            "
            >
              {/* Desktop expanded logo */}

              <div
                className={`
                                    transition-all
                                    duration-200

                                    ${collapsed
                    ? "hidden"
                    : "block"
                  }
                                `}
              >
                <SkillioLogo
                  color="var(--primary)"
                  size={128}
                  className="
                                        block
                                        h-auto
                                        max-w-[128px]
                                    "
                />
              </div>


              {/* Desktop collapsed icon */}

              <div
                className={`
                                    transition-all
                                    duration-200

                                    ${collapsed
                    ? "block"
                    : "hidden"
                  }
                                `}
              >
                <SkillioIcon
                  color="var(--primary)"
                  size={39}
                />
              </div>
            </NavLink>


            {/* DESKTOP COLLAPSE */}

            <button
              type="button"
              onClick={toggleCollapsed}
              aria-label={
                collapsed
                  ? "Expand sidebar"
                  : "Collapse sidebar"
              }
              title={
                collapsed
                  ? "Expand sidebar"
                  : "Collapse sidebar"
              }
              className="
                                hidden

                                h-9
                                w-9

                                shrink-0

                                items-center
                                justify-center

                                rounded-lg

                                text-[var(--on-surface-variant)]/65

                                transition-colors

                                hover:bg-[var(--surface-container)]
                                hover:text-[var(--on-surface)]

                                lg:flex
                            "
            >
              {collapsed ? (
                <PanelLeftOpen
                  size={18}
                  strokeWidth={2}
                />
              ) : (
                <PanelLeftClose
                  size={18}
                  strokeWidth={2}
                />
              )}
            </button>


            {/* MOBILE CLOSE */}

            <button
              type="button"
              onClick={closeMobileSidebar}
              aria-label="Close navigation"
              className="
                                flex

                                h-9
                                w-9

                                shrink-0

                                items-center
                                justify-center

                                rounded-lg

                                text-[var(--on-surface-variant)]/65

                                transition-colors

                                hover:bg-[var(--surface-container)]
                                hover:text-[var(--on-surface)]

                                lg:hidden
                            "
            >
              <X size={19} />
            </button>

          </div>


          {/* =================================================
                        NAVIGATION
                    ================================================= */}

          <nav
            className="
                            min-h-0
                            flex-1

                            overflow-y-auto
                            overflow-x-hidden

                            px-3
                            py-5

                            [scrollbar-width:thin]
                        "
          >

            {/* WORKSPACE LABEL */}

            {!collapsed && (
              <div className="mb-2 px-2">
                <span
                  className="
                                        text-[10px]
                                        font-bold
                                        uppercase
                                        tracking-[0.15em]

                                        text-[var(--on-surface-variant)]/45
                                    "
                >
                  Workspace
                </span>
              </div>
            )}


            {/* NAVIGATION ITEMS */}

            <div className="space-y-1">

              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive =
                  isNavigationActive(item.path);

                return (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    onClick={handleNavigation}
                    title={
                      collapsed
                        ? item.name
                        : undefined
                    }
                    className={`
                                                      group
          relative

          flex
          h-11
          w-full
          items-center

          rounded-md

          text-sm
          font-semibold

          transition-all
          duration-200F

                                            ${collapsed
                        ? "justify-center"
                        : "gap-3"
                      }

                                            px-3

                                            text-sm
                                            font-medium

                                            transition-all
                                            duration-200

                                            ${isActive
                        ? `
                                                        bg-[var(--primary-fixed)]
                text-[var(--on-primary-fixed)]
                shadow-[var(--shadow-sm)]
                                                      `
                        : `
                                                                        text-[var(--on-surface-variant)]
                hover:bg-[var(--surface-container)]
                hover:text-[var(--on-surface)]
                                                      `
                      }
                                        `}
                  >

                    {/* ACTIVE BAR */}

                    {isActive && (
                      <span
                        className="
                                                    absolute
                                                    left-0

                                                    h-6
                                                    w-[3px]

                                                    rounded-r-full

                                                    bg-[var(--primary)]
                                                "
                      />
                    )}


                    {/* ICON */}

                    <Icon
                      size={19}
                      strokeWidth={
                        isActive
                          ? 2.2
                          : 1.9
                      }
                      className={`
                                                shrink-0

                                                transition-colors

                                                ${isActive
                          ? "text-[var(--primary)]"
                          : "text-[var(--on-surface-variant)]/65 group-hover:text-[var(--primary)]"
                        }
                                            `}
                    />


                    {/* LABEL */}

                    {!collapsed && (
                      <>
                        <span
                          className="
                                                        min-w-0
                                                        flex-1
                                                        truncate
                                                    "
                        >
                          {item.name}
                        </span>


                        {/* ONLINE STATUS */}

                        {item.online && (
                          <span
                            className="
                                                            relative
                                                            flex
                                                            h-2
                                                            w-2
                                                            shrink-0
                                                        "
                          >
                            <span
                              className="
                                                                absolute
                                                                inset-0

                                                                animate-ping

                                                                rounded-full

                                                                bg-emerald-400

                                                                opacity-60
                                                            "
                            />

                            <span
                              className="
                                                                relative

                                                                h-2
                                                                w-2

                                                                rounded-full

                                                                bg-emerald-500
                                                            "
                            />
                          </span>
                        )}
                      </>
                    )}

                  </NavLink>
                );
              })}

            </div>


            {/* =================================================
                            ACCOUNT
                        ================================================= */}

            <div
              className="
                                my-5
                                border-t
                                border-[var(--outline-variant)]/50
                            "
            />

            {!collapsed && (
              <div className="mb-2 px-2">
                <span
                  className="
                                        text-[10px]
                                        font-bold
                                        uppercase
                                        tracking-[0.15em]

                                        text-[var(--on-surface-variant)]/45
                                    "
                >
                  Account
                </span>
              </div>
            )}


            {/* SETTINGS */}

            <NavLink
              to="/settings"
              onClick={handleNavigation}
              title={
                collapsed
                  ? "Settings"
                  : undefined
              }
              className={`
          group
          relative

          flex
          h-11
          w-full
          items-center

          rounded-md

          text-sm
          font-semibold

          transition-all
          duration-200

                                ${collapsed
                  ? "justify-center"
                  : "gap-3"
                }

                                px-3

                                text-sm
                                font-medium

                                transition-all

                                ${isNavigationActive("/settings")
                  ? `
                                                            bg-[var(--primary-fixed)]

                text-[var(--on-primary-fixed)]

                shadow-[var(--shadow-sm)]
                                          `
                  : `
                   text-[var(--on-surface-variant)]

                hover:bg-[var(--surface-container)]

                hover:text-[var(--on-surface)]
                                          `
                }
                            `}
            >

              {isNavigationActive("/settings") && (
                <span
                  className="
                                        absolute
                                        left-0

                                        h-6
                                        w-[3px]

                                        rounded-r-full

                                        bg-[var(--primary)]
                                    "
                />
              )}

              <Settings
                size={19}
                strokeWidth={2}
                className={`
                                    shrink-0

                                    ${isNavigationActive("/settings")
                    ? "text-[var(--primary)]"
                    : "text-[var(--on-surface-variant)]/65 group-hover:text-[var(--primary)]"
                  }
                                `}
              />

              {!collapsed && (
                <span>
                  Settings
                </span>
              )}

            </NavLink>

          </nav>


          {/* =================================================
                        BOTTOM SECTION
                    ================================================= */}

          <div
            className="
                            shrink-0

                            border-t
                            border-[var(--outline-variant)]/50

                            p-3
                        "
          >

            {/* =================================================
                            CAREER COACH
                        ================================================= */}

            <NavLink
              to="/career-coach"
              onClick={handleNavigation}
              title={
                collapsed
                  ? "Ask Career Coach"
                  : undefined
              }
              className={`
                                flex
                                h-11
                                w-full
                                items-center

                                rounded-xl

                                bg-[var(--primary)]

                                font-semibold
                                text-[var(--on-primary)]

                                shadow-[0_8px_20px_rgba(58,83,53,0.14)]

                                transition-all

                                hover:-translate-y-[1px]
                                hover:shadow-[0_10px_24px_rgba(58,83,53,0.20)]

                                active:translate-y-0

                                ${collapsed
                  ? "justify-center"
                  : "justify-center gap-2"
                }
                            `}
            >
              <Sparkles
                size={17}
                strokeWidth={2.2}
                className="text-[var(--on-primary)]"
              />

              {!collapsed && (
                <span className="text-[var(--on-primary)]">
                  Ask Career Coach
                </span>
              )}
            </NavLink>


            {/* =================================================
                            USER AREA
                        ================================================= */}

            <div className="relative mt-3">

              {/* USER MENU */}

              {userMenuOpen && (
                <div
                  className={`
                                        absolute
                                        bottom-full

                                        mb-2

                                        w-[230px]

                                        overflow-hidden

                                        rounded-2xl

                                        border
                                        border-[var(--outline-variant)]

                                        bg-[var(--surface-container-lowest)]

                                        p-1.5

                                        shadow-[0_16px_45px_rgba(0,0,0,0.15)]

                                        ${collapsed
                      ? "left-0"
                      : "left-0 right-0 w-auto"
                    }
                                    `}
                >

                  {/* PROFILE */}

                  <button
                    type="button"
                    onClick={() => {
                      navigate("/career-profile");
                      setUserMenuOpen(false);
                      closeMobileSidebar();
                    }}
                    className="
                                            flex
                                            w-full
                                            items-center
                                            gap-3

                                            rounded-xl

                                            px-3
                                            py-2.5

                                            text-sm
                                            font-medium

                                            text-[var(--on-surface-variant)]

                                            transition

                                            hover:bg-[var(--surface-container)]
                                            hover:text-[var(--on-surface)]
                                        "
                  >
                    <User size={16} />
                    Career Profile
                  </button>


                  {/* SETTINGS */}

                  <button
                    type="button"
                    onClick={() => {
                      navigate("/settings");
                      setUserMenuOpen(false);
                      closeMobileSidebar();
                    }}
                    className="
                                            flex
                                            w-full
                                            items-center
                                            gap-3

                                            rounded-xl

                                            px-3
                                            py-2.5

                                            text-sm
                                            font-medium

                                            text-[var(--on-surface-variant)]

                                            transition

                                            hover:bg-[var(--surface-container)]
                                            hover:text-[var(--on-surface)]
                                        "
                  >
                    <Settings size={16} />
                    Settings
                  </button>


                  {/* DIVIDER */}

                  <div
                    className="
                                            my-1.5

                                            border-t
                                            border-[var(--outline-variant)]/50
                                        "
                  />


                  {/* LOGOUT */}

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="
                                            flex
                                            w-full
                                            items-center
                                            gap-3

                                            rounded-xl

                                            px-3
                                            py-2.5

                                            text-sm
                                            font-semibold

                                            text-[var(--error)]

                                            transition

                                            hover:bg-[var(--error-container)]
                                        "
                  >
                    <LogOut size={16} />
                    Logout
                  </button>

                </div>
              )}


              {/* USER BUTTON */}

              <button
                type="button"
                onClick={() =>
                  setUserMenuOpen(
                    (previous) => !previous
                  )
                }
                title={
                  collapsed
                    ? userName
                    : undefined
                }
                className={`
                                    flex
                                    w-full
                                    items-center

                                    rounded-xl

                                    border
                                    border-[var(--outline-variant)]/60

                                    bg-[var(--surface-container-lowest)]

                                    transition-all

                                    hover:border-[var(--outline)]
                                    hover:bg-[var(--surface-container)]

                                    ${collapsed
                    ? "justify-center p-2"
                    : "gap-3 p-2"
                  }
                                `}
              >

                <UserAvatar size="md" />


                {!collapsed && (
                  <>
                    <div
                      className="
                                                min-w-0
                                                flex-1
                                                text-left
                                            "
                    >
                      <p
                        className="
                                                    truncate

                                                    text-xs
                                                    font-bold

                                                    text-[var(--on-surface)]
                                                "
                      >
                        {userName}
                      </p>

                      <p
                        className="
                                                    mt-0.5
                                                    truncate

                                                    text-[10px]

                                                    text-[var(--on-surface-variant)]/65
                                                "
                      >
                        {userEmail}
                      </p>
                    </div>


                    <ChevronDown
                      size={16}
                      className={`
                                                shrink-0

                                                text-[var(--on-surface-variant)]/60

                                                transition-transform

                                                ${userMenuOpen
                          ? "rotate-180"
                          : ""
                        }
                                            `}
                    />
                  </>
                )}

              </button>

            </div>

          </div>

        </div>
      </aside>
    </>
  );
}