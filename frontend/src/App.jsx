import { useState } from "react";
import "./App.css";
import AppRoute from "./routes";

function App() {
  const [count, setCount] = useState(0);

  return (
    <AppRoute />
  );
}

export default App;
