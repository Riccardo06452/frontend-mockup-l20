import React, { useEffect } from "react";
import "./dashboard.scss";
import { useNavigate } from "react-router-dom";
import useChatDashboardStore from "../../stores/useChatDashboardStore";

function ChatDashboard() {
  const navigate = useNavigate();

  const { loadedChatsHistory, loadAllChatsHistory } = useChatDashboardStore();

  useEffect(() => {
    loadAllChatsHistory();
  }, [loadAllChatsHistory]);

  const open_chat = (id) => {
    navigate(`/chat/${id}`);
  };

  return (
    <div className="dashboard-container">
      <div className="title">Storico Chat</div>
      <div className="scrollable-table">
        <table>
          <thead>
            <tr>
              <th>Chat ID</th>
              <th>Data</th>
              <th>Total messages</th>
              <th>Report messages</th>
              <th>Analysis ID</th>
              <th>Analysis range date</th>
              <th>Analysis description</th>
            </tr>
          </thead>
          <tbody>
            {loadedChatsHistory != null &&
              loadedChatsHistory.map((chat) => (
                <tr key={chat.id} onClick={() => open_chat(chat.id)}>
                  <td>{chat.id}</td>
                  <td>{chat.created_at}</td>
                  <td>{chat.total_messages}</td>
                  <td>{chat.report_messages}</td>
                  <td>{chat.analysis_id}</td>
                  <td>{chat.analysis_range_date}</td>
                  <td>{chat.analysis_description}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ChatDashboard;
