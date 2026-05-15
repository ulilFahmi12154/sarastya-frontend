# Product Requirements Document (PRD) - TaskFlow Web

## 1. Nama Produk

**TaskFlow Web**

## 2. Deskripsi Produk

TaskFlow Web adalah aplikasi frontend berbasis React untuk mengelola proyek dan tugas. Aplikasi ini terhubung dengan TaskFlow API yang sudah dibangun menggunakan ASP.NET Core dan PostgreSQL.

Frontend Web ini memungkinkan pengguna untuk melakukan register, login, melihat daftar project, membuat project baru, melihat detail project, serta mengelola task yang berelasi dengan project.

Aplikasi ini dibuat untuk memenuhi kebutuhan tugas pengembangan sistem berbasis web dengan frontend React, backend RESTful API, autentikasi JWT, dan integrasi database melalui backend.

## 3. Tujuan Produk

Tujuan utama TaskFlow Web adalah menyediakan antarmuka web yang mudah digunakan untuk mengakses fitur-fitur utama TaskFlow API.

Tujuan khusus:

- Menyediakan halaman register dan login.
- Menangani token JWT dari backend.
- Mengakses endpoint API yang diproteksi menggunakan Bearer Token.
- Menampilkan daftar project.
- Membuat, mengubah, dan menghapus project.
- Menampilkan detail project beserta task di dalamnya.
- Membuat, mengubah status, dan menghapus task.
- Memberikan feedback visual kepada pengguna seperti loading state, success message, error message, dan empty state.
- Menyediakan UI yang responsif minimal untuk desktop dan tablet.
- Menyediakan repository frontend yang rapi, terdokumentasi, dan siap dideploy.

## 4. Target Pengguna

Target pengguna aplikasi ini adalah:

- Mahasiswa atau tim kecil yang ingin mengelola daftar project dan task.
- Pengguna yang membutuhkan sistem sederhana untuk tracking pekerjaan.
- Dosen/asisten penguji yang akan menilai implementasi frontend React yang terhubung dengan backend API.

## 5. Ruang Lingkup Produk

### 5.1 Termasuk dalam Scope

- Autentikasi pengguna:
  - Register
  - Login
  - Logout
  - Penyimpanan JWT token
- Routing halaman menggunakan React Router DOM.
- Protected route untuk halaman yang membutuhkan login.
- Dashboard project.
- CRUD project.
- Detail project.
- CRUD task.
- Update status task.
- Feedback UI.
- Responsive layout untuk desktop dan tablet.
- Integrasi dengan backend API menggunakan Fetch API.
- Dokumentasi penggunaan melalui README.md.
- Deployment frontend ke Vercel atau Netlify.

### 5.2 Tidak Termasuk dalam Scope

- Role admin/user.
- Upload file.
- Real-time collaboration.
- Notification system.
- Drag and drop task board.
- Offline mode.
- Integrasi kalender.
- Manajemen profil pengguna secara lengkap.
- Fitur komentar pada task.
- Multi workspace atau multi team.

## 6. Backend API

Frontend akan menggunakan TaskFlow API yang sudah dideploy di Railway.

### 6.1 Base API URL

```text
https://sarastya-backend-production.up.railway.app
```

### 6.2 Swagger API

```text
https://sarastya-backend-production.up.railway.app/swagger
```

### 6.3 Environment Variable

Frontend harus membaca base URL dari environment variable:

```env
VITE_API_BASE_URL=https://sarastya-backend-production.up.railway.app
```

Jika variable tidak tersedia, aplikasi boleh fallback ke URL backend production tersebut.

## 7. Teknologi yang Digunakan

### 7.1 Frontend Web

- React
- Vite
- React Router DOM
- React Context API
- Fetch API
- CSS biasa / global CSS
- LocalStorage untuk penyimpanan token JWT
- Vercel atau Netlify untuk deployment

### 7.2 Backend API

- ASP.NET Core 8
- PostgreSQL
- JWT Bearer Authentication
- Swagger/OpenAPI
- Railway deployment

## 8. Arsitektur Frontend

Aplikasi menggunakan pendekatan modular berbasis folder.

Rencana struktur folder:

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

Penjelasan singkat:

- `api/` berisi fungsi komunikasi ke backend menggunakan Fetch API.
- `context/` berisi state global untuk autentikasi.
- `components/` berisi komponen UI reusable.
- `pages/` berisi halaman utama aplikasi.
- `utils/` berisi fungsi helper seperti format tanggal.
- `styles.css` berisi styling global dan responsive design.

## 9. Kebutuhan Fungsional

### 9.1 Register

Pengguna dapat membuat akun baru.

Endpoint:

```http
POST /api/auth/register
```

Request body:

