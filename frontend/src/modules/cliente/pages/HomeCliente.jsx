import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { usuarioAPI, cronogramaAPI, exercicioAPI, cronogramaExercicioAPI } from "../../../services/api";
import styles from "./styles.module.css";

export default function HomeCliente() {
  const { user, logout, cadastrar } = useAuth();
  const [students, setStudents] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modais
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showEditStudentModal, setShowEditStudentModal] = useState(false);
  const [showCreateWorkoutModal, setShowCreateWorkoutModal] = useState(false);
  const [showAtribuirModal, setShowAtribuirModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Form Aluno
  const [studentForm, setStudentForm] = useState({
    nome: "",
    email: "",
    senha: "",
    tipo: "ALUNO"
  });

  // Form Treino
  const [workoutForm, setWorkoutForm] = useState({
    alunoId: "",
    diasTotais: "",
    exercicios: []
  });

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const usuarios = await usuarioAPI.listar();
      setStudents(usuarios.filter((s) => s.tipo === "ALUNO"));

      // Tentar carregar exercícios
      try {
        const exercicios = await exercicioAPI.listar();
        setExercises(exercicios);
      } catch (err) {
        console.log("Exercícios não disponíveis");
        setExercises([]);
      }

      try {
        const cronogramas = await cronogramaAPI.listar();
        setWorkouts(cronogramas);
      } catch (err) {
        console.log("Cronogramas não disponíveis");
        setWorkouts([]);
      }

    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      alert("Erro ao carregar dados: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();

    // Validar campos
    if (!studentForm.nome || !studentForm.email || !studentForm.senha) {
      alert("Preencha todos os campos");
      return;
    }

    if (studentForm.senha.length < 6) {
      alert("A senha deve ter no mínimo 6 caracteres");
      return;
    }

    try {
      const resultado = await cadastrar(
        studentForm.nome.trim(),
        studentForm.email.trim(),
        studentForm.senha,
        "ALUNO"
      );

      if (resultado.success) {
        alert("Aluno adicionado com sucesso!");
        setShowAddStudentModal(false);
        setStudentForm({ nome: "", email: "", senha: "", tipo: "ALUNO" });
        carregarDados();
      } else {
        alert("Erro ao adicionar aluno: " + (resultado.error || "Erro desconhecido"));
      }
    } catch (error) {
      console.error("Erro ao adicionar aluno:", error);
      alert("Erro ao adicionar aluno: " + error.message);
    }
  };

  const handleEditarAluno = (student) => {
    setSelectedStudent(student);
    setStudentForm({
      nome: student.nome,
      email: student.email,
      senha: "",
      tipo: student.tipo
    });
    setShowEditStudentModal(true);
  };

  const handleSaveEditStudent = async (e) => {
    e.preventDefault();

    try {
      // TODO: Implementar endpoint de atualização no backend
      alert("Funcionalidade de edição em desenvolvimento. Dados:\n" +
        "ID: " + selectedStudent.idUsuario + "\n" +
        "Nome: " + studentForm.nome + "\n" +
        "Email: " + studentForm.email);

      setShowEditStudentModal(false);
      setStudentForm({ nome: "", email: "", senha: "", tipo: "ALUNO" });
      carregarDados();
    } catch (error) {
      alert("Erro ao editar aluno: " + error.message);
    }
  };

  const handleRemoverAluno = async (idUsuario) => {
    if (!window.confirm("Tem certeza que deseja remover este aluno?")) return;

    try {
      await usuarioAPI.remover(idUsuario);
      alert("Aluno removido com sucesso!");
      carregarDados();
    } catch (error) {
      console.error("Erro ao remover aluno:", error);
      alert("Erro ao remover aluno: " + error.message);
    }
  };

  const handleCreateWorkout = async (e) => {
    e.preventDefault();

    if (!workoutForm.alunoId) {
      alert("Selecione um aluno");
      return;
    }

    if (!workoutForm.exercicios || workoutForm.exercicios.length === 0) {
      alert("Adicione pelo menos um exercício ao treino");
      return;
    }

    try {
      const cronograma = {
        aluno: { idUsuario: parseInt(workoutForm.alunoId) },
        diasTotais: workoutForm.diasTotais ? parseInt(workoutForm.diasTotais) : null,
        exercicio: workoutForm.exercicios.map(ex => ({
          exercicio: { idExercicio: parseInt(ex.idExercicio) },
          diaSemana: ex.diaSemana,
          serie: parseInt(ex.serie),
          repeticao: parseInt(ex.repeticao),
          carga: parseInt(ex.carga) || 0
        }))
      };

      await cronogramaAPI.cadastrar(cronograma);
      alert("Treino criado com sucesso!");
      setShowCreateWorkoutModal(false);
      setWorkoutForm({ alunoId: "", diasTotais: "", exercicios: [] });
      carregarDados();
    } catch (error) {
      console.error("Erro ao criar treino:", error);
      alert("Erro ao criar treino: " + error.message);
    }
  };

  const handleAddExerciseToWorkout = () => {
    setWorkoutForm({
      ...workoutForm,
      exercicios: [...workoutForm.exercicios, {
        idExercicio: "",
        diaSemana: "Segunda",
        serie: "",
        repeticao: "",
        carga: ""
      }]
    });
  };

  const handleRemoveExerciseFromWorkout = (index) => {
    const newExercicios = workoutForm.exercicios.filter((_, i) => i !== index);
    setWorkoutForm({ ...workoutForm, exercicios: newExercicios });
  };

  const handleUpdateExerciseInWorkout = (index, field, value) => {
    const newExercicios = [...workoutForm.exercicios];
    newExercicios[index][field] = value;
    setWorkoutForm({ ...workoutForm, exercicios: newExercicios });
  };

  const handleAtribuirTreino = (student) => {
    setSelectedStudent(student);
    setShowAtribuirModal(true);
  };

  const handleConfirmAtribuir = async (workoutId) => {
    try {
      alert(`Treino ${workoutId} atribuído ao aluno ${selectedStudent.nome}`);
      setShowAtribuirModal(false);
    } catch (error) {
      alert("Erro ao atribuir treino");
    }
  };

  const handleVerTreino = (treinoId) => {
    alert(`Ver treino ID: ${treinoId}`);
  };

  const handleEditarTreino = (treinoId) => {
    alert(`Editar treino ID: ${treinoId}`);
  };

  const handleExcluirTreino = async (treinoId) => {
    if (window.confirm("Deseja realmente excluir este treino?")) {
      try {
        await cronogramaAPI.remover(treinoId);
        alert("Treino excluído com sucesso!");
        carregarDados();
      } catch (error) {
        alert("Erro ao excluir treino");
      }
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <nav className={styles.navbar}>
          <div className={styles.logo}>
            <img
              src="/image/LOGO ACADEMIA BRANCO.png"
              alt="GymConnect Logo"
              className={styles.logoImage}
            />
          </div>
          <button className={styles.btnSair} onClick={logout}>
            Sair
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        <h1 className={styles.pageTitle}>Painel do Administrador</h1>
        <p className={styles.welcomeText}>Bem-vindo, {user?.nome}.</p>

        {/* Stats Cards */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <h3 className={styles.statLabel}>Alunos Ativos</h3>
            <p className={styles.statValue}>{students.length}</p>
          </div>
          <div className={styles.statCard}>
            <h3 className={styles.statLabel}>Treinos Criados</h3>
            <p className={styles.statValue}>{workouts.length}</p>
          </div>
          <div className={styles.statCard}>
            <h3 className={styles.statLabel}>Progresso Médio</h3>
            <p className={styles.statValue}>0%</p>
          </div>
        </div>

        {/* Gerenciar Alunos */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Gerenciar Alunos</h2>
            <button
              className={styles.btnAdd}
              onClick={() => setShowAddStudentModal(true)}
            >
              Adicionar Aluno
            </button>
          </div>

          {loading ? (
            <p>Carregando...</p>
          ) : (
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {students.length === 0 ? (
                    <tr>
                      <td colSpan="3" style={{ textAlign: 'center', padding: '2rem' }}>
                        Nenhum aluno cadastrado
                      </td>
                    </tr>
                  ) : (
                    students.map((student) => (
                      <tr key={student.idUsuario}>
                        <td>{student.nome}</td>
                        <td>{student.email}</td>
                        <td>
                          <div className={styles.actionButtons}>
                            <button
                              className={styles.btnEditar}
                              onClick={() => handleEditarAluno(student)}
                            >
                              Editar
                            </button>
                            <button
                              className={styles.btnRemover}
                              onClick={() => handleRemoverAluno(student.idUsuario)}
                            >
                              Remover
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Gerenciar Treinos */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Gerenciar Treinos</h2>
            <button
              className={styles.btnAdd}
              onClick={() => setShowCreateWorkoutModal(true)}
            >
              Criar Treino
            </button>
          </div>

          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Nome do Treino</th>
                  <th>Alunos Atribuídos</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {workouts.length === 0 ? (
                  <tr>
                    <td colSpan="3" style={{ textAlign: 'center', padding: '2rem' }}>
                      Nenhum treino cadastrado
                    </td>
                  </tr>
                ) : (
                  workouts.map((workout) => (
                    <tr key={workout.idCronograma}>
                      <td>Treino de Força - Nível {workout.idCronograma}</td>
                      <td>1</td>
                      <td>
                        <div className={styles.actionButtons}>
                          <button
                            className={styles.btnVer}
                            onClick={() => handleVerTreino(workout.idCronograma)}
                          >
                            Ver
                          </button>
                          <button
                            className={styles.btnEditar}
                            onClick={() => handleEditarTreino(workout.idCronograma)}
                          >
                            Editar
                          </button>
                          <button
                            className={styles.btnExcluir}
                            onClick={() => handleExcluirTreino(workout.idCronograma)}
                          >
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Modal Adicionar Aluno */}
      {showAddStudentModal && (
        <div className={styles.modalOverlay} onClick={() => setShowAddStudentModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2>Adicionar Aluno</h2>
            <form onSubmit={handleAddStudent}>
              <div className={styles.formGroup}>
                <label>Nome</label>
                <input
                  type="text"
                  value={studentForm.nome}
                  onChange={(e) => setStudentForm({ ...studentForm, nome: e.target.value })}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Email</label>
                <input
                  type="email"
                  value={studentForm.email}
                  onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Senha</label>
                <input
                  type="password"
                  value={studentForm.senha}
                  onChange={(e) => setStudentForm({ ...studentForm, senha: e.target.value })}
                  required
                />
              </div>
              <div className={styles.modalButtons}>
                <button type="submit" className={styles.btnPrimary}>Adicionar</button>
                <button type="button" className={styles.btnSecondary} onClick={() => setShowAddStudentModal(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Editar Aluno */}
      {showEditStudentModal && (
        <div className={styles.modalOverlay} onClick={() => setShowEditStudentModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2>Editar Aluno</h2>
            <form onSubmit={handleSaveEditStudent}>
              <div className={styles.formGroup}>
                <label>Nome</label>
                <input
                  type="text"
                  value={studentForm.nome}
                  onChange={(e) => setStudentForm({ ...studentForm, nome: e.target.value })}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Email</label>
                <input
                  type="email"
                  value={studentForm.email}
                  onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                  required
                  disabled
                  style={{ background: '#f0f0f0', cursor: 'not-allowed' }}
                />
                <small style={{ color: '#666', fontSize: '0.875rem' }}>
                  O email não pode ser alterado
                </small>
              </div>
              <div className={styles.formGroup}>
                <label>Nova Senha (opcional)</label>
                <input
                  type="password"
                  value={studentForm.senha}
                  onChange={(e) => setStudentForm({ ...studentForm, senha: e.target.value })}
                  placeholder="Deixe em branco para manter a senha atual"
                />
              </div>
              <div className={styles.modalButtons}>
                <button type="submit" className={styles.btnPrimary}>Salvar</button>
                <button type="button" className={styles.btnSecondary} onClick={() => setShowEditStudentModal(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Criar Treino */}
      {showCreateWorkoutModal && (
        <div className={styles.modalOverlay} onClick={() => setShowCreateWorkoutModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2>Criar Treino</h2>
            <form onSubmit={handleCreateWorkout}>
              <div className={styles.formGroup}>
                <label>Aluno</label>
                <select
                  value={workoutForm.alunoId}
                  onChange={(e) => setWorkoutForm({ ...workoutForm, alunoId: e.target.value })}
                  required
                >
                  <option value="">Selecione um aluno</option>
                  {students.map((student) => (
                    <option key={student.idUsuario} value={student.idUsuario}>
                      {student.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Dias Totais (opcional)</label>
                <input
                  type="number"
                  value={workoutForm.diasTotais}
                  onChange={(e) => setWorkoutForm({ ...workoutForm, diasTotais: e.target.value })}
                  placeholder="Ex: 30"
                  min="1"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Exercícios</label>
                {workoutForm.exercicios.map((exercicio, index) => (
                  <div key={index} className={styles.exerciseRow}>
                    <select
                      value={exercicio.idExercicio}
                      onChange={(e) => handleUpdateExerciseInWorkout(index, 'idExercicio', e.target.value)}
                      required
                    >
                      <option value="">Selecione um exercício</option>
                      {exercises.map((ex) => (
                        <option key={ex.idExercicio} value={ex.idExercicio}>
                          {ex.nome}
                        </option>
                      ))}
                    </select>

                    <select
                      value={exercicio.diaSemana}
                      onChange={(e) => handleUpdateExerciseInWorkout(index, 'diaSemana', e.target.value)}
                      required
                    >
                      <option value="Segunda">Segunda</option>
                      <option value="Terca">Terça</option>
                      <option value="Quarta">Quarta</option>
                      <option value="Quinta">Quinta</option>
                      <option value="Sexta">Sexta</option>
                      <option value="Sabado">Sábado</option>
                      <option value="Domingo">Domingo</option>
                    </select>

                    <input
                      type="number"
                      placeholder="Séries"
                      value={exercicio.serie}
                      onChange={(e) => handleUpdateExerciseInWorkout(index, 'serie', e.target.value)}
                      required
                      min="1"
                    />

                    <input
                      type="number"
                      placeholder="Repetições"
                      value={exercicio.repeticao}
                      onChange={(e) => handleUpdateExerciseInWorkout(index, 'repeticao', e.target.value)}
                      required
                      min="1"
                    />

                    <input
                      type="number"
                      placeholder="Carga (kg)"
                      value={exercicio.carga}
                      onChange={(e) => handleUpdateExerciseInWorkout(index, 'carga', e.target.value)}
                      min="0"
                    />

                    <button
                      type="button"
                      className={styles.btnRemoveExercise}
                      onClick={() => handleRemoveExerciseFromWorkout(index)}
                    >
                      ✕
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  className={styles.btnAddExercise}
                  onClick={handleAddExerciseToWorkout}
                >
                  + Adicionar Exercício
                </button>
              </div>

              <div className={styles.modalButtons}>
                <button type="submit" className={styles.btnPrimary}>Criar Treino</button>
                <button type="button" className={styles.btnSecondary} onClick={() => setShowCreateWorkoutModal(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Atribuir Treino */}
      {showAtribuirModal && (
        <div className={styles.modalOverlay} onClick={() => setShowAtribuirModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2>Atribuir Treino para {selectedStudent?.nome}</h2>
            <div className={styles.workoutList}>
              {workouts.length === 0 ? (
                <p style={{ textAlign: 'center', padding: '2rem' }}>Nenhum treino disponível</p>
              ) : (
                workouts.map((workout) => (
                  <div key={workout.idCronograma} className={styles.workoutOption}>
                    <span>Treino de Força - Nível {workout.idCronograma}</span>
                    <button
                      className={styles.btnAtribuir}
                      onClick={() => handleConfirmAtribuir(workout.idCronograma)}
                    >
                      Selecionar
                    </button>
                  </div>
                ))
              )}
            </div>
            <div className={styles.modalButtons}>
              <button className={styles.btnSecondary} onClick={() => setShowAtribuirModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}