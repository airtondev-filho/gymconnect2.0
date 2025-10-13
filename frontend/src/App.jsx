import React, { useState } from "react";
import Login from "./components/Login";
import Cadastro from "./components/Cadastro";

export default function App() {
  const [tela, setTela] = useState("login");

  return (
    <div style={styles.container}>
      {tela === "login" ? (
        <Login mudarTela={() => setTela("cadastro")} />
      ) : (
        <Cadastro mudarTela={() => setTela("login")} />
      )}
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "Poppins, sans-serif",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    background:
      "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
  },
};
