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

  setSendMessageInProgress: (inProgress) =>
    set({ sendMessageInProgress: inProgress }),

  setCurrentChatId: (chatId) => set({ current_chat_id: chatId }),

  setCurrentChatMessages: (messages) => set({ currentChatMessages: messages }),

  clearCurrentChatMessages: () => set({ currentChatMessages: [] }),

  setLoadedChatsHistory: (chats) => set({ loadedChatsHistory: chats }),

  clearLoadedChatsHistory: () => set({ loadedChatsHistory: [] }),

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
            return {
              currentChatMessages: [
                ...state.currentChatMessages,
                {
                  sender: "bot",
                  content: answerMessage,
                  addedToReport: false,
                },
              ],
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
        set({
          loadedChatsHistory: Array.from({ length: 20 }, (_, index) => ({
            id: 1100 + index,
            created_at: `12/05/2024 14:${30 + index}`,
            total_messages: Math.round(Math.random() * 20),
            report_messages: Math.round(Math.random() * 20),
            analysis_id: Math.round(Math.random() * 10000000),
            analysis_range_date: "01/05/2024 - 10/05/2024",
            analysis_description:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          })),
        });
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
        set({
          currentChatMessages: [
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
          ],
        });
      });
  },

  loadSavedPromptsList: async () => {
    axios
      .get("/api/prompts/saved")
      .then((response) => {
        set({ savedPromptsList: response.data.prompts });
      })
      .finally(() => {
        set({
          savedPromptsList: [
            {
              id: 1,
              name: "Data Cleaning Prompt",
              description: "Prompt for cleaning datasets.",
              created_by: "admin",
              status: "public",
              created_at: "01/04/2024",
            },
            {
              id: 2,
              name: "Data Analysis Prompt",
              description: "Prompt for analyzing data trends.",
              created_by: "user1",
              status: "private",
              created_at: "15/04/2024",
            },
            {
              id: 3,
              name: "Visualization Prompt",
              description: "Prompt for generating data visualizations.",
              created_by: "user2",
              status: "public",
              created_at: "20/04/2024",
            },
          ],
        });
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
        set({
          loadedSavedPromptMessages: [
            Math.random() > 0.5
              ? "Get all the data in a clean format."
              : "Provide a summary of the dataset.",
            Math.random() > 0.5
              ? "Analyze the trends over the last year."
              : "Identify any outliers in the dataset.",
            Math.random() > 0.5
              ? "Generate visualizations for the key metrics."
              : "Generate a summary report of the findings.",
          ],
          loadedSavedPromptId: promptId,
        });
      });
  },
}));

export default useChatDashboardStore;