```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

Acceptance criteria:

- User dapat mengisi email dan password.
- Email wajib diisi.
- Password minimal 8 karakter.
- Jika register berhasil, token disimpan.
- Setelah register berhasil, user diarahkan ke dashboard.
- Jika register gagal, aplikasi menampilkan pesan error yang mudah dipahami.
- Tombol submit menampilkan loading state saat request berjalan.

### 9.2 Login

Pengguna dapat masuk menggunakan akun yang sudah dibuat.

Endpoint:

```http
POST /api/auth/login
```

Request body:

```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

Acceptance criteria:

- User dapat mengisi email dan password.
- Email wajib diisi.
- Password wajib diisi.
- Jika login berhasil, token JWT disimpan di localStorage.
- Jika login gagal, aplikasi menampilkan pesan error.
- Setelah login berhasil, user diarahkan ke dashboard.
- Tombol submit menampilkan loading state saat request berjalan.

### 9.3 Logout

Pengguna dapat keluar dari aplikasi.

Acceptance criteria:

- Token dihapus dari localStorage.
- Data user di AuthContext dibersihkan.
- User diarahkan kembali ke halaman login.
- Halaman protected tidak dapat diakses setelah logout.

### 9.4 Protected Route

Halaman dashboard, project detail, dan task hanya dapat diakses setelah login.

Acceptance criteria:

- Jika user belum login, redirect ke halaman login.
- Jika token tidak tersedia, user diarahkan ke login.
- Jika API mengembalikan 401, user otomatis logout.
- Jika user sudah login, halaman protected dapat diakses.

### 9.5 Dashboard Project

Pengguna dapat melihat daftar project.

Endpoint:

```http
GET /api/projects
```

Acceptance criteria:

- Menampilkan daftar project dari backend.
- Menampilkan loading state saat data dimuat.
- Menampilkan empty state jika belum ada project.
- Menampilkan error message jika request gagal.
- Setiap project memiliki tombol untuk melihat detail.
- Setiap project memiliki tombol edit dan delete.

### 9.6 Create Project

Pengguna dapat membuat project baru.

Endpoint:

```http
POST /api/projects
```

Request body:

```json
{
  "name": "Project Name",
  "description": "Project description",
  "startDate": "2026-05-14T12:00:00Z",
  "endDate": "2026-06-14T12:00:00Z"
}
```

Acceptance criteria:

- Field name wajib diisi.
- Field description opsional.
- Field startDate wajib atau menggunakan default tanggal hari ini.
- Field endDate opsional.
- Format tanggal dikirim dalam format ISO string dengan timezone, contoh `2026-05-14T12:00:00Z`.
- Jika berhasil, project baru muncul di daftar project.
- Jika gagal, aplikasi menampilkan pesan error.
- Form reset setelah project berhasil dibuat.

### 9.7 Project Detail

Pengguna dapat melihat detail project.

Endpoint:

```http
GET /api/projects/{id}
```

Acceptance criteria:

- Menampilkan nama project.
- Menampilkan deskripsi project.
- Menampilkan tanggal mulai dan tanggal selesai.
- Menampilkan daftar task yang berelasi dengan project.
- Menampilkan empty state jika project belum punya task.
- Menampilkan error message jika project tidak ditemukan atau request gagal.

### 9.8 Update Project

Pengguna dapat mengubah data project.

Endpoint:

```http
PUT /api/projects/{id}
```

Request body:

```json
{
  "name": "Updated Project Name",
  "description": "Updated project description",
  "startDate": "2026-05-14T12:00:00Z",
  "endDate": "2026-06-14T12:00:00Z"
}
```

Acceptance criteria:

- User dapat mengubah name, description, startDate, dan endDate.
- Field name tetap wajib.
- Setelah berhasil update, data di UI ikut berubah.
- Jika gagal, aplikasi menampilkan pesan error.
- Tombol submit menampilkan loading state saat request berjalan.

### 9.9 Delete Project

Pengguna dapat menghapus project.

Endpoint:

```http
DELETE /api/projects/{id}
```

Acceptance criteria:

- Aplikasi menampilkan konfirmasi sebelum menghapus.
- Jika berhasil, project hilang dari daftar.
- Jika gagal, aplikasi menampilkan pesan error.
- Jika project dihapus, task yang berelasi akan ikut terhapus melalui backend.

### 9.10 Get Tasks

Pengguna dapat melihat daftar task.

Endpoint:

```http
GET /api/tasks
```

Acceptance criteria:

- Menampilkan daftar task.
- Menampilkan loading state saat data dimuat.
- Menampilkan empty state jika belum ada task.
- Menampilkan error message jika request gagal.

### 9.11 Create Task

Pengguna dapat membuat task di dalam project.

Endpoint:

```http
POST /api/tasks
```

Request body:

