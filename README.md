# 🔋 Battery Inspection Analytics Dashboard

A full-stack industrial analytics dashboard designed to visualize, monitor, and inspect battery production quality in real-time. This system parses raw inspection logs (CSV & Text), aggregates metrics, and serves high-resolution inspection images for quality control verification.

![Project Status](https://img.shields.io/badge/Status-Active-success)
![Tech Stack](https://img.shields.io/badge/Stack-Next.js_|_FastAPI-blue)

## 🌟 Features

-   **Real-time Metrics:** Instant visualization of Total Scanned, Passed (OK), and Failed (NG) batteries.
-   **Data Reconciliation:** Intelligent parsing logic that merges machine logs (`.csv`) with final verification results (`.txt`) to ensure accurate status reporting.
-   **Interactive Data Grid:**
    -   Filter by Status (OK/NG).
    -   Debounced Search (ID, Timestamp, etc.).
    -   Expandable rows for detailed metadata.
-   **Advanced Image Viewer:**
    -   Deep Zoom & Pan capabilities.
    -   Image Rotation & Fullscreen mode.
    -   Direct Download.
    -   *Note: Bypasses SSR optimization for local network speed.*
-   **Theming:** Fully responsive UI with toggleable **Dark/Light Mode**.

## 🛠 Tech Stack

### Frontend
| Technology | Description |
| :--- | :--- |
| **Next.js 14** | React Framework (App Router). |
| **TypeScript** | Static typing for reliability. |
| **Material UI (MUI)** | Component library for a premium, accessible UI. |
| **Axios** | HTTP Client for API communication. |

### Backend
| Technology | Description |
| :--- | :--- |
| **FastAPI** | High-performance Python web framework. |
| **Uvicorn** | ASGI server. |
| **Pandas/Regex** | For parsing complex log formats. |
| **StaticFiles** | For serving inspection images securely. |

---

## 📂 Data Parsing Logic

The system utilizes a custom ETL (Extract, Transform, Load) process defined in `parsing.py`:

1.  **Source 1 (CSV):** Reads `resin_csv_YYYY-MM-DD.csv`. This file contains the base records, timestamps, and image paths. It uses variable whitespace delimiters (not standard commas).
2.  **Source 2 (TXT):** Reads `results_YYYY-MM-DD.txt`. This file contains the final "GO" (Pass) or "NG" (Fail) verification codes.
3.  **Reconciliation:** The backend matches records by timestamp. The status in the Text file takes precedence over the CSV file to ensure the most accurate inspection result is displayed.

---

## 🚀 Getting Started

### Prerequisites
-   Node.js (v18+)
-   Python (v3.10+)
-   Pip

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install fastapi uvicorn

# Configure Image Path
# Open main.py and update the IMAGES_DIRECTORY variable to point 
# to your local folder containing the date-based image structure.

# Run the server
uvicorn main:app --reload
```

The API will run at http://localhost:8000.

Docs: http://localhost:8000/docs

Images: http://localhost:8000/images/...

```Bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create Environment Variable
# Create a .env.local file in the root
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Run the development server
npm run dev
```
Open http://localhost:3000 to view the dashboard.

### Project Structure
```Plaintext
├── backend/
│   ├── main.py                # FastAPI entry point & Static Mounts
│   ├── parsing.py             # CSV/TXT Parsing Logic
│   ├── schemas.py             # Pydantic Models
│   ├── data/
│   │   ├── resin_csv_....csv  # Raw Logs
│   │   └── results_....txt    # Raw Results
│   └── static_images/         # Image Repository (Date/Hour structure)
│
└── frontend/
    ├── src/
    │   ├── app/               # Next.js App Router
    │   ├── components/
    │   │   ├── BatteryTable.tsx # Main Data Grid
    │   │   └── ImageModal.tsx   # Advanced Image Viewer
    │   └── ThemeContext.tsx     # Dark/Light Mode Logic
    ├── next.config.mjs          # Security & Image Config
    └── package.json
```
