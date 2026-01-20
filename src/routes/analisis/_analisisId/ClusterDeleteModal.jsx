import useAnalysisOverview from "../../../stores/useAnalysisOverview";
import { useEffect, useState } from "react";

function ClusterDeleteModal({ setShowClusterDeleteMenu }) {
  const {
    selectedCategory,
    setSelectedCategory,
    deleteCategoryAndReassignRecords,
  } = useAnalysisOverview();
  const [timeout, setTimeout] = useState(3);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeout((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000); // Aggiorna ogni secondo

    return () => clearInterval(interval); // Pulisce l'intervallo al termine del componente
  }, [timeout]);

  return (
    <div className="overlay">
      <div className="open-cluster-menu">
        <p>
          <b>Attenzione</b>
          <br />
          <br />
          Stai per eliminare la categoria:
          <br />
          <br />
          <b>{selectedCategory}</b>
        </p>
        <div className="buttons-section">
          <button
            className="secondary no-wrap"
            disabled={timeout > 0}
            onClick={() => {
              deleteCategoryAndReassignRecords(selectedCategory);
              setSelectedCategory("");
              setShowClusterDeleteMenu(false);
            }}
          >
            Conferma Eliminazione {timeout > 0 && "(" + timeout + ")"}
          </button>
          <button
            className="secondary no-wrap"
            onClick={() => {
              setShowClusterDeleteMenu(false);
            }}
          >
            Annulla
          </button>
        </div>
      </div>
    </div>
  );
}

export default ClusterDeleteModal;
