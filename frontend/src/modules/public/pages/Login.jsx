import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import styles from "./styles.module.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    const resultado = await login(email, senha);

    if (resultado.success) {
      navigate(resultado.user.tipo === "CLIENTE" ? "/home-cliente" : "/home-aluno");
    } else {
      setErro(resultado.error || "Erro ao fazer login");
    }
    setCarregando(false);
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        {/* Header Preto com Logo - PADRÃO LANDING */}
        <div className={styles.authHeader}>
          <img src="/image/LOGO ACADEMIA BRANCO.png" alt="GymConnect" className={styles.authLogoImage} />
        </div>

        {/* Conteúdo do Card */}
        <div className={styles.authContent}>
          <h1>Bem-vindo</h1>
          <p>Faça login para acessar sua conta</p>

          {erro && <div className={styles.errorMessage}>{erro}</div>}

          <form className={styles.authForm} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label>Email</label>
              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={carregando}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Senha</label>
              <input
                type="password"
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                disabled={carregando}
              />
            </div>
            <button type="submit" className={styles.btnPrimaryFull} disabled={carregando}>
              {carregando ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <div className={styles.authFooter}>
            <p>
              Não tem conta?
              <Link to="/cadastro"> Cadastre-se</Link>
            </p>
            <p>
              <Link to="/"> ← Voltar para início</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}