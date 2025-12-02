import { useNavigate } from "react-router-dom";
import useAnalysisOverview from "../../../stores/useAnalysisOverview";
import useChatDashboardStore from "../../../stores/useChatDashboardStore";

function OverviewMainTables({ showChatTable, setShowChatTable }) {
  const navigate = useNavigate();
  const { data, dataset, selectedCategory } = useAnalysisOverview();
  const { loadedChatsHistory } = useChatDashboardStore();
  const open_chat = (id) => {
    navigate(`/chat/${id}`);
  };

  return (
    <div
      className={
        showChatTable ? "dataset-area show-chat-table" : "dataset-area"
      }
    >
      <div className="table-area">
        <table className="dataset">
          <thead>
            <tr>
              <th>ID</th>
              <th>Data</th>
              <th>Part Number</th>
              <th>Site</th>
              <th className="center">Categoria</th>
              <th className="center">Categoria Padre</th>
              <th>Descrizione</th>
            </tr>
          </thead>
          <tbody>
            {dataset
              .filter(
                (record) =>
                  selectedCategory === "" ||
                  record.category === selectedCategory
              )
              .map((record) => (
                <tr key={record.id}>
                  <td>{record.id}</td>
                  <td>{record.date}</td>
                  <td>{record.part_number}</td>
                  <td>{data.site}</td>
                  <td>
                    <div>{record.category}</div>
                  </td>
                  <td>
                    <div className="center">{record.parent_category}</div>
                  </td>
                  <td>{record.description}</td>
                </tr>
              ))}
          </tbody>
        </table>
        <table className="chat">
          <thead>
            <tr>
              <th>Chat ID</th>
              <th>Data</th>
              <th>Total messages</th>
              <th>Report messages</th>
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
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className="buttons">
        {!showChatTable && (
          <button className="secondary small">Filtra Dati</button>
        )}
        {loadedChatsHistory && loadedChatsHistory.length > 0 && (
          <button
            className="secondary small"
            onClick={() => setShowChatTable((state) => !state)}
          >
            {showChatTable ? "Mostra Dataset Esteso" : "Mostra Storico Chat"}
          </button>
        )}
      </div>
    </div>
  );
}

export default OverviewMainTables;
