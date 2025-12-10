import useAnalysisOverview from "../../../stores/useAnalysisOverview";
import { useState } from "react";

function OverviewClusterValidation() {
  const {
    setMockedData,
    setMockedCategories,
    data,
    categories,
    categoriesToValidate,
    setMockedCategoriesToValidate,
    selectedCategoryToCluster,
    dataset,
    setDataset,
    setSelectedCategory,
    setPreviousData,
  } = useAnalysisOverview();

  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");

  return (
    <div className="overlay">
      <div className="cluster-selection-menu">
        <h2>Categorie generate</h2>
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Description</th>
              <th>Selected</th>
            </tr>
          </thead>
          <tbody>
            {categoriesToValidate.map((category, index) => (
              <tr
                key={index}
                onClick={() => {
                  const newCategories = [...categoriesToValidate].map(
                    (cat, catIndex) => {
                      if (catIndex === index) {
                        return {
                          ...cat,
                          selected: !cat.selected,
                        };
                      }
                      return cat;
                    }
                  );
                  setMockedCategoriesToValidate(newCategories);
                }}
              >
                <td>{category.name}</td>
                <td>{category.description}</td>
                <td>
                  <input type="checkbox" checked={category.selected} readOnly />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <br />
        <hr />
        <br />
        <div className="input-section">
          <input
            type="text"
            placeholder="Category Title"
            value={newCategoryName}
            onChange={(event) => setNewCategoryName(event.target.value)}
          />
          <input
            type="text"
            placeholder="Category Description"
            value={newCategoryDescription}
            onChange={(event) => setNewCategoryDescription(event.target.value)}
          />
          <button
            className="secondary no-wrap small"
            onClick={() => {
              if (
                newCategoryName.trim() === "" ||
                newCategoryDescription.trim() === ""
              )
                return;
              const newCategories = [...categoriesToValidate];
              newCategories.push({
                name: newCategoryName,
                description: newCategoryDescription,
                selected: true,
              });
              setMockedCategoriesToValidate(newCategories);
              setNewCategoryName("");
              setNewCategoryDescription("");
              setSelectedCategory("");
            }}
          >
            Add Category
          </button>
        </div>
        <div className="buttons-section">
          <button
            className="secondary no-wrap full-width big"
            onClick={() => {
              const selectedCategories = categoriesToValidate
                .filter((cat) => cat.selected)
                .map((cat) => ({
                  name: cat.name,
                  selected: true,
                }));
              const new_data = {
                ...data,
                analysis_status: "Processed",
              };
              console.log(categories, selectedCategoryToCluster);

              const filtered_categories = categories.filter(
                (cat) => cat.name !== selectedCategoryToCluster
              );
              setMockedData(new_data);
              setMockedCategories([
                ...filtered_categories,
                ...selectedCategories,
              ]);
              let round_index = 1000;
              const new_dataset = dataset.map((record) => {
                if (record.category === selectedCategoryToCluster) {
                  round_index += 1;
                  if (round_index >= selectedCategories.length) {
                    round_index = 0;
                  }
                  return {
                    ...record,
                    category: selectedCategories[round_index].name,
                  };
                }
                return record;
              });
              setDataset(new_dataset);
              setPreviousData(categories, dataset, true);
              setMockedCategoriesToValidate([]);
            }}
          >
            Confirm Selected Categories
          </button>
        </div>
      </div>
    </div>
  );
}

export default OverviewClusterValidation;
