import React, { useEffect } from "react";
import "./chat.scss";
import { toPng } from "html-to-image";
import { useParams } from "react-router-dom";
import useChatDashboardStore from "../../../stores/useChatDashboardStore";
import PieChartComponent from "../../../components/charts/PieChartComponent";
import pptxgen from "pptxgenjs";
import useAnalysisOverview from "../../../stores/useAnalysisOverview";
import ParetoChart from "../../../components/charts/ParetoChart";
import PNVolumeChart from "../../../components/charts/PNVolumeChart";
import GeneralAnalysisOverviewTable from "../../../components/generalAnalysisOverviewTable/generalAnalysisOverviewTable";
import useAnalysisDashboardStore from "../../../stores/useAnalysisDashboardStore";

function ChatPage() {
  const { chatId } = useParams();
  console.log("Chat ID:", chatId);
  const [userInput, setUserInput] = React.useState("");
  const chatEndRef = React.useRef(null);

  const {
    loadMessagesByChatId,
    currentChatMessages,
    sendMessageToProcess,
    sendMessageInProgress,
    toggleMessageInReport,
    toggleMessageInPromptGroup,
    loadSavedPromptsList,
    savedPromptsList,
    loadSavedPromptsMessages,
    loadedSavedPromptMessages,
    loadedSavedPromptId,
    useSavedPromptInCurrentChat,
    sendGroupMessageInProgress,
    saveNewPromptGroup,
    getChatDataById,
    loadedChatsHistory,
    loadAllChatsHistory,
    setIsCurrentChatPublic,
    is_current_chat_public,
  } = useChatDashboardStore();

  const {
    paretoCategoriesData,
    partNumberVolumes,
    fetchDataFromAnalysisId,
    setMockedCategories,
    setMockedData,
    data,
  } = useAnalysisOverview();

  const { fetchData, data: dashboardData } = useAnalysisDashboardStore();
  const [showSettings, setShowSettings] = React.useState("");
  const [promptsTitle, setPromptsTitle] = React.useState("");
  const [promptsDescription, setPromptsDescription] = React.useState("");
  const [promptsStatus, setPromptsStatus] = React.useState("private");
  const [showPublishPopup, setShowPublishPopup] = React.useState(false);
  const [isReportGoodEnough, setIsReportGoodEnough] = React.useState(false);
  const charts = React.useRef({});
  const default_charts = React.useRef({});

  useEffect(() => {
    if (dashboardData == null || dashboardData.length === 0) {
      fetchData();
    }

    setMockedData(
      dashboardData.filter((analysis) => chatId.startsWith(analysis.id))[0]
    );

    loadAllChatsHistory();
    loadMessagesByChatId(chatId);
    loadSavedPromptsList();
  }, [
    chatId,
    loadMessagesByChatId,
    loadSavedPromptsList,
    loadAllChatsHistory,
    setMockedData,
    fetchData,
    dashboardData,
  ]);

  useEffect(() => {
    if (loadedChatsHistory) {
      const chat = getChatDataById(chatId);
      if (chat != null) {
        console.log("=======\n\n\n loaded chat: ", chat);
        const fakeDatasetWithCategories = [
          "OLED SCHERMO GUASTO",
          "OLED SOFTWARE GUASTO",
          "DIFETTI ESTETICI",
          "DIFETTI FUNZIONALI",
          "DIFETTI FUNZIONALI",
          "DIFETTI FUNZIONALI",
          "DIFETTI FUNZIONALI",
          "DIFETTI FUNZIONALI",
          "DIFETTI FUNZIONALI",
          "DIFETTI FUNZIONALI",
        ];
        setMockedCategories(
          fakeDatasetWithCategories.map((cat) => {
            return {
              name: cat,
              selected: true,
            };
          })
        );
        fetchDataFromAnalysisId(chat.analysis_id);
      }
    }
  }, [loadedChatsHistory, getChatDataById]);

  useEffect(() => {
    if (currentChatMessages && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentChatMessages, showSettings]);

  useEffect(() => {
    if (showSettings === "savedPrompts") {
      loadSavedPromptsList();
    }
  }, [showSettings, loadSavedPromptsList]);

  const sendMessage = () => {
    sendMessageToProcess(userInput);
    setUserInput("");
  };

  const handleSubmit = (event) => {
    if (event.key === "Enter" && event.ctrlKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const useSavedPrompt = () => {
    useSavedPromptInCurrentChat();
    setShowSettings("");
  };

  const downloadReport = async () => {
    console.log("Downloading report...");
    console.log(charts.current);
    console.log(default_charts.current);

    const pptx = new pptxgen();

    for (const [key, ref] of Object.entries(default_charts.current)) {
      if (!ref) continue; // il div potrebbe non essere montato ancora

      const slide = pptx.addSlide();
      slide.addText("Grafico: " + key, {
        x: 0.5,
        y: 0.5,
        w: 8,
        h: 1,
        fontSize: 14,
      });

      const img = await toPng(ref); // <-- ora ref è corretto
      slide.addImage({ data: img, x: 1, y: 1.5, w: 6, h: 4 });
    }

    for (const [index, message] of currentChatMessages.entries()) {
      if (message.addedToReport) {
        const slide = pptx.addSlide();
        slide.addText(message.content, {
          x: 0.5,
          y: 0.5,
          w: 8,
          h: 1,
          fontSize: 14,
        });

        if (message.sender === "bot" && message.chart_type != null) {
          console.log("Adding chart to slide...", index, charts.current[index]);

          const img = await toPng(charts.current[index]);
          slide.addImage({ data: img, x: 1, y: 1.5, w: 6, h: 4 });
        }
      }
    }

    await pptx.writeFile({ fileName: `Chat_Report_${chatId}.pptx` });
  };

  return (
    <div className="chat-page-container">
      {sendGroupMessageInProgress && (
        <div className="overlay">
          <p className="loading-prompt-message">
            Sending saved prompt messages to chat, please wait. Do not close
            this window or refresh the page.
          </p>
        </div>
      )}

      {showPublishPopup && (
        <div className="overlay ">
          <div className="publish-popup">
            {!is_current_chat_public ? (
              <>
                <h2>Publish Chat</h2>
                <p>
                  Before publishing a chat be sure that the report contains all
                  the necessary information and charts you want to share.
                  Therefor click on "Publish Chat" to make the chat available to
                  other users.
                </p>
                <div className="checkbox-area">
                  <input
                    type="checkbox"
                    id="confirm-consistency"
                    name="confirm-consistency"
                    value={isReportGoodEnough}
                    onChange={(e) => setIsReportGoodEnough(e.target.checked)}
                  />
                  <label htmlFor="confirm-consistency">
                    The report is good enough to be published
                  </label>
                </div>
                <div className="buttons">
                  <button
                    className="secondary"
                    onClick={() => {
                      setShowPublishPopup(false), setIsReportGoodEnough(false);
                    }}
                  >
                    Close
                  </button>
                  <button
                    className="secondary"
                    onClick={() => {
                      setShowPublishPopup(false);
                      setIsCurrentChatPublic(true);
                      setIsReportGoodEnough(false);
                    }}
                    disabled={!isReportGoodEnough}
                  >
                    Publish Chat
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2>Unpublish Chat</h2>
                <p>
                  Are you sure you want to unpublish this chat? Once
                  unpublished, it will no longer be accessible to other users
                  untill you publish it again.
                </p>
                <div className="checkbox-area">
                  <input
                    type="checkbox"
                    id="confirm-consistency"
                    name="confirm-consistency"
                    value={isReportGoodEnough}
                    onChange={(e) => setIsReportGoodEnough(e.target.checked)}
                  />
                  <label htmlFor="confirm-consistency">
                    I understand that unpublishing will restrict access to this
                    chat
                  </label>
                </div>
                <div className="buttons">
                  <button
                    className="secondary"
                    onClick={() => {
                      setShowPublishPopup(false);
                      setIsReportGoodEnough(false);
                    }}
                  >
                    Close
                  </button>
                  <button
                    className="secondary"
                    onClick={() => {
                      setShowPublishPopup(false);
                      setIsCurrentChatPublic(false);
                      setIsReportGoodEnough(false);
                    }}
                    disabled={!isReportGoodEnough}
                  >
                    Unpublish Chat
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {showSettings === "" && dashboardData && data && (
        <div className="scrollable-table">
          <GeneralAnalysisOverviewTable />
        </div>
      )}
      <div className="chat-area">
        {showSettings != "" ? (
          <div className="settings-panel">
            {showSettings === "report" ? (
              <div className="report-area">
                <h3>Report messages</h3>
                <div className="scrollable-area">
                  <div className="message report full-width-graph">
                    <div ref={(el) => (default_charts.current["pareto"] = el)}>
                      <ParetoChart data={paretoCategoriesData} />
                    </div>
                  </div>

                  <div className="message report full-width-graph">
                    <div ref={(el) => (default_charts.current["volumes"] = el)}>
                      <PNVolumeChart
                        positive={partNumberVolumes.success}
                        negative={partNumberVolumes.failures}
                      />
                    </div>
                  </div>

                  <div className="message report full-width-graph">
                    <div
                      ref={(el) =>
                        (default_charts.current["distribution"] = el)
                      }
                    >
                      <PieChartComponent
                        data={paretoCategoriesData.map((data) => ({
                          label: data.label,
                          value: data.value,
                          id: data.label,
                        }))}
                      />
                    </div>
                  </div>
                  {currentChatMessages.map((message, index) => {
                    if (message.sender === "bot" && message.addedToReport) {
                      return (
                        <div className="message report" key={index}>
                          {message.content}
                          {message.sender === "bot" &&
                            message.chart_type != null && (
                              <>
                                {message.chart_type === "pie" && (
                                  <div
                                    ref={(el) => (charts.current[index] = el)}
                                  >
                                    <PieChartComponent data={message.data} />
                                  </div>
                                )}
                              </>
                            )}
                          <div className="buttons-area">
                            <button
                              className="small bot-color "
                              onClick={() => toggleMessageInReport(index)}
                            >
                              Rimuovi dal report
                            </button>
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>
                <button
                  className="secondary full-width"
                  onClick={downloadReport}
                >
                  Crea Report
                </button>
              </div>
            ) : showSettings === "prompt" ? (
              <div className="prompt-area">
                <h3>Prompt messages</h3>
                <div className="split-view">
                  <div className="side form-section">
                    <label htmlFor="title">Prompt Title*</label>
                    <input
                      id="title"
                      type="text"
                      value={promptsTitle}
                      onChange={(e) => setPromptsTitle(e.target.value)}
                    />
                    <label htmlFor="description">Prompt Description*</label>
                    <input
                      id="description"
                      type="text"
                      value={promptsDescription}
                      onChange={(e) => setPromptsDescription(e.target.value)}
                    />
                    <label htmlFor="status">Visibility</label>
                    <select
                      name="status"
                      id="status"
                      value={promptsStatus}
                      onChange={(e) => setPromptsStatus(e.target.value)}
                    >
                      <option value="private">Private</option>
                      <option value="public">Public</option>
                    </select>
                  </div>
                  <div className="side">
                    <div className="scrollable-area">
                      {currentChatMessages.map((message, index) => {
                        if (
                          message.sender === "user" &&
                          message.addedToPromptGroup
                        ) {
                          return (
                            <div className="message bot" key={index}>
                              {message.content}
                              <div className="buttons-area">
                                <button
                                  className="small bot-color "
                                  onClick={() =>
                                    toggleMessageInPromptGroup(index)
                                  }
                                >
                                  Rimuovi dal prompt
                                </button>
                              </div>
                            </div>
                          );
                        }
                      })}
                    </div>
                  </div>
                </div>
                <button
                  className="secondary full-width"
                  disabled={
                    !currentChatMessages.some(
                      (msg) => msg.addedToPromptGroup
                    ) ||
                    promptsTitle.trim() === "" ||
                    promptsDescription.trim() === ""
                  }
                  onClick={() => {
                    saveNewPromptGroup(
                      promptsTitle,
                      promptsDescription,
                      promptsStatus
                    );
                    setPromptsTitle("");
                    setPromptsDescription("");
                    setPromptsStatus("private");
                    setShowSettings("savedPrompts");
                  }}
                >
                  Save prompt group
                </button>
              </div>
            ) : showSettings === "savedPrompts" ? (
              <div className="saved-prompts-area">
                <h3>load prompt</h3>
                <div className="split-view">
                  <div className="side">
                    <div className="scrollable-table">
                      <table>
                        <thead>
                          <tr>
                            <th>Nome Prompt</th>
                            <th>Creato da</th>
                            <th>Data creazione</th>
                            <th>Stato</th>
                            <th>Descrizione</th>
                          </tr>
                        </thead>
                        <tbody>
                          {savedPromptsList != null &&
                            savedPromptsList.map((prompt) => (
                              <tr
                                key={prompt.id}
                                onClick={() =>
                                  loadSavedPromptsMessages(prompt.id)
                                }
                                className={
                                  loadedSavedPromptId === prompt.id
                                    ? "selected"
                                    : ""
                                }
                              >
                                <td>{prompt.name}</td>
                                <td>{prompt.created_by}</td>
                                <td>{prompt.created_at}</td>
                                <td>{prompt.status}</td>
                                <td>{prompt.description}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="side">
                    <div className="scrollable-area">
                      {loadedSavedPromptMessages != null &&
                        loadedSavedPromptMessages.map((message, index) => (
                          <div className="message bot" key={index}>
                            {message}
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
                <button
                  className="secondary full-width"
                  onClick={useSavedPrompt}
                  disabled={
                    loadedSavedPromptMessages == null ||
                    loadedSavedPromptMessages.length === 0
                  }
                >
                  Load Selected Prompt
                </button>
              </div>
            ) : null}
          </div>
        ) : (
          <>
            {currentChatMessages && currentChatMessages.length > 0 && (
              <>
                {currentChatMessages.map((message, index) => (
                  <div
                    key={index}
                    className={`message ${message.sender} ${
                      message.chart_type != null && "full-width-graph"
                    }`}
                  >
                    {message.content}
                    {message.sender === "bot" && message.chart_type != null && (
                      <>
                        {message.chart_type === "pie" && (
                          <div className="pie-chart-container">
                            <PieChartComponent data={message.data} />
                          </div>
                        )}
                      </>
                    )}
                    <div className="buttons-area">
                      {message.sender === "user" && (
                        <button
                          className="small secondary"
                          onClick={() => toggleMessageInPromptGroup(index)}
                        >
                          {message.addedToPromptGroup
                            ? "Rimuovi dal prompt"
                            : "Aggiungi al prompt"}
                        </button>
                      )}
                      {message.sender === "bot" && (
                        <button
                          className="small bot-color "
                          onClick={() => toggleMessageInReport(index)}
                        >
                          {message.addedToReport
                            ? "Rimuovi dal report"
                            : "Aggiungi al report"}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </>
            )}
          </>
        )}
        <div ref={chatEndRef} className="ref-point" />
      </div>
      {showSettings != "" ? (
        <button
          className="settings-toggle secondary"
          onClick={() => setShowSettings("")}
        >
          Back to Chat
        </button>
      ) : !is_current_chat_public ? (
        <>
          <div className="input-area">
            <textarea
              value={userInput} // <-- controlled value
              onChange={(event) => setUserInput(event.target.value)}
              disabled={sendMessageInProgress}
              onKeyDown={handleSubmit}
            ></textarea>
            <button
              className="primary"
              onClick={sendMessage}
              disabled={
                sendMessageInProgress ||
                userInput.trim() === "" ||
                userInput.length < 2 ||
                userInput.length > 5000
              }
            >
              SEND (Ctrl + Enter)
            </button>
          </div>
          <div className="bottom-buttons">
            <button
              className="secondary"
              onClick={() => setShowSettings("report")}
            >
              Show Report Groups
            </button>
            <button
              className="secondary"
              onClick={() => setShowSettings("prompt")}
              disabled={
                !currentChatMessages ||
                !currentChatMessages.some((msg) => msg.addedToPromptGroup)
              }
            >
              Show Prompt Groups
            </button>
            <button
              className="secondary"
              onClick={() => setShowSettings("savedPrompts")}
            >
              Load Saved Prompts
            </button>
            <button
              className="secondary"
              onClick={() => setShowPublishPopup(true)}
            >
              Publish Chat
            </button>
          </div>
        </>
      ) : (
        <button
          className="secondary unpublish-button"
          onClick={() => setShowPublishPopup(true)}
        >
          Unpublish Chat
        </button>
      )}
    </div>
  );
}
export default ChatPage;
