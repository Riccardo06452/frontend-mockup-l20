import useAnalysisOverview from "../../../stores/useAnalysisOverview";

function OverviewDropChangesAlert({ setShowDropChangesAlert }) {
  const { backToPreviousData } = useAnalysisOverview();

  return (
    <div className="overlay">
      <div className="alert-box">
        <h2>Discard last changes?</h2>
        <p>
          By confirming, the last changes made to the analysis overview will be
          discarded.
        </p>
        <div className="buttons-section">
          <button
            className="secondary"
            onClick={() => {
              backToPreviousData();
              setShowDropChangesAlert(false);
            }}
          >
            Discard Changes
          </button>
          <button
            className="secondary"
            onClick={() => setShowDropChangesAlert(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default OverviewDropChangesAlert;
