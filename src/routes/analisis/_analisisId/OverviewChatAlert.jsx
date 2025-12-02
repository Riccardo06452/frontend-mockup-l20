import { useNavigate } from "react-router-dom";
import useAnalysisOverview from "../../../stores/useAnalysisOverview";
import useChatDashboardStore from "../../../stores/useChatDashboardStore";

function OverviewChatAlert({ setShowChatTable, setShowOpenChatMenu }) {
  const { loadedChatsHistory } = useChatDashboardStore();
  const { analysisId } = useAnalysisOverview();
  const navigate = useNavigate();
  return (
    <div
      className="overlay"
      onClick={(e) => {
        if (e.target.className === "overlay") {
          setShowOpenChatMenu(false);
        }
      }}
    >
      <div className="open-chat-menu">
        <p>
          Attention: <b>{loadedChatsHistory.length}</b> chats already existing
          for this analysis.
        </p>
        <div className="buttons-section">
          <button
            className="secondary no-wrap"
            onClick={() =>
              navigate(
                `/chat/${analysisId}_` + Math.floor(Math.random() * 10000)
              )
            }
          >
            Create New Chat
          </button>
          <button
            className="secondary no-wrap"
            onClick={() => navigate(`/chat/${loadedChatsHistory[0].id}`)}
          >
            Open Last Chat
          </button>
          <button
            className="secondary no-wrap"
            onClick={() => {
              setShowChatTable(true);
              setShowOpenChatMenu(false);
            }}
          >
            Show Chats List
          </button>
        </div>
      </div>
    </div>
  );
}

export default OverviewChatAlert;