```json
{
  "projectId": "project-id",
  "title": "Task title",
  "content": "Task content",
  "status": "Todo",
  "priority": 1,
  "dueDate": "2026-05-20T12:00:00Z"
}
```

Acceptance criteria:

- Field projectId wajib.
- Field title wajib.
- Field content opsional.
- Field status wajib dengan nilai `Todo`, `Doing`, atau `Done`.
- Field priority berupa angka.
- Field dueDate opsional.
- Jika berhasil, task muncul di detail project.
- Jika gagal, aplikasi menampilkan pesan error.
- Form reset setelah task berhasil dibuat.

### 9.12 Update Task

Pengguna dapat mengubah task.

Endpoint:

```http
PUT /api/tasks/{id}
```

Request body:

```json
{
  "projectId": "project-id",
  "title": "Updated task title",
  "content": "Updated task content",
  "status": "Done",
  "priority": 2,
  "dueDate": "2026-05-21T12:00:00Z"
}
```

Acceptance criteria:

- User dapat mengubah title, content, status, priority, dan dueDate.
- User dapat mengubah status task dari `Todo` ke `Doing` atau `Done`.
- Setelah berhasil update, UI menampilkan data terbaru.
- Jika gagal, aplikasi menampilkan pesan error.

### 9.13 Delete Task

Pengguna dapat menghapus task.

Endpoint:

```http
DELETE /api/tasks/{id}
```

Acceptance criteria:

- Aplikasi menampilkan konfirmasi sebelum menghapus.
- Jika berhasil, task hilang dari daftar.
- Jika gagal, aplikasi menampilkan pesan error.

## 10. Kebutuhan Non-Fungsional

### 10.1 Responsif

Aplikasi harus responsif minimal untuk:

- Desktop
- Tablet

Kriteria:

- Layout tidak pecah pada layar tablet.
- Form tetap mudah digunakan.
- Card project dan task tersusun rapi.
- Navbar tetap dapat digunakan di layar lebih kecil.
- Spacing dan ukuran teks nyaman dibaca.

### 10.2 Performance

- Request API dilakukan seperlunya.
- Loading state ditampilkan saat proses fetch.
- Tidak melakukan fetch berulang tanpa kebutuhan.
- Komponen dibuat sederhana dan reusable.
- State disimpan secara efisien di context atau local component state.

### 10.3 Error Handling

Aplikasi harus menangani error dengan baik.

Contoh:

- 400 Bad Request: tampilkan pesan validasi.
- 401 Unauthorized: logout otomatis dan redirect ke login.
- 404 Not Found: tampilkan pesan data tidak ditemukan.
- 500 Server Error: tampilkan pesan umum seperti "Terjadi kesalahan pada server."

Aplikasi tidak boleh menampilkan detail error sensitif kepada user.

### 10.4 Keamanan

- Token JWT disimpan di localStorage untuk kebutuhan demo/tugas.
- Request ke endpoint protected harus mengirim header:

```http
Authorization: Bearer <token>
```

- Jangan hardcode token di source code.
- Jangan commit file `.env`.
- Validasi input dilakukan di frontend dan backend.
- Error sensitif dari backend tidak ditampilkan mentah-mentah di UI.

### 10.5 Maintainability

- Struktur folder harus modular.
- API call dipisahkan dari komponen UI.
- Auth state dipusatkan di AuthContext.
- Komponen UI dibuat reusable.
- Penamaan file dan fungsi harus jelas.
- Hindari duplikasi kode yang tidak perlu.
- Gunakan helper untuk format tanggal dan request API.

## 11. Desain UI/UX

### 11.1 Konsep Visual

Desain yang digunakan adalah modern, clean, dan profesional.

Karakter desain:

- Warna utama biru/indigo.
- Background terang.
- Card layout untuk project dan task.
- Form sederhana dan mudah dipahami.
- Button dengan hover state.
- Badge status task:
  - Todo
  - Doing
  - Done
- Feedback visual untuk loading, sukses, error, dan empty state.

### 11.2 Halaman Utama

Halaman yang harus tersedia:

- Login Page
- Register Page
- Dashboard / Projects Page
- Project Detail Page
- Not Found Page

### 11.3 Komponen UI

Komponen yang dibutuhkan:

- Navbar
- ProtectedRoute
- Loading
- Alert
- ProjectCard
- TaskCard
- Form project
- Form task
- Status badge
- Confirmation action untuk delete

## 12. Routing

Rencana route:

```text
/login
/register
/dashboard
/projects/:id
*
```

Detail:

- `/login` untuk login.
- `/register` untuk register.
- `/dashboard` untuk daftar project.
- `/projects/:id` untuk detail project dan task.
- `*` untuk not found page.

Route protected:

```text
/dashboard
/projects/:id
```

## 13. State Management

