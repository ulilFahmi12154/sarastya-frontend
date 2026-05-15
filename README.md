# TaskFlow Web

TaskFlow Web adalah frontend React untuk sistem manajemen proyek dan tugas. Aplikasi ini terhubung ke backend TaskFlow API yang sudah dideploy di Railway dan mendukung register, login, project management, serta task management dengan JWT.

## Teknologi

- React
- Vite
- React Router DOM
- React Context API
- Fetch API
- CSS biasa
- LocalStorage untuk token JWT demo

## Struktur Folder

```text
src/
  api/
    client.js
    authApi.js
    projectsApi.js
    tasksApi.js
  context/
    AuthContext.jsx
  components/
    Navbar.jsx
    ProtectedRoute.jsx
    Loading.jsx
    Alert.jsx
    ProjectCard.jsx
    TaskCard.jsx
  pages/
    LoginPage.jsx
    RegisterPage.jsx
    DashboardPage.jsx
    ProjectDetailPage.jsx
    NotFoundPage.jsx
  utils/
    date.js
  App.jsx
  main.jsx
  styles.css
```

## Menjalankan Lokal

```bash
npm install
cp .env.example .env
npm run dev
```

Aplikasi akan berjalan di URL yang ditampilkan oleh Vite, biasanya `http://localhost:5173`.

## Konfigurasi API Backend

Backend API:

```text
https://sarastya-backend-production.up.railway.app
```

File `.env.example` berisi:

```env
VITE_API_BASE_URL=https://sarastya-backend-production.up.railway.app
```

Jika `VITE_API_BASE_URL` tidak tersedia, aplikasi otomatis memakai fallback:

```text
https://sarastya-backend-production.up.railway.app
```

Saat menjalankan `npm run dev`, request frontend memakai path relatif `/api` dan diteruskan oleh Vite dev proxy ke `VITE_API_BASE_URL`. Ini membantu testing lokal ketika backend belum membuka CORS untuk `localhost`.

Swagger backend:

```text
https://sarastya-backend-production.up.railway.app/swagger
```

Endpoint `projects` dan `tasks` adalah endpoint protected dan membutuhkan header:

```http
Authorization: Bearer <token>
```

Jika backend membalas `401 Unauthorized`, aplikasi akan menghapus sesi lokal dan mengarahkan user ke halaman login.

## Build Production

```bash
npm run build
```

Output build Vite tersedia di folder `dist`.

## Testing Flow

Alur utama testing: Register -> Login -> Create Project -> Create Task.

1. Register akun baru di `/register`.
2. Login di `/login` jika belum otomatis masuk.
3. Buat project dari dashboard.
4. Buka detail project.
5. Buat task pada project tersebut.
6. Ubah status task ke `Todo`, `Doing`, atau `Done`.
7. Hapus task atau project untuk menguji delete flow.
8. Logout untuk memastikan protected route kembali mengarah ke login.

## Deployment

### Vercel

1. Import repository ke Vercel.
2. Pastikan backend mengizinkan CORS dari domain frontend Vercel.
3. Set environment variable:

```env
VITE_API_BASE_URL=https://sarastya-backend-production.up.railway.app
```

4. Gunakan konfigurasi:

```text
Build command: npm run build
Output directory: dist
```

### Netlify

1. Import repository ke Netlify.
2. Pastikan backend mengizinkan CORS dari domain frontend Netlify.
3. Set environment variable yang sama.
4. Gunakan konfigurasi:

```text
Build command: npm run build
Publish directory: dist
```

## Catatan Keamanan

JWT disimpan di `localStorage` untuk kebutuhan demo/tugas. Jangan hardcode token di source code dan jangan commit file `.env`. Validasi tetap perlu dilakukan di backend karena validasi frontend hanya membantu pengalaman pengguna.

## Saran Conventional Commit

```bash
feat: initialize taskflow web frontend
feat: add auth pages and jwt context
feat: add project dashboard
feat: add task management
docs: add frontend setup guide
```
