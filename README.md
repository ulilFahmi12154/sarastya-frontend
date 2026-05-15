# TaskFlow Web

TaskFlow Web adalah frontend React untuk sistem manajemen proyek dan tugas. Aplikasi ini terhubung ke backend TaskFlow API yang sudah dideploy di Railway dan mendukung register, login, project management, serta task management dengan JWT.

## Deployment

TaskFlow Web telah dideploy menggunakan Vercel.

- Frontend URL: `https://sarastya-frontend.vercel.app`
- Backend API URL: `https://sarastya-backend-production.up.railway.app`
- Swagger API: `https://sarastya-backend-production.up.railway.app/swagger`

## Teknologi

- React
- Vite
- React Router DOM
- React Context API
- Fetch API
- CSS biasa
- LocalStorage untuk token JWT demo
- Vercel untuk deployment

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

Install dependency:

```bash
npm install
```

Copy file environment:

```bash
cp .env.example .env
```

Jalankan aplikasi:

```bash
npm run dev
```

Aplikasi akan berjalan di URL yang ditampilkan oleh Vite, biasanya:

```text
http://localhost:5173
```

## Konfigurasi API Backend

Frontend menggunakan environment variable berikut untuk menentukan alamat backend:

```env
VITE_API_BASE_URL=https://sarastya-backend-production.up.railway.app
```

File `.env.example` sudah disediakan dengan value default:

```env
VITE_API_BASE_URL=https://sarastya-backend-production.up.railway.app
```

Jika `VITE_API_BASE_URL` tidak tersedia, aplikasi menggunakan fallback ke backend production:

```text
https://sarastya-backend-production.up.railway.app
```

Backend API:

```text
https://sarastya-backend-production.up.railway.app
```

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

Jalankan command berikut:

```bash
npm run build
```

Output build Vite tersedia di folder:

```text
dist
```

Untuk preview hasil build:

```bash
npm run preview
```

## Deployment ke Vercel

Langkah deployment:

1. Push repository frontend ke GitHub.
2. Import repository ke Vercel.
3. Pilih framework preset: `Vite`.
4. Gunakan konfigurasi berikut:

```text
Build command: npm run build
Output directory: dist
Install command: npm install
```

5. Tambahkan environment variable di Vercel:

```env
VITE_API_BASE_URL=https://sarastya-backend-production.up.railway.app
```

6. Klik Deploy.

Jika environment variable diubah setelah deployment, lakukan redeploy agar value terbaru terbaca oleh aplikasi.

Backend Railway sudah dikonfigurasi CORS agar menerima request dari domain frontend Vercel:

```text
https://sarastya-frontend.vercel.app
```

## Deployment ke Netlify

Jika menggunakan Netlify:

1. Import repository ke Netlify.
2. Pastikan backend mengizinkan CORS dari domain frontend Netlify.
3. Set environment variable:

```env
VITE_API_BASE_URL=https://sarastya-backend-production.up.railway.app
```

4. Gunakan konfigurasi:

```text
Build command: npm run build
Publish directory: dist
```

## Testing Flow

Alur utama testing:

```text
Register → Login → Create Project → Create Task
```

Langkah pengujian:

1. Register akun baru di `/register`.
2. Login di `/login` jika belum otomatis masuk.
3. Buat project dari dashboard.
4. Buka detail project.
5. Buat task pada project tersebut.
6. Ubah status task ke `Todo`, `Doing`, atau `Done`.
7. Hapus task atau project untuk menguji delete flow.
8. Logout untuk memastikan protected route kembali mengarah ke login.

## Fitur Utama

- Register user.
- Login user.
- Logout.
- Protected route.
- Dashboard project.
- Create project.
- View project detail.
- Update project.
- Delete project.
- Create task.
- Update task.
- Update status task.
- Delete task.
- Loading state.
- Success dan error message.
- Empty state.
- Responsive layout untuk desktop dan tablet.

## Catatan Keamanan

JWT disimpan di `localStorage` untuk kebutuhan demo/tugas. Jangan hardcode token di source code dan jangan commit file `.env`.

Validasi tetap dilakukan di backend karena validasi frontend hanya membantu pengalaman pengguna. Jika token invalid atau expired, aplikasi akan menghapus sesi lokal dan mengarahkan user ke halaman login.

## Saran Conventional Commit

```bash
feat: initialize taskflow web frontend
feat: add auth pages and jwt context
feat: add project dashboard
feat: add task management
docs: add frontend setup guide
docs: update frontend deployment guide
fix: handle api error states
```
