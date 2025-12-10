import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import AnalysisFiltersMenu from "../../components/analysisFiltersMenu/analysisFiltersMenus";
import useAnalysisDashboardStore from "../../stores/useAnalysisDashboardStore";
import "./dashboard.scss";

function AnalysisDashboard() {
  const { toggleFiltersMenu, toggleCreateAnalysisMenu, fetchData, data } =
    useAnalysisDashboardStore();
  const navigate = useNavigate();

  const open_analysis = (id) => {
    navigate(`/analysis/dashboard/${id}`);
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="analysisDashboardArea">
      <button
        className="primary big new-analysis"
        onClick={toggleCreateAnalysisMenu}
      >
        + New Analysis
      </button>

      <AnalysisFiltersMenu />
      <div className="history-area">
        <div className="top">
          <div className="title">Storico Analisi</div>
          <button className="secondary" onClick={toggleFiltersMenu}>
            Filtri <span>0</span>
          </button>
        </div>
        <div className="scrollable-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th className="centered">Analysis Status</th>
                <th>Created At</th>
                <th>Dates Range</th>
                <th>Site</th>
                <th>PN</th>
                <th>NC Category</th>
                <th>Data Status</th>
                <th>Num Records</th>
                <th>Description</th>
                <th>Num Categories</th>
              </tr>
            </thead>
            <tbody>
              {data.map((analysis) => (
                <tr
                  onClick={() => open_analysis(analysis.id)}
                  key={analysis.id}
                >
                  <td>{analysis.id}</td>
                  <td className="centered">
                    <div
                      className={
                        "label " + analysis.analysis_status.toLowerCase()
                      }
                    >
                      {analysis.analysis_status != "Failed"
                        ? analysis.analysis_status
                        : "Unprocessable"}
                    </div>
                  </td>
                  <td>{analysis.created_at}</td>
                  <td>{analysis.range_date}</td>
                  <td>{analysis.site}</td>
                  <td className="parts-number">
                    {analysis.part_numbers && analysis.part_numbers.length > 0
                      ? analysis.part_numbers.join(", ")
                      : "All"}
                  </td>
                  <td>{analysis.nc_category}</td>
                  <td>{analysis.data_status}</td>
                  <td>{analysis.num_records}</td>
                  <td>
                    <div className="description">{analysis.description}</div>
                  </td>
                  <td>{analysis.num_categories}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AnalysisDashboard;
