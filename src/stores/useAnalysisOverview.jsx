import axios from "axios";
import { create } from "zustand";
// import axios from "axios";
import ExcelJS from "exceljs";
import { format } from "date-fns";
import { saveAs } from "file-saver";

const useAnalysisOverview = create((set, get) => ({
  data: null,
  dataset: [],
  categories: [],
  analysisId: null,
  categoriesToValidate: [],
  selectedCategoryToCluster: "",
  selectedCategory: "",
  paretoCategoriesData: [],
  partNumberVolumes: {
    success: 0,
    failures: 0,
  },

  setSelectedCategory: (category) => {
    set({ selectedCategory: category });
  },

  setSelectedCategoryToCluster: (category) => {
    set({ selectedCategoryToCluster: category });
  },

  setMockedCategoriesToValidate: (categories) => {
    set({ categoriesToValidate: categories });
  },

  setMockedData: (data) => {
    if (data) {
      localStorage.setItem("fakeAnalysisData_" + data.id, JSON.stringify(data));
      set({ data: data });
    } else {
      set({ data: null });
    }
  },

  resetMockupedData: () => {
    set({ data: null, dataset: [], categories: [], analysisId: null });
  },

  updateDatasetRecordCategory: (id, category) => {
    set({
      dataset: get().dataset.map((value) => {
        if (id === value.id) {
          return {
            ...value,
            category: category,
          };
        }
        return value;
      }),
    });
  },

  setMockedCategories: (categories) => {
    set({ categories: categories });
  },

  fetchDataFromAnalysisId: async (analysisId) => {
    console.log("Fetching analysis data for ID:", analysisId);
    console.warn(
      "Currently data will be set from the overview.jsx page then we should receive the data from the backend"
    );

    set({ analysisId: analysisId });
    axios
      .get("/api/analysis/" + analysisId)
      .then((response) => {
        // set({ data: response.data });
        response && console.log("Fetched analysis data for ID:", analysisId);
      })
      .catch((e) => {
        console.log("Error fetching analysis data for ID:", analysisId, e);
      })
      .then(() => {
        const categories = get().categories;
        console.log(
          "categories before dataset generation:",
          categories,
          "\nlength:",
          categories.length
        );
        const category =
          categories[Math.floor(Math.random() * categories.length)].name;
        console.log("test category:", category);

        const dataset = Array.from({ length: 100 }, (_, i) => ({
          id: i + 1,
          date: `2024-05-${(i + 1).toString().padStart(2, "0")}`,
          site: "Fornitore esterno XYZ Ltd.",
          part_number: Math.floor(10000 + Math.random() * 90000).toString(),
          nc_category: ["ingegneristica", "produzione", "fornitore"].sort(
            () => Math.random() - 0.5
          )[0],
          category:
            Math.random() > 0.1
              ? categories[Math.floor(Math.random() * categories.length)].name
              : "Altro",
          parent_category: "",
          description: "Descrizione del record " + (i + 1),
        }));
        const data = get().data || {};
        data.description = "Updated description with dataset loaded.";
        set({ dataset: dataset });
        const clean_pn_volumes = {
          success: 0,
          failures: 0,
        };
        const categories_distribution = dataset.reduce((acc, item) => {
          const category = item.category;
          if (item.category != null && item.category !== "Altro") {
            clean_pn_volumes.success += 1;
          } else {
            clean_pn_volumes.failures += 1;
          }
          acc[category] = (acc[category] || 0) + 1;
          return acc;
        }, {});

        const local_pareto_categories = Object.entries(
          categories_distribution
        ).map(([label, value]) => ({ label, value }));

        set({
          paretoCategoriesData: local_pareto_categories,
          partNumberVolumes: clean_pn_volumes,
        });
      });
  },

  createExcelFileForDataset: async (rows, analysisId) => {
    const workbook = new ExcelJS.Workbook();

    const sheet = workbook.addWorksheet("Dataset Analysis");

    const columns = [
      { name: "ID", key: "id" },
      { name: "Date", key: "date" },
      { name: "Part Number", key: "part_number" },
      { name: "Site", key: "site" },
      { name: "NC Category", key: "nc_category" },
      { name: "Category", key: "category" },
      { name: "Sub-Category", key: "sub_category" },
      { name: "Description", key: "description" },
    ];

    const formatted_rows = rows.map((row) => [
      row.id,
      row.date,
      row.part_number,
      row.site,
      row.nc_category,
      row.category,
      row.sub_category,
      row.description,
    ]);

    console.log(formatted_rows);

    sheet.addTable({
      name: "ReportTable",
      ref: "A1", // posizione d’inizio
      headerRow: true,
      style: {
        theme: "TableStyleMedium9", // puoi cambiare tema
        showRowStripes: true,
      },
      columns,
      rows: formatted_rows,
    });

    sheet.columns.forEach((column) => {
      let maxLength = 10; // larghezza minima
      column.eachCell({ includeEmpty: true }, (cell) => {
        const cellValue = cell.value ? cell.value.toString() : "";
        maxLength = Math.max(maxLength, cellValue.length + 2); // +2 padding
      });
      column.width = maxLength;
    });

    const buffer = await workbook.xlsx.writeBuffer();

    // Usa FileSaver per scaricare
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    console.log(analysisId);

    const fileName = `analysis_${analysisId.toString()}_dataset_${format(
      new Date(),
      "HH_mm__dd_MM_yyyy"
    )}.xlsx`;

    saveAs(blob, fileName);
  },
}));

export default useAnalysisOverview;
