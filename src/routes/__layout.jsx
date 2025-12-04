import { NavLink, Outlet, useLocation } from "react-router-dom";
import "./__layout.scss";
import { useState, useEffect } from "react";
import {
  Bars3Icon,
  ChartBarIcon,
  ChatBubbleLeftIcon,
  ChevronDoubleLeftIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

function Layout() {
  const location = useLocation();
  const [isSidebarForcedOpen, setIsSidebarForcedOpen] = useState(false);
  const [isSidebarForcedClosed, setIsSidebarForcedClosed] = useState(false);
  const [isTabletWidth, setIsTabletWidth] = useState(false);
  const MOBILE_WIDTH = 550;
  const TABLET_WIDTH = 1024;
  function renderTitle() {
    if (location.pathname.includes("analysis")) {
      return "Analysis Dashboard";
    } else if (location.pathname.includes("chat")) {
      return "Chat Dashboard";
    }
  }

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= TABLET_WIDTH) {
        setIsTabletWidth(true);
      } else {
        setIsTabletWidth(false);
      }
    };
    handleResize(); // Initial check

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setIsTabletWidth]);

  return (
    <div className="layout">
      <div
        className={
          (!isSidebarForcedClosed || isTabletWidth) &&
          (isSidebarForcedOpen || !isTabletWidth)
            ? "sidebar open"
            : "sidebar closed"
        }
      >
        <div className="logo">
          My App
          <ChevronDoubleLeftIcon
            className="icon large clickable right"
            onClick={() => {
              if (isTabletWidth) {
                setIsSidebarForcedOpen(false);
              } else {
                console.log("chiudo la sidebar");
                setIsSidebarForcedClosed(true);
              }
            }}
          />
        </div>
        <div className="link-list">
          <NavLink
            to="/analysis/dashboard"
            className={({ isActive }) => `link ${isActive ? "selected" : ""}`}
          >
            <ChartBarIcon /> Analysis Dashboard
          </NavLink>
          <NavLink
            to="/chat/dashboard"
            className={({ isActive }) => `link ${isActive ? "selected" : ""}`}
          >
            <ChatBubbleLeftIcon /> Chat Dashboard
          </NavLink>
        </div>
        <div className="logout">logout</div>
      </div>
      <div
        className={
          isSidebarForcedClosed ? "main-content expanded" : "main-content"
        }
      >
        <div className="navbar">
          {(isTabletWidth || isSidebarForcedClosed) && (
            <div>
              <Bars3Icon
                className="icon large clickable"
                onClick={() =>
                  isTabletWidth
                    ? setIsSidebarForcedOpen(true)
                    : setIsSidebarForcedClosed(false)
                }
              />
            </div>
          )}
          <div
            className={
              isSidebarForcedClosed && !isTabletWidth
                ? "title centered"
                : isTabletWidth
                ? "title small"
                : "title"
            }
          >
            {renderTitle()}
          </div>

          <div className="user">
            <div className="generics">
              <div className="name">John Doe</div>
              <div className="role">Admin</div>
            </div>
            <div className="avatar">JD</div>
          </div>
        </div>
        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;
