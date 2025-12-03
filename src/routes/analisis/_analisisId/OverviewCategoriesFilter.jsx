import useAnalysisOverview from "../../../stores/useAnalysisOverview";

function OverviewCategoriesFilter() {
  const { categories, selectedCategory, setSelectedCategory } =
    useAnalysisOverview();

  return (
    <div className="categories-selector">
      <ul>
        {categories.map((category, index) => (
          <li key={index}>
            <button
              className={
                category.name === selectedCategory
                  ? "secondary small"
                  : "bot-color small"
              }
              onClick={() =>
                setSelectedCategory(
                  category.name === selectedCategory ? "" : category.name
                )
              }
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
