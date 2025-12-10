import axios from "axios";
import { create } from "zustand";
// import axios from "axios";
import ExcelJS from "exceljs";
import { format } from "date-fns";
import { saveAs } from "file-saver";

const FAKE_DATSET_ID_CATEGORY_DESCRIPTIONS = [
  {
    id: 1,
    category: "Quarzo Interrotto",
    description:
      "Durante il controllo visivo è stato identificato un componente con quarzo completamente interrotto, incapace di garantire l’oscillazione prevista. Il pezzo risulta non recuperabile e viene avviato a scarto.",
    code: 695670976,
  },
  {
    id: 2,
    category: "Quarzo Interrotto",
    description:
      "Nel corso delle verifiche funzionali, un lotto presenta quarzi che non generano segnale a causa di una frattura interna. Gli elementi risultano inservibili e non proseguono alla fase di collaudo.",
    code: 695962898,
  },
  {
    id: 3,
    category: "Quarzo Interrotto",
    description:
      "Il quarzo del componente testato non risulta integro: l'involucro presenta microfratture interne che compromettono la generazione stabile dell’oscillazione.",
    code: 696873431,
  },

  {
    id: 4,
    category: "Quarzo Decentrato",
    description:
      "Il quarzo del componente analizzato risulta installato in posizione non corretta, con evidente decentramento rispetto all’alloggiamento previsto, causando instabilità del segnale generato.",
    code: 697277705,
  },
  {
    id: 5,
    category: "Quarzo Decentrato",
    description:
      "Rilevata una posizione asimmetrica del quarzo che compromette l'accoppiamento con il circuito stampato. Il componente non supera il controllo dimensionale.",
    code: 697556969,
  },
  {
    id: 6,
    category: "Quarzo Decentrato",
    description:
      "Il quarzo installato non è correttamente centrato sul pad metallico, creando un disallineamento che interferisce con la lettura del segnale da parte del circuito.",
    code: 698103320,
  },
  {
    id: 7,
    category: "Quarzo Decentrato",
    description:
      "Il quarzo assemblato presenta un disallineamento laterale tale da compromettere il corretto contatto con i punti di saldatura, impedendo la validazione del componente.",
    code: 698115093,
  },

  {
    id: 8,
    category: "Fotoincisione Decentrata",
    description:
      "L’analisi del substrato evidenzia una fotoincisione decentrata rispetto agli assi di riferimento, causando un disallineamento critico tra le piste conduttive.",
    code: 699311159,
  },
  {
    id: 9,
    category: "Fotoincisione Decentrata",
    description:
      "Durante il controllo AOI è stata riscontrata una fotoincisione spostata verso il bordo, con rischio di cortocircuito nelle fasi successive di saldatura.",
    code: 700015662,
  },
  {
    id: 10,
    category: "Fotoincisione Decentrata",
    description:
      "La fotoincisione mostra un offset significativo tra layer superiore e inferiore, che compromette la funzionalità del tracciato multilayer progettato.",
    code: 700182159,
  },

  {
    id: 11,
    category: "Fotoincisione Interrotta",
    description:
      "La pista fotoincisa mostra un’interruzione lungo il tracciato principale, impedendo la continuità elettrica richiesta. Il componente risulta irrimediabilmente compromesso.",
    code: 700591453,
  },
  {
    id: 12,
    category: "Fotoincisione Interrotta",
    description:
      "La fotoincisione sul layer superiore presenta una rottura visibile al microscopio, con perdita completa del percorso conduttivo. Non è possibile procedere con la riparazione.",
    code: 700773453,
  },
  {
    id: 13,
    category: "Fotoincisione Interrotta",
    description:
      "Il controllo elettrico ha evidenziato un’interruzione nella sezione di fotoincisione dedicata alla linea di alimentazione, impedendo il passaggio di corrente.",
    code: 701375605,
  },
  {
    id: 14,
    category: "Fotoincisione Interrotta",
    description:
      "È stata rilevata una fotoincisione non continua sul percorso di segnale ad alta frequenza, determinando un malfunzionamento del circuito nella fase di test RF.",
    code: 701726956,
  },

  {
    id: 15,
    category: "Substrato Fuori Specifica",
    description:
      "Il substrato prodotto presenta dimensioni finali non conformi ai limiti di tolleranza previsti dal disegno tecnico, rendendo impossibile il corretto assemblaggio a monte della linea.",
    code: 702413334,
  },
  {
    id: 16,
    category: "Substrato Fuori Specifica",
    description:
      "Durante la misurazione metrologica è stata rilevata una planarità del substrato non conforme, tale da compromettere la stabilità meccanica del modulo assemblato.",
    code: 703015240,
  },
  {
    id: 17,
    category: "Substrato Fuori Specifica",
    description:
      "Rilevata variazione dello spessore del substrato oltre la tolleranza ammessa, con conseguente difficoltà di accoppiamento con gli strati successivi del laminato.",
    code: 703839762,
  },
  {
    id: 18,
    category: "Substrato Fuori Specifica",
    description:
      "La superficie del substrato presenta difetti geometrici che superano i limiti di tolleranza, risultando non idonea ai successivi trattamenti superficiali.",
    code: 704304976,
  },

  {
    id: 19,
    category: "Accoppiamento Diretto Fuori Specifica",
    description:
      "La dimensione dell’accoppiamento diretto tra componente e housing risulta fuori specifica, causando un gioco eccessivo che compromette la funzionalità del sistema.",
    code: 704429208,
  },
  {
    id: 20,
    category: "Accoppiamento Diretto Fuori Specifica",
    description:
      "Il controllo dimensionale ha evidenziato un accoppiamento diretto superiore al limite massimo consentito, impedendo la corretta chiusura del gruppo meccanico.",
    code: 704896443,
  },
  {
    id: 21,
    category: "Accoppiamento Diretto Fuori Specifica",
    description:
      "Il dimensionamento dell’accoppiamento diretto fra piastra e componente elettronico è inferiore al valore minimo richiesto, causando interferenze meccaniche durante il montaggio.",
    code: 705177638,
  },
];

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
  previous_data: {
    is_stored: false,
    categories: [],
    dataset: [],
  },

  setPreviousData: (categories, dataset, is_stored) => {
    set({
      previous_data: {
        is_stored: is_stored,
        categories: categories,
        dataset: dataset,
      },
    });
  },

  backToPreviousData: () => {
    const previous_data = get().previous_data;
    if (!previous_data.is_stored) return;
    const categories = get().categories;
    const dataset = get().dataset;
    set({
      categories: previous_data.categories,
      dataset: previous_data.dataset,
      previous_data: {
        is_stored: true,
        categories: categories,
        dataset: dataset,
      },
    });
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
        let dataset;
        if (analysisId == 12356) {
          dataset = FAKE_DATSET_ID_CATEGORY_DESCRIPTIONS.map((item, i) => {
            return {
              id: item.code,
              date: `2024-05-${(i + 1).toString().padStart(2, "0")}`,
              site: "Fornitore esterno XYZ Ltd.",
              part_number: Math.floor(10000 + Math.random() * 90000).toString(),
              nc_category: ["ingegneristica", "produzione", "fornitore"].sort(
                () => Math.random() - 0.5
              )[0],
              category: item.category,
              parent_category: "",
              description: item.description,
            };
          });
        } else {
          dataset = Array.from({ length: 100 }, (_, i) => ({
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
        }

        const data = get().data || {};
        if (data.analysis_status !== "Failed") {
          data.description = "Updated description with dataset loaded.";
        }
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

  setDataset: (dataset) => {
    set({ dataset: dataset });
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
