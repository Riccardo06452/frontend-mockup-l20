import { create } from "zustand";
import axios from "axios";

const useChatDashboardStore = create((set, get) => ({
  loadedChatsHistory: [],

  current_chat_id: null,

  currentChatMessages: [],

  sendMessageInProgress: false,

  savedPromptsList: [],

  loadedSavedPromptMessages: [],

  loadedSavedPromptId: null,

  is_current_chat_public: false,

  sendGroupMessageInProgress: false,

  setIsCurrentChatPublic: (isPublic) =>
    set({ is_current_chat_public: isPublic }),

  setSendMessageInProgress: (inProgress) =>
    set({ sendMessageInProgress: inProgress }),

  setCurrentChatId: (chatId) => set({ current_chat_id: chatId }),

  setCurrentChatMessages: (messages) => set({ currentChatMessages: messages }),

  clearCurrentChatMessages: () => set({ currentChatMessages: [] }),

  setLoadedChatsHistory: (chats) => set({ loadedChatsHistory: chats }),

  clearLoadedChatsHistory: () => set({ loadedChatsHistory: [] }),

  getChatDataById: (chatId) => {
    if (get().loadedChatsHistory.length === 0) {
      console.log("Missing chats history");
      get().loadAllChatsHistory();
      return null;
    } else {
      const current_chat = get().loadedChatsHistory.filter(
        (chat) => chat.id == chatId
      )[0];
      if (current_chat != null) {
        return current_chat;
      }
      return null;
    }
  },

  toggleMessageInReport: (messageIndex) => {
    if (!get().sendMessageInProgress) {
      set((state) => {
        return {
          currentChatMessages: state.currentChatMessages.map((msg, index) => {
            if (index === messageIndex && msg.sender === "bot") {
              return {
                ...msg,
                addedToReport: !msg.addedToReport,
              };
            }
            return msg;
          }),
        };
      });
    }
  },

  toggleMessageInPromptGroup: (messageIndex) => {
    if (!get().sendMessageInProgress) {
      set((state) => {
        return {
          currentChatMessages: state.currentChatMessages.map((msg, index) => {
            if (index === messageIndex && msg.sender === "user") {
              return {
                ...msg,
                addedToPromptGroup: !msg.addedToPromptGroup,
              };
            }
            return msg;
          }),
        };
      });
    }
  },

  sendMessageToProcess: async (message) => {
    set({ sendMessageInProgress: true });

    set((state) => {
      return {
        currentChatMessages: [
          ...state.currentChatMessages,
          {
            sender: "user",
            content: message,
            addedToPromptGroup: false,
          },
        ],
      };
    });
    console.log("Added message to current chat:", message);

    axios
      .post("/api/chats/send_message", { message })
      .then((response) => {
        console.log("Message sent response:", response.data);
        set({ sendMessageInProgress: false });
      })
      .catch((error) => {
        console.log("Error expected. This is a simulation.", error);
      })
      .finally(() => {
        setTimeout(() => {
          const answerMessage =
            "This is a simulated response from the AI. Any data processing results would appear here.";
          set((state) => {
            const hasChartData = Math.random() > 0.2;
            if (state.currentChatMessages == 0) {
              const localStorageChat = localStorage.getItem(
                "fake_chat_" + state.current_chat_id
              );
              if (localStorageChat) {
                state.currentChatMessages = JSON.parse(localStorageChat);
              }
            }
            const newCurrentChatMessages = [
              ...state.currentChatMessages,
              {
                sender: "bot",
                content: answerMessage,
                addedToReport: false,
                data: hasChartData
                  ? [
                      {
                        id: "category_a",
                        label: "Category A",
                        value: Math.floor(Math.random() * 100) + 10,
                      },
                      {
                        id: "category_b",
                        label: "Category B",
                        value: Math.floor(Math.random() * 100) + 10,
                      },
                      {
                        id: "category_c",
                        label: "Category C",
                        value: Math.floor(Math.random() * 100) + 10,
                      },
                      {
                        id: "category_d",
                        label: "Category D",
                        value: Math.floor(Math.random() * 100) + 10,
                      },
                      {
                        id: "category_e",
                        label: "Category E",
                        value: Math.floor(Math.random() * 100) + 10,
                      },
                      {
                        id: "category_f",
                        label: "Category F",
                        value: Math.floor(Math.random() * 100) + 10,
                      },
                    ]
                  : [],
                chart_type: hasChartData ? "pie" : null,
              },
            ];
            localStorage.setItem(
              "fake_chat_" + state.current_chat_id,
              JSON.stringify(newCurrentChatMessages)
            );
            const chats_history = JSON.parse(
              localStorage.getItem("fake_chats_history")
            );
            const chats_history_index = chats_history.findIndex(
              (chat) => parseInt(chat.id) === parseInt(state.current_chat_id)
            );
            if (chats_history_index !== -1) {
              console.log("Updating chat history message counts.");
              chats_history[chats_history_index].total_messages += 2;
              localStorage.setItem(
                "fake_chats_history",
                JSON.stringify(chats_history)
              );
            }
            localStorage.setItem(
              "fake_chats_history",
              JSON.stringify(chats_history)
            );

            return {
              currentChatMessages: newCurrentChatMessages,
            };
          });
          set({ sendMessageInProgress: false });
        }, Math.floor(Math.random() * 3000) + 1000);
      });
  },

  loadAllChatsHistory: async () => {
    axios
      .get("/api/chats/history")
      .then((response) => {
        set({ loadedChatsHistory: response.data.chats });
      })
      .finally(() => {
        const localFakeChats = localStorage.getItem("fake_chats_history");
        if (localFakeChats) {
          set({ loadedChatsHistory: JSON.parse(localFakeChats) });
        } else {
          set({
            loadedChatsHistory: [
              {
                id: "12356_1100",
                created_at: `12/05/2024 14:${30}`,
                total_messages: Math.round(Math.random() * 20),
                report_messages: Math.round(Math.random() * 20),
                analysis_id: "12356",
                analysis_range_date: "01/05/2024 - 10/05/2024",
                analysis_description:
                  "The description of the analysis associated with this chat generated by the AI.",
              },
            ],
          });
          localStorage.setItem(
            "fake_chats_history",
            JSON.stringify(get().loadedChatsHistory)
          );
          localStorage.setItem(
            "fake_chat_12356_1100",
            JSON.stringify([
              {
                sender: "user",
                content: "Simulated user message.",
                addedToPromptGroup: false,
              },
              {
                sender: "bot",
                content:
                  "This is a simulated response from the AI. Any data processing results would appear here.",
                addedToReport: false,
              },
            ])
          );
        }
      });
  },

  loadMessagesByChatId: async (chatId) => {
    set({ current_chat_id: chatId });
    axios
      .get(`/api/chats/${chatId}/messages`)
      .then((response) => {
        set({ currentChatMessages: response.data.messages });
      })
      .finally(() => {
        const localStorageChat = localStorage.getItem("fake_chat_" + chatId);
        if (localStorageChat) {
          set({
            currentChatMessages: JSON.parse(localStorageChat),
            current_chat_id: chatId,
          });
          return;
        }
        set({
          currentChatMessages: [],
          current_chat_id: chatId,
        });
        const chats_history = JSON.parse(
          localStorage.getItem("fake_chats_history")
        );
        let chat_entry = null;
        if (chats_history) {
          chat_entry = chats_history.find((chat) => chat.id == chatId);
        }
        if (!chat_entry) {
          let analysisId = Math.round(Math.random() * 10000000);
          if (chatId.includes("_")) {
            analysisId = chatId.split("_")[0];
          }
          chats_history.push({
            id: chatId,
            created_at: `12/05/2024 14:${30}`,
            total_messages: 0,
            report_messages: 0,
            analysis_id: analysisId,
            analysis_range_date: "01/05/2024 - 10/05/2024",
            analysis_description:
              "The description of the analysis associated with this chat generated by the AI.",
          });
          localStorage.setItem(
            "fake_chats_history",
            JSON.stringify(chats_history)
          );
        }
      });
  },

  loadSavedPromptsList: async () => {
    axios
      .get("/api/prompts/saved")
      .then((response) => {
        set({ savedPromptsList: response.data.prompts });
      })
      .finally(() => {
        const localStoragePrompts = localStorage.getItem("fake_saved_prompts");
        if (localStoragePrompts) {
          console.log("Loading saved prompts from localStorage.");

          set({
            savedPromptsList: JSON.parse(localStoragePrompts).sort(
              (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
            ),
          });
          return;
        }
        set({
          savedPromptsList: [
            {
              id: 1476,
              name: "Data Cleaning Prompt",
              description: "Prompt for cleaning datasets.",
              created_by: "Jhon Doe Jr.",
              status: "public",
              created_at: "2025-10-15",
            },
          ],

          loadedSavedPromptMessages: [
            "Give me a list of all the categories with more then 5% of data points.",
            "Make a graph showing the distribution of data points across categories.",
            "Identify any outliers in the dataset and suggest how to handle them.",
          ],
          loadedSavedPromptId: 1476,
        });
        localStorage.setItem(
          "fake_saved_prompts",
          JSON.stringify(get().savedPromptsList)
        );
        localStorage.setItem(
          "fake_saved_prompt_1476",
          JSON.stringify(get().loadedSavedPromptMessages)
        );
      });
  },

  loadSavedPromptsMessages: async (promptId) => {
    axios
      .get(`/api/prompts/${promptId}/messages`)
      .then((response) => {
        set({
          loadedSavedPromptMessages: response.data.messages,
          loadedSavedPromptId: promptId,
        });
      })
      .finally(() => {
        const localSavedPrompt = localStorage.getItem(
          "fake_saved_prompt_" + promptId
        );
        if (localSavedPrompt) {
          set({
            loadedSavedPromptMessages: JSON.parse(localSavedPrompt),
            loadedSavedPromptId: promptId,
          });
          return;
        }
      });
  },

  useSavedPromptInCurrentChat: async () => {
    set({
      sendGroupMessageInProgress: true,
    });
    const promptId = get().loadedSavedPromptId;
    if (promptId == null) return;

    const messagesToAdd = get().loadedSavedPromptMessages;

    for (const msg of messagesToAdd) {
      get().sendMessageToProcess(msg);
      while (get().sendMessageInProgress) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }
    set({
      sendGroupMessageInProgress: false,
    });
  },

  loadChatsHistoryByAnalysisId: async (analysisId) => {
    axios
      .get(`/api/chats/history?analysis_id=${analysisId}`)
      .then((response) => {
        set({ loadedChatsHistory: response.data.chats });
      })
      .finally(() => {
        const allChats = JSON.parse(localStorage.getItem("fake_chats_history"));
        const filteredChats = allChats.filter(
          (chat) => chat.analysis_id == analysisId
        );
        set({ loadedChatsHistory: filteredChats });
      });
  },

  saveNewPromptGroup: async (name, description, status) => {
    axios
      .post("/api/prompts/save", {
        name,
        description,
        messages: get()
          .currentChatMessages.filter(
            (msg) => msg.addedToPromptGroup && msg.sender === "user"
          )
          .map((msg) => msg.content),
        status,
        created_by: "Jhon Doe",
        created_at: new Date().toISOString(),
      })
      .then((response) => {
        console.log("Prompt group saved response:", response.data);
      })
      .finally(() => {
        const newPrompt = {
          id: Math.floor(Math.random() * 100000),
          name,
          description,
          created_by: "current_user",
          status: "private",
          created_at: new Date().toISOString().split("T")[0],
        };

        set((state) => ({
          savedPromptsList: [...state.savedPromptsList, newPrompt],
        }));
        localStorage.setItem(
          "fake_saved_prompts",
          JSON.stringify(get().savedPromptsList)
        );
        localStorage.setItem(
          "fake_saved_prompt_" + newPrompt.id,
          JSON.stringify(
            get()
              .currentChatMessages.filter(
                (msg) => msg.addedToPromptGroup && msg.sender === "user"
              )
              .map((msg) => msg.content)
          )
        );
      });
  },
}));

export default useChatDashboardStore;
