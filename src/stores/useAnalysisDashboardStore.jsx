// import { data } from "react-router-dom";
import axios from "axios";
import { create } from "zustand";
// import axios from "axios";
import ExcelJS from "exceljs";
import { format } from "date-fns";
import { saveAs } from "file-saver";

const useAnalysisDashboardStore = create((set, get) => ({
  filters: {
    date_from: new Date("1999-01-01"),
    date_to: new Date(),
    site: null,
    part_number: null,
    nc_category: null,
    status: null,
  },
  categories: {},
  description: "",
  data: [],
  selected_analysis_id: null,
  selected_analysis_data: null,
  selected_analysis_categories: [],

  is_filters_menu_visible: false,
  is_create_analysis_menu_visible: false,
  options: {
    site_options: [
      {
        label: "OFIR",
        value: "OFIR",
      },
      {
        label: "OMON",
        value: "OMON",
      },
    ],
    part_numbers_options: [
      { label: "12356", value: "12356" },
      { label: "78901", value: "78901" },
      { label: "45623", value: "45623" },
      { label: "98745", value: "98745" },
      { label: "32165", value: "32165" },
      { label: "65432", value: "65432" },
      { label: "11223", value: "11223" },
      { label: "33445", value: "33445" },
      { label: "55667", value: "55667" },
    ],
    nc_category_options: [
      { label: "Tutte le categorie", value: null },
      { label: "Ingegneristica", value: "ingegneristica" },
      { label: "Produzione", value: "produzione" },
      { label: "Fornitore", value: "fornitore" },
      { label: "Logistica", value: "logistica" },
    ],
    status_options: [
      { label: "Tutti gli stati", value: null },
      { label: "Aperto", value: "Aperto" },
      { label: "In lavorazione", value: "in lavorazione" },
      { label: "Chiuso", value: "Chiuso" },
    ],
  },

  toggleFiltersMenu: () => {
    set((state) => ({
      is_filters_menu_visible: !state.is_filters_menu_visible,
      is_create_analysis_menu_visible: false,
    }));

    if (get().is_filters_menu_visible === false) {
      get().fetchData();
    }
  },

  toggleCreateAnalysisMenu: () =>
    set((state) => ({
      is_create_analysis_menu_visible: !state.is_create_analysis_menu_visible,
      is_filters_menu_visible: false,
    })),

  toggleCategorySelected: (categoryKey) => {
    set((state) => {
      if (categoryKey in state.categories) {
        console.log("Toggling category:", categoryKey);
        return {
          categories: {
            ...state.categories,
            [categoryKey]: {
              ...state.categories[categoryKey],
              selected: !state.categories[categoryKey].selected,
            },
          },
        };
      } else {
        console.warn(
          `Attempted to toggle unknown category key: ${categoryKey}`
        );
        return state;
      }
    });
  },

  setFilters: (newFilters) =>
    set((state) => {
      const updatedFilters = { ...state.filters };

      for (const key in newFilters) {
        if (key in state.filters) {
          updatedFilters[key] = newFilters[key];
        } else {
          console.warn(`Attempted to set unknown filter key: ${key}`);
        }
      }
      return {
        ...state,
        filters: updatedFilters,
      };
    }),

  setDescription: (description) => {
    let capital_description =
      description.charAt(0).toUpperCase() + description.slice(1);
    set({ description: capital_description });
  },

  resetFilters: () => set({ filters: {} }),

  fetchCategories: async (userID) => {
    console.log("Fetching categories for user:", userID);
    // const response = await axios.get("/api/categories", { params: { userID} });
    const response = {
      category_1: {
        title: `Quarzo Interrotto`,
        selected: false,
        description: `Il quarzo all'interno del componente elettronico è interrotto, causando un malfunzionamento irreparabile. Questo difetto è di natura funzionale e impedisce il corretto avanzamento del prodotto nelle fasi successive di lavoro.`,
      },
      category_2: {
        title: `Quarzo Decentrato`,
        selected: false,
        description: `Il quarzo all'interno del componente elettronico è posizionato in modo decentrato, compromettendo il corretto funzionamento del dispositivo. Questo difetto è di natura dimensionale e può impedire il proseguimento del processo di produzione.`,
      },
      category_3: {
        title: `Fotoincisione Decentrata`,
        selected: false,
        description: `La fotoincisione sul substrato è posizionata in modo decentrato, causando una non conformità visiva e dimensionale. Questo difetto impedisce il passaggio del componente ai test successivi e richiede lo scarto del prodotto.`,
      },
      category_4: {
        title: `Fotoincisione Interrotta`,
        selected: false,
        description: `La fotoincisione sul substrato è interrotta, causando una non conformità visiva e funzionale. Questo difetto rende il componente non riparabile e richiede la sua eliminazione dal processo di produzione.`,
      },
      category_5: {
        title: `Substrato Fuori Specifica`,
        selected: false,
        description: `Il substrato finale del flusso di montaggio non risponde alle specifiche richieste, causando un malfunzionamento funzionale. Questo difetto impedisce il proseguimento del processo di produzione e richiede lo scarto del prodotto.`,
      },
      category_6: {
        title: `Accoppiamento Diretto Fuori Specifica`,
        selected: false,
        description: `La misura di accoppiamento diretto del componente non rientra nelle specifiche richieste, causando una non conformità funzionale. Questo difetto impedisce il passaggio del componente ai test successivi e richiede la sua eliminazione dal processo di produzione.`,
      },
    };
    set({ categories: response });
  },

  fetchData: async () => {
    try {
      const { filters } = get();
      // const response = await axios.get("/api/analysis", { params: filters });
      //TODO: replace with real API call
      console.log("Fetching data with filters:", filters);
      let fakeData = localStorage.getItem("fakeData");
      if (!fakeData) {
        fakeData = [
          {
            id: 14756,
            created_at: "12/05/2024 14:30",
            range_date: "01/05/2024 - 10/05/2024",
            site: "OFIR",
            part_numbers: [
              "12356",
              "78901",
              "45623",
              "98745",
              "32165",
              "65432",
              "11223",
              "33445",
              "55667",
            ],
            nc_category: "NC ingegneristica",
            nc_category_options: "produzione",
            data_status: "Aperto",
            analysis_status: "Failed",
            num_records: 458,
            description: `It is not possible to proceed with the analysis because the dataset contains an excessive number of NULL values.`,
            num_categories: 47,
          },
          {
            id: 1,
            created_at: "12/05/2024 14:30",
            range_date: "01/05/2024 - 10/05/2024",
            site: "OFIR",
            part_numbers: [
              "12356",
              "78901",
              "45623",
              "98745",
              "32165",
              "65432",
              "11223",
              "33445",
              "55667",
            ],
            nc_category: "NC ingegneristica",
            nc_category_options: "produzione",
            data_status: "Aperto",
            analysis_status: "Processed",
            num_records: 458,
            description: `Lorem, ipsum dolor sit amet consectetur adipisicing elit.
        Rem doloribus aliquam facilis facere! Quos eveniet facere voluptatum eaque!
        Itaque esse, reprehenderit fugit iusto consequatur aperiam. Amet a blanditiis
        fuga laborum fugiat quidem eos quae quasi sapiente in. Ut, modi cumque nostrum
        fuga aperiam doloribus laborum, fugit deserunt molestias libero non!`,
            num_categories: 47,
          },
          {
            id: 12356,
            created_at: "12/05/2024 14:30",
            range_date: "01/05/2024 - 10/05/2024",
            site: "OFIR",
            part_numbers: [
              "12356",
              "78901",
              "45623",
              "98745",
              "32165",
              "65432",
              "11223",
              "33445",
              "55667",
            ],
            nc_category: "NC ingegneristica",
            nc_category_options: "produzione",
            data_status: "Aperto",
            analysis_status: "Validated",
            num_records: 21,
            description: `This is an example based on a real analysis with changed data for privacy reasons.`,
            num_categories: 6,
          },
        ];
        localStorage.setItem("fakeData", JSON.stringify(fakeData));
      } else {
        fakeData = JSON.parse(fakeData);
      }

      if (filters.date_from != null) {
        //filter fakeData by date_from
        fakeData = fakeData.filter((item) => {
          const itemDate = new Date(
            item.range_date
              .split(" - ")[1]
              .split(" ")[0]
              .split("/")
              .reverse()
              .join("-")
          );
          const filterDate = new Date(filters.date_from);
          return itemDate >= filterDate;
        });
      }

      if (filters.date_to != null) {
        //filter fakeData by date_to
        fakeData = fakeData.filter((item) => {
          const itemDate = new Date(
            item.range_date
              .split(" - ")[0]
              .split(" ")[0]
              .split("/")
              .reverse()
              .join("-")
          );
          const filterDate = new Date(filters.date_to);
          return itemDate <= filterDate;
        });
      }

      if (filters.site != null) {
        fakeData = fakeData.filter((item) => item.site === filters.site);
      }

      if (filters.part_number != null) {
        fakeData = fakeData.filter((item) =>
          item.part_numbers.includes(filters.part_number)
        );
      }

      if (filters.nc_category != null) {
        fakeData = fakeData.filter(
          (item) => item.categoria_NC === filters.nc_category
        );
      }

      if (filters.status != null) {
        fakeData = fakeData.filter(
          (item) => item.data_status === filters.status
        );
      }

      const response = {
        data: fakeData,
      };
      set({ data: response.data, is_filters_menu_visible: false });
    } catch (error) {
      console.error("Error fetching analysis data:", error);
    }
  },

  sendCreateAnalysisRequest: () => {
    // response = await axios.post("/api/create_analysis", { userID, ...get().filters, description: get().description, categories: get().categories });
    // alert("Creating analysis with data:" + JSON.stringify(get()));

    if (
      get().description.trim() === "" &&
      !Object.values(get().categories).some((category) => category.selected)
    ) {
      return null;
    }
    console.log("filters: ", get().filters);

    const new_data = {
      id: 200000 + Math.floor(Math.random() * 10000), // Random ID for demo purposes
      created_at: new Date().toLocaleString(),
      range_date: `${get().filters.date_from.toLocaleDateString()} - ${get().filters.date_to.toLocaleDateString()}`,
      site: get().filters.site || "All sites",
      part_numbers: get().filters.part_number,
      nc_category: get().filters.nc_category || "All categories",
      nc_category_options: "N/A",
      data_status: get().filters.status || "N/A",
      analysis_status: "Editing",
      num_records: Math.floor(Math.random() * 1000), // Random number for demo purposes
      description: get().description,
      num_categories: 0,
    };
    set((state) => {
      state.data.unshift(new_data);

      let fakeData = localStorage.getItem("fakeData");
      if (fakeData) {
        fakeData = JSON.parse(fakeData);
        fakeData.unshift(new_data);
        localStorage.setItem("fakeData", JSON.stringify(fakeData));
      }

      return { data: state.data };
    });
    set({ is_create_analysis_menu_visible: false });
    return new_data.id;
  },

  fetchDataFromAnalysisId: async (analysisId) => {
    set({ selected_analysis_id: analysisId });
    axios
      .get("/api/analysis/" + analysisId)
      .then((response) => {
        set({ selected_analysis_data: response.data });
      })
      .catch((e) => {
        console.log("Error fetching analysis data for ID:", analysisId, e);
      })
      .then(() => {
        console.log("Finished fetching analysis data for ID:", analysisId);
        const localStorageFakeAnalysis = localStorage.getItem(
          "fakeAnalysisData_" + analysisId
        );
        if (localStorageFakeAnalysis) {
          set({ selected_analysis_data: JSON.parse(localStorageFakeAnalysis) });
        } else {
          if (analysisId.toString().startsWith("1")) {
            //generate fake analysis data
            const categories = ["OLED", "DIFETTI"];
            const selected_category = categories[Math.floor(Math.random() * 2)];
            const sub_categories_map = {
              OLED: ["SCHERMO GUASTO", "SOFTWARE GUASTO"],
              DIFETTI: ["ESTETICI", "FUNZIONALI"],
            };
            const fakeAnalysisData = {
              description:
                "Analisi dettagliata per l'ID generata dall intelligenza artificiale" +
                analysisId,
              dataset: Array.from({ length: 10 }, (_, i) => ({
                id: i + 1,
                date: `2024-05-${(i + 1).toString().padStart(2, "0")}`,
                site: "Fornitore esterno XYZ Ltd.",
                part_number: Math.floor(
                  10000 + Math.random() * 90000
                ).toString(),
                nc_category: ["ingegneristica", "produzione", "fornitore"].sort(
                  () => Math.random() - 0.5
                )[0],
                category: selected_category,
                sub_category:
                  sub_categories_map[selected_category][
                    Math.floor(Math.random() * 2)
                  ],
                description: "Descrizione del record " + (i + 1),
              })),
            };
            localStorage.setItem(
              "fakeAnalysisData_" + analysisId,
              JSON.stringify(fakeAnalysisData)
            );
            set({ selected_analysis_data: fakeAnalysisData });
          }
        }
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

  deleteAnalysisById: (analysisId) => {
    console.log("deleting analysis with id:", analysisId);

    let fakeData = localStorage.getItem("fakeData");
    if (fakeData) {
      fakeData = JSON.parse(fakeData);
      fakeData = fakeData.filter((item) => item.id != analysisId);
      localStorage.setItem("fakeData", JSON.stringify(fakeData));
    } else {
      fakeData = get().data;
      fakeData = fakeData.filter((item) => item.id != analysisId);
      localStorage.setItem("fakeData", JSON.stringify(fakeData));
    }
    get().fetchData();
  },
}));

export default useAnalysisDashboardStore;
