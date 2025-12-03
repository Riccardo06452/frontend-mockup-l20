import { useNavigate } from "react-router-dom";
import useAnalysisOverview from "../../../stores/useAnalysisOverview";
import useChatDashboardStore from "../../../stores/useChatDashboardStore";
import Select from "react-select";
function OverviewMainTables({ showChatTable, setShowChatTable }) {
  const navigate = useNavigate();
  const {
    data,
    dataset,
    selectedCategory,
    categories,
    updateDatasetRecordCategory,
  } = useAnalysisOverview();
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
                    <div>
                      {data.analysis_status === "Validated" ? (
                        record.category
                      ) : (
                        <Select
                          styles={{
                            control: (base) => ({
                              ...base,
                              minHeight: 30,
                              height: 30,
                              fontSize: "0.8rem",
                              minWidth: 200,
                            }),
                            valueContainer: (base) => ({
                              ...base,
                              padding: "0 6px",
                            }),
                            indicatorsContainer: (base) => ({
                              ...base,
                              height: 30,
                            }),
                          }}
                          id="input-nc-category"
                          options={categories.map((category) => ({
                            value: category.name,
                            label: category.name,
                          }))}
                          value={
                            record.category
                              ? {
                                  value: record.category,
                                  label: record.category,
                                }
                              : null
                          }
                          onChange={(selectedOption) => {
                            console.log(
                              "changing category from: ",
                              record.category,
                              " to: ",
                              selectedOption.value
                            );
                            updateDatasetRecordCategory(
                              record.id,
                              selectedOption.value
                            );
                          }}
                          className="select-component"
                        />
                      )}
                    </div>
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
