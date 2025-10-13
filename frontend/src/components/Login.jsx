import React, { useState } from "react";
import axios from "axios";

export default function Login({ mudarTela }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:8080/login", {
        email,
        senha,
      });
      setMensagem(response.data.mensagem || "Login realizado com sucesso!");
    } catch (error) {
      if (error.response) {
        setMensagem(error.response.data.mensagem);
      } else {
        setMensagem("Erro ao fazer login.");
      }
    }
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.titulo}>GymConnect</h2>
      <input
        style={styles.input}
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        style={styles.input}
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
      />
      <button style={styles.botao} onClick={handleLogin}>
        Entrar
      </button>
      <button style={styles.link} onClick={mudarTela}>
        Não tem conta? Cadastre-se
      </button>
      <p style={styles.mensagem}>{mensagem}</p>
    </div>
  );
}

const styles = {
  card: {
    background: "#fff",
    padding: "40px",
    borderRadius: "15px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
    width: "320px",
    textAlign: "center",
  },
  titulo: {
    color: "#1e3a8a",
    marginBottom: "20px",
  },
  input: {
    display: "block",
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
  },
  botao: {
    width: "100%",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  link: {
    background: "none",
    border: "none",
    color: "#2563eb",
    cursor: "pointer",
    marginTop: "10px",
    textDecoration: "underline",
  },
  mensagem: {
    color: "#dc2626",
    marginTop: "10px",
  },
};