State management menggunakan **React Context API**.

AuthContext menyimpan:

- token
- user email
- status login
- login function
- register function
- logout function

Token disimpan di localStorage agar user tetap login setelah refresh halaman.

## 14. API Client

Aplikasi harus memiliki wrapper Fetch API, misalnya `src/api/client.js`.

Fungsi API client:

- Membaca `VITE_API_BASE_URL`.
- Menambahkan header `Content-Type: application/json`.
- Menambahkan header `Authorization: Bearer <token>` jika token tersedia.
- Mengubah response menjadi JSON.
- Menangani error response.
- Jika response 401, trigger logout atau menghapus token.

Contoh header untuk endpoint protected:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

## 15. Environment

File `.env.example`:

```env
VITE_API_BASE_URL=https://sarastya-backend-production.up.railway.app
```

File `.env` tidak boleh di-commit ke GitHub.

## 16. Deployment

Frontend akan dideploy ke salah satu platform berikut:

- Vercel
- Netlify
- Firebase Hosting
- GitHub Pages

Rekomendasi: **Vercel** karena mudah untuk project Vite React.

Production environment:

```env
VITE_API_BASE_URL=https://sarastya-backend-production.up.railway.app
```

Build command:

```bash
npm run build
```

Output directory Vite:

```text
dist
```

## 17. Dokumentasi README

Repository frontend wajib memiliki `README.md` yang berisi:

- Deskripsi singkat project.
- Teknologi yang digunakan.
- Struktur folder.
- Cara menjalankan lokal.
- Cara mengatur environment variable.
- Cara menghubungkan frontend ke backend.
- Cara build production.
- Cara deployment.
- Link deployment frontend.
- Link backend API.
- Testing flow:
  - Register
  - Login
  - Create Project
  - Create Task
  - Logout
- Catatan keamanan JWT.

## 18. Git dan Repository

Repository GitHub harus rapi dan siap dibagikan.

Ketentuan:

- Menggunakan `.gitignore`.
- Tidak commit `node_modules`.
- Tidak commit `.env`.
- Tidak commit file build `dist`.
- Commit message menggunakan Conventional Commits.

Contoh commit:

```bash
feat: initialize taskflow web frontend
feat: add auth pages and jwt context
feat: add project dashboard
feat: add task management
docs: add frontend setup guide
fix: handle api error states
```

Repository perlu dibagikan ke:

```text
ngertos@gmail.com
```

## 19. Acceptance Criteria Keseluruhan

Frontend dianggap selesai jika:

- Aplikasi dapat dijalankan dengan `npm run dev`.
- Register user berhasil.
- Login user berhasil.
- Token JWT tersimpan.
- Protected route berjalan.
- User dapat melihat daftar project.
- User dapat membuat project.
- User dapat melihat detail project.
- User dapat membuat task pada project.
- User dapat mengubah status task.
- User dapat menghapus project/task.
- UI memiliki loading state, success message, error message, dan empty state.
- UI responsif untuk desktop dan tablet.
- Aplikasi dapat dideploy secara public.
- README lengkap tersedia.
- Repository bersih dan tidak menyimpan file sensitif.

## 20. Risiko dan Mitigasi

| Risiko | Mitigasi |
|---|---|
| Backend API down | Tampilkan error message yang ramah |
| Token expired/invalid | Logout otomatis dan redirect ke login |
| CORS error | Pastikan backend mengizinkan domain frontend |
| Format tanggal tidak sesuai | Gunakan format ISO string dengan `Z` |
| Data kosong | Tampilkan empty state |
| Validasi gagal | Tampilkan pesan validasi |
| Deployment gagal | Dokumentasikan environment variable dan build command |
| API mengembalikan 500 | Tampilkan pesan umum tanpa detail sensitif |
| User menghapus data tidak sengaja | Berikan confirmation dialog sebelum delete |

## 21. Rencana Pengembangan MVP

Tahap MVP:

1. Setup React Vite.
2. Setup routing.
3. Setup AuthContext.
4. Setup API client dengan Fetch API.
5. Buat halaman login/register.
6. Buat dashboard project.
7. Buat detail project dan task.
8. Tambahkan create/update/delete project.
9. Tambahkan create/update/delete task.
10. Tambahkan feedback UI.
11. Tambahkan responsive design.
12. Tambahkan README.
13. Deploy ke Vercel/Netlify.

## 22. Pengembangan Lanjutan Opsional

Fitur opsional setelah MVP selesai:

- Filter task berdasarkan status.
- Search project/task.
- Statistik jumlah task Todo/Doing/Done.
- Dark mode.
- Drag and drop task board.
- Sort project berdasarkan tanggal.
- Sort task berdasarkan prioritas.
- Dashboard ringkasan produktivitas.
