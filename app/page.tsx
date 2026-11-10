"use client";

import { useState, useMemo } from "react";

// --- TIPOS Y MODELOS DE DATOS ---
type SectorKey = "retail" | "banca" | "saas" | "turismo" | "educacion";

interface SectorData {
  nombre: string;
  icono: string;
  categoria: string;
  objetivo: string;
  var1Nombre: string;
  var1Min: number;
  var1Max: number;
  var1Default: number;
  var1Unidad: string;
  var1Corte: number;
  var2Nombre: string;
  var2Min: number;
  var2Max: number;
  var2Default: number;
  var2Unidad: string;
  var2Corte: number;
  impactoNegocio: string;
  accionSiSi: string;
  accionSiNo: string;
  accionNo: string;
  kpiObjetivo: string;
}

const SECTORES: Record<SectorKey, SectorData> = {
  retail: {
    nombre: "Retail & E-commerce",
    icono: "🛍️",
    categoria: "Comercio Electrónico",
    objetivo: "Predecir si un visitante con carrito abandonado convertirá",
    var1Nombre: "Visitas al sitio (últimos 30 días)",
    var1Min: 0,
    var1Max: 15,
    var1Default: 6,
    var1Unidad: "visitas",
    var1Corte: 5,
    var2Nombre: "Valor acumulado en carrito",
    var2Min: 20,
    var2Max: 400,
    var2Default: 180,
    var2Unidad: "USD",
    var2Corte: 120,
    impactoNegocio: "Aumenta la tasa de rescate de carritos sin regalar margen de descuento innecesario.",
    accionSiSi: "Cupón VIP 15% + Notificación Push urgente",
    accionSiNo: "Recordatorio amistoso con envío gratis",
    accionNo: "Campaña de retargeting educativo de marca",
    kpiObjetivo: "Tasa de Recuperación de Carrito (+22%)",
  },
  banca: {
    nombre: "Banca & Fintech",
    icono: "🏦",
    categoria: "Servicios Financieros",
    objetivo: "Detectar riesgo inminente de cancelación de cuenta (Churn)",
    var1Nombre: "Sesiones en app móvil (mes actual)",
    var1Min: 0,
    var1Max: 25,
    var1Default: 3,
    var1Unidad: "sesiones",
    var1Corte: 4,
    var2Nombre: "Reclamos o tickets en últimos 60 días",
    var2Min: 0,
    var2Max: 6,
    var2Default: 2,
    var2Unidad: "tickets",
    var2Corte: 1,
    impactoNegocio: "Anticipa la pérdida de clientes de alto valor 45 días antes de la solicitud formal de baja.",
    accionSiSi: "Alerta Roja: Contacto de gestor VIP en menos de 2 horas",
    accionSiNo: "Encuesta de satisfacción rápida + beneficio fidelidad",
    accionNo: "Cliente saludable: Flujo habitual de cross-selling",
    kpiObjetivo: "Reducción de Tasa de Abandono Churn (-18%)",
  },
  saas: {
    nombre: "SaaS & B2B Tech",
    icono: "💻",
    categoria: "Software por Suscripción",
    objetivo: "Calificar Lead de prueba gratuita a Cliente Pago (PQL)",
    var1Nombre: "Miembros invitados al espacio de trabajo",
    var1Min: 1,
    var1Max: 15,
    var1Default: 5,
    var1Unidad: "usuarios",
    var1Corte: 3,
    var2Nombre: "Uso de la función clave (eventos)",
    var2Min: 0,
    var2Max: 80,
    var2Default: 45,
    var2Unidad: "acciones",
    var2Corte: 30,
    impactoNegocio: "Concentra el tiempo del equipo comercial únicamente en las cuentas con alta probabilidad de cierre.",
    accionSiSi: "Asignar Ejecutivo Enterprise para Demo Ejecutiva",
    accionSiNo: "Webinar guiado de mejores prácticas de equipo",
    accionNo: "Secuencia de onboarding automatizado por email",
    kpiObjetivo: "Conversión de Free Trial a Pago (+35%)",
  },
  turismo: {
    nombre: "Turismo & Hotelería",
    icono: "✈️",
    categoria: "Viajes y Experiencias",
    objetivo: "Predecir reserva de paquete turístico vacacional",
    var1Nombre: "Anticipación de la búsqueda",
    var1Min: 2,
    var1Max: 90,
    var1Default: 45,
    var1Unidad: "días",
    var1Corte: 30,
    var2Nombre: "Viajes reservados en los últimos 2 años",
    var2Min: 0,
    var2Max: 8,
    var2Default: 3,
    var2Unidad: "viajes",
    var2Corte: 2,
    impactoNegocio: "Optimiza la pauta dinámica mostrando ofertas estacionales según la ventana de reserva.",
    accionSiSi: "Paquete All-Inclusive con Upgrade de habitación gratis",
    accionSiNo: "Guía de destino descargable + opción de reserva flexible",
    accionNo: "Promoción de escapadas de fin de semana cercanas",
    kpiObjetivo: "Ingreso promedio por reserva (+28%)",
  },
  educacion: {
    nombre: "Educación & E-Learning",
    icono: "🎓",
    categoria: "EdTech y Posgrados",
    objetivo: "Predecir culminación exitosa y retención de estudiantes",
    var1Nombre: "Porcentaje de módulos interactivos completados",
    var1Min: 0,
    var1Max: 100,
    var1Default: 65,
    var1Unidad: "%",
    var1Corte: 50,
    var2Nombre: "Participación en foros de discusión y dudas",
    var2Min: 0,
    var2Max: 15,
    var2Default: 4,
    var2Unidad: "aportes",
    var2Corte: 3,
    impactoNegocio: "Identifica estudiantes rezagados a mitad del período para activar tutorías personalizadas.",
    accionSiSi: "Invitación a certificación de honor y proyectos avanzados",
    accionSiNo: "Recordatorio de tutoría de apoyo con asistente docente",
    accionNo: "Plan de reactivación urgente con llamada de acompañamiento",
    kpiObjetivo: "Tasa de Finalización de Curso (+31%)",
  },
};

// Preguntas del cuestionario interactivo
const PREGUNTAS_QUIZ = [
  {
    pregunta: "¿Cuál es el objetivo primordial de una división (split) en un árbol de decisión?",
    opciones: [
      "Aumentar el número total de variables analizadas",
      "Maximizar la homogeneidad (reducir la impureza) de los nodos resultantes",
      "Garantizar que todas las ramas tengan exactamente la misma longitud",
      "Eliminar automáticamente los datos nulos del dataset",
    ],
    correcta: 1,
    explicacion:
      "¡Exacto! Cada división busca separar los datos de forma que cada grupo hijo sea lo más puro posible respecto a la variable objetivo (por ejemplo, compradores vs no compradores).",
  },
  {
    pregunta: "Si tu objetivo en marketing es predecir el monto exacto en dólares que gastará un cliente, ¿qué tipo de árbol debes usar?",
    opciones: [
      "Árbol de Clasificación",
      "Árbol de Regresión",
      "Árbol de Agrupamiento Jerárquico (Clustering)",
      "Árbol Binario de Búsqueda",
    ],
    correcta: 1,
    explicacion:
      "¡Correcto! Cuando la variable objetivo es continua y numérica (como dinero, tiempo o visitas), se utiliza un Árbol de Regresión. Si fuera una etiqueta categórica (compra / no compra), sería de Clasificación.",
  },
  {
    pregunta: "¿Qué ocurre cuando permites que un árbol crezca sin control hasta profundidades muy altas?",
    opciones: [
      "El modelo subajusta (underfitting) y pierde precisión en todos los datos",
      "El modelo sobreajusta (overfitting), memorizando el ruido y fallando ante clientes nuevos",
      "El índice de Gini se vuelve negativo",
      "El algoritmo automáticamente se convierte en una red neuronal profunda",
    ],
    correcta: 1,
    explicacion:
      "¡Muy bien! Un árbol demasiado profundo genera reglas ultra-específicas para memorizar el conjunto de entrenamiento, perdiendo su capacidad de generalizar para nuevos clientes en producción.",
  },
  {
    pregunta: "¿Qué significa un Índice de Impureza de Gini igual a 0.0 en un nodo hoja?",
    opciones: [
      "Que el nodo es completamente puro: el 100% de las observaciones pertenecen a una sola clase",
      "Que el modelo no pudo encontrar ningún patrón en los datos",
      "Que hay exactamente 50% de probabilidad para cada clase",
      "Que los datos contienen errores de medición",
    ],
    correcta: 0,
    explicacion:
      "¡Excelente! Gini = 0.0 indica máxima pureza absoluta. Por ejemplo, todos los usuarios en ese nodo compraron o todos abandonaron sin excepciones.",
  },
  {
    pregunta: "¿Cuál es la principal ventaja de negocio que tienen los árboles frente a modelos de 'caja negra' como redes neuronales?",
    opciones: [
      "Siempre tienen una precisión matemática infinitamente superior",
      "Son 100% interpretables y permiten justificar decisiones ante comités, clientes y regulaciones",
      "No requieren ningún dato para ser entrenados",
      "Sólo pueden ejecutarse en computadoras cuánticas",
    ],
    correcta: 1,
    explicacion:
      "¡Brillante! La interpretabilidad es el superpoder de los árboles: puedes extraer reglas de negocio claras (IF/THEN) comprensibles para gerentes, analistas y auditores.",
  },
  {
    pregunta: "¿Por qué en analítica avanzada se pasa de un solo árbol de decisión a un Random Forest (Bosque Aleatorio)?",
    opciones: [
      "Porque los bosques consumen menos memoria que un solo árbol",
      "Porque un solo árbol es sensible y de alta varianza; combinar muchos árboles mediante votación estabiliza la predicción",
      "Porque los bosques eliminan la necesidad de recolectar datos de clientes",
      "Porque los árboles individuales no funcionan en marketing",
    ],
    correcta: 1,
    explicacion:
      "¡Totalmente correcto! Un árbol individual tiene alta varianza (pequeños cambios en datos cambian su estructura). Random Forest entrena cientos de árboles y promedia sus votos para lograr máxima robustez.",
  },
];

