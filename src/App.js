import List from "./components/List";
import "./App.css";
import { useState } from "react";

function App() {
  // State for storing token value
  const [token, setToken] = useState("");
  // State for tracking if token has been provided
  const [tokenProvided, setTokenProvided] = useState(false);

  const handleTokenChange = (event) => {
    // Update token value when input changes
    setToken(event.target.value);
    // Update tokenProvided based on whether token is provided
    setTokenProvided(!!event.target.value);
  };

  return (
    <div className="App">
      <h1 className="heading">snapgist</h1>
      <TokenInput
        onTokenChange={handleTokenChange}
        tokenProvided={tokenProvided}
      />
      {tokenProvided && <List token={token} />}{" "}
    </div>
  );
}

function TokenInput({ onTokenChange, tokenProvided }) {
  return (
    <div
      className={`token-input-container ${
        tokenProvided ? "token-provided" : ""
      }`}
    >
      <input
        type="password"
        className="token-input"
        placeholder="Enter your GitHub token with gist scope"
        onChange={onTokenChange}
      />
    </div>
  );
}

export default App;
