import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./overview.scss";
import useAnalysisOverview from "../../../stores/useAnalysisOverview";
import useChatDashboardStore from "../../../stores/useChatDashboardStore";
import useAnalysisDashboardStore from "../../../stores/useAnalysisDashboardStore";
import OverviewClusterMenuPrompt from "./OverviewClusterMenuPrompt";
import OverviewChatAlert from "./OverviewChatAlert";
import OverviewClusterValidation from "./OverviewClusterValidation";
import GeneralAnalysisOverviewTable from "../../../components/generalAnalysisOverviewTable/generalAnalysisOverviewTable";
import OverviewCategoriesFilter from "./OverviewCategoriesFilter";
import OverviewMainTables from "./OverviewMainTables";
import OverviewDefaultCharts from "./OverviewDefaultCharts";
import OverviewDropChangesAlert from "./OverviewDropChangesAlert";
import { BackwardIcon } from "@heroicons/react/24/outline";
import ClusterDeleteModal from "./ClusterDeleteModal";

function AnalysisOverview() {
  const { analysisId } = useParams();
  const navigate = useNavigate();
  const {
    setMockedData,
    setMockedCategories,
    data,
    dataset,
    categories,
    fetchDataFromAnalysisId,
    createExcelFileForDataset,
    resetMockupedData,
    categoriesToValidate,
    setMockedCategoriesToValidate,
    setSelectedCategoryToCluster,
    selectedCategory,
    previous_data,
    fakeDatasetWithCategories,
  } = useAnalysisOverview();

  const {
    data: dashboardData,
    fetchData,
    deleteAnalysisById,
  } = useAnalysisDashboardStore();
  const { loadChatsHistoryByAnalysisId, loadedChatsHistory } =
    useChatDashboardStore();

  const [showChatTable, setShowChatTable] = useState(false);
  const [showOpenChatMenu, setShowOpenChatMenu] = useState(false);
  const [showCharts, setShowCharts] = useState(false);
  const [showClusterStartMenu, setShowClusterStartMenu] = useState(false);
  const [showDropChangesAlert, setShowDropChangesAlert] = useState(false);
  const [showClusterDeleteMenu, setShowClusterDeleteMenu] = useState(false);

  const openNewChat = () => {
    if (loadedChatsHistory == null || loadedChatsHistory.length === 0) {
      navigate(`/chat/${analysisId}_` + Math.floor(Math.random() * 10000));
    } else {
      setShowOpenChatMenu(true);
    }
  };

  useEffect(() => {
    if (dashboardData != null && dashboardData.length > 0) {
      console.log("Dashboard data available:", dashboardData);

      if (data != null) {
        const mockedCategoriesDict = {};
        fakeDatasetWithCategories.forEach((data) => {
          mockedCategoriesDict[data.category] = {
            name: data.category,
            selected: true,
            description: data.description,
          };
        });
        const mockedCategories = Object.values(mockedCategoriesDict);
        if (data.analysis_status == "Editing") {
          setMockedCategoriesToValidate(mockedCategories);
        } else if (categories == null || categories.length === 0) {
          setMockedCategories(mockedCategories);
        } else if (
          (dataset == null || dataset.length === 0) &&
          data.analysis_status != "Editing"
        ) {
          fetchDataFromAnalysisId(analysisId);
          console.log("Dataset should be loaded now...\n", dataset);
        } else if (
          data.chats_history == null ||
          data.chats_history.length === 0
        ) {
          console.log("Loading chats history for analysis ID:", analysisId);

          // fetchDataFromAnalysisId(analysisId);
          loadChatsHistoryByAnalysisId(analysisId);
        }
      } else {
        setMockedData(
          dashboardData.filter((analysis) => analysis.id == analysisId)[0]
        );
        console.log(
          "DATA FILTERED:",
          dashboardData.filter((analysis) => analysis.id == analysisId),
          analysisId
        );
      }
    } else {
      console.log("Loading dashboard data...");
      fetchData();
    }
  }, [
    analysisId,
    data,
    dashboardData,
    loadChatsHistoryByAnalysisId,
    fetchDataFromAnalysisId,
    setMockedData,
    fetchData,
    fakeDatasetWithCategories,
    setMockedCategories,
    dataset,
    categories,
    setMockedCategoriesToValidate,
  ]);

  useEffect(() => {
    return () => {
      console.log("Cleanup overview effect");
      resetMockupedData();
      setShowCharts(false);
      setMockedCategoriesToValidate([]);
    };
  }, [resetMockupedData, setMockedCategoriesToValidate]);

  return (
    <div className="overview-page">
      {showOpenChatMenu && (
        <OverviewChatAlert
          setShowChatTable={setShowChatTable}
          setShowOpenChatMenu={setShowOpenChatMenu}
        />
      )}

      {showDropChangesAlert && (
        <OverviewDropChangesAlert
          setShowDropChangesAlert={setShowDropChangesAlert}
        />
      )}

      {showClusterStartMenu != "" && (
        <OverviewClusterMenuPrompt
          setShowClusterStartMenu={setShowClusterStartMenu}
        ></OverviewClusterMenuPrompt>
      )}

      {showClusterDeleteMenu != "" && (
        <ClusterDeleteModal
          setShowClusterDeleteMenu={setShowClusterDeleteMenu}
        />
      )}

      {categoriesToValidate.length > 0 && <OverviewClusterValidation />}
      <div className="top-buttons">
        <button
          className="secondary small"
          onClick={() => navigate("/analysis/dashboard")}
        >
          {"< Dashboard"}
        </button>

        <button className="secondary small" disabled={!previous_data.is_stored}>
          <BackwardIcon
            className="back-arrow"
            onClick={() => setShowDropChangesAlert(true)}
          />
        </button>
      </div>

      <div className="data-area">
        {data && <GeneralAnalysisOverviewTable />}

        {data && data.description && data.analysis_status != "Editing" && (
          <div className="ai-description">
            <div className="title">Descrizione Generata dall'AI</div>
            <div className="text">{data.description}</div>
          </div>
        )}

        {dataset != null && dataset.length > 0 ? (
          <>
            {!showChatTable &&
              data &&
              data.analysis_status != "Validated" &&
              data.analysis_status != "Failed" && <OverviewCategoriesFilter />}
            {data &&
              dataset &&
              (showCharts ? (
                <OverviewDefaultCharts />
              ) : (
                <OverviewMainTables
                  showChatTable={showChatTable}
                  setShowChatTable={setShowChatTable}
                />
              ))}
          </>
        ) : (
          categories == null ||
          (categories.length === 0 && (
            <div className="loading-indicator">
              Categories elaboration in progress...
            </div>
          ))
        )}
      </div>

      {data?.analysis_status == "Validated" ? (
        <div className="actions-buttons">
          <button
            className="charts-toggle secondary no-wrap"
            onClick={() => setShowCharts((val) => !val)}
          >
            {showCharts ? "Mostra Dataset" : "Mostra grafici"}
          </button>

          <button
            className="primary no-wrap"
            onClick={() =>
              alert(
                "Questo pulsante crea una nuova analisi con stessi dati e stesse categorie ma in stato modificabile"
              )
            }
          >
            Duplicate Analysis
          </button>
          <button
            className="primary no-wrap"
            onClick={() => createExcelFileForDataset(dataset, analysisId)}
          >
            Download Dataset
          </button>
          <button
            className="primary no-wrap"
            onClick={() => alert("Genera QA Matrix")}
          >
            Genera QA Matrix
          </button>
          <button className="primary no-wrap" onClick={openNewChat}>
            Conversational BI
          </button>
        </div>
      ) : data?.analysis_status == "Processed" ? (
        <div className="actions-buttons">
          <button
            className="primary no-wrap big"
            onClick={() => {
              const new_data = {
                ...data,
                analysis_status: "Validated",
              };
              setMockedData(new_data);
            }}
          >
            Validate Analysis
          </button>
          <button
            className="primary no-wrap big"
            onClick={() => {
              setSelectedCategoryToCluster(selectedCategory),
                setShowClusterDeleteMenu(true);
            }}
            disabled={selectedCategory === ""}
          >
            Delete Cluster and Re-Cluster
          </button>
          <button
            className="primary no-wrap big"
            onClick={() => {
              setSelectedCategoryToCluster(selectedCategory),
                setShowClusterStartMenu(true);
            }}
            disabled={selectedCategory === ""}
          >
            Apri Menu Elaborazione Cluster
          </button>
        </div>
      ) : (
        data?.analysis_status == "Failed" && (
          <div
            className="actions-buttons"
            onClick={() => {
              deleteAnalysisById(data.id), navigate("/analysis/dashboard");
            }}
          >
            <button className="primary no-wrap big">DELETE ANALYSIS</button>
          </div>
        )
      )}
    </div>
  );
}

export default AnalysisOverview;
