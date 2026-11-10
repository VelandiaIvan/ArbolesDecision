# DecisionLab: Árboles de decisión para marketing digital

Aplicación académica e interactiva para la asignatura de Marketing Digital de la **Maestría en Analítica de Datos — Universidad Central**. Autora/autor del proyecto: **Iván Velandia**.

La aplicación permite entender los conceptos de árboles de decisión, explorar casos de sectores económicos distintos, alterar indicadores dentro de un simulador pedagógico y responder preguntas de evaluación con retroalimentación inmediata.

## Características

- Interfaz completamente en español y adaptable a móvil.
- Explicación visual de raíz, ramas y hojas.
- Simulador: visitas, apertura de correos y profundidad del árbol.
- Casos de retail, banca, turismo, educación y salud.
- Reto de tres preguntas con explicación de cada respuesta.
- Sin autenticación, base de datos ni variables de entorno.

> El simulador emplea una fórmula didáctica; no reemplaza el entrenamiento o la validación de un modelo estadístico real.

## Tecnologías

- Next.js 15 (App Router)
- React 19
- TypeScript
- CSS nativo

## Ejecución local

Requisitos: Node.js 20.9 o una versión posterior y npm.

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

Para verificar una compilación de producción:

```bash
npm run build
npm run start
```

## Publicar el código en GitHub

1. Crea un repositorio vacío en GitHub, por ejemplo `decisionlab-marketing`.
2. Desde la carpeta del proyecto, ejecuta:

```bash
git init
git add .
git commit -m "feat: crear laboratorio de árboles de decisión"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/decisionlab-marketing.git
git push -u origin main
```

3. Confirma que GitHub muestre el archivo `README.md` y la carpeta `app`.

## Desplegar en Vercel

1. Inicia sesión en [Vercel](https://vercel.com) usando GitHub.
2. Selecciona **Add New → Project**.
3. Importa el repositorio `decisionlab-marketing`.
4. Vercel detectará Next.js automáticamente. Conserva los valores predeterminados y pulsa **Deploy**.
5. Al terminar, Vercel mostrará una URL pública. Cada `git push` a `main` generará un nuevo despliegue automáticamente.

No debes configurar variables de entorno para esta versión.

## Estructura

```text
arboles-marketing-academico/
├── app/
│   ├── globals.css       # Estilos y diseño adaptable
│   ├── layout.tsx        # Metadatos y estructura base
│   └── page.tsx          # Contenido e interactividad
├── .gitignore
├── next.config.ts
├── package.json
└── README.md
```

## Próximas extensiones sugeridas

- Cargar un archivo CSV y entrenar un árbol real en un servicio backend.
- Incluir métricas de desempeño: accuracy, precision, recall y matriz de confusión.
- Añadir más actividades y un certificado de finalización.
- Conectar fuentes de datos de campañas con consentimiento y principios de privacidad.
