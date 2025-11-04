import React from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./overview.scss";

function AnalysisOverview() {
  const { analysisId } = useParams();
  const navigate = useNavigate();

  const [showChatTable, setShowChatTable] = React.useState(false);
  const isReady = analysisId.startsWith("1"); // Simulazione dello stato di prontezza

  const open_chat = (id) => {
    navigate(`/chat/${id}`);
  };

  return (
    <div className="overview-page">
      <button
        className="secondary small"
        onClick={() => navigate("/analysis/dashboard")}
      >
        {"< Dashboard"}
      </button>
      <div className="data-area">
        <div className="scrollable-table">
          <table>
            <thead>
              <tr>
                <th>id</th>
                <th>creato il</th>
                <th>range date</th>
                <th>sito</th>
                <th>PN</th>
                <th>Categoria NC</th>
                <th>Tipologia</th>
                <th>Stato</th>
                <th>Num Record</th>
                <th>Num Categorie</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>
                  12/05/2024 <br /> 14:30
                </td>
                <td>01/05/2024 - 10/05/2024</td>
                <td>Fornitore esterno XYZ Ltd.</td>
                <td>12356,78901,45623, 98745,32165,65432, 11223,33445,55667</td>
                <td>NC ingegneristica</td>
                <td>produzione</td>
                <td>Aperto</td>
                <td>458</td>
                <td>47</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="ai-description">
          <div className="title">Descrizione Generata dall'AI</div>
          <div className="text">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias,
            incidunt. Esse suscipit nostrum recusandae adipisci accusamus
            repellendus ipsum amet quo incidunt sit nesciunt, dolorum temporibus
            corporis soluta magnam dolorem libero sed perferendis sint,
            voluptatem at ea quaerat enim? Nemo dolore nam deleniti recusandae
            eius ducimus asperiores animi aperiam earum, ullam quidem sed eaque
            illo cum perferendis ipsa voluptatum est inventore iusto veritatis
            in laudantium voluptatem? Maxime reprehenderit excepturi recusandae
            ipsum, nesciunt sunt? Sit asperiores eos laudantium unde
            consequuntur vero facere minima sapiente? Voluptas recusandae minima
            quis iste, hic et maiores. Velit sapiente quibusdam distinctio
            veniam, aut adipisci placeat ea blanditiis.
          </div>
        </div>

        {isReady ? (
          <div
            className={
              showChatTable ? "dataset-area show-chat-table" : "dataset-area"
            }
          >
            <div className="table-area">
              <table className="dataset">
                <thead>
                  <tr>
                    <th>DATASET</th>
                    <th>Descrizione</th>
                    <th>Categoria</th>
                    <th>Sottocategoria</th>
                    <th>Altro Dato</th>
                    <th>Altro Dato</th>
                    <th>Altro Dato</th>
                    <th>Altro Dato</th>
                    <th>Altro Dato</th>
                    <th>Altro Dato</th>
                    <th>Altro Dato</th>
                    <th>Altro Dato</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 20 }, (_, i) => (
                    <tr key={i}>
                      <td>888-999-0{i}</td>
                      <td>
                        <div className="description">
                          Descrizione esempio {i}. Lorem ipsum dolor sit, amet
                          consectetur adipisicing elit. Pariatur, ad excepturi!
                          Quos nisi deleniti totam facere, autem reiciendis in
                          excepturi odit perspiciatis unde. Tenetur, doloribus
                          repellat. Unde voluptatibus dolorem ipsa.
                        </div>
                      </td>
                      <td>Categoria {i % 5}</td>
                      <td>Sottocategoria {i % 3}</td>
                      <td>Dato {i}</td>
                      <td>Dato {i}</td>
                      <td>Dato {i}</td>
                      <td>Dato {i}</td>
                      <td>Dato {i}</td>
                      <td>Dato {i}</td>
                      <td>Dato {i}</td>
                      <td>Dato {i}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <table className="chat">
                <thead>
                  <tr>
                    <th>Chat ID</th>
                    <th>Data</th>
                    <th>Total messages</th>
                    <th>Report messages</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 50 }, (_, index) => (
                    <tr key={index} onClick={() => open_chat(1100 + index)}>
                      <td>11{index}</td>
                      <td>
                        12/05/2024 <br /> 14:30
                      </td>
                      <td>{Math.round(Math.random() * 20)}</td>
                      <td>{Math.round(Math.random() * 20)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="buttons">
              {!showChatTable && (
                <button className="secondary small">Filtra Dati</button>
              )}
              <button
                className="secondary small"
                onClick={() => setShowChatTable((state) => !state)}
              >
                {showChatTable
                  ? "Mostra Dataset Esteso"
                  : "Mostra Storico Chat"}
              </button>
            </div>
          </div>
        ) : (
          <div className="loading-indicator">Elaborazione in corso...</div>
        )}
      </div>
      {isReady && (
        <div className="actions-buttons">
          <button
            className="primary no-wrap"
            onClick={() => navigate(`/analysis/${analysisId}/edit`)}
          >
            Scarica il Dataset
          </button>
          <button
            className="primary no-wrap"
            onClick={() => navigate(`/analysis/${analysisId}/delete`)}
          >
            Genera QA Matrix
          </button>
          <button
            className="primary no-wrap"
            onClick={() => navigate(`/analysis/${analysisId}/delete`)}
          >
            Conversational BI
          </button>
        </div>
      )}
    </div>
  );
}

export default AnalysisOverview;
