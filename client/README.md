# ResolveFlow — Frontend Application

React + Vite + Tailwind CSS + Framer Motion user interface for ResolveFlow.

## Design Language
- Clean white background & light surfaces (`#FAFAFC`, `#FFFFFF`)
- Light purple primary accent (`#7C3AED` / `#8B5CF6`)
- Soft purple secondary accent (`#A855F7`)
- Dark neutral text (`#0F172A`)
- 14–18px border radius on cards (`rounded-card`)
- Inter font family & Lucide icons
- Apple-clean aesthetic with AI control-center functionality

## Folder Structure
```
src/
├── components/     # Reusable UI tokens and widgets
├── pages/          # Dashboard, Case Creation, Case Detail views
├── layouts/        # AppLayout, Navbar, Footer
├── hooks/          # TanStack Query & state hooks
├── services/       # Axios API client & contract mock data
├── context/        # Auth & global state context
├── utils/          # Formatting and classname helpers
├── types/          # JSDoc interface definitions
├── constants/      # Shared event & status constants
└── styles/         # index.css & Tailwind layers
```

## Running Locally
```bash
# Install dependencies
npm install

# Start Vite dev server
npm run dev

# Build for production
npm run build
```
