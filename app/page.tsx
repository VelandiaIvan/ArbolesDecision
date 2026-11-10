"use client";

import { useMemo, useState } from "react";

type Sector = "Retail" | "Banca" | "Turismo" | "Educación" | "Salud";

const casos: Record<Sector, { icono: string; objetivo: string; variable: string; regla: string; impacto: string }> = {
  Retail: { icono: "🛍️", objetivo: "Predecir la compra de una oferta", variable: "Visitas al sitio", regla: "> 5 visitas", impacto: "Prioriza cupones para clientes con mayor intención." },
  Banca: { icono: "🏦", objetivo: "Identificar riesgo de abandono", variable: "Uso de la app", regla: "< 3 sesiones/mes", impacto: "Activa una campaña de retención antes de perder al cliente." },
  Turismo: { icono: "✈️", objetivo: "Estimar reserva de paquete", variable: "Anticipación del viaje", regla: "> 30 días", impacto: "Segmenta mensajes según la ventana de decisión." },
  Educación: { icono: "🎓", objetivo: "Predecir inscripción al programa", variable: "Asistencia a webinar", regla: "Sí asistió", impacto: "Enfoca seguimiento comercial en prospectos calificados." },
  Salud: { icono: "🩺", objetivo: "Promover chequeo preventivo", variable: "Edad", regla: ">= 40 años", impacto: "Personaliza comunicaciones de prevención con criterio ético." },
};

const preguntas = [
  { texto: "¿Cuál es el propósito de una división (split) en un árbol de decisión?", opciones: ["Reducir la heterogeneidad de los grupos", "Aumentar todas las variables", "Eliminar los datos faltantes"], correcta: 0, explicacion: "Cada división busca dejar nodos más homogéneos frente a la variable objetivo." },
  { texto: "Para predecir si una persona convierte (sí/no), ¿qué tipo de árbol usarías?", opciones: ["Regresión", "Clasificación", "Agrupamiento"], correcta: 1, explicacion: "La conversión es una categoría binaria, por eso corresponde clasificación." },
  { texto: "¿Qué ayuda a controlar el sobreajuste?", opciones: ["Aumentar sin límite la profundidad", "Podar y validar con datos no vistos", "Usar una sola variable"], correcta: 1, explicacion: "La poda y la validación evitan que el árbol memorice el conjunto de entrenamiento." },
];

