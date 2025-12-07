import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import styles from "./styles.module.css";

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmaSenha, setConfirmaSenha] = useState("");
  const [tipo, setTipo] = useState("ALUNO");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const { cadastrar } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");

    if (senha !== confirmaSenha) {
      setErro("Senhas não conferem");
      return;
    }
    if (senha.length < 6) {
      setErro("Senha deve ter no mínimo 6 caracteres");
      return;
    }

    setCarregando(true);
    const resultado = await cadastrar(nome, email, senha, tipo);

    if (resultado.success) {
      navigate("/login");
    } else {
      setErro(resultado.error || "Erro ao cadastrar");
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
          <h1>Cadastro</h1>
          <p>Crie sua conta para começar</p>

          {erro && <div className={styles.errorMessage}>{erro}</div>}

          <form className={styles.authForm} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label>Nome Completo</label>
              <input
                type="text"
                placeholder="João Silva"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                disabled={carregando}
              />
            </div>
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
              <label>Tipo de Conta</label>
              <select 
                value={tipo} 
                onChange={(e) => setTipo(e.target.value)}
                required
                disabled={carregando}
              >
                <option value="ALUNO">Aluno</option>
                <option value="CLIENTE">Personal Trainer / Admin</option>
              </select>
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
            <div className={styles.formGroup}>
              <label>Confirmar Senha</label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmaSenha}
                onChange={(e) => setConfirmaSenha(e.target.value)}
                required
                disabled={carregando}
              />
            </div>
            <button type="submit" className={styles.btnPrimaryFull} disabled={carregando}>
              {carregando ? "Cadastrando..." : "Cadastrar"}
            </button>
          </form>

          <div className={styles.authFooter}>
            <p>
              Já tem conta?
              <Link to="/login"> Faça login</Link>
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