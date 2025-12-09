import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { cronogramaExercicioAPI } from "../../../services/api";
import styles from "./styles.module.css";

// Mapeamento de grupos musculares por exercício
const gruposMusculares = {
  'Supino Reto': 'Peitoral, Tríceps, Ombro',
  'Supino Inclinado': 'Peitoral Superior, Ombro, Tríceps',
  'Crucifixo': 'Peitoral',
  'Agachamento': 'Quadríceps, Glúteos, Posterior',
  'Agachamento Livre': 'Quadríceps, Glúteos, Posterior',
  'Leg Press': 'Quadríceps, Glúteos',
  'Rosca Direta': 'Bíceps',
  'Rosca Alternada': 'Bíceps',
  'Puxada Frontal': 'Costas, Bíceps',
  'Remada Curvada': 'Costas, Bíceps',
  'Desenvolvimento': 'Ombro, Tríceps',
  'Desenvolvimento com Halteres': 'Ombro, Tríceps',
  'Tríceps Testa': 'Tríceps',
  'Levantamento Terra': 'Costas, Posterior, Glúteos',
  'Abdominal': 'Abdômen',
  'Abdominal Supra': 'Abdômen'
};

// Obter grupos musculares de um treino
const obterGruposMusculares = (exercicios) => {
  const grupos = new Set();
  exercicios.forEach(ex => {
    const nomeExercicio = ex.nome;
    const grupo = gruposMusculares[nomeExercicio];
    if (grupo) {
      grupo.split(',').forEach(g => grupos.add(g.trim()));
    }
  });
  return Array.from(grupos).join(', ') || 'Variados';
};

// Função para extrair ID do vídeo do YouTube
const getYouTubeVideoId = (url) => {
  if (!url) return null;

  // Para YouTube Shorts
  if (url.includes('/shorts/')) {
    const match = url.match(/\/shorts\/([^?&]+)/);
    return match ? match[1] : null;
  }

  // Para URLs normais do YouTube
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

export default function HomeAluno() {
  const { user, logout } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [completedExercises, setCompletedExercises] = useState({});

  useEffect(() => {
    carregarTreinos();
    // Carregar exercícios concluídos do localStorage
    const saved = localStorage.getItem(`completed_${user?.idUsuario}`);
    if (saved) {
      setCompletedExercises(JSON.parse(saved));
    }
  }, []);

  // Calcular progresso total
  const calcularProgresso = () => {
    if (!selectedWorkout || !selectedWorkout.exercicios.length) return 0;

    const totalExercicios = selectedWorkout.exercicios.length;
    const concluidos = selectedWorkout.exercicios.filter(ex => completedExercises[ex.id]).length;

    return Math.round((concluidos / totalExercicios) * 100);
  };

  const carregarTreinos = async () => {
    try {
      const uid = user?.idUsuario || user?.id;
      if (!uid) return;
      const dados = await cronogramaExercicioAPI.listarPorAluno(uid);

      // Agrupar por cronograma
      const cronogramas = {};
      dados.forEach((item) => {
        const cronogramaId = item.cronograma?.idCronograma;
        if (!cronogramas[cronogramaId]) {
          cronogramas[cronogramaId] = {
            id: cronogramaId,
            nome: item.cronograma?.nome || `Treino ${Object.keys(cronogramas).length + 1}`,
            exercicios: []
          };
        }
        cronogramas[cronogramaId].exercicios.push({
          id: item.idCronogramaExercicio,
          nome: item.exercicio?.nome || "Exercício",
          videoUrl: item.exercicio?.linkYoutube || "",
          series: item.serie,
          repeticoes: item.repeticao,
          carga: item.carga,
          diaSemana: item.diaSemana
        });
      });

      const workoutsArray = Object.values(cronogramas);
      setWorkouts(workoutsArray);

      if (workoutsArray.length > 0) {
        // Carregar índice do treino atual do localStorage
        const currentIndex = parseInt(localStorage.getItem(`current_workout_${user?.idUsuario}`)) || 0;
        setSelectedWorkout(workoutsArray[currentIndex % workoutsArray.length]);
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
      [exerciseId]: !completedExercises[exerciseId]
    };
    setCompletedExercises(newCompleted);
    // Salvar no localStorage
    localStorage.setItem(`completed_${user?.idUsuario}`, JSON.stringify(newCompleted));
  };

  return (
    <div className={styles.container}>
      {/* Header com Botão Sair */}
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

      {/* Conteúdo Principal */}
      <main className={styles.main}>
        <h1 className={styles.pageTitle}>Meu Painel</h1>
        <p className={styles.welcomeText}>Bem-vindo, {user?.nome}</p>

        {/* Estatísticas - AGORA SÓ 2 CARDS */}
        <div className={styles.statsGrid}>
          <div className={`${styles.statCard} ${styles.statCardTreino}`}>
            <h3 className={styles.statLabel}>Treino Atual</h3>
            <p className={styles.statValue}>{selectedWorkout?.nome || "--"}</p>
          </div>
          <div className={`${styles.statCard} ${styles.statCardProgresso}`}>
            <h3 className={styles.statLabel}>Progresso Total</h3>
            <p className={styles.statValue}>{calcularProgresso()}%</p>
          </div>
        </div>

        {/* Detalhes do Treino */}
        {loading ? (
          <p>Carregando treinos...</p>
        ) : selectedWorkout ? (
          <div className={styles.workoutSection}>
            <h2 className={styles.sectionTitle}>Meu Treino</h2>
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
                      className={`${styles.exerciseItem} ${isCompleted ? styles.completed : ''}`}
                    >
                      <div className={styles.exerciseInfo}>
                        <div className={styles.exerciseHeader}>
                          <h5 className={styles.exerciseName}>{exercise.nome}</h5>
                          <button
                            className={`${styles.btnCheck} ${isCompleted ? styles.checked : ''}`}
                            onClick={() => handleToggleExercise(exercise.id)}
                            title={isCompleted ? "Marcar como não concluído" : "Marcar como concluído"}
                          >
                            {isCompleted ? "✓ Concluído" : "Marcar Concluído"}
                          </button>
                        </div>
                        <p className={styles.exerciseDetails}>
                          {exercise.series} séries de {exercise.repeticoes} repetições
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