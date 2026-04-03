import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { SearchProvider } from "./SearchContext";
import Login from "./pages/Login";
import Index from "./pages/Index";
import Products from "./pages/Products";
import Analytics from "./pages/Analytics";
import Alerts from "./pages/Alerts";
import Settings from "./pages/Settings";
import "./App.css";

function App() {
  return (
    <SearchProvider>
      <Router>
        <Toaster position="top-right" richColors />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Index />} />
          <Route path="/products" element={<Products />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Router>
    </SearchProvider>
  );
}

export default App;
