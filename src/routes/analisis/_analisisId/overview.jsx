import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./overview.scss";
import useAnalysisDashboardStore from "../../../stores/useAnalysisDashboardStore";
import useChatDashboardStore from "../../../stores/useChatDashboardStore";

function AnalysisOverview() {
  const { analysisId } = useParams();
  const navigate = useNavigate();
  const [currentData, setCurrentData] = React.useState(null);
  const {
    data,
    fetchData,
    selected_analysis_data,
    fetchDataFromAnalysisId,
    createExcelFileForDataset,
  } = useAnalysisDashboardStore();
  const { loadChatsHistoryByAnalysisId, loadedChatsHistory } =
    useChatDashboardStore();

  const [showChatTable, setShowChatTable] = React.useState(false);
  const [showOpenChatMenu, setShowOpenChatMenu] = React.useState(false);
  const isReady = analysisId.startsWith("1"); // Simulazione dello stato di prontezza

  useEffect(() => {
    if (data && analysisId) {
      if (data.length === 0) {
        console.log("Data is empty.");
        fetchData();
        return;
      }
      console.log("Data and analysisId are available:", data, analysisId);

      const filteredData = data.filter(
        (item) => item.id.toString() === analysisId
      );
      if (filteredData.length > 0) {
        setCurrentData(filteredData[0]);
      }
    } else {
      console.log("Data or analysisId is not available yet.");
    }
  }, [fetchData, setCurrentData, analysisId, data]);

  const open_chat = (id) => {
    navigate(`/chat/${id}`);
  };

  const openNewChat = () => {
    if (loadedChatsHistory == null || loadedChatsHistory.length === 0) {
      navigate(`/chat/${analysisId}_` + Math.floor(Math.random() * 10000));
    } else {
      setShowOpenChatMenu(true);
    }
  };

  useEffect(() => {
    fetchDataFromAnalysisId(analysisId);
    loadChatsHistoryByAnalysisId(analysisId);
  }, [analysisId, loadChatsHistoryByAnalysisId, fetchDataFromAnalysisId]);

  return (
    <div className="overview-page">
      {showOpenChatMenu && (
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
              Attention: <b>{loadedChatsHistory.length}</b> chats already
              existing for this analysis.
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
      )}
      <button
        className="secondary small"
        onClick={() => navigate("/analysis/dashboard")}
      >
        {"< Dashboard"}
      </button>
      <div className="data-area">
        {currentData && (
          <div className="scrollable-table">
            <table>
              <thead>
                <tr>
                  <th>id</th>
                  <th>creato il</th>
                  <th>range date</th>
                  <th>sito</th>
                  <th>PN</th>
                  <th>Categoria NC</th>
                  <th>Stato</th>
                  <th>Num Record</th>
                  <th>Num Categorie</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{currentData.id}</td>
                  <td>{currentData.created_at}</td>
                  <td>{currentData.range_date}</td>
                  <td>{currentData.site}</td>
                  <td>{currentData.part_numbers.join(", ")}</td>
                  <td>{currentData.nc_category}</td>
                  <td>{currentData.status}</td>
                  <td>{currentData.num_records}</td>
                  <td>{currentData.num_categories}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
        <div className="ai-description">
          <div className="title">Descrizione Generata dall'AI</div>
          <div className="text">
            {(selected_analysis_data && selected_analysis_data.description) ||
              "No description available for this analysis. Waiting for AI generation..."}
          </div>
        </div>

        {isReady &&
        selected_analysis_data != null &&
        selected_analysis_data.dataset != null &&
        selected_analysis_data.dataset.length > 0 ? (
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
                    <th>Categoria</th>
                    <th>Sottocategoria</th>
                    <th>Descrizione</th>
                  </tr>
                </thead>
                <tbody>
                  {selected_analysis_data.dataset.map((record) => (
                    <tr key={record.id}>
                      <td>{record.id}</td>
                      <td>{record.date}</td>
                      <td>
                        {
                          currentData.part_numbers[
                            Math.floor(
                              Math.random() * currentData.part_numbers.length
                            )
                          ]
                        }
                      </td>
                      <td>{currentData.site}</td>
                      <td>{record.category}</td>
                      <td>{record.sub_category}</td>
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
                  {showChatTable
                    ? "Mostra Dataset Esteso"
                    : "Mostra Storico Chat"}
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="loading-indicator">Elaborazione in corso...</div>
        )}
      </div>
      {isReady && (
        <div className="actions-buttons">
          <button
            className="primary no-wrap"
            onClick={() =>
              createExcelFileForDataset(
                selected_analysis_data.dataset,
                analysisId
              )
            }
          >
            Download Dataset
          </button>
          <button
            className="primary no-wrap"
            onClick={() => navigate(`/analysis/${analysisId}/delete`)}
          >
            Genera QA Matrix
          </button>
          <button className="primary no-wrap" onClick={openNewChat}>
            Conversational BI
          </button>
        </div>
      )}
    </div>
  );
}

export default AnalysisOverview;