export default function Inicio() {
  const [sector, setSector] = useState<Sector>("Retail");
  const [visitas, setVisitas] = useState(6);
  const [apertura, setApertura] = useState(42);
  const [profundidad, setProfundidad] = useState(3);
  const [pregunta, setPregunta] = useState(0);
  const [respuesta, setRespuesta] = useState<number | null>(null);
  const caso = casos[sector];
  const probabilidad = useMemo(() => Math.min(94, Math.max(8, Math.round(18 + visitas * 5 + apertura * 0.5 - (profundidad - 3) * 3))), [visitas, apertura, profundidad]);
  const convierte = probabilidad >= 55;

  function cambiarSector(valor: string) {
    setSector(valor as Sector);
    setRespuesta(null);
  }

  return <main>
    <nav className="nav"><a className="marca" href="#inicio"><span>◈</span> DecisionLab</a><div><a href="#conceptos">Conceptos</a><a href="#simulador">Simulador</a><a href="#reto">Reto</a></div></nav>
    <section id="inicio" className="hero">
      <div className="hero-copy"><p className="eyebrow">MAESTRÍA EN ANALÍTICA DE DATOS · UNIVERSIDAD CENTRAL</p><h1>Aprende a decidir con <em>árboles.</em></h1><p className="lead">Explora cómo los árboles de decisión convierten señales de clientes en decisiones de marketing claras, explicables y accionables.</p><div className="actions"><a className="button primary" href="#simulador">Explorar el laboratorio <span>→</span></a><a className="button ghost" href="#conceptos">Ver fundamentos</a></div><p className="autor">Diseñado para <strong>Iván Velandia</strong></p></div>
      <div className="hero-card"><div className="card-label">EJEMPLO RÁPIDO</div><h3>¿Activar cupón?</h3><div className="tree mini"><div className="node root">Visitas al sitio <b>&gt; 5</b></div><div className="branches"><div><i>Sí</i><div className="node yes">Conversión<br/><b>72%</b></div></div><div><i>No</i><div className="node no">Nutrir lead<br/><b>18%</b></div></div></div></div><p>Una regla comprensible para una acción concreta.</p></div>
    </section>

    <section id="conceptos" className="section soft"><div className="section-head"><p className="eyebrow">01 · FUNDAMENTOS</p><h2>Del dato a una regla que puedes explicar</h2><p>Un árbol hace preguntas secuenciales sobre los datos hasta llegar a una predicción o recomendación.</p></div><div className="concept-grid"><article><span className="num">01</span><h3>Raíz</h3><p>El punto de partida: la variable que mejor separa los resultados, como visitas o interacción.</p></article><article><span className="num">02</span><h3>Ramas</h3><p>Las alternativas de cada pregunta. Cada ruta representa un segmento con características comunes.</p></article><article><span className="num">03</span><h3>Hojas</h3><p>El resultado final: una clase, probabilidad o decisión de campaña.</p></article></div><div className="callout"><b>Idea clave</b><span>La ventaja del árbol en marketing no es solo predecir: es explicar por qué una audiencia recibe una acción.</span></div></section>

    <section id="simulador" className="section lab"><div className="section-head"><p className="eyebrow">02 · LABORATORIO INTERACTIVO</p><h2>Construye una decisión de campaña</h2><p>Ajusta los indicadores y observa cómo cambian la probabilidad y la recomendación.</p></div><div className="lab-grid"><aside className="controls"><label>Sector económico<select value={sector} onChange={(e) => cambiarSector(e.target.value)}>{Object.keys(casos).map((item) => <option key={item}>{item}</option>)}</select></label><label>Visitas al sitio <strong>{visitas}</strong><input type="range" min="0" max="12" value={visitas} onChange={(e) => setVisitas(Number(e.target.value))}/></label><label>Apertura de correos <strong>{apertura}%</strong><input type="range" min="0" max="100" value={apertura} onChange={(e) => setApertura(Number(e.target.value))}/></label><label>Profundidad máxima <strong>{profundidad}</strong><input type="range" min="1" max="6" value={profundidad} onChange={(e) => setProfundidad(Number(e.target.value))}/></label><small>Nota: es una simulación pedagógica, no un modelo predictivo real.</small></aside><div className="tree-panel"><div className="case-title"><span>{caso.icono}</span><div><p>{sector.toUpperCase()}</p><h3>{caso.objetivo}</h3></div></div><div className="tree full"><div className="node root">{caso.variable}<b>{caso.regla}</b></div><div className="branches"><div><i>Sí</i><div className="node mid">Apertura email <b>≥ 35%</b></div><div className="leaf-row"><div className="node yes">{convierte ? "Activar oferta" : "Prueba A/B"}<b>{probabilidad}%</b></div><div className="node no">Contenido educativo<b>{Math.max(8, 100 - probabilidad)}%</b></div></div></div><div><i>No</i><div className="node no">Secuencia de nutrición<b>Lead frío</b></div></div></div></div><div className="recommendation"><span>✦</span><p><b>Recomendación:</b> {convierte ? "ofrece una campaña personalizada." : "nutre el interés antes de invertir en un incentivo."}<br/><small>{caso.impacto}</small></p></div></div></div></section>

    <section className="section cases"><div className="section-head"><p className="eyebrow">03 · CASOS APLICADOS</p><h2>La misma lógica, distintos contextos</h2></div><div className="case-grid">{Object.entries(casos).map(([nombre, item]) => <button onClick={() => { cambiarSector(nombre); document.getElementById("simulador")?.scrollIntoView({ behavior: "smooth" }); }} className={sector === nombre ? "case active" : "case"} key={nombre}><span>{item.icono}</span><div><h3>{nombre}</h3><p>{item.objetivo}</p></div><b>→</b></button>)}</div></section>

    <section id="reto" className="section challenge"><div className="quiz-copy"><p className="eyebrow">04 · RETO DE COMPRENSIÓN</p><h2>Comprueba lo aprendido</h2><p>Responde y recibe retroalimentación inmediata. Avanza a tu ritmo.</p><div className="dots">{preguntas.map((_, i) => <button aria-label={`Pregunta ${i + 1}`} className={i === pregunta ? "dot current" : "dot"} onClick={() => { setPregunta(i); setRespuesta(null); }} key={i}/>)}</div></div><div className="quiz"><p className="counter">PREGUNTA {pregunta + 1} DE {preguntas.length}</p><h3>{preguntas[pregunta].texto}</h3>{preguntas[pregunta].opciones.map((opcion, i) => <button key={opcion} onClick={() => setRespuesta(i)} className={`answer ${respuesta === i ? (i === preguntas[pregunta].correcta ? "correct" : "wrong") : ""}`}>{opcion}<span>{respuesta === i && (i === preguntas[pregunta].correcta ? "✓" : "×")}</span></button>)}{respuesta !== null && <div className={respuesta === preguntas[pregunta].correcta ? "feedback good" : "feedback bad"}><b>{respuesta === preguntas[pregunta].correcta ? "¡Correcto!" : "Casi."}</b> {preguntas[pregunta].explicacion}</div>}</div></section>
    <footer><div><span className="marca">◈ DecisionLab</span><p>Árboles de decisión para marketing digital.</p></div><p>Maestría en Analítica de Datos · Universidad Central<br/>Iván Velandia · 2026</p></footer>
  </main>;
}
