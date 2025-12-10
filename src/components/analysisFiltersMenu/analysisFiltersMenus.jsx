import "./analysisFiltersMenus.scss";
import useAnalysisDashboardStore from "../../stores/useAnalysisDashboardStore";
import { useEffect, useState, useMemo } from "react";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import Select from "react-select";
import { useNavigate } from "react-router-dom";

function AnalysisFiltersMenu() {
  const {
    categories,
    toggleCategorySelected,
    filters,
    setFilters,
    toggleFiltersMenu,
    toggleCreateAnalysisMenu,
    is_filters_menu_visible,
    is_create_analysis_menu_visible,
    fetchData,
    sendCreateAnalysisRequest,
    fetchCategories,
    options,
    description,
    setDescription,
  } = useAnalysisDashboardStore();

  const [category_filter, setCategoryFilter] = useState("");
  const navigate = useNavigate();
  const [invalidInput, setInvalidInput] = useState(false);

  useEffect(() => {
    if (is_filters_menu_visible || is_create_analysis_menu_visible) {
      fetchCategories();
    }
  }, [
    is_filters_menu_visible,
    is_create_analysis_menu_visible,
    fetchCategories,
  ]);

  const sendCreateAnalysisRequestAndRedirect = () => {
    const id = sendCreateAnalysisRequest();
    console.log("id created:", id);

    if (id != null) {
      setInvalidInput(false);
      navigate("/analysis/dashboard/" + id);
    } else {
      setInvalidInput(true);
    }
  };

  const filteredCategories = useMemo(() => {
    console.log("Categories updated");

    if (!category_filter?.trim()) return Object.entries(categories);

    const filter = category_filter.toLowerCase();

    return Object.entries(categories)
      .filter(
        ([, category]) =>
          category.title.toLowerCase().includes(filter) ||
          category.subCategories?.some((subCat) =>
            subCat.title.toLowerCase().includes(filter)
          )
      )
      .map(([key, category]) => {
        if (
          category.title.toLowerCase().includes(filter) ||
          category.description?.toLowerCase().includes(filter)
        ) {
          return [key, category];
        }

        const filteredSubCategories = category.subCategories.filter((subCat) =>
          subCat.title.toLowerCase().includes(filter)
        );

        return [
          key,
          {
            ...category,
            subCategories: filteredSubCategories,
          },
        ];
      });
  }, [category_filter, categories]);

  const toggle_visibility = (event) => {
    if (event.target.classList.contains("background-layer")) {
      if (is_filters_menu_visible) {
        toggleFiltersMenu();
      } else {
        toggleCreateAnalysisMenu();
      }
    }
  };

  const find_option_from_value = (options, value) => {
    if (typeof value === "string") {
      return options.find((option) => option.value === value) || null;
    } else if (Array.isArray(value)) {
      return options.filter((option) => value.includes(option.value));
    }
  };

  return (
    <>
      <div
        className={
          is_filters_menu_visible || is_create_analysis_menu_visible
            ? "visible"
            : "hidden"
        }
      >
        <div
          className="background-layer"
          onClick={(event) => toggle_visibility(event)}
        >
          <div className="filters-box">
            <div className="title-box">
              <div className="title">Menu Filtri</div>
            </div>
            <div className="filters-area">
              <div className="col left-column">
                <div className="row top-row">
                  <div className="input">
                    <label htmlFor="start-date">Date da:</label>
                    <Flatpickr
                      placeholder="Data inizio"
                      id="start-date"
                      data-enable-time
                      value={filters.date_from}
                      onChange={([selectedDate]) =>
                        setFilters({ date_from: selectedDate })
                      }
                      options={{
                        dateFormat: "d-m-Y",
                        maxDate: new Date(),
                        locale: {
                          firstDayOfWeek: 1, // Set Monday as the first day of the week
                          weekdays: {
                            shorthand: [
                              "Dom",
                              "Lun",
                              "Mar",
                              "Mer",
                              "Gio",
                              "Ven",
                              "Sab",
                            ],
                            longhand: [
                              "Domenica",
                              "Lunedì",
                              "Martedì",
                              "Mercoledì",
                              "Giovedì",
                              "Venerdì",
                              "Sabato",
                            ],
                          },
                          months: {
                            shorthand: [
                              "Gen",
                              "Feb",
                              "Mar",
                              "Apr",
                              "Mag",
                              "Giu",
                              "Lug",
                              "Ago",
                              "Set",
                              "Ott",
                              "Nov",
                              "Dic",
                            ],
                            longhand: [
                              "Gennaio",
                              "Febbraio",
                              "Marzo",
                              "Aprile",
                              "Maggio",
                              "Giugno",
                              "Luglio",
                              "Agosto",
                              "Settembre",
                              "Ottobre",
                              "Novembre",
                              "Dicembre",
                            ],
                          },
                        },
                      }}
                    />
                  </div>
                  <div className="input">
                    <label htmlFor="end-date">a:</label>
                    <Flatpickr
                      placeholder="Data fine"
                      id="end-date"
                      data-enable-time
                      value={filters.date_to}
                      onChange={([selectedDate]) =>
                        setFilters({ date_to: selectedDate })
                      }
                      options={{
                        dateFormat: "d-m-Y",
                        maxDate: new Date(),
                        locale: {
                          firstDayOfWeek: 1, // Set Monday as the first day of the week
                          weekdays: {
                            shorthand: [
                              "Dom",
                              "Lun",
                              "Mar",
                              "Mer",
                              "Gio",
                              "Ven",
                              "Sab",
                            ],
                            longhand: [
                              "Domenica",
                              "Lunedì",
                              "Martedì",
                              "Mercoledì",
                              "Giovedì",
                              "Venerdì",
                              "Sabato",
                            ],
                          },
                          months: {
                            shorthand: [
                              "Gen",
                              "Feb",
                              "Mar",
                              "Apr",
                              "Mag",
                              "Giu",
                              "Lug",
                              "Ago",
                              "Set",
                              "Ott",
                              "Nov",
                              "Dic",
                            ],
                            longhand: [
                              "Gennaio",
                              "Febbraio",
                              "Marzo",
                              "Aprile",
                              "Maggio",
                              "Giugno",
                              "Luglio",
                              "Agosto",
                              "Settembre",
                              "Ottobre",
                              "Novembre",
                              "Dicembre",
                            ],
                          },
                        },
                      }}
                    />
                  </div>
                  <div className="input">
                    <label htmlFor="input-site">Sito: </label>
                    <Select
                      id="input-site"
                      options={options.site_options}
                      value={find_option_from_value(
                        options.site_options,
                        filters.site
                      )}
                      onChange={(selectedOption) =>
                        setFilters({ site: selectedOption?.value || null })
                      }
                      className="select-component"
                      isMulti={true}
                    />
                  </div>
                  <div className="input">
                    <label htmlFor="input-pn">Part Number: </label>
                    <Select
                      id="input-pn"
                      options={options.part_numbers_options}
                      value={find_option_from_value(
                        options.part_numbers_options,
                        filters.part_number
                      )}
                      onChange={(selectedOption) =>
                        setFilters({
                          part_number: selectedOption?.value || null,
                        })
                      }
                      className="select-component"
                      isMulti={true}
                      placeholder="All PNs"
                    />
                  </div>
                  <div className="input">
                    <label htmlFor="input-nc-category">Categoria NC: </label>
                    <Select
                      id="input-nc-category"
                      options={options.nc_category_options}
                      value={find_option_from_value(
                        options.nc_category_options,
                        filters.nc_category
                      )}
                      onChange={(selectedOption) =>
                        setFilters({
                          nc_category: selectedOption?.value || null,
                        })
                      }
                      className="select-component"
                    />
                  </div>
                  <div className="input">
                    <label htmlFor="input-status">Stato: </label>
                    <Select
                      id="input-site"
                      options={options.status_options}
                      value={find_option_from_value(
                        options.status_options,
                        filters.status
                      )}
                      onChange={(selectedOption) =>
                        setFilters({
                          status: selectedOption?.value || null,
                        })
                      }
                      className="select-component"
                    />
                  </div>
                </div>
                {is_create_analysis_menu_visible && (
                  <div className="row bottom-row">
                    <label htmlFor="description">
                      <h3>DESCRIZIONE DEL SET DI DATI DA UTILIZZARE</h3>
                    </label>
                    <textarea
                      name="description"
                      id="description"
                      value={description}
                      onChange={(element) =>
                        setDescription(element.target.value)
                      }
                      className={invalidInput ? "invalid-input" : ""}
                    ></textarea>
                  </div>
                )}
              </div>
              {is_create_analysis_menu_visible && (
                <div
                  className={
                    invalidInput
                      ? "col right-column invalid-input"
                      : "col right-column"
                  }
                >
                  <h3>CATEGORIE DA INCLUDERE NELL'ANALISI</h3>
                  <input
                    type="text"
                    id="search"
                    class="search"
                    placeholder="Cerca tra le categorie..."
                    value={category_filter}
                    onChange={(event) => setCategoryFilter(event.target.value)}
                  />
                  <ul>
                    {filteredCategories.map(([key, category]) => (
                      <li key={key}>
                        <div className="accordion">
                          <div
                            className="top-section"
                            onClick={(event) => {
                              event.stopPropagation();
                              toggleCategorySelected(key);
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={category.selected}
                              readOnly
                            />
                            <span>
                              <b>{category.title + ": "}</b>
                              {category.description}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {invalidInput && (
                <div className="error">
                  You should select either a category or provide a description!
                </div>
              )}
              <div className="buttons-submit">
                {is_create_analysis_menu_visible ? (
                  <button
                    className="primary"
                    onClick={sendCreateAnalysisRequestAndRedirect}
                  >
                    Crea Analisi
                  </button>
                ) : (
                  <button className="" onClick={fetchData}>
                    Applica Filtri
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AnalysisFiltersMenu;
