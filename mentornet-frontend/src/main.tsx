import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { loadAll } from "./lib/data";

loadAll();

createRoot(document.getElementById("root")!).render(<App />);
