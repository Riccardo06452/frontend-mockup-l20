import useAnalysisOverview from "../../../stores/useAnalysisOverview";

function OverviewCategoriesFilter() {
  const { data, categories, selectedCategory, setSelectedCategory } =
    useAnalysisOverview();

  return (
    <div className="categories-selector">
      {data.analysis_status}
      <ul>
        {categories.map((category, index) => (
          <li key={index}>
            <button
              className={
                category.name === selectedCategory ? "secondary" : "bot-color"
              }
              onClick={() => setSelectedCategory(category.name)}
            >
              {category.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default OverviewCategoriesFilter;