export default function Home() {
  // --- ESTADOS PRINCIPALES ---
  const [sectorActivo, setSectorActivo] = useState<SectorKey>("retail");
  const [profundidadMax, setProfundidadMax] = useState<number>(3);
  const [activeAnatomy, setActiveAnatomy] = useState<number>(0);
  const [formatoCodigo, setFormatoCodigo] = useState<"sql" | "python" | "regla">("regla");
  const [copiado, setCopiado] = useState(false);

  // Valores de los controles del laboratorio interactivo
  const sector = SECTORES[sectorActivo];
  const [val1, setVal1] = useState<number>(sector.var1Default);
  const [val2, setVal2] = useState<number>(sector.var2Default);

  // Estados para el mini-ejemplo del Hero
  const [heroArchetype, setHeroArchetype] = useState<"indeciso" | "frio" | "vip">("vip");

  // Estados para la calculadora didáctica de Gini
  const [giniSplitPoint, setGiniSplitPoint] = useState<number>(5);

  // Estados para el simulador de Sobreajuste
  const [overfitDepth, setOverfitDepth] = useState<number>(3);

  // Estados del Quiz
  const [preguntaActual, setPreguntaActual] = useState<number>(0);
  const [respuestasUsuario, setRespuestasUsuario] = useState<(number | null)[]>(
    Array(PREGUNTAS_QUIZ.length).fill(null)
  );
  const [quizFinalizado, setQuizFinalizado] = useState(false);

  // Sincronizar variables al cambiar de sector
  const cambiarSector = (nuevoSector: SectorKey) => {
    setSectorActivo(nuevoSector);
    const target = SECTORES[nuevoSector];
    setVal1(target.var1Default);
    setVal2(target.var2Default);
  };

  // --- LÓGICA DE DECISIÓN DEL ÁRBOL EN VIVO ---
  const condicion1Cumplida = val1 >= sector.var1Corte;
  const condicion2Cumplida = val2 >= sector.var2Corte;

  // Cálculo didáctico de probabilidad estimada
  const probabilidad = useMemo(() => {
    let base = 20;
    if (condicion1Cumplida) {
      base += 38;
      if (condicion2Cumplida) {
        base += 34;
      } else {
        base += 12;
      }
    } else {
      base += Math.round((val1 / sector.var1Max) * 15);
    }
    // Factor de profundidad
    const ajusteProfundidad = (profundidadMax - 2) * 2;
    return Math.min(97, Math.max(8, base + ajusteProfundidad));
  }, [condicion1Cumplida, condicion2Cumplida, val1, sector.var1Max, profundidadMax]);

  // Veredicto y recomendación activa
  const rutaActiva = useMemo(() => {
    if (!condicion1Cumplida) {
      return {
        nodoId: "hoja-no",
        titulo: "Segmento Frío / Bajo Riesgo",
        accion: sector.accionNo,
        nivel: "low-conversion",
        probabilidad: Math.min(30, probabilidad),
      };
    }
    if (profundidadMax === 1) {
      return {
        nodoId: "hoja-split1",
        titulo: "Segmento Prometedor (Evaluación Simple)",
        accion: "Enviar comunicación estándar de segmento",
        nivel: "medium-conversion",
        probabilidad: 62,
      };
    }
    if (condicion2Cumplida) {
      return {
        nodoId: "hoja-sisi",
        titulo: "Segmento Prioritario / Alto Valor",
        accion: sector.accionSiSi,
        nivel: "high-conversion",
        probabilidad: Math.max(78, probabilidad),
      };
    } else {
      return {
        nodoId: "hoja-sino",
        titulo: "Segmento Intermedio / En Duda",
        accion: sector.accionSiNo,
        nivel: "medium-conversion",
        probabilidad: 54,
      };
    }
  }, [condicion1Cumplida, condicion2Cumplida, profundidadMax, sector, probabilidad]);

  // Generador de código dinámico
  const codigoGenerado = useMemo(() => {
    if (formatoCodigo === "regla") {
      return `// REGLA DE NEGOCIO ACCIONABLE (Lógica Humana)
SI [${sector.var1Nombre}] >= ${sector.var1Corte} ${sector.var1Unidad} ENTONCES:
    SI [${sector.var2Nombre}] >= ${sector.var2Corte} ${sector.var2Unidad} ENTONCES:
        -> ACCIÓN: "${sector.accionSiSi}" (Probabilidad: ~88%)
    SINO:
        -> ACCIÓN: "${sector.accionSiNo}" (Probabilidad: ~54%)
SINO:
    -> ACCIÓN: "${sector.accionNo}" (Probabilidad: ~18%)`;
    }
    if (formatoCodigo === "sql") {
      return `-- LÓGICA DE SEGMENTACIÓN SQL (BigQuery / Snowflake / PostgreSQL)
SELECT
    cliente_id,
    ${sector.var1Nombre.replace(/\s+/g, "_").toLowerCase()},
    ${sector.var2Nombre.replace(/\s+/g, "_").toLowerCase()},
    CASE 
        WHEN ${sector.var1Nombre.replace(/\s+/g, "_").toLowerCase()} >= ${sector.var1Corte} 
             AND ${sector.var2Nombre.replace(/\s+/g, "_").toLowerCase()} >= ${sector.var2Corte} 
             THEN '${sector.accionSiSi}'
        WHEN ${sector.var1Nombre.replace(/\s+/g, "_").toLowerCase()} >= ${sector.var1Corte} 
             THEN '${sector.accionSiNo}'
        ELSE '${sector.accionNo}'
    END AS accion_marketing_recomendada
FROM clientes_activos;`;
    }
    return `# MODELO CON SCIKIT-LEARN (Python 3)
from sklearn.tree import DecisionTreeClassifier, export_text

# Definición del árbol con control de profundidad (Poda)
clf = DecisionTreeClassifier(
    criterion='gini',
    max_depth=${profundidadMax},
    min_samples_split=10,
    random_state=42
)

# Ajuste con datos históricos de ${sector.nombre}
clf.fit(X_train, y_train)

# Predicción para el cliente actual:
cliente_actual = [[${val1}, ${val2}]]
prediccion = clf.predict(cliente_actual)
probabilidad = clf.predict_proba(cliente_actual)[0][1]

print(f"Predicción: {prediccion} | Certeza: {probabilidad:.1%}")`;
  }, [formatoCodigo, sector, profundidadMax, val1, val2]);

  const copiarAlPortapapeles = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(codigoGenerado);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    }
  };

  // --- CÁLCULO EN VIVO DE IMPUREZA DE GINI ---
  // Simulamos 20 clientes ordenados por una variable X de 1 a 10
  // Clientes 1 al 10: 8 no compran, 2 compran.
  // Clientes 11 al 20: 2 no compran, 8 compran.
  const totalMuestras = 20;
  const clientesSimulados = useMemo(() => {
    return Array.from({ length: totalMuestras }, (_, i) => {
      const xVal = Math.round(((i + 1) / totalMuestras) * 10);
      // Tendencia: a mayor X, mayor probabilidad de ser Comprador
      const esComprador = i < 7 ? (i === 2 ? 1 : 0) : i < 11 ? (i % 2 === 0 ? 1 : 0) : (i === 17 ? 0 : 1);
      return { id: i + 1, valor: xVal, clase: esComprador };
    });
  }, []);

  const metricasGini = useMemo(() => {
    const grupoIzq = clientesSimulados.filter((c) => c.valor <= giniSplitPoint);
    const grupoDer = clientesSimulados.filter((c) => c.valor > giniSplitPoint);

    const calcGini = (grupo: typeof clientesSimulados) => {
      if (grupo.length === 0) return 0;
      const compradores = grupo.filter((c) => c.clase === 1).length;
      const p1 = compradores / grupo.length;
      const p0 = 1 - p1;
      return 1 - (p1 * p1 + p0 * p0);
    };

    const giniIzq = calcGini(grupoIzq);
    const giniDer = calcGini(grupoDer);

    const pesoIzq = grupoIzq.length / totalMuestras;
    const pesoDer = grupoDer.length / totalMuestras;
    const giniPonderado = pesoIzq * giniIzq + pesoDer * giniDer;

    // Gini inicial del conjunto completo (10 de cada uno: 1 - 0.25 - 0.25 = 0.50)
    const giniInicial = 0.5;
    const ganancia = Math.max(0, giniInicial - giniPonderado);

    return {
      grupoIzq,
      grupoDer,
      giniIzq: giniIzq.toFixed(3),
      giniDer: giniDer.toFixed(3),
      giniPonderado: giniPonderado.toFixed(3),
      ganancia: ganancia.toFixed(3),
      esOptimo: giniSplitPoint >= 5 && giniSplitPoint <= 6,
    };
  }, [clientesSimulados, giniSplitPoint]);

  // --- CÁLCULO DE CURVA DE SOBREAJUSTE (OVERFITTING) ---
  const overfitMetrics = useMemo(() => {
    // A profundidad 1: train 68%, test 67% (underfitting)
    // A profundidad 3: train 85%, test 83% (óptimo)
    // A profundidad 6: train 99%, test 71% (overfitting)
    const profundidades = [1, 2, 3, 4, 5, 6, 7];
    const trainScores = [68, 77, 86, 92, 96, 99, 100];
    const testScores = [66, 76, 84, 83, 78, 71, 65];

    const idx = overfitDepth - 1;
    const trainActual = trainScores[idx];
    const testActual = testScores[idx];

    let estado = "Zona Óptima de Generalización";
    let colorEstado = "var(--emerald)";
    let descEstado =
      "El modelo equilibra sesgo y varianza. Las reglas son concisas y predicen con alta exactitud en clientes nuevos.";

    if (overfitDepth <= 2) {
      estado = "Subajuste (Underfitting)";
      colorEstado = "var(--amber)";
      descEstado =
        "El árbol es demasiado simple. Pierde patrones clave del cliente porque no hace suficientes preguntas.";
    } else if (overfitDepth >= 5) {
      estado = "Sobreajuste Severo (Overfitting)";
      colorEstado = "var(--orange)";
      descEstado =
        "El árbol memorizó datos específicos y ruido del entrenamiento. En producción con clientes reales fallará con frecuencia.";
    }

    return {
      profundidades,
      trainScores,
      testScores,
      trainActual,
      testActual,
      estado,
      colorEstado,
      descEstado,
    };
  }, [overfitDepth]);

  // Manejo de respuestas del cuestionario
  const seleccionarRespuesta = (idxOpcion: number) => {
    if (respuestasUsuario[preguntaActual] !== null) return;
    const nuevas = [...respuestasUsuario];
    nuevas[preguntaActual] = idxOpcion;
    setRespuestasUsuario(nuevas);
  };

  const aciertosTotales = respuestasUsuario.reduce((acc: number, curr, i) => {
    return curr === PREGUNTAS_QUIZ[i].correcta ? acc + 1 : acc;
  }, 0);

  return (
    <main>
      {/* NAVBAR */}
      <nav className="nav">
        <div className="nav-container">
          <a href="#inicio" className="brand">
            <span className="brand-icon">◈</span>
            <span>DecisionLab</span>
            <span className="brand-badge">Interactiva v2.0</span>
          </a>
          <div className="nav-links">
            <a href="#fundamentos">¿Qué son?</a>
            <a href="#laboratorio">Simulador Árbol</a>
            <a href="#gini">Impureza de Gini</a>
            <a href="#sobreajuste">Poda & Overfitting</a>
            <a href="#casos">Casos Reales</a>
            <a href="#reto">Desafío del Analista</a>
          </div>
          <a href="#laboratorio" className="nav-cta">
            Probar Simulador →
          </a>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section id="inicio" className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Maestría en Analítica de Datos · Universidad Central</p>
          <h1>
            Aprende a decidir con <em>Árboles de Decisión.</em>
          </h1>
          <p className="lead">
            Descubre cómo los árboles convierten señales complejas de comportamiento en{" "}
            <strong>reglas transparentes, explicables y 100% accionables</strong> para marketing, finanzas y estrategia.
          </p>

          <div className="hero-actions">
            <a href="#laboratorio" className="btn btn-primary">
              Explorar el Simulador en Vivo <span>→</span>
            </a>
            <a href="#fundamentos" className="btn btn-secondary">
              Ver Fundamentos Teóricos
            </a>
          </div>

          <div className="author-pill">
            <span>🎓 Proyecto Académico diseñado para:</span>
            <strong>Iván Velandia · 2026</strong>
          </div>
        </div>

        {/* HERO INTERACTIVE CARD */}
        <div className="hero-card">
          <div className="hero-card-header">
            <div className="hero-card-title">
              <span>⚡</span> Demostración en Tiempo Real
            </div>
            <span className="hero-badge">Caja Blanca (Explicable)</span>
          </div>

          <p style={{ fontSize: "0.85rem", color: "var(--muted)", marginBottom: "12px" }}>
            Selecciona un perfil de usuario para ver cómo el árbol traza su ruta y decide la acción:
          </p>

          <div className="hero-profile-switch">
            <button
              onClick={() => setHeroArchetype("vip")}
              className={`hero-profile-btn ${heroArchetype === "vip" ? "active" : ""}`}
            >
              ⭐ Comprador VIP
            </button>
            <button
              onClick={() => setHeroArchetype("indeciso")}
              className={`hero-profile-btn ${heroArchetype === "indeciso" ? "active" : ""}`}
            >
              🤔 Lead Indeciso
            </button>
            <button
              onClick={() => setHeroArchetype("frio")}
              className={`hero-profile-btn ${heroArchetype === "frio" ? "active" : ""}`}
            >
              ❄️ Lead Frío
            </button>
          </div>

          {/* Árbol interactivo en el Hero */}
          <div className="hero-tree-preview">
            <div
              style={{
                display: "inline-block",
                padding: "8px 14px",
                background: "var(--ink)",
                color: "#fff",
                borderRadius: "6px",
                fontSize: "0.8rem",
                fontWeight: 600,
              }}
            >
              ¿Visitas al sitio &gt; 5?
            </div>
            <div style={{ display: "flex", justifyContent: "space-around", marginTop: "16px" }}>
              <div
                style={{
                  opacity: heroArchetype === "frio" ? 0.35 : 1,
                  transform: heroArchetype !== "frio" ? "scale(1.05)" : "none",
                  transition: "all 0.3s ease",
                }}
              >
                <div style={{ fontSize: "0.7rem", color: "var(--emerald)", fontWeight: 700 }}>
                  [SÍ: {heroArchetype === "vip" ? "8 visitas" : heroArchetype === "indeciso" ? "6 visitas" : "0"}]
                </div>
                <div
                  style={{
                    background: heroArchetype === "vip" ? "var(--emerald-light)" : "var(--cream-alt)",
                    border: `2px solid ${heroArchetype === "vip" ? "var(--emerald)" : "var(--line)"}`,
                    padding: "8px 10px",
                    borderRadius: "6px",
                    fontSize: "0.75rem",
                    marginTop: "6px",
                  }}
                >
                  ¿Carrito &gt; $120?
                  <br />
                  <strong style={{ color: heroArchetype === "vip" ? "var(--emerald)" : "var(--orange)" }}>
                    {heroArchetype === "vip" ? "SÍ ($240) -> Cupón VIP" : "NO ($45) -> Empujón"}
                  </strong>
                </div>
              </div>

              <div
                style={{
                  opacity: heroArchetype === "frio" ? 1 : 0.35,
                  transform: heroArchetype === "frio" ? "scale(1.05)" : "none",
                  transition: "all 0.3s ease",
                }}
              >
                <div style={{ fontSize: "0.7rem", color: "var(--orange)", fontWeight: 700 }}>
                  [NO: 1 visita]
                </div>
                <div
                  style={{
                    background: heroArchetype === "frio" ? "var(--orange-soft)" : "var(--cream-alt)",
                    border: `2px solid ${heroArchetype === "frio" ? "var(--orange)" : "var(--line)"}`,
                    padding: "8px 10px",
                    borderRadius: "6px",
                    fontSize: "0.75rem",
                    marginTop: "6px",
                  }}
                >
                  Lead en Exploración
                  <br />
                  <strong style={{ color: "var(--orange)" }}>Nutrir con contenido</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="hero-result-box">
            <div>
              <div className="hero-result-text">
                {heroArchetype === "vip" && "✨ Veredicto: Alta propensión de compra inmediata."}
                {heroArchetype === "indeciso" && "🔍 Veredicto: Interés presente pero ticket bajo."}
                {heroArchetype === "frio" && "🧊 Veredicto: Lead en fase inicial de descubrimiento."}
              </div>
              <small style={{ color: "var(--muted)" }}>
                {heroArchetype === "vip" && "Disparar oferta flash de cierre."}
                {heroArchetype === "indeciso" && "Ofrecer prueba o envío gratis para reducir fricción."}
                {heroArchetype === "frio" && "Evitar saturar con descuentos; educar con valor."}
              </small>
            </div>
            <div className="hero-result-prob">
              {heroArchetype === "vip" ? "91%" : heroArchetype === "indeciso" ? "58%" : "14%"}
            </div>
          </div>
        </div>
      </section>

      {/* STATS TICKER */}
      <div className="ticker-section">
        <div className="ticker-grid">
          <div className="ticker-item">
            <span className="ticker-value">100%</span>
            <span className="ticker-label">Explicabilidad y Transparencia (Auditable)</span>
          </div>
          <div className="ticker-item">
            <span className="ticker-value">0 a 1</span>
            <span className="ticker-label">Índice de Impureza de Gini (Métrica de División)</span>
          </div>
          <div className="ticker-item">
            <span className="ticker-value">2 en 1</span>
            <span className="ticker-label">Modelos para Clasificación y Regresión</span>
          </div>
          <div className="ticker-item">
            <span className="ticker-value">Ensembles</span>
            <span className="ticker-label">Bloque fundacional de Random Forest y XGBoost</span>
          </div>
        </div>
      </div>

      {/* SECCIÓN 1: FUNDAMENTOS & ANATOMÍA */}
      <section id="fundamentos" className="section">
        <div className="section-container">
          <div className="section-header">
            <p className="eyebrow">01 · FUNDAMENTOS TEÓRICOS</p>
            <h2>¿Qué son los árboles y por qué dominan la toma de decisiones?</h2>
            <p>
              Un árbol de decisión es un modelo de aprendizaje supervisado no paramétrico que divide
              recursivamente los datos en subgrupos basados en preguntas de Sí/No. A diferencia de las
              redes neuronales ("cajas negras"), un árbol se puede leer y entender en segundos.
            </p>
          </div>

          {/* Tarjetas interactivas de Anatomía */}
          <div className="anatomy-grid">
            {[
              {
                id: 0,
                tag: "COMPONENTE 01",
                icono: "🌱",
                titulo: "Nodo Raíz (Root)",
                resumen: "El punto de partida del árbol. Contiene toda la población y la variable más discriminante.",
                detalle:
                  "El algoritmo evalúa todas las variables disponibles (edad, visitas, ingresos) y selecciona aquella que reduce más la impureza inicial del conjunto completo de clientes.",
                formula: "Split inicial: Max(Ganancia de Información)",
                marketing: "Ejemplo: ¿El usuario visitó el sitio más de 5 veces en la última semana?",
              },
              {
                id: 1,
                tag: "COMPONENTE 02",
                icono: "⚖️",
                titulo: "Nodos de Decisión (Splits)",
                resumen: "Puntos de corte intermedios que dividen subconjuntos con condiciones lógicas.",
                detalle:
                  "Cada nodo interno formula una condición binaria (por ejemplo, x ≥ umbral). Cuanto más homogéneo sea cada subgrupo resultante, mejor es el poder predictivo del split.",
                formula: "Impureza Ponderada = w_L·Gini(L) + w_R·Gini(R)",
                marketing: "Ejemplo: ¿El valor del carrito supera los $120 USD?",
              },
              {
                id: 2,
                tag: "COMPONENTE 03",
                icono: "🌿",
                titulo: "Ramas (Branches)",
                resumen: "Caminos lógicos que conectan nodos según la respuesta (Verdadero o Falso).",
                detalle:
                  "Representan las rutas de decisión del cliente. Cada rama filtra una subpoblación de clientes con características de comportamiento homogéneas.",
                formula: "Ruta = [Condición_1 AND Condición_2 AND ...]",
                marketing: "Ejemplo: Ruta = Visitas > 5 Y Apertura de Email ≥ 40%",
              },
              {
                id: 3,
                tag: "COMPONENTE 04",
                icono: "🍃",
                titulo: "Nodos Hoja (Leaves)",
                resumen: "El destino final del árbol. No se divide más y entrega la predicción o acción.",
                detalle:
                  "En clasificación, la hoja entrega la clase mayoritaria (ej: 'Comprará') y su probabilidad. En regresión, entrega el promedio del valor objetivo en ese segmento.",
                formula: "Predicción = Moda(Clases) o Promedio(Y)",
                marketing: "Ejemplo: 'Activar descuento de 20% con 85% de probabilidad de éxito'.",
              },
            ].map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveAnatomy(item.id)}
                className={`anatomy-card ${activeAnatomy === item.id ? "active" : ""}`}
              >
                <span className="anatomy-tag">{item.tag}</span>
                <span className="anatomy-icon">{item.icono}</span>
                <h3>{item.titulo}</h3>
                <p>{item.resumen}</p>
              </div>
            ))}
          </div>

          {/* Panel de detalle del componente activo */}
          <div className="anatomy-detail-box">
            <div>
              <span
                style={{
                  fontSize: "0.75rem",
                  fontFamily: "DM Mono",
                  color: "var(--emerald)",
                  fontWeight: 600,
                  textTransform: "uppercase",
                }}
              >
                Detalle Técnico & Aplicación
              </span>
              <h3 style={{ fontSize: "1.4rem", margin: "6px 0 12px" }}>
                {[
                  "El Nodo Raíz: La Decisión Más Importante",
                  "Nodos Internos: Refinamiento Progresivo",
                  "Ramas: Los Senderos del Comportamiento",
                  "Nodos Hoja: Acciones Concretas de Negocio",
                ][activeAnatomy]}
              </h3>
              <p style={{ color: "var(--muted)", fontSize: "0.95rem", marginBottom: "16px" }}>
                {[
                  "El nodo raíz contiene el 100% de la base de datos sin filtrar. El algoritmo busca exhaustivamente entre todas las columnas numéricas y categóricas para hallar el umbral que produzca la mayor separación inicial entre compradores y no compradores.",
                  "A medida que se desciende por el árbol, los nodos internos van especializando el perfil del usuario. Cada split divide un subgrupo en partes aún más limpias, eliminando la incertidumbre paso a paso.",
                  "Las ramas son las reglas lógicas que permiten transformar el modelo de machine learning en consultas SQL, reglas en motores de automatización (como HubSpot o Salesforce) o condicionales en el código de tu aplicación.",
                  "La hoja es donde la analítica se traduce en dinero: define si el cliente recibe una llamada de un asesor, un correo automatizado, una alerta de fraude o un cupón de rescate.",
                ][activeAnatomy]}
              </p>
              <div
                style={{
                  background: "var(--cream-alt)",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  fontSize: "0.85rem",
                  borderLeft: "3px solid var(--orange)",
                }}
              >
                <strong>🎯 Impacto en Marketing: </strong>
                {[
                  "Seleccionar la variable raíz adecuada garantiza que la primera segmentación de tu base de contactos separe a los prospectos de alto interés de los curiosos que sólo rebotaron.",
                  "Permite crear microsegmentos granulares sin necesidad de programar manualmente decenas de filtros estáticos en tu CRM.",
                  "Cada combinación de ramas equivale a un 'Buyer Persona' respaldado por datos cuantitativos y no por intuición subjetiva.",
                  "Evita la pérdida de presupuesto: asegura que las promociones con costo financiero sólo lleguen a quienes realmente las necesitan para convertir.",
                ][activeAnatomy]}
              </div>
            </div>

            <div className="detail-formula">
              <div style={{ color: "#a4beba", fontSize: "0.75rem", marginBottom: "8px" }}>
                // MECÁNICA MATEMÁTICA Y LÓGICA
              </div>
              {[
                `# Algoritmo de Búsqueda de Raíz:
Para cada variable X_j en X:
    Para cada valor umbral 't' posible:
        Calcular Ganancia_Informacion(X_j, t)
Seleccionar split con Ganancia MÁXIMA.`,
                `# Evaluación en Nodo Interno:
if cliente[feature_j] <= umbral:
    seguir_por_rama_izquierda()
else:
    seguir_por_rama_derecha()`,
                `# Expresión Booleana de Ruta:
Ruta_Segmento = (
    (visitas > 5) & 
    (ticket_promedio >= 120) & 
    (dias_inactivo <= 7)
)`,
                `# Asignación en Hoja:
probabilidad_conversion = P(Y=1 | Ruta)
if probabilidad >= 0.55:
    retornar "Activar Promoción"
else:
    retornar "Secuencia de Cuidado"`,
              ][activeAnatomy]}
            </div>
          </div>

          {/* TARJETAS DE CASOS DE USO REALES */}
          <div style={{ marginTop: "64px" }}>
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <p className="eyebrow">02 · APLICACIONES REALES</p>
              <h3 style={{ fontSize: "1.8rem", fontWeight: 700 }}>
                ¿Para qué sirven en marketing digital y analítica de negocios?
              </h3>
            </div>

            <div className="use-cases-grid">
              <div className="use-case-card">
                <span className="use-case-badge">CONVERSIÓN</span>
                <h3>Lead Scoring Automatizado</h3>
                <p>
                  Clasifica prospectos en frío, tibio y caliente según su actividad digital (descargas,
                  asistencia a webinars, visitas a precios) para enviar solo los más preparados al equipo de ventas.
                </p>
                <div className="use-case-footer">
                  <span>📈 Beneficio:</span> +40% de productividad comercial
                </div>
              </div>

              <div className="use-case-card">
                <span className="use-case-badge">RETENCIÓN</span>
                <h3>Prevención de Churn (Fuga de Clientes)</h3>
                <p>
                  Identifica patrones tempranos de abandono (baja en frecuencia de login, tickets de soporte no
                  resueltos) para activar ofertas de rescate antes de que el cliente cancele su suscripción.
                </p>
                <div className="use-case-footer">
                  <span>🛡️ Beneficio:</span> Reducción del 25% en pérdida de clientes
                </div>
              </div>

              <div className="use-case-card">
                <span className="use-case-badge">OPTIMIZACIÓN</span>
                <h3>Asignación Inteligente de Descuentos</h3>
                <p>
                  Distingue a los clientes que comprarán de todos modos de aquellos que necesitan un empujón,
                  evitando regalar márgenes de ganancia con cupones masivos indiscriminados.
                </p>
                <div className="use-case-footer">
                  <span>💰 Beneficio:</span> Ahorro del 35% en presupuesto promocional
                </div>
              </div>

              <div className="use-case-card">
                <span className="use-case-badge">CROSS-SELLING</span>
                <h3>Recomendación de Producto Siguiente</h3>
                <p>
                  Predice qué categoría complementaria tiene mayor probabilidad de compra basándose en la
                  primera orden, antigüedad y canal de adquisición del usuario.
                </p>
                <div className="use-case-footer">
                  <span>🛍️ Beneficio:</span> +18% en Ticket Promedio (AOV)
                </div>
              </div>

              <div className="use-case-card">
                <span className="use-case-badge">SEGURIDAD</span>
                <h3>Detección de Fraude en Transacciones</h3>
                <p>
                  Establece reglas claras y auditables para bloquear pagos sospechosos por monto inusual, país de
                  origen o velocidad de intentos, cumpliendo con regulaciones bancarias.
                </p>
                <div className="use-case-footer">
                  <span>🔒 Beneficio:</span> 100% explicable ante auditorías
                </div>
              </div>

              <div className="use-case-card">
                <span className="use-case-badge">EXPERIENCIA</span>
                <h3>Personalización del Customer Journey</h3>
                <p>
                  Determina qué versión de la página de aterrizaje (Landing Page) o qué canal de comunicación
                  (WhatsApp vs Email vs SMS) tiene mejor tasa de respuesta por segmento.
                </p>
                <div className="use-case-footer">
                  <span>🎯 Beneficio:</span> Aumento de CTR en 2.4x
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN 2: LABORATORIO INTERACTIVO PRINCIPAL */}
      <section id="laboratorio" className="section section-alt">
        <div className="section-container">
          <div className="section-header">
            <p className="eyebrow">03 · LABORATORIO INTERACTIVO</p>
            <h2>Simula una Decisión de Negocio en Tiempo Real</h2>
            <p>
              Ajusta el sector, mueve los deslizadores de comportamiento del cliente y observa cómo el árbol
              recorre sus ramas, ilumina el camino activo y genera la recomendación estratégica.
            </p>
          </div>

          <div className="lab-layout">
            {/* BARRA LATERAL DE CONTROLES */}
            <aside className="lab-sidebar">
              <div className="control-group">
                <label className="control-label">
                  Sector Económico <span>🏢</span>
                </label>
                <select
                  value={sectorActivo}
                  onChange={(e) => cambiarSector(e.target.value as SectorKey)}
                  className="select-custom"
                >
                  <option value="retail">🛍️ Retail & E-commerce</option>
                  <option value="banca">🏦 Banca & Fintech</option>
                  <option value="saas">💻 SaaS & B2B Tech</option>
                  <option value="turismo">✈️ Turismo & Hotelería</option>
                  <option value="educacion">🎓 Educación & E-Learning</option>
                </select>
                <span className="control-hint">{sector.categoria}</span>
              </div>

              {/* Slider Variable 1 */}
              <div className="control-group">
                <label className="control-label">
                  <span>{sector.var1Nombre}</span>
                  <span className="control-value">
                    {val1} {sector.var1Unidad}
                  </span>
                </label>
                <input
                  type="range"
                  min={sector.var1Min}
                  max={sector.var1Max}
                  value={val1}
                  onChange={(e) => setVal1(Number(e.target.value))}
                  className="range-custom"
                />
                <span className="control-hint">
                  Corte del árbol: <strong>≥ {sector.var1Corte} {sector.var1Unidad}</strong>
                </span>
              </div>

              {/* Slider Variable 2 */}
              <div className="control-group">
                <label className="control-label">
                  <span>{sector.var2Nombre}</span>
                  <span className="control-value">
                    {val2} {sector.var2Unidad}
                  </span>
                </label>
                <input
                  type="range"
                  min={sector.var2Min}
                  max={sector.var2Max}
                  value={val2}
                  onChange={(e) => setVal2(Number(e.target.value))}
                  className="range-custom"
                />
                <span className="control-hint">
                  Corte del árbol: <strong>≥ {sector.var2Corte} {sector.var2Unidad}</strong>
                </span>
              </div>

              {/* Slider Profundidad */}
              <div className="control-group">
                <label className="control-label">
                  <span>Profundidad Máxima del Árbol</span>
                  <span className="control-value">Nivel {profundidadMax}</span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={3}
                  value={profundidadMax}
                  onChange={(e) => setProfundidadMax(Number(e.target.value))}
                  className="range-custom"
                />
                <span className="control-hint">
                  {profundidadMax === 1
                    ? "1 nivel: Decisión simple (Stump)"
                    : profundidadMax === 2
                    ? "2 niveles: Segmentación estándar"
                    : "3 niveles: Máxima granularidad pedagógica"}
                </span>
              </div>

              {/* Tarjeta de impacto del sector */}
              <div
                style={{
                  background: "var(--white)",
                  border: "1px solid var(--line)",
                  borderRadius: "8px",
                  padding: "16px",
                  fontSize: "0.8rem",
                }}
              >
                <strong style={{ color: "var(--ink)", display: "block", marginBottom: "6px" }}>
                  🎯 Meta Estratégica:
                </strong>
                <p style={{ color: "var(--muted)", margin: 0 }}>{sector.impactoNegocio}</p>
                <div
                  style={{
                    marginTop: "10px",
                    fontWeight: 700,
                    color: "var(--emerald)",
                    fontFamily: "DM Mono",
                  }}
                >
                  {sector.kpiObjetivo}
                </div>
              </div>
            </aside>

            {/* CONTENIDO DEL LABORATORIO: ÁRBOL Y EXPLICACIÓN */}
            <div className="lab-content">
              <div className="lab-header">
                <div className="lab-scenario-info">
                  <div className="scenario-icon">{sector.icono}</div>
                  <div>
                    <h3 className="scenario-title">{sector.nombre}</h3>
                    <p className="scenario-sub">{sector.objetivo}</p>
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--muted)", display: "block" }}>
                    PROBABILIDAD ESTIMADA
                  </span>
                  <span
                    style={{
                      fontFamily: "DM Mono",
                      fontSize: "1.75rem",
                      fontWeight: 700,
                      color: rutaActiva.nivel === "high-conversion" ? "var(--emerald)" : "var(--orange)",
                    }}
                  >
                    {rutaActiva.probabilidad}%
                  </span>
                </div>
              </div>

              {/* ÁRBOL VISUAL DINÁMICO */}
              <div className="tree-visualizer">
                <div className="tree-flow">
                  {/* NODO RAÍZ */}
                  <div className={`tree-node ${condicion1Cumplida ? "active-path" : "active-path"}`}>
                    <div className="node-title">01 · Nodo Raíz</div>
                    <div className="node-condition">
                      ¿{sector.var1Nombre} ≥ {sector.var1Corte}?
                    </div>
                    <span
                      className={`node-status ${
                        condicion1Cumplida ? "true-state" : "false-state"
                      }`}
                    >
                      Actual: {val1} {sector.var1Unidad} ({condicion1Cumplida ? "Cumple" : "No cumple"})
                    </span>
                  </div>

                  {/* RAMAS DESDE LA RAÍZ */}
                  <div
                    className={`branch-container ${
                      condicion1Cumplida ? "split-active" : ""
                    }`}
                  >
                    {/* RAMA IZQUIERDA: SÍ */}
                    <div className={`branch-column ${condicion1Cumplida ? "active" : ""}`}>
                      <span className="branch-tag">
                        SÍ (≥ {sector.var1Corte})
                      </span>

                      {profundidadMax > 1 ? (
                        <>
                          {/* NODO INTERNO 2 */}
                          <div
                            className={`tree-node ${
                              condicion1Cumplida ? "active-path" : "inactive-path"
                            }`}
                          >
                            <div className="node-title">02 · Nodo Interno</div>
                            <div className="node-condition">
                              ¿{sector.var2Nombre} ≥ {sector.var2Corte}?
                            </div>
                            <span
                              className={`node-status ${
                                condicion2Cumplida ? "true-state" : "false-state"
                              }`}
                            >
                              Actual: {val2} {sector.var2Unidad}
                            </span>
                          </div>

                          {/* SUB-RAMAS DEL NODO 2 */}
                          <div
                            style={{
                              display: "flex",
                              gap: "14px",
                              marginTop: "16px",
                              width: "100%",
                              justifyContent: "center",
                            }}
                          >
                            {/* HOJA SÍ-SÍ */}
                            <div
                              className={`leaf-node high-conversion ${
                                condicion1Cumplida && condicion2Cumplida
                                  ? "active-path"
                                  : "inactive-path"
                              }`}
                            >
                              <div className="node-title">Hoja A · Alta Propensión</div>
                              <div className="leaf-action">{sector.accionSiSi}</div>
                              <div className="leaf-metric">
                                {condicion1Cumplida && condicion2Cumplida ? rutaActiva.probabilidad : 88}%
                              </div>
                            </div>

                            {/* HOJA SÍ-NO */}
                            <div
                              className={`leaf-node medium-conversion ${
                                condicion1Cumplida && !condicion2Cumplida
                                  ? "active-path"
                                  : "inactive-path"
                              }`}
                            >
                              <div className="node-title">Hoja B · Intermedio</div>
                              <div className="leaf-action">{sector.accionSiNo}</div>
                              <div className="leaf-metric">
                                {condicion1Cumplida && !condicion2Cumplida ? rutaActiva.probabilidad : 54}%
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        /* HOJA DIRECTA SI PROFUNDIDAD = 1 */
                        <div
                          className={`leaf-node medium-conversion ${
                            condicion1Cumplida ? "active-path" : "inactive-path"
                          }`}
                        >
                          <div className="node-title">Hoja · Decisión Nivel 1</div>
                          <div className="leaf-action">Segmento Calificado</div>
                          <div className="leaf-metric">65%</div>
                        </div>
                      )}
                    </div>

                    {/* RAMA DERECHA: NO */}
                    <div className={`branch-column ${!condicion1Cumplida ? "active" : ""}`}>
                      <span className="branch-tag">
                        NO (&lt; {sector.var1Corte})
                      </span>

                      {/* HOJA NO */}
                      <div
                        className={`leaf-node low-conversion ${
                          !condicion1Cumplida ? "active-path" : "inactive-path"
                        }`}
                      >
                        <div className="node-title">Hoja C · Baja Propensión</div>
                        <div className="leaf-action">{sector.accionNo}</div>
                        <div className="leaf-metric">
                          {!condicion1Cumplida ? rutaActiva.probabilidad : 18}%
                        </div>
                        <small style={{ color: "var(--muted)", fontSize: "0.75rem", display: "block", marginTop: "4px" }}>
                          Lead Frío / Sin intención inmediata
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* PANEL DE EXPLICABILIDAD HUMANA */}
              <div className="trace-card">
                <div className="trace-title">
                  <span>✦</span> Explicación del Camino de Decisión (Trazabilidad 100%)
                </div>
                <div className="trace-step-list">
                  <div className="trace-step-item">
                    <span className="trace-step-badge">Paso 1</span>
                    <span>
                      El modelo evalúa <strong>{sector.var1Nombre}</strong>: el valor del cliente es{" "}
                      <strong>
                        {val1} {sector.var1Unidad}
                      </strong>
                      . Como es{" "}
                      <strong style={{ color: condicion1Cumplida ? "var(--emerald)" : "var(--orange)" }}>
                        {condicion1Cumplida ? `≥ ${sector.var1Corte}` : `< ${sector.var1Corte}`}
                      </strong>
                      , se avanza hacia la rama del{" "}
                      <strong>{condicion1Cumplida ? "SÍ" : "NO"}</strong>.
                    </span>
                  </div>

                  {condicion1Cumplida && profundidadMax > 1 && (
                    <div className="trace-step-item">
                      <span className="trace-step-badge">Paso 2</span>
                      <span>
                        Se evalúa <strong>{sector.var2Nombre}</strong> con valor de{" "}
                        <strong>
                          {val2} {sector.var2Unidad}
                        </strong>
                        . Resulta{" "}
                        <strong style={{ color: condicion2Cumplida ? "var(--emerald)" : "var(--amber)" }}>
                          {condicion2Cumplida ? `≥ ${sector.var2Corte}` : `< ${sector.var2Corte}`}
                        </strong>
                        , asignando el perfil final.
                      </span>
                    </div>
                  )}

                  <div className="trace-step-item">
                    <span className="trace-step-badge">Decisión</span>
                    <span>
                      <strong>Recomendación Ejecutiva:</strong> "{rutaActiva.accion}" con un nivel de certeza
                      estimado del <strong>{rutaActiva.probabilidad}%</strong>.
                    </span>
                  </div>
                </div>
              </div>

              {/* GENERADOR Y EXPORTADOR DE CÓDIGO */}
              <div className="code-export-box">
                <div className="code-export-header">
                  <div className="code-tabs">
                    <button
                      onClick={() => setFormatoCodigo("regla")}
                      className={`code-tab-btn ${formatoCodigo === "regla" ? "active" : ""}`}
                    >
                      Regla de Negocio
                    </button>
                    <button
                      onClick={() => setFormatoCodigo("sql")}
                      className={`code-tab-btn ${formatoCodigo === "sql" ? "active" : ""}`}
                    >
                      Consulta SQL
                    </button>
                    <button
                      onClick={() => setFormatoCodigo("python")}
                      className={`code-tab-btn ${formatoCodigo === "python" ? "active" : ""}`}
                    >
                      Python (Scikit-Learn)
                    </button>
                  </div>

                  <button onClick={copiarAlPortapapeles} className="copy-btn">
                    {copiado ? "✓ ¡Copiado!" : "Copiar Código 📋"}
                  </button>
                </div>

                <div className="code-snippet">{codigoGenerado}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN 3: MECÁNICA INTERNA — IMPUREZA DE GINI */}
      <section id="gini" className="section">
        <div className="section-container">
          <div className="section-header">
            <p className="eyebrow">04 · MECÁNICA MATEMÁTICA</p>
            <h2>¿Cómo elige el algoritmo dónde cortar? El Índice de Gini</h2>
            <p>
              El algoritmo de árbol no adivina: calcula matemáticamente la <strong>impureza</strong> de cada
              posible corte. La meta es encontrar el punto exacto que separe la mayor cantidad de clientes
              compradores (verdes) de los no compradores (naranjas).
            </p>
          </div>

          <div className="gini-calculator-grid">
            {/* PANEL INTERACTIVO DE PARTICIÓN */}
            <div className="gini-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 700 }}>
                  Simulador de Partición de Muestras
                </h3>
                <span
                  style={{
                    fontFamily: "DM Mono",
                    fontSize: "0.8rem",
                    background: metricasGini.esOptimo ? "var(--emerald-light)" : "var(--cream-alt)",
                    color: metricasGini.esOptimo ? "var(--emerald)" : "var(--muted)",
                    padding: "4px 10px",
                    borderRadius: "999px",
                    fontWeight: 700,
                  }}
                >
                  {metricasGini.esOptimo ? "⭐ Corte Óptimo" : "Corte Subóptimo"}
                </span>
              </div>

              <p style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
                Mueve el punto de corte (X = {giniSplitPoint}) para separar las 20 observaciones de clientes.
                Observa cómo cambia la pureza en los dos grupos hijos:
              </p>

              <div className="control-group">
                <label className="control-label">
                  <span>Punto de División (Split Threshold):</span>
                  <span className="control-value">X = {giniSplitPoint}</span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={9}
                  value={giniSplitPoint}
                  onChange={(e) => setGiniSplitPoint(Number(e.target.value))}
                  className="range-custom"
                />
              </div>

              {/* GRÁFICO VISUAL DE BOLITAS (MARBLES) */}
              <div className="gini-marbles-container">
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--muted)" }}>
                  GRUPO IZQUIERDO (X ≤ {giniSplitPoint}): {metricasGini.grupoIzq.length} clientes · Gini ={" "}
                  <strong style={{ color: "var(--ink)" }}>{metricasGini.giniIzq}</strong>
                </div>
                <div className="marbles-row">
                  {metricasGini.grupoIzq.length === 0 ? (
                    <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>(Sin muestras)</span>
                  ) : (
                    metricasGini.grupoIzq.map((c) => (
                      <span
                        key={c.id}
                        className={`marble ${c.clase === 1 ? "marble-buyer" : "marble-churn"}`}
                        title={`Cliente #${c.id} - ${c.clase === 1 ? "Comprador" : "No comprador"}`}
                      >
                        {c.clase === 1 ? "✓" : "×"}
                      </span>
                    ))
                  )}
                </div>

                <div className="split-line-indicator" />

                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--muted)" }}>
                  GRUPO DERECHO (X &gt; {giniSplitPoint}): {metricasGini.grupoDer.length} clientes · Gini ={" "}
                  <strong style={{ color: "var(--ink)" }}>{metricasGini.giniDer}</strong>
                </div>
                <div className="marbles-row">
                  {metricasGini.grupoDer.length === 0 ? (
                    <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>(Sin muestras)</span>
                  ) : (
                    metricasGini.grupoDer.map((c) => (
                      <span
                        key={c.id}
                        className={`marble ${c.clase === 1 ? "marble-buyer" : "marble-churn"}`}
                        title={`Cliente #${c.id} - ${c.clase === 1 ? "Comprador" : "No comprador"}`}
                      >
                        {c.clase === 1 ? "✓" : "×"}
                      </span>
                    ))
                  )}
                </div>
              </div>

              <div style={{ display: "flex", gap: "16px", fontSize: "0.8rem", color: "var(--muted)" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <span className="marble marble-buyer" style={{ width: 14, height: 14 }} /> Comprador (Clase 1)
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <span className="marble marble-churn" style={{ width: 14, height: 14 }} /> No Comprador (Clase 0)
                </span>
              </div>
            </div>

            {/* PANEL DE EXPLICACIÓN MATEMÁTICA DE GINI */}
            <div className="gini-card">
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700 }}>
                La Ecuación de Impureza de Gini
              </h3>

              <div className="gini-formula-display">
                <strong>Fórmula de Gini para un nodo:</strong>
                <br />
                <span style={{ color: "var(--emerald)", fontWeight: 700 }}>
                  Gini(k) = 1 - ∑ (p_i)² = 1 - (p_compra² + p_nocompra²)
                </span>
                <br />
                <br />
                <strong>Impureza Ponderada tras el Split:</strong>
                <br />
                <span>
                  Gini_Split = ({metricasGini.grupoIzq.length}/20)·{metricasGini.giniIzq} + (
                  {metricasGini.grupoDer.length}/20)·{metricasGini.giniDer} ={" "}
                  <strong style={{ color: "var(--orange)" }}>{metricasGini.giniPonderado}</strong>
                </span>
              </div>

              <div
                style={{
                  background: "var(--cream-alt)",
                  border: "1px solid var(--line)",
                  borderRadius: "8px",
                  padding: "16px",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "14px",
                }}
              >
                <div>
                  <span style={{ fontSize: "0.75rem", color: "var(--muted)", display: "block" }}>
                    IMPUREZA INICIAL
                  </span>
                  <span style={{ fontFamily: "DM Mono", fontSize: "1.3rem", fontWeight: 700 }}>
                    0.500
                  </span>
                  <small style={{ color: "var(--muted)", display: "block", fontSize: "0.7rem" }}>
                    (Máxima mezcla: 50/50)
                  </small>
                </div>

                <div>
                  <span style={{ fontSize: "0.75rem", color: "var(--emerald)", display: "block" }}>
                    GANANCIA DE PUREZA
                  </span>
                  <span
                    style={{
                      fontFamily: "DM Mono",
                      fontSize: "1.3rem",
                      fontWeight: 700,
                      color: "var(--emerald)",
                    }}
                  >
                    +{metricasGini.ganancia}
                  </span>
                  <small style={{ color: "var(--muted)", display: "block", fontSize: "0.7rem" }}>
                    (Reducción de incertidumbre)
                  </small>
                </div>
              </div>

              <div style={{ fontSize: "0.85rem", color: "var(--muted)", lineHeight: 1.6 }}>
                💡 <strong>Conclusión Didáctica:</strong> Un Gini de <strong>0.0</strong> significa pureza total
                (todos los clientes pertenecen a la misma clase). Un Gini de <strong>0.5</strong> significa
                máxima confusión aleatoria. El algoritmo CART evalúa miles de combinaciones y escoge siempre la
                que maximice la Ganancia de Pureza.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN 4: SOBREAJUSTE (OVERFITTING) Y PODA */}
      <section id="sobreajuste" className="section section-alt">
        <div className="section-container">
          <div className="section-header">
            <p className="eyebrow">05 · CONTROL DE COMPLEJIDAD</p>
            <h2>El Talón de Aquiles: Sobreajuste (Overfitting) y Poda</h2>
            <p>
              ¿Qué pasa si permites que un árbol crezca sin fin? Memorizará cada dato atípico del conjunto de
              entrenamiento, fallando miserablemente ante nuevos clientes en el mundo real. Aprende cómo
              funciona la <strong>poda (pruning)</strong>.
            </p>
          </div>

          <div className="overfitting-demo">
            {/* CONTROLES DEL EXPERIMENTO */}
            <div className="overfit-controls">
              <div className="control-group">
                <label className="control-label">
                  <span>Profundidad del Árbol (max_depth):</span>
                  <span className="control-value">{overfitDepth}</span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={7}
                  value={overfitDepth}
                  onChange={(e) => setOverfitDepth(Number(e.target.value))}
                  className="range-custom"
                />
                <span className="control-hint">Mueve el deslizador de 1 a 7</span>
              </div>

              {/* Indicador de Estado */}
              <div
                style={{
                  background: "var(--white)",
                  border: `2px solid ${overfitMetrics.colorEstado}`,
                  borderRadius: "8px",
                  padding: "16px",
                }}
              >
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontFamily: "DM Mono",
                    color: overfitMetrics.colorEstado,
                    fontWeight: 700,
                    textTransform: "uppercase",
                  }}
                >
                  DIAGNÓSTICO DEL MODELO
                </span>
                <h4 style={{ fontSize: "1.05rem", margin: "4px 0 8px", color: "var(--ink)" }}>
                  {overfitMetrics.estado}
                </h4>
                <p style={{ fontSize: "0.8rem", color: "var(--muted)", margin: 0, lineHeight: 1.5 }}>
                  {overfitMetrics.descEstado}
                </p>
              </div>

              {/* Métricas Numéricas */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                  background: "var(--white)",
                  border: "1px solid var(--line)",
                  borderRadius: "8px",
                  padding: "14px",
                }}
              >
                <div>
                  <span style={{ fontSize: "0.7rem", color: "var(--blue)", fontWeight: 700 }}>
                    ENTRENAMIENTO (TRAIN)
                  </span>
                  <div style={{ fontFamily: "DM Mono", fontSize: "1.4rem", fontWeight: 700, color: "var(--blue)" }}>
                    {overfitMetrics.trainActual}%
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: "0.7rem", color: "var(--emerald)", fontWeight: 700 }}>
                    VALIDACIÓN (TEST)
                  </span>
                  <div
                    style={{
                      fontFamily: "DM Mono",
                      fontSize: "1.4rem",
                      fontWeight: 700,
                      color: overfitDepth >= 5 ? "var(--orange)" : "var(--emerald)",
                    }}
                  >
                    {overfitMetrics.testActual}%
                  </div>
                </div>
              </div>

              <div style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
                <strong>Técnicas de Poda Clave:</strong>
                <ul style={{ paddingLeft: "18px", marginTop: "6px", lineHeight: 1.6 }}>
                  <li>
                    <code>max_depth</code>: Limita los niveles máximos.
                  </li>
                  <li>
                    <code>min_samples_leaf</code>: Exige un mínimo de clientes por hoja (ej. mínimo 30).
                  </li>
                  <li>
                    <code>ccp_alpha</code>: Poda por costo-complejidad.
                  </li>
                </ul>
              </div>
            </div>

            {/* GRÁFICO SVG DE CURVA DE ERROR */}
            <div className="overfit-chart-container">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 700 }}>
                  Curva de Generalización: Rendimiento vs Profundidad
                </span>
                <div className="legend-group">
                  <div className="legend-item">
                    <span className="legend-color" style={{ background: "var(--blue)" }} />
                    <span>Train Score (Entrenamiento)</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-color" style={{ background: "var(--emerald)" }} />
                    <span>Test Score (Datos no vistos)</span>
                  </div>
                </div>
              </div>

              {/* SVG Gráfico interactivo */}
              <svg className="svg-chart" viewBox="0 0 500 240">
                {/* Cuadrícula de fondo */}
                <line x1="50" y1="40" x2="470" y2="40" stroke="#e2e8f0" strokeDasharray="3 3" />
                <line x1="50" y1="90" x2="470" y2="90" stroke="#e2e8f0" strokeDasharray="3 3" />
                <line x1="50" y1="140" x2="470" y2="140" stroke="#e2e8f0" strokeDasharray="3 3" />
                <line x1="50" y1="190" x2="470" y2="190" stroke="#cbd5e1" strokeWidth="1.5" />
                <line x1="50" y1="30" x2="50" y2="190" stroke="#cbd5e1" strokeWidth="1.5" />

                {/* Etiquetas Eje Y */}
                <text x="42" y="44" fontSize="10" textAnchor="end" fill="#64748b" fontFamily="DM Mono">100%</text>
                <text x="42" y="94" fontSize="10" textAnchor="end" fill="#64748b" fontFamily="DM Mono">80%</text>
                <text x="42" y="144" fontSize="10" textAnchor="end" fill="#64748b" fontFamily="DM Mono">60%</text>

                {/* Zona Óptima Sombreada */}
                <rect x="180" y="30" width="120" height="160" fill="rgba(16, 185, 129, 0.08)" />
                <text x="240" y="25" fontSize="10" textAnchor="middle" fill="var(--emerald)" fontWeight="700">
                  ZONA DULCE (ÓPTIMA)
                </text>

                {/* Línea de Train (Azul) */}
                <polyline
                  fill="none"
                  stroke="var(--blue)"
                  strokeWidth="3"
                  points="
                    80,125 
                    140,100 
                    200,75 
                    260,58 
                    320,48 
                    380,42 
                    440,40
                  "
                />

                {/* Línea de Test (Verde/Naranja) */}
                <polyline
                  fill="none"
                  stroke="var(--emerald)"
                  strokeWidth="3"
                  points="
                    80,130 
                    140,102 
                    200,80 
                    260,82 
                    320,95 
                    380,115 
                    440,135
                  "
                />

                {/* Marcadores de eje X */}
                {[1, 2, 3, 4, 5, 6, 7].map((d, i) => {
                  const cx = 80 + i * 60;
                  const isCurrent = d === overfitDepth;
                  return (
                    <g key={d}>
                      <line x1={cx} y1="190" x2={cx} y2="195" stroke="#94a3b8" />
                      <text
                        x={cx}
                        y="210"
                        fontSize="11"
                        textAnchor="middle"
                        fill={isCurrent ? "var(--ink)" : "#64748b"}
                        fontWeight={isCurrent ? "700" : "400"}
                        fontFamily="DM Mono"
                      >
                        d={d}
                      </text>
                      {isCurrent && (
                        <>
                          <line
                            x1={cx}
                            y1="30"
                            x2={cx}
                            y2="190"
                            stroke={overfitMetrics.colorEstado}
                            strokeWidth="2"
                            strokeDasharray="4 4"
                          />
                          <circle cx={cx} cy={200 - overfitMetrics.trainActual * 1.6} r="5" fill="var(--blue)" />
                          <circle cx={cx} cy={200 - overfitMetrics.testActual * 1.6} r="6" fill={overfitMetrics.colorEstado} />
                        </>
                      )}
                    </g>
                  );
                })}
              </svg>

              <div
                style={{
                  background: "#f0fdf4",
                  border: "1px solid #bbf7d0",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  fontSize: "0.825rem",
                  color: "#166534",
                }}
              >
                🧠 <strong>Regla de Oro del Analista:</strong> Un modelo que predice 99% en datos de entrenamiento pero
                cae a 70% en validación es un modelo sobreajustado. La poda busca el punto donde el test score alcanza su
                máximo valor (profundidad 3 a 4).
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN 5: COMPARATIVA DE MODELOS */}
      <section id="casos" className="section">
        <div className="section-container">
          <div className="section-header">
            <p className="eyebrow">06 · BENCHMARK ANALÍTICO</p>
            <h2>¿Cuándo usar un Árbol frente a otros algoritmos?</h2>
            <p>
              No existe un modelo perfecto para todos los problemas (teorema de No Free Lunch). Conoce cuándo un
              árbol es la opción ganadora y cuándo conviene escalar a ensambles o regresión logística.
            </p>
          </div>

          <div className="table-responsive">
            <table className="compare-table">
              <thead>
                <tr>
                  <th>Algoritmo</th>
                  <th>Explicabilidad</th>
                  <th>Relaciones No Lineales</th>
                  <th>Preparación de Datos</th>
                  <th>Riesgo de Sobreajuste</th>
                  <th>Mejor Caso de Uso</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>Árbol de Decisión Simple</strong>
                    <br />
                    <small style={{ color: "var(--muted)" }}>CART, C4.5, ID3</small>
                  </td>
                  <td>
                    <span className="score-badge score-high">Excelente (100%)</span>
                  </td>
                  <td>
                    <span className="score-badge score-high">Nativo</span>
                  </td>
                  <td>
                    <span className="score-badge score-high">Mínima (Tolera outliers)</span>
                  </td>
                  <td>
                    <span className="score-badge score-low">Alto (Sin Poda)</span>
                  </td>
                  <td>
                    Reglas de negocio claras, auditorías bancarias, lead scoring transparente.
                  </td>
                </tr>

                <tr>
                  <td>
                    <strong>Random Forest (Bosque Aleatorio)</strong>
                    <br />
                    <small style={{ color: "var(--muted)" }}>Ensamble de Cientos de Árboles</small>
                  </td>
                  <td>
                    <span className="score-badge score-mid">Media (Feature Importance)</span>
                  </td>
                  <td>
                    <span className="score-badge score-high">Sobresaliente</span>
                  </td>
                  <td>
                    <span className="score-badge score-high">Mínima</span>
                  </td>
                  <td>
                    <span className="score-badge score-high">Muy Bajo</span>
                  </td>
                  <td>
                    Predicción de Churn a gran escala, scoring crediticio robusto, e-commerce.
                  </td>
                </tr>

                <tr>
                  <td>
                    <strong>Regresión Logística</strong>
                    <br />
                    <small style={{ color: "var(--muted)" }}>Modelo Lineal Probabilístico</small>
                  </td>
                  <td>
                    <span className="score-badge score-high">Alta (Coeficientes Odds)</span>
                  </td>
                  <td>
                    <span className="score-badge score-low">Pobre (Solo lineal)</span>
                  </td>
                  <td>
                    <span className="score-badge score-mid">Alta (Requiere escalado)</span>
                  </td>
                  <td>
                    <span className="score-badge score-high">Bajo</span>
                  </td>
                  <td>
                    Líneas base rápidas, estudios clínicos, probabilidades continuas directas.
                  </td>
                </tr>

                <tr>
                  <td>
                    <strong>Redes Neuronales Profundas</strong>
                    <br />
                    <small style={{ color: "var(--muted)" }}>Deep Learning / MLP</small>
                  </td>
                  <td>
                    <span className="score-badge score-low">Muy Baja (Caja Negra)</span>
                  </td>
                  <td>
                    <span className="score-badge score-high">Máxima</span>
                  </td>
                  <td>
                    <span className="score-badge score-low">Muy Compleja</span>
                  </td>
                  <td>
                    <span className="score-badge score-mid">Medio-Alto</span>
                  </td>
                  <td>
                    Visión computacional, texto no estructurado, audio y patrones ultra complejos.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SECCIÓN 6: RETO DEL ANALISTA (QUIZ GAMIFICADO) */}
      <section id="reto" className="section section-dark">
        <div className="section-container">
          <div className="quiz-wrapper">
            {/* META DEL QUIZ */}
            <div className="quiz-meta">
              <div>
                <span className="quiz-score-badge">
                  Aciertos: {aciertosTotales} de {PREGUNTAS_QUIZ.length}
                </span>
                <p className="eyebrow">07 · EVALUACIÓN DE COMPETENCIAS</p>
                <h2 style={{ fontSize: "2.4rem", lineHeight: 1.15, marginBottom: "16px" }}>
                  El Reto del Analista
                </h2>
                <p style={{ color: "#a4beba", fontSize: "0.95rem", lineHeight: 1.6 }}>
                  Pon a prueba tu comprensión de criterios de división, poda, impureza y aplicaciones
                  estratégicas en analítica de marketing.
                </p>

                <div className="quiz-progress-bar">
                  <div
                    className="quiz-progress-fill"
                    style={{
                      width: `${((preguntaActual + 1) / PREGUNTAS_QUIZ.length) * 100}%`,
                    }}
                  />
                </div>
                <div style={{ fontSize: "0.8rem", color: "#a4beba" }}>
                  Pregunta {preguntaActual + 1} de {PREGUNTAS_QUIZ.length}
                </div>
              </div>

              {quizFinalizado ? (
                <div
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    padding: "20px",
                    borderRadius: "10px",
                    border: "1px solid rgba(255,255,255,0.15)",
                  }}
                >
                  <h4 style={{ color: "var(--lime)", fontSize: "1.2rem", marginBottom: "6px" }}>
                    {aciertosTotales >= 5
                      ? "🏆 ¡Maestro de Árboles de Decisión!"
                      : aciertosTotales >= 3
                      ? "🎖️ ¡Buen Trabajo, Analista en Progreso!"
                      : "📚 ¡Momento de Repasar los Fundamentos!"}
                  </h4>
                  <p style={{ fontSize: "0.85rem", color: "#d1fae5", margin: 0 }}>
                    Lograste {aciertosTotales} respuestas correctas sobre {PREGUNTAS_QUIZ.length}.
                  </p>
                  <button
                    onClick={() => {
                      setRespuestasUsuario(Array(PREGUNTAS_QUIZ.length).fill(null));
                      setPreguntaActual(0);
                      setQuizFinalizado(false);
                    }}
                    className="btn btn-secondary"
                    style={{ marginTop: "14px", width: "100%", justifyContent: "center" }}
                  >
                    Reiniciar el Reto ↺
                  </button>
                </div>
              ) : (
                <div style={{ fontSize: "0.85rem", color: "#7ca299" }}>
                  💡 Cada respuesta te brindará una explicación didáctica inmediata para consolidar tu conocimiento.
                </div>
              )}
            </div>

            {/* TARJETA INTERACTIVA DE PREGUNTAS */}
            <div className="quiz-interactive-card">
              <div className="quiz-question-number">
                Pregunta {preguntaActual + 1} · {PREGUNTAS_QUIZ[preguntaActual].pregunta.includes("Gini") ? "Métrica" : "Concepto"}
              </div>

              <h3 className="quiz-question-text">{PREGUNTAS_QUIZ[preguntaActual].pregunta}</h3>

              <div className="quiz-options-list">
                {PREGUNTAS_QUIZ[preguntaActual].opciones.map((opcion, i) => {
                  const respondida = respuestasUsuario[preguntaActual] !== null;
                  const esSeleccionada = respuestasUsuario[preguntaActual] === i;
                  const esCorrecta = i === PREGUNTAS_QUIZ[preguntaActual].correcta;

                  let claseBoton = "quiz-option-btn";
                  if (respondida) {
                    if (esSeleccionada) {
                      claseBoton += esCorrecta ? " selected-correct" : " selected-wrong";
                    } else if (esCorrecta) {
                      claseBoton += " selected-correct";
                    }
                  }

                  return (
                    <button
                      key={i}
                      disabled={respondida}
                      onClick={() => seleccionarRespuesta(i)}
                      className={claseBoton}
                    >
                      <span>{opcion}</span>
                      {respondida && (
                        <span>
                          {esCorrecta ? "✓" : esSeleccionada ? "×" : ""}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* RETROALIMENTACIÓN INMEDIATA */}
              {respuestasUsuario[preguntaActual] !== null && (
                <div
                  className={`quiz-feedback ${
                    respuestasUsuario[preguntaActual] === PREGUNTAS_QUIZ[preguntaActual].correcta
                      ? "good"
                      : "bad"
                  }`}
                >
                  <strong>
                    {respuestasUsuario[preguntaActual] === PREGUNTAS_QUIZ[preguntaActual].correcta
                      ? "🎉 ¡Respuesta Correcta!"
                      : "💡 Explicación Formativa:"}
                  </strong>{" "}
                  {PREGUNTAS_QUIZ[preguntaActual].explicacion}
                </div>
              )}

              {/* BOTONES DE NAVEGACIÓN */}
              <div className="quiz-nav-actions">
                <button
                  disabled={preguntaActual === 0}
                  onClick={() => setPreguntaActual((prev) => Math.max(0, prev - 1))}
                  className="btn btn-secondary"
                  style={{ opacity: preguntaActual === 0 ? 0.4 : 1, fontSize: "0.85rem", padding: "8px 16px" }}
                >
                  ← Anterior
                </button>

                {preguntaActual < PREGUNTAS_QUIZ.length - 1 ? (
                  <button
                    disabled={respuestasUsuario[preguntaActual] === null}
                    onClick={() => setPreguntaActual((prev) => prev + 1)}
                    className="btn btn-primary"
                    style={{
                      opacity: respuestasUsuario[preguntaActual] === null ? 0.4 : 1,
                      fontSize: "0.85rem",
                      padding: "8px 18px",
                    }}
                  >
                    Siguiente Pregunta →
                  </button>
                ) : (
                  <button
                    disabled={respuestasUsuario[preguntaActual] === null}
                    onClick={() => setQuizFinalizado(true)}
                    className="btn btn-primary"
                    style={{
                      opacity: respuestasUsuario[preguntaActual] === null ? 0.4 : 1,
                      fontSize: "0.85rem",
                      padding: "8px 18px",
                      background: "var(--emerald)",
                    }}
                  >
                    Ver Resultado Final 🏆
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN 7: PREGUNTAS FRECUENTES (FAQ & GLOSARIO) */}
      <section className="section">
        <div className="section-container">
          <div className="section-header">
            <p className="eyebrow">08 · PREGUNTAS FRECUENTES</p>
            <h2>Dudas comunes en comités de marketing y analítica</h2>
            <p>
              Respuestas directas a las preguntas que surgen al presentar árboles de decisión ante la junta
              directiva o equipos comerciales.
            </p>
          </div>

          <div className="faq-grid">
            <div className="faq-item">
              <h4>¿Por qué un árbol no necesita que normalicemos los datos numéricos?</h4>
              <p>
                A diferencia de la regresión lineal o redes neuronales, el árbol evalúa condiciones de orden
                (x ≥ umbral). Si el salario está en dólares o en millones, el orden de los datos no cambia, por lo
                que no requiere estandarización (Z-score ni Min-Max).
              </p>
            </div>

            <div className="faq-item">
              <h4>¿Cómo maneja el árbol variables categóricas como país o dispositivo?</h4>
              <p>
                Divide las categorías en subconjuntos binarios (por ejemplo, ¿Dispositivo ∈ [iOS, Mac]?). En
                herramientas como Scikit-Learn se codifican con One-Hot Encoding; otros algoritmos como LightGBM o
                CatBoost las manejan nativamente.
              </p>
            </div>

            <div className="faq-item">
              <h4>¿Qué es la Importancia de Variables (Feature Importance)?</h4>
              <p>
                Es una métrica que suma toda la reducción de impureza de Gini que aportó cada variable a lo largo de
                todas las divisiones donde participó. Permite al equipo de marketing saber con exactitud qué factor
                pesa más en la decisión de compra.
              </p>
            </div>

            <div className="faq-item">
              <h4>¿Por qué los bancos los eligen para scoring de créditos y préstamos?</h4>
              <p>
                Por cumplimiento regulatorio y derechos del consumidor. Si a un cliente se le rechaza un crédito, el
                banco está obligado por ley a explicar el motivo exacto (ej: "Días de mora previa &gt; 30"). Con una
                red neuronal profunda, justificar esa decisión individual es sumamente complejo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-top">
            <div className="footer-brand">
              <div className="brand" style={{ color: "#fff" }}>
                <span className="brand-icon">◈</span>
                <span>DecisionLab</span>
              </div>
              <p>
                Laboratorio interactivo y didáctico de árboles de decisión aplicado a marketing digital, retención
                de clientes y analítica de negocios.
              </p>
            </div>

            <div style={{ display: "flex", gap: "40px", flexWrap: "wrap" }}>
              <div>
                <strong style={{ color: "var(--cream)", fontSize: "0.85rem", display: "block", marginBottom: "12px" }}>
                  MÓDULOS DEL LAB
                </strong>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.8rem", color: "#a4beba" }}>
                  <a href="#fundamentos">Anatomía del Árbol</a>
                  <a href="#laboratorio">Simulador de Sectores</a>
                  <a href="#gini">Calculadora de Gini</a>
                  <a href="#sobreajuste">Poda & Generalización</a>
                  <a href="#reto">Desafío del Analista</a>
                </div>
              </div>

              <div>
                <strong style={{ color: "var(--cream)", fontSize: "0.85rem", display: "block", marginBottom: "12px" }}>
                  CRÉDITOS ACADÉMICOS
                </strong>
                <p style={{ fontSize: "0.8rem", color: "#a4beba", lineHeight: 1.6, margin: 0 }}>
                  Maestría en Analítica de Datos
                  <br />
                  Universidad Central · 2026
                  <br />
                  Estudiante / Investigador: <strong>Iván Velandia</strong>
                </p>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <span>© 2026 DecisionLab · Optimizado para despliegue continuo en Vercel.</span>
            <span>Desarrollado con Next.js 15, React 19 & TypeScript.</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
