import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { cronogramaAPI, cronogramaExercicioAPI } from "../../../services/api";
import styles from "./styles.module.css";

// Mapeamento de grupos musculares por exercício
const gruposMusculares = {
  "Supino Reto": "Peitoral, Tríceps, Ombro",
  "Supino Inclinado": "Peitoral Superior, Ombro, Tríceps",
  Crucifixo: "Peitoral",
  Agachamento: "Quadríceps, Glúteos, Posterior",
  "Agachamento Livre": "Quadríceps, Glúteos, Posterior",
  "Leg Press": "Quadríceps, Glúteos",
  "Rosca Direta": "Bíceps",
  "Rosca Alternada": "Bíceps",
  "Puxada Frontal": "Costas, Bíceps",
  "Remada Curvada": "Costas, Bíceps",
  Desenvolvimento: "Ombro, Tríceps",
  "Desenvolvimento com Halteres": "Ombro, Tríceps",
  "Triceps Testa": "Tríceps",
  "Levantamento Terra": "Costas, Posterior, Glúteos",
  Abdominal: "Abdômen",
  "Abdominal Supra": "Abdômen",
};

const obterGruposMusculares = (exercicios) => {
  const grupos = new Set();
  exercicios.forEach((ex) => {
    const nomeExercicio = ex.nome;
    const grupo = gruposMusculares[nomeExercicio];
    if (grupo) {
      grupo.split(",").forEach((g) => grupos.add(g.trim()));
    }
  });
  return Array.from(grupos).join(", ") || "Variados";
};

const getYouTubeVideoId = (url) => {
  if (!url) return null;
  if (url.includes("/shorts/")) {
    const match = url.match(/\/shorts\/([^?&]+)/);
    return match ? match[1] : null;
  }
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

export default function HomeAluno() {
  const { user, logout } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentWorkoutIndex, setCurrentWorkoutIndex] = useState(0);
  const [completedExercises, setCompletedExercises] = useState({});

  const selectedWorkout = workouts[currentWorkoutIndex];

  useEffect(() => {
    carregarTreinos();
    const saved = localStorage.getItem(`completed_${user?.idUsuario}`);
    if (saved) {
      setCompletedExercises(JSON.parse(saved));
    }
  }, []);

  const calcularProgresso = () => {
    if (!selectedWorkout || !selectedWorkout.exercicios.length) return 0;
    const totalExercicios = selectedWorkout.exercicios.length;
    const concluidos = selectedWorkout.exercicios.filter(
      (ex) => completedExercises[ex.id]
    ).length;
    return Math.round((concluidos / totalExercicios) * 100);
  };

  const carregarTreinos = async () => {
    try {
      const uid = user?.idUsuario || user?.id;
      if (!uid) return;

      // Buscar exercícios do aluno diretamente
      const exercicios = await cronogramaExercicioAPI.listarPorAluno(uid);
      console.log("🏋️ Exercícios encontrados:", exercicios);

      if (!exercicios || exercicios.length === 0) {
        setWorkouts([]);
        setLoading(false);
        return;
      }

      // Agrupar exercícios por cronograma
      const cronogramasMap = {};
      exercicios.forEach((item) => {
        const cronogramaId = item.cronograma.idCronograma;
        if (!cronogramasMap[cronogramaId]) {
          cronogramasMap[cronogramaId] = {
            id: cronogramaId,
            nome: item.cronograma.nome || `Treino ${cronogramaId}`,
            exercicios: [],
          };
        }
        cronogramasMap[cronogramaId].exercicios.push({
          id: item.idCronogramaExercicio,
          nome: item.exercicio?.nome || "Exercício",
          videoUrl: item.exercicio?.linkYoutube || "",
          series: item.serie,
          repeticoes: item.repeticao,
          carga: item.carga,
          diaSemana: item.diaSemana,
        });
      });

      const workoutsArray = Object.values(cronogramasMap);
      setWorkouts(workoutsArray);

      if (workoutsArray.length > 0) {
        const savedIndex =
          parseInt(
            localStorage.getItem(`current_workout_index_${user?.idUsuario}`)
          ) || 0;
        setCurrentWorkoutIndex(savedIndex % workoutsArray.length);
      }
    } catch (error) {
      console.error("Erro ao carregar treinos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleExercise = (exerciseId) => {
    const newCompleted = {
      ...completedExercises,
      [exerciseId]: !completedExercises[exerciseId],
    };
    setCompletedExercises(newCompleted);
    localStorage.setItem(
      `completed_${user?.idUsuario}`,
      JSON.stringify(newCompleted)
    );
  };

  const handlePreviousWorkout = () => {
    const newIndex =
      currentWorkoutIndex === 0 ? workouts.length - 1 : currentWorkoutIndex - 1;
    setCurrentWorkoutIndex(newIndex);
    localStorage.setItem(`current_workout_index_${user?.idUsuario}`, newIndex);
  };

  const handleNextWorkout = () => {
    const newIndex = (currentWorkoutIndex + 1) % workouts.length;
    setCurrentWorkoutIndex(newIndex);
    localStorage.setItem(`current_workout_index_${user?.idUsuario}`, newIndex);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.navbar}>
          <div className={styles.logo}>
            <img
              src="/image/LOGO ACADEMIA BRANCO.png"
              alt="GymConnect"
              className={styles.logoImage}
            />
          </div>
          <button className={styles.btnSair} onClick={logout}>
            Sair
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <h1 className={styles.pageTitle}>Meu Painel</h1>
        <p className={styles.welcomeText}>Bem-vindo, {user?.nome}</p>

        <div className={styles.statsGrid}>
          <div className={`${styles.statCard} ${styles.statCardTreino}`}>
            <h3 className={styles.statLabel}>Treino Atual</h3>
            <p className={styles.statValue}>{selectedWorkout?.nome || "--"}</p>
            {workouts.length > 1 && (
              <p className={styles.statDetail}>
                {currentWorkoutIndex + 1} de {workouts.length} treinos
              </p>
            )}
          </div>
          <div className={`${styles.statCard} ${styles.statCardProgresso}`}>
            <h3 className={styles.statLabel}>Progresso Total</h3>
            <p className={styles.statValue}>{calcularProgresso()}%</p>
          </div>
        </div>

        {loading ? (
          <p>Carregando treinos...</p>
        ) : selectedWorkout ? (
          <div className={styles.workoutSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Meu Treino</h2>

              {workouts.length > 1 && (
                <div className={styles.workoutNavigation}>
                  <button
                    className={styles.btnNavWorkout}
                    onClick={handlePreviousWorkout}
                  >
                    ← Anterior
                  </button>
                  <span className={styles.workoutCounter}>
                    {currentWorkoutIndex + 1} / {workouts.length}
                  </span>
                  <button
                    className={styles.btnNavWorkout}
                    onClick={handleNextWorkout}
                  >
                    Próximo →
                  </button>
                </div>
              )}
            </div>

            <div className={styles.workoutCard}>
              <div className={styles.workoutHeader}>
                <h3>{selectedWorkout.nome}</h3>
                <p className={styles.workoutDesc}>
                  {obterGruposMusculares(selectedWorkout.exercicios)}
                </p>
              </div>

              <h4 className={styles.exercisesTitle}>Exercícios</h4>
              <div className={styles.exercisesList}>
                {selectedWorkout.exercicios.map((exercise) => {
                  const videoId = getYouTubeVideoId(exercise.videoUrl);
                  const isCompleted = completedExercises[exercise.id];

                  return (
                    <div
                      key={exercise.id}
                      className={`${styles.exerciseItem} ${
                        isCompleted ? styles.completed : ""
                      }`}
                    >
                      <div className={styles.exerciseInfo}>
                        <div className={styles.exerciseHeader}>
                          <h5 className={styles.exerciseName}>
                            {exercise.nome}
                          </h5>
                          <button
                            className={`${styles.btnCheck} ${
                              isCompleted ? styles.checked : ""
                            }`}
                            onClick={() => handleToggleExercise(exercise.id)}
                          >
                            {isCompleted ? "✓ Concluído" : "Marcar Concluído"}
                          </button>
                        </div>
                        <p className={styles.exerciseDetails}>
                          {exercise.series} séries de {exercise.repeticoes}{" "}
                          repetições
                          {exercise.carga > 0 && ` - ${exercise.carga}kg`}
                        </p>
                      </div>
                      <div className={styles.exerciseVideo}>
                        {videoId ? (
                          <iframe
                            width="100%"
                            height="200"
                            src={`https://www.youtube.com/embed/${videoId}`}
                            title={exercise.nome}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        ) : (
                          <div className={styles.noVideo}>
                            <span>▶</span>
                            <p>Vídeo não disponível</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <p>Nenhum treino atribuído</p>
        )}
      </main>
    </div>
  );
}
