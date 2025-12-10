import { useEffect, useState } from "react";
import useAnalysisOverview from "../../../stores/useAnalysisOverview";

function OverviewClusterMenuPrompt({ setShowClusterStartMenu }) {
  const [clusterDescription, setClusterDescription] = useState("");
  const [fakeTimer, setFakeTimer] = useState(0);

  const {
    selectedCategoryToCluster,
    setSelectedCategoryToCluster,
    setMockedCategoriesToValidate,
  } = useAnalysisOverview();

  useEffect(() => {
    const interval = setInterval(() => {
      if (fakeTimer === 1) {
        const selectedCategoryName = selectedCategoryToCluster.includes(" _ ")
          ? selectedCategoryToCluster.replace(" _ ", " ")
          : selectedCategoryToCluster;
        setMockedCategoriesToValidate([
          {
            name: selectedCategoryName + " - simulato 1",
            description: "simulazione 1",
            selected: true,
          },
          {
            name: selectedCategoryName + " - simulato 2",
            description: "simulazione 2",
            selected: true,
          },
          {
            name: selectedCategoryName + " - simulato 3",
            description: "simulazione 3",
            selected: true,
          },
        ]);
        setShowClusterStartMenu(false);
      }
      setFakeTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000); // Aggiorna ogni 5 secondi

    return () => clearInterval(interval); // Pulisce l'intervallo al termine del componente
  }, [
    fakeTimer,
    selectedCategoryToCluster,
    setMockedCategoriesToValidate,
    setSelectedCategoryToCluster,
  ]);

  return (
    <div className="overlay">
      <div className="open-cluster-menu">
        {fakeTimer == 0 ? (
          <>
            <p>
              <b>Attenzione</b>
              <br />
              <br />
              {selectedCategoryToCluster.includes(" _ ")
                ? "Si sta creando una nuova categoria a partire dalla sottocategoria esistente:"
                : "si sta procedendo a creare ulteriori cluster per la categoria già esistente:"}
              <br />
              <br />
              <b>
                {selectedCategoryToCluster.includes(" _ ")
                  ? selectedCategoryToCluster.replace(" _ ", " - ")
                  : selectedCategoryToCluster}
              </b>
            </p>
            <textarea
              name="description"
              id="description"
              value={clusterDescription}
              onChange={(element) => {
                console.log(clusterDescription);

                setClusterDescription(element.target.value);
              }}
              placeholder="Inserisci una descrizione per il nuovo cluster..."
            ></textarea>
            <div className="buttons-section">
              <button
                className="secondary no-wrap"
                disabled={
                  clusterDescription.trim() === "" ||
                  clusterDescription.length < 10
                }
                onClick={() => {
                  setFakeTimer(10);
                }}
              >
                Conferma
              </button>
              <button
                className="secondary no-wrap"
                onClick={() => {
                  setSelectedCategoryToCluster("");
                  setShowClusterStartMenu(false);
                }}
              >
                Annulla
              </button>
            </div>
          </>
        ) : (
          <p>
            Generazione in corso di nuovi cluster per la categoria: <br />
            <br />
            <b>{selectedCategoryToCluster}</b>
            <br />
            <br />
            Attendere
            {fakeTimer % 3 === 0 ? "..." : fakeTimer % 3 === 1 ? ".." : "."}
          </p>
        )}
      </div>
    </div>
  );
}

export default OverviewClusterMenuPrompt;
