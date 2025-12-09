import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "./styles.module.css";

export default function Landing() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: "/image/perna.png",
      title: "Gestão Completa",
    },
    {
      image: "/image/gym_image_5_reception.png",
      title: "Recepção Moderna",
    },
    {
      image: "/image/gym-imagem-agachamento.png",
      title: "Treinos Eficazes",
    },
    {
      image: "/image/gym-imagem-perna.png",
      title: "Resultados Garantidos",
    },
  ];

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    alert("Mensagem enviada com sucesso!");
    e.target.reset();
  };

  return (
    <div className={styles.landingPage}>
      <header className={styles.header}>
        <nav className={styles.navbar}>
          <div className={styles.logo}>
            <img
              src="/image/LOGO ACADEMIA BRANCO.png"
              alt="GymConnect Logo"
              className={styles.logoImage}
            />
          </div>

          <div className={styles.navLinks}>
            <a href="#inicio">Início</a>
            <a href="#sobre">Sobre</a>
            <a href="#servicos">Serviços</a>
            <a href="#contato">Contato</a>
          </div>

          <div className={styles.navButtons}>
            <button
              className={styles.btnLogin}
              onClick={() => navigate("/login")}
            >
              Login
            </button>
            <button
              className={styles.btnRegister}
              onClick={() => navigate("/cadastro")}
            >
              Cadastrar
            </button>
          </div>
        </nav>
      </header>

      <section id="inicio" className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>
            Transforme sua academia com a
            <span className={styles.highlight}> GymConnect</span>
          </h1>
          <p>
            A plataforma completa para gerenciar treinos personalizados,
            acompanhar o progresso dos alunos e revolucionar a experiência
            fitness.
          </p>
          <div className={styles.heroButtons}>
            <button
              className={styles.btnPrimary}
              onClick={() => navigate("/cadastro")}
            >
              Começar Agora
            </button>
            <button className={styles.btnSecondary}>Saiba Mais</button>
          </div>
        </div>

        <div className={styles.carouselContainer}>
          <div className={styles.carousel}>
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`${styles.slide} ${index === currentSlide ? styles.active : ""
                  }`}
              >
                <img
                  src={slide.image}
                  alt={slide.title}
                  className={styles.slideImage}
                />
              </div>
            ))}
          </div>

          {/* Botões de navegação */}
          <button
            className={`${styles.carouselBtn} ${styles.prevBtn}`}
            onClick={handlePrevSlide}
            aria-label="Slide anterior"
          >
            &#10094;
          </button>
          <button
            className={`${styles.carouselBtn} ${styles.nextBtn}`}
            onClick={handleNextSlide}
            aria-label="Próximo slide"
          >
            &#10095;
          </button>

          {/* Indicadores */}
          <div className={styles.indicators}>
            {slides.map((_, index) => (
              <button
                key={index}
                className={`${styles.dot} ${index === currentSlide ? styles.activeDot : ""
                  }`}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Ir para slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="sobre" className={styles.about}>
        <h2>Sobre a <span className={styles.highlight}>GymConnect</span></h2>
        <div className={styles.aboutContent}>
          <div className={styles.aboutText}>
            <p>
              A GymConnect é a solução completa para academias e personal
              trainers que desejam oferecer uma experiência de treinamento
              personalizado e profissional.
            </p>
            <p>
              Com nossa plataforma, você pode criar treinos customizados,
              acompanhar o progresso de seus alunos em tempo real e oferecer um
              atendimento de qualidade superior.
            </p>
            <p>
              Somos a escolha de centenas de academias que confiam em nós para
              transformar a forma como gerenciam seus negócios.
            </p>
          </div>
          <div className={styles.aboutImage}>
            <img
              src="/image/gymconnect_escritorio.png"
              alt="escritório da GymConnect"
            />
          </div>
        </div>
      </section>

      <section id="servicos" className={styles.services}>
        <h2>Nossos <span className={styles.highlight}>Serviços</span></h2>
        <div className={styles.servicesGrid}>
          <div className={styles.serviceCard}>
            <div className={styles.serviceIcon}>🏋️</div>
            <h3>Treinos Personalizados</h3>
            <p>
              Crie treinos customizados para cada aluno com exercícios
              específicos.
            </p>
          </div>
          <div className={styles.serviceCard}>
            <div className={styles.serviceIcon}>📊</div>
            <h3>Acompanhamento de Progresso</h3>
            <p>
              Acompanhe o progresso dos alunos em tempo real com relatórios
              detalhados.
            </p>
          </div>
          <div className={styles.serviceCard}>
            <div className={styles.serviceIcon}>👥</div>
            <h3>Gerenciamento de Alunos</h3>
            <p>Organize e gerencie todos os seus alunos em um único lugar.</p>
          </div>
        </div>
      </section>

      <section id="contato" className={styles.contact}>
        <h2>Entre em <span className={styles.highlight}>Contato</span></h2>
        <form className={styles.contactForm} onSubmit={handleContactSubmit}>
          <div className={styles.formGroup}>
            <label>Nome</label>
            <input type="text" placeholder="Seu nome" required />
          </div>
          <div className={styles.formGroup}>
            <label>Email</label>
            <input type="email" placeholder="seu@email.com" required />
          </div>
          <div className={styles.formGroup}>
            <label>Mensagem</label>
            <textarea
              placeholder="Sua mensagem aqui..."
              rows="5"
              required
            ></textarea>
          </div>
          <button type="submit" className={styles.btnPrimary}>
            Enviar Mensagem
          </button>
        </form>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h3>GymConnect</h3>
            <p>A plataforma completa para gerenciar treinos personalizados.</p>
          </div>
          <div className={styles.footerSection}>
            <h4>Produto</h4>
            <ul>
              <li><a href="#">Recursos</a></li>
              <li><a href="#">Preços</a></li>
            </ul>
          </div>
          <div className={styles.footerSection}>
            <h4>Empresa</h4>
            <ul>
              <li><a href="#">Sobre</a></li>
              <li><a href="#">Blog</a></li>
            </ul>
          </div>
          <div className={styles.footerSection}>
            <h4>Contato</h4>
            <ul>
              <li>Email: contato@gymconnect.com</li>
              <li>Telefone: (11) 9999-9999</li>
            </ul>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>&copy; 2024 GymConnect. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}