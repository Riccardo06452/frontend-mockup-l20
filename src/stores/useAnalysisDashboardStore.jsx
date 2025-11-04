// import { data } from "react-router-dom";
import { create } from "zustand";
// import axios from "axios";

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

  is_filters_menu_visible: false,
  is_create_analysis_menu_visible: false,
  options: {
    site_options: [
      { label: "Tutti i siti", value: null },
      { label: "Sede Centrale", value: "Sede Centrale" },
      {
        label: "Fornitore esterno XYZ Ltd.",
        value: "Fornitore esterno XYZ Ltd.",
      },
      { label: "Magazzino 3", value: "Magazzino 3" },
    ],
    part_numbers_options: [
      { label: "Tutti i PN", value: null },
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
      { label: "Aperto", value: "aperto" },
      { label: "In lavorazione", value: "in lavorazione" },
      { label: "Chiuso", value: "chiuso" },
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
              subCategories: state.categories[categoryKey].subCategories.map(
                (subCategory) => ({
                  ...subCategory,
                  selected: !state.categories[categoryKey].selected,
                })
              ),
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

  toggleSubCategorySelected: (categoryKey, subCategoryIndex) => {
    set((state) => {
      if (
        categoryKey in state.categories &&
        subCategoryIndex >= 0 &&
        subCategoryIndex < state.categories[categoryKey].subCategories.length
      ) {
        const new_sub_category = state.categories[
          categoryKey
        ].subCategories.map((subCat, index) => {
          if (subCategoryIndex === index) {
            return {
              ...subCat,
              selected: !subCat.selected,
            };
          }
          return subCat;
        });
        console.log("Toggling sub-category:", categoryKey, subCategoryIndex);
        console.log("new sub-categories:", new_sub_category);

        return {
          categories: {
            ...state.categories,
            [categoryKey]: {
              ...state.categories[categoryKey],
              subCategories: new_sub_category,
              selected: new_sub_category.some((subCat) => subCat.selected),
            },
          },
        };
      } else {
        return state;
      }
    });
  },

  toggleCategoryExpanded: (categoryKey) => {
    set((state) => {
      if (categoryKey in state.categories) {
        console.log("Toggling expansion for category:", categoryKey);
        return {
          categories: {
            ...state.categories,
            [categoryKey]: {
              ...state.categories[categoryKey],
              expanded: !state.categories[categoryKey].expanded,
            },
          },
        };
      } else {
        console.warn(
          `Attempted to toggle expansion for unknown category key: ${categoryKey}`
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
    const response = {};
    for (let index = 0; index < 100; index++) {
      response[`category_${index}`] = {
        title: `Category ${index}`,
        selected: false,
        expanded: false,
        subCategories: Array.from([
          {
            title: `Sub-category ${index}-A`,
            selected: false,
          },
          {
            title: `Sub-category ${index}-B`,
            selected: false,
          },
          {
            title: `Sub-category ${index}-C`,
            selected: false,
          },
        ]),
      };
    }
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
            id: 1,
            created_at: "12/05/2024 14:30",
            range_date: "01/05/2024 - 10/05/2024",
            site: "Fornitore esterno XYZ Ltd.",
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
            status: "Aperto",
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
            site: "Fornitore esterno XYZ Ltd.",
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
            status: "Aperto",
            num_records: 458,
            description: `Lorem, ipsum dolor sit amet consectetur adipisicing elit.
        Rem doloribus aliquam facilis facere! Quos eveniet facere voluptatum eaque!
        Itaque esse, reprehenderit fugit iusto consequatur aperiam. Amet a blanditiis
        fuga laborum fugiat quidem eos quae quasi sapiente in. Ut, modi cumque nostrum
        fuga aperiam doloribus laborum, fugit deserunt molestias libero non!`,
            num_categories: 47,
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
        fakeData = fakeData.filter((item) => item.stato === filters.status);
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

    const new_data = {
      id: 200000 + Math.floor(Math.random() * 10000), // Random ID for demo purposes
      created_at: new Date().toLocaleString(),
      range_date: `${get().filters.date_from.toLocaleDateString()} - ${get().filters.date_to.toLocaleDateString()}`,
      site: get().filters.site || "All sites",
      part_numbers: get().filters.part_number
        ? [get().filters.part_number]
        : [],
      nc_category: get().filters.nc_category || "All categories",
      nc_category_options: "N/A",
      status: "Open",
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
}));

export default useAnalysisDashboardStore;
