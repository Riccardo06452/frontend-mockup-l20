import { NavLink, Outlet, useLocation } from "react-router-dom";
import "./__layout.scss";

function Layout() {
  const location = useLocation();

  function renderTitle() {
    if (location.pathname.includes("analysis")) {
      return "Analysis Dashboard";
    } else if (location.pathname.includes("chat")) {
      return "Chat Dashboard";
    }
  }

  function chartIcon() {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z"
        />
      </svg>
    );
  }

  function chatIcon() {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="size-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
        />
      </svg>
    );
  }

  return (
    <div className="layout">
      <div className="sidebar">
        <div className="logo">My App</div>
        <div className="link-list">
          <NavLink
            to="/analysis/dashboard"
            className={({ isActive }) => `link ${isActive ? "selected" : ""}`}
          >
            <i>{chartIcon()}</i> Analysis Dashboard
          </NavLink>
          <NavLink
            to="/chat/dashboard"
            className={({ isActive }) => `link ${isActive ? "selected" : ""}`}
          >
            <i>{chatIcon()}</i> Chat Dashboard
          </NavLink>
        </div>
        <div className="logout">logout</div>
      </div>
      <div className="main-content">
        <div className="navbar">
          <div className="title">{renderTitle()}</div>
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
