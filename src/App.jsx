import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./routes/__layout";
import AnalysisDashboard from "./routes/analisis/dashboard";
import ChatDashboard from "./routes/chat/dashboard";
import "./buttons.scss";
import "./tables.scss";
import AnalysisOverview from "./routes/analisis/_analisisId/overview";
import ChatPage from "./routes/chat/_cahtId/chat";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/analysis/dashboard" element={<AnalysisDashboard />} />
          <Route
            path="/analysis/dashboard/:analysisId"
            element={<AnalysisOverview />}
          />
          <Route path="/chat/dashboard" element={<ChatDashboard />} />
          <Route path="/chat/:chatId" element={<ChatPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
