import useAnalysisOverview from "../../stores/useAnalysisOverview";

function GeneralAnalysisOverviewTable() {
  const { data } = useAnalysisOverview();

  return (
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
            <td>{data.id}</td>
            <td>{data.created_at}</td>
            <td>{data.range_date}</td>
            <td>{data.site}</td>
            <td>{data.part_numbers ? data.part_numbers.join(", ") : "All"}</td>
            <td>{data.nc_category}</td>
            <td>{data.data_status}</td>
            <td>{data.num_records}</td>
            <td>{data.num_categories}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
export default GeneralAnalysisOverviewTable;
