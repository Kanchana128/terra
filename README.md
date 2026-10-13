# TerraSense AI

TerraSense AI is a responsive React + Vite interface for agricultural land analysis and crop recommendations. It intentionally does not simulate AI, infer soil properties from an image, or include pre-filled crop knowledge.

## Run locally

Requirements: Node.js 18+ and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`). To build and preview the production frontend:

```bash
npm run build
npm run preview
```

## Project structure

```text
terrasense-ai/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── App.jsx
    ├── main.jsx
    ├── styles.css
    └── components/
        ├── Analysis.jsx
        ├── Dashboard.jsx
        ├── History.jsx
        ├── Knowledge.jsx
        ├── Recommendations.jsx
        ├── Shared.jsx
        └── Sidebar.jsx
```

## Connecting an analysis backend

The UI currently reports **“Analysis engine not connected yet.”** The analysis form and image preview are local-only, and the recommendation screen remains empty until actual results are supplied.

`src/components/Recommendations.jsx` accepts `results`, `form`, and `onStart` props. Replace the current `results={null}` in `src/App.jsx` with state populated by a backend request. Keep the returned data in this shape (or adapt the component at that boundary):

```js
{
  status: 'completed',
  summary: {
    location: '...',
    area: '...',
    soilType: '...',
    temperature: '...'
  },
  missingInformation: ['...'],
  crops: [
    {
      name: '...',
      suitability: '...', // backend-provided value; no frontend default
      explanation: '...',
      soilCompatibility: '...',
      waterRequirements: '...',
      climateCompatibility: '...',
      risks: ['...']
    }
  ]
}
```

For a Flask service, a typical integration can submit the collected `form` fields and optional image using `FormData`, then set the parsed response as recommendation state:

```js
const payload = new FormData()
Object.entries(form).forEach(([key, value]) => payload.append(key, value))
if (image?.file) payload.append('image', image.file)

const response = await fetch('http://localhost:5000/api/analyze', {
  method: 'POST',
  body: payload,
})
if (!response.ok) throw new Error(`Analysis request failed (${response.status})`)
setResults(await response.json())
```

Keep the Flask endpoint and frontend origin aligned with your local CORS configuration. The backend should explicitly report which information is missing and should not treat unknown soil properties as known facts. Add loading and error states when wiring the real service; do not show recommendation cards until valid results are returned.

## Included interactions

- Sidebar and mobile navigation between dashboard, land analysis, crop recommendations, knowledge base, and history.
- JPG/JPEG/PNG image upload with preview, replacement/removal, and type/10 MB size validation.
- Editable land inputs retained while navigating between sections; location and positive land area are validated on submission.
- Empty recommendations and analysis history until real engine output is available.
- Searchable knowledge base with a form for user-entered crop profiles and their references. Entries are held in app memory for this session.
- Light/dark appearance toggle.
