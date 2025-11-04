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
        + Nuova Analisi
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
                <th>id</th>
                <th>creato il</th>
                <th>range date</th>
                <th>sito</th>
                <th>PN</th>
                <th>Categoria NC</th>
                <th>Tipologia</th>
                <th>Stato</th>
                <th>Num Record</th>
                <th>Descrizione</th>
                <th>Num Categorie</th>
              </tr>
            </thead>
            <tbody>
              {data.map((analysis) => (
                <tr
                  onClick={() => open_analysis(analysis.id)}
                  key={analysis.id}
                >
                  <td>{analysis.id}</td>
                  <td>{analysis.created_at}</td>
                  <td>{analysis.range_date}</td>
                  <td>{analysis.site}</td>
                  <td className="parts-number">
                    {analysis.part_numbers.length > 0
                      ? analysis.part_numbers.join(", ")
                      : "All"}
                  </td>
                  <td>{analysis.nc_category}</td>
                  <td>{analysis.nc_category_options}</td>
                  <td>{analysis.status}</td>
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
