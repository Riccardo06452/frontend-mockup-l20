import React, { useEffect } from "react";
import "./chat.scss";
import { toPng } from "html-to-image";
import { useParams } from "react-router-dom";
import useChatDashboardStore from "../../../stores/useChatDashboardStore";
import PieChartComponent from "../../../components/charts/PieChartComponent";
import pptxgen from "pptxgenjs";

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
  } = useChatDashboardStore();
  const [showSettings, setShowSettings] = React.useState("");
  const [promptsTitle, setPromptsTitle] = React.useState("");
  const [promptsDescription, setPromptsDescription] = React.useState("");
  const [promptsStatus, setPromptsStatus] = React.useState("private");

  const charts = React.useRef({});

  useEffect(() => {
    loadMessagesByChatId(chatId);
    loadSavedPromptsList();
  }, [chatId, loadMessagesByChatId, loadSavedPromptsList]);

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

    const pptx = new pptxgen();

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
          <p>
            Sending saved prompt messages to chat, please wait. Do not close
            this window or refresh the page.
          </p>
        </div>
      )}
      <div className="chat-area">
        {showSettings != "" ? (
          <div className="settings-panel">
            {showSettings === "report" ? (
              <div className="report-area">
                <h3>Report messages</h3>
                <div className="scrollable-area">
                  {currentChatMessages.map((message, index) => (
                    <>
                      {message.sender === "bot" && message.addedToReport && (
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
                      )}
                    </>
                  ))}
                </div>
                <button
                  className="secondary full-width"
                  disabled={
                    !currentChatMessages.some((msg) => msg.addedToReport)
                  }
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
                  <div key={index} className={`message ${message.sender}`}>
                    {message.content}
                    {message.sender === "bot" && message.chart_type != null && (
                      <>
                        {message.chart_type === "pie" && (
                          <PieChartComponent data={message.data} />
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
      ) : (
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
              disabled={
                !currentChatMessages ||
                !currentChatMessages.some((msg) => msg.addedToReport)
              }
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
          </div>
        </>
      )}
    </div>
  );
}
export default ChatPage;
