import React, { useEffect } from "react";
import "./chat.scss";
import { useParams } from "react-router-dom";
import useChatDashboardStore from "../../../stores/useChatDashboardStore";

function ChatPage() {
  const { chatId } = useParams();
  console.log("Chat ID:", chatId);
  const [userInput, setUserInput] = React.useState("");

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
  } = useChatDashboardStore();
  const [showSettings, setShowSettings] = React.useState("");

  useEffect(() => {
    loadMessagesByChatId(chatId);
  }, [chatId, loadMessagesByChatId]);

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

  return (
    <div className="chat-page-container">
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
                >
                  Crea Report
                </button>
              </div>
            ) : showSettings === "prompt" ? (
              <div className="prompt-area">
                <h3>Prompt messages</h3>
                <div className="split-view">
                  <div className="form-section">
                    <div>
                      <label for="title">Prompt Title</label>
                      <input id="title" type="text" />
                    </div>
                    <div>
                      <label for="description">Prompt Description</label>
                      <input id="description" type="text" />
                    </div>
                    <div>
                      <label for="status">Visibility</label>
                      <select name="status" id="status">
                        <option value="private" selected>
                          Private
                        </option>
                        <option value="public">Public</option>
                      </select>
                    </div>
                  </div>
                  <div className="scrollable-area">
                    {currentChatMessages.map((message, index) => (
                      <>
                        {message.sender === "user" &&
                          message.addedToPromptGroup && (
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
                          )}
                      </>
                    ))}
                  </div>
                </div>
                <button
                  className="secondary full-width"
                  disabled={
                    !currentChatMessages.some((msg) => msg.addedToPromptGroup)
                  }
                >
                  Salva gruppo di prompt
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
                <button className="secondary full-width">Carica Prompt</button>
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
            >
              Show Report Groups
            </button>
            <button
              className="secondary"
              onClick={() => setShowSettings("prompt")}
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
