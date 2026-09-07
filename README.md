<div align="center">

# 🚀 Frontend Portofolio Personal

[![React Badge](https://img.shields.io/badge/React-2026?logo=react\&logoColor=61DAFB\&style=flat)](https://react.dev/)
[![Tailwind CSS Badge](https://img.shields.io/badge/Tailwind_CSS-2026?logo=tailwindcss\&logoColor=fff\&style=flat)](https://tailwindcss.com/)
[![Vite Badge](https://img.shields.io/badge/Vite-2026?logo=vite\&logoColor=fff\&style=flat)](https://vite.dev/)
[![Framer Motion Badge](https://img.shields.io/badge/Framer_Motion-2026?logo=framer\&logoColor=fff\&style=flat)](https://motion.dev/)
[![Vercel Badge](https://img.shields.io/badge/Vercel-000?logo=vercel\&logoColor=fff\&style=flat)](https://vercel.com/)

Dokumentasi resmi untuk antarmuka (*frontend*) website portofolio personal **Shinta Nursobah Chairani**.
Aplikasi ini dikembangkan menggunakan React dengan pendekatan komponen modular, animasi interaktif, integrasi REST API, serta dilengkapi dengan **Admin CMS** untuk mengelola konten portofolio.

</div>

---

## 📖 Deskripsi Sistem

Repositori ini memuat kode sumber untuk sisi *frontend* dari sistem portofolio personal. Aplikasi bertanggung jawab dalam menyediakan antarmuka publik untuk menampilkan informasi profil, keahlian, pengalaman, pendidikan, sertifikasi, proyek, artikel, serta formulir kontak.

Selain halaman publik, sistem juga menyediakan **Admin CMS** yang memungkinkan administrator mengelola berbagai data portofolio melalui dashboard yang terintegrasi dengan *backend API*.

Frontend mengambil dan mengirim data melalui layanan API pada `backendApi`, termasuk data profil, resume, skills, projects, experiences, educations, certifications, articles, serta messages.

---

## ✨ Fitur Utama

### 🌐 Halaman Publik

Frontend menyediakan beberapa section utama pada halaman portofolio:

* **Home / Hero**

  * Menampilkan nama, profesi, headline, bio, pengalaman, dan jumlah proyek.
  * Data profil dapat diambil secara dinamis dari backend.
  * Menampilkan animasi menggunakan Framer Motion.
  * Menyediakan tombol navigasi menuju bagian proyek dan about.

* **About**

  * Menampilkan informasi profil dan biodata.
  * Informasi pendidikan dan lokasi.
  * Informasi kontak.
  * Integrasi GitHub, LinkedIn, dan Instagram.
  * Menampilkan CV/Resume aktif.
  * Mendukung fitur melihat dan mengunduh CV.

* **Skills**

  * Menampilkan daftar teknologi dan keahlian.
  * Pengelompokan berdasarkan kategori:

    * Frontend
    * Backend
    * Database
    * Tools
  * Menggunakan pemetaan icon berdasarkan nama teknologi.

* **Experience**

  * Menampilkan pengalaman profesional, freelance, organisasi, dan aktivitas lainnya.
  * Informasi meliputi posisi, perusahaan, lokasi, periode, deskripsi, dan skills.

* **Education**

  * Menampilkan riwayat pendidikan.
  * Informasi institusi, program studi, periode, nilai, aktivitas, dan deskripsi.

* **Certifications**

  * Menampilkan sertifikasi dan kredensial.
  * Mendukung informasi penerbit, tautan kredensial, dan media sertifikasi.

* **Projects**

  * Menampilkan galeri proyek.
  * Mendukung kategori:

    * Website Development
    * Machine Learning
    * UI/UX Design
    * Lainnya
  * Setiap proyek dapat memiliki tautan GitHub, Figma, dan website.

* **Project Detail**

  * Menampilkan informasi lengkap suatu proyek berdasarkan ID atau slug.
  * Menampilkan deskripsi, tools, tanggal, gambar, serta tautan GitHub, Figma, dan website.

* **Articles**

  * Menampilkan daftar artikel.
  * Mendukung halaman detail artikel berdasarkan ID atau slug.

* **Contact**

  * Menyediakan formulir kontak untuk pengunjung.
  * Data formulir terdiri dari nama, email, dan isi pesan.
  * Pesan dikirimkan ke backend melalui API.

---

### 🔐 Admin CMS

Frontend juga menyediakan halaman administrasi yang dilindungi oleh sistem autentikasi.

Fitur Admin CMS meliputi:

* **Dashboard**

  * Statistik jumlah:

    * Projects
    * Articles
    * Messages
    * Education
    * Experience
    * Certifications
    * Skills
  * Menampilkan pesan masuk terbaru.
  * Menampilkan status sistem dan informasi koneksi backend.

* **Profile Management**

  * Mengelola informasi profil administrator/portofolio.

* **Project Management**

  * Menambah proyek.
  * Mengedit proyek.
  * Menghapus proyek.
  * Mengelola gambar proyek.
  * Menghubungkan proyek dengan skills.
  * Menambahkan tautan GitHub, Figma, dan website.

* **Article Management**

  * Membuat artikel.
  * Mengedit artikel.
  * Menghapus artikel.
  * Mengelola konten artikel.

* **Education Management**

  * Menambah riwayat pendidikan.
  * Mengedit data pendidikan.
  * Menghapus data pendidikan.
  * Mengelola institusi, gelar, bidang studi, periode, nilai, aktivitas, dan deskripsi.

* **Experience Management**

  * Menambah pengalaman.
  * Mengedit pengalaman.
  * Menghapus pengalaman.

* **Certification Management**

  * Menambah sertifikasi.
  * Mengedit sertifikasi.
  * Menghapus sertifikasi.
  * Mengelola gambar dan tautan kredensial.

* **Skills Management**

  * Menambah skills.
  * Mengedit skills.
  * Menghapus skills.
  * Mengelompokkan skills berdasarkan kategori.

* **Resume Management**

  * Menambah resume.
  * Mengedit resume.
  * Menghapus resume.
  * Menentukan resume aktif.
  * Mengelola versi dan URL CV.

* **Messages Management**

  * Melihat pesan masuk.
  * Mencari pesan.
  * Melihat detail pesan.
  * Menghapus pesan.

* **Settings**

  * Mengatur warna aksen website.
  * Mengatur konfigurasi SEO.
  * Menyimpan konfigurasi SEO pada Local Storage.

---

## 🛠️ Teknologi yang Digunakan

Frontend memanfaatkan beberapa teknologi utama:

| Teknologi         | Fungsi                                        |
| :---------------- | :-------------------------------------------- |
| **React.js**      | Library utama untuk membangun antarmuka       |
| **Vite**          | Development server dan build tool             |
| **Tailwind CSS**  | Styling dan responsive UI                     |
| **Framer Motion** | Animasi dan transisi antarmuka                |
| **React Router**  | Routing halaman                               |
| **React Icons**   | Icon interface                                |
| **PropTypes**     | Validasi props komponen                       |
| **REST API**      | Komunikasi frontend dengan backend            |
| **Local Storage** | Penyimpanan konfigurasi tertentu pada browser |
| **Vercel**        | Deployment aplikasi frontend                  |

Komponen UI seperti `Button`, `Card`, `Modal`, dan `LoadingSpinner` dibuat secara reusable sehingga dapat digunakan pada berbagai halaman aplikasi. Komponen tersebut juga memanfaatkan Framer Motion untuk animasi interaksi.

---

## 🏗️ Struktur Direktori

Struktur utama frontend diorganisasikan secara modular sebagai berikut:

```text
src/
├── api/
│   └── backendApi.js
│
├── assets/
│   ├── rocket.png
│   ├── flash.png
│   └── programming.svg
│
├── components/
│   ├── admin/
│   │   ├── AdminHeader.js
│   │   └── AdminSidebar.js
│   │
│   ├── common/
│   │   ├── ContentProtector.jsx
│   │   ├── Footer.jsx
│   │   ├── Navbar.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── SEO.jsx
│   │   └── Watermark.jsx
│   │
│   ├── sections/
│   │   ├── AboutSection.jsx
│   │   ├── ArticleSection.jsx
│   │   ├── CertificationSection.jsx
│   │   ├── ContactSection.jsx
│   │   ├── EducationSection.jsx
│   │   ├── ExperienceSection.jsx
│   │   ├── HeroSection.jsx
│   │   ├── ProjectSection.jsx
│   │   └── SkillsSection.jsx
│   │
│   └── ui/
│       ├── Button.jsx
│       ├── Card.jsx
│       ├── LoadingSpinner.jsx
│       └── Modal.jsx
│
├── context/
│   ├── AuthContext.jsx
│   └── ThemeContext.jsx
│
├── hooks/
│   └── useContentProtection.js
│
└── pages/
    ├── public/
    │   ├── ArticleDetail.jsx
    │   ├── Home.jsx
    │   ├── Login.jsx
    │   └── ProjectDetail.jsx
    │
    └── admin/
        ├── Dashboard.jsx
        ├── ManageArticles.jsx
        ├── ManageCertifications.jsx
        ├── ManageEducations.jsx
        ├── ManageExperience.jsx
        ├── ManageMesssages.jsx
        ├── ManageProfile.jsx
        ├── ManageProjects.jsx
        ├── ManageResume.jsx
        ├── ManageSettings.jsx
        └── ManageSkills.jsx
```

---

## 🧩 Arsitektur Frontend

Frontend menggunakan pendekatan **component-based architecture** dengan pemisahan antara halaman, komponen reusable, state global, dan komunikasi API.

### 1. Pages

Folder `pages/` berisi halaman utama aplikasi.

#### Public Pages

```text
pages/public/
├── Home.jsx
├── Login.jsx
├── ProjectDetail.jsx
└── ArticleDetail.jsx
```

Halaman `Home.jsx` menggabungkan seluruh section utama seperti Hero, About, Skills, Experience, Education, Certifications, Projects, Articles, dan Contact.

#### Admin Pages

```text
pages/admin/
├── Dashboard.jsx
├── ManageProfile.jsx
├── ManageProjects.jsx
├── ManageArticles.jsx
├── ManageEducation.jsx
├── ManageExperience.jsx
├── ManageCertifications.jsx
├── ManageSkills.jsx
├── ManageResume.jsx
├── ManageMesssages.jsx
└── ManageSettings.jsx
```

---

### 2. Components

Komponen dibagi menjadi beberapa kelompok.

#### UI Components

Berisi komponen yang dapat digunakan kembali:

* `Button.jsx`
* `Card.jsx`
* `Modal.jsx`
* `LoadingSpinner.jsx`

Komponen `Button` mendukung beberapa variant seperti `primary`, `secondary`, `outline`, dan `ghost`, serta memiliki dukungan loading state dan icon.

#### Common Components

Berisi komponen yang digunakan pada beberapa halaman:

* `Navbar`
* `Footer`
* `SEO`
* `Watermark`
* `ContentProtector`
* `ProtectedRoute`

---

### 3. Context

Context digunakan untuk mengelola state global aplikasi.

```text
context/
├── AuthContext.jsx
└── ThemeContext.jsx
```

`AuthContext` digunakan untuk menangani status autentikasi administrator, sedangkan `ThemeContext` digunakan untuk mengelola warna aksen antarmuka.

---

### 4. Hooks

Frontend memiliki custom hook:

```text
hooks/
└── useContentProtection.js
```

Hook tersebut digunakan untuk mengaktifkan perlindungan konten seperti pembatasan klik kanan, shortcut tertentu, dan aksi copy pada halaman.

---

### 5. API Layer

Komunikasi dengan backend dipusatkan melalui:

```text
src/api/backendApi.js
```

Beberapa fungsi API yang digunakan frontend antara lain:

```text
getProfile()
getActiveResume()

getProjects()
getProjectByIdOrSlug()

getArticles()
getArticleByIdOrSlug()

getSkills()
getExperiences()
getEducations()
getCertifications()

sendContactMessage()

getContactMessages()
deleteContactMessage()
```

Serta fungsi CRUD untuk halaman Admin CMS seperti:

```text
createProject()
updateProject()
deleteProject()

createArticle()
updateArticle()
deleteArticle()

createSkill()
updateSkill()
deleteSkill()

createEducation()
updateEducation()
deleteEducation()

createExperience()
updateExperience()
deleteExperience()

createCertification()
updateCertification()
deleteCertification()

createResume()
updateResume()
deleteResume()
setActiveResume()
```

---

## 🔐 Sistem Autentikasi

Halaman administrator dilindungi menggunakan `ProtectedRoute`.

Alur autentikasi:

```text
User
 │
 ▼
Login Page
 │
 │ username + password
 ▼
AuthContext
 │
 ▼
Backend API
 │
 │ JWT
 ▼
Authentication Success
 │
 ▼
/admin/dashboard
```

Jika pengguna belum terautentikasi dan mencoba mengakses halaman Admin, sistem akan mengarahkan pengguna kembali ke:

```text
/login
```

`ProtectedRoute` melakukan pemeriksaan terhadap status `isAuthenticated` sebelum memberikan akses ke halaman yang dilindungi.

---

## 🔄 Integrasi Frontend & Backend

Frontend terhubung dengan backend melalui REST API.

Arsitektur sistem:

```text
┌─────────────────────────────┐
│       Frontend React        │
│                             │
│  Public Website             │
│  Admin CMS                  │
└──────────────┬──────────────┘
               │
               │ REST API
               ▼
┌─────────────────────────────┐
│      Backend Node.js        │
│        Express.js           │
└──────────────┬──────────────┘
               │
               │ Sequelize
               ▼
┌─────────────────────────────┐
│    Supabase PostgreSQL      │
└─────────────────────────────┘
```

Frontend menggunakan API backend untuk mengambil data portofolio secara dinamis. Pada dashboard, misalnya, data project, artikel, pesan, pendidikan, pengalaman, sertifikasi, dan skills diambil melalui beberapa fungsi API secara paralel.

Backend yang digunakan oleh frontend:

```text
https://be-portfolio-shinta.vercel.app/
```

---

## 🎨 Sistem UI & Animasi

Antarmuka menggunakan desain **dark modern** dengan aksen warna gold.

Karakteristik desain:

* Dark theme.
* Gold accent color.
* Glassmorphism.
* Rounded card.
* Backdrop blur.
* Responsive layout.
* Hover animation.
* Page transition.
* Loading animation.
* Interactive button.
* Animated modal.
* Responsive mobile navigation.

Komponen seperti `Card` menggunakan efek hover dan animasi masuk, sedangkan `Modal` menggunakan `AnimatePresence` untuk animasi ketika dibuka maupun ditutup.

---

## 📱 Responsive Design

Frontend dirancang agar dapat digunakan pada berbagai ukuran layar:

```text
Desktop
   │
   ├── Full Navigation
   ├── Multi-column Layout
   └── Admin Sidebar

Tablet
   │
   ├── Responsive Grid
   └── Adaptive Navigation

Mobile
   │
   ├── Mobile Menu
   ├── Single-column Layout
   └── Collapsible Admin Sidebar
```

Navbar menyediakan menu mobile menggunakan `AnimatePresence`, sedangkan Admin Sidebar memiliki mekanisme buka/tutup khusus untuk tampilan mobile.

---

## 🔎 SEO

Frontend menyediakan komponen khusus:

```text
src/components/common/SEO.jsx
```

Komponen tersebut mengelola:

* `<title>`
* Meta description
* Meta keywords
* Author
* Open Graph
* Twitter Card
* URL halaman
* Social media preview image

Konfigurasi SEO juga dapat dikelola melalui halaman:

```text
/admin/settings
```

dan disimpan menggunakan Local Storage browser.

---

## 🛡️ Content Protection

Frontend memiliki sistem perlindungan konten melalui:

```text
ContentProtector.jsx
useContentProtection.js
```

Fitur yang diterapkan meliputi:

* Menonaktifkan klik kanan.
* Membatasi shortcut tertentu untuk Developer Tools.
* Membatasi View Source.
* Membatasi Save Page.
* Membatasi copy text.

Komponen `ContentProtector` digunakan sebagai wrapper pada halaman utama.

> **Catatan:** Content protection pada sisi frontend bukan mekanisme keamanan absolut karena kode JavaScript tetap dikirim ke browser pengguna.

---

## 💧 Watermark

Frontend menyediakan komponen:

```text
src/components/common/Watermark.jsx
```

Watermark digunakan sebagai overlay visual pada halaman untuk memberikan identitas dan menjaga konsistensi branding.

Default watermark menggunakan:

```text
SHINTA NURSOBAH CHAIRANI
```

dan dapat dikonfigurasi melalui props seperti `text`, `imageUrl`, dan `opacity`.

---

## 🚀 Panduan Instalasi dan Konfigurasi

### 1. Prasyarat Sistem

Pastikan perangkat lunak berikut telah tersedia:

* Node.js
* NPM
* Git

Direkomendasikan menggunakan versi Node.js LTS.

---

### 2. Kloning Repositori

Kloning repositori frontend:

```bash
git clone <URL_REPOSITORI>
cd fe-portfolio-shinta
```

---

### 3. Instalasi Dependensi

Install seluruh dependensi:

```bash
npm install
```

---

### 4. Konfigurasi Environment

Buat file:

```text
.env
```

Kemudian masukkan konfigurasi API backend sesuai struktur environment yang digunakan pada project.

Contoh:

```env
VITE_API_URL=https://be-portfolio-shinta.vercel.app
```

> Sesuaikan nama variabel dengan konfigurasi yang digunakan pada `backendApi.js`.

---

### 5. Menjalankan Development Server

Jalankan aplikasi:

```bash
npm run dev
```

Setelah berhasil dijalankan, Vite akan memberikan alamat lokal, biasanya:

```text
http://localhost:5173
```

---

### 6. Build Production

Untuk membuat production build:

```bash
npm run build
```

Preview hasil production build:

```bash
npm run preview
```

---

## 🧭 Routing

Frontend menggunakan React Router untuk mengatur navigasi halaman.

### Public Routes

| Route                  | Halaman        |   Akses   |
| :--------------------- | :------------- | :-------: |
| `/`                    | Homepage       | 🌐 Public |
| `/login`               | Admin Login    | 🌐 Public |
| `/project/:identifier` | Detail Project | 🌐 Public |
| `/article/:identifier` | Detail Article | 🌐 Public |

### Admin Routes

| Route                   | Halaman               |   Akses  |
| :---------------------- | :-------------------- | :------: |
| `/admin/dashboard`      | Dashboard CMS         | 🔐 Admin |
| `/admin/profile`        | Manage Profile        | 🔐 Admin |
| `/admin/projects`       | Manage Projects       | 🔐 Admin |
| `/admin/articles`       | Manage Articles       | 🔐 Admin |
| `/admin/education`      | Manage Education      | 🔐 Admin |
| `/admin/experience`     | Manage Experience     | 🔐 Admin |
| `/admin/certifications` | Manage Certifications | 🔐 Admin |
| `/admin/skills`         | Manage Skills         | 🔐 Admin |
| `/admin/resumes`        | Manage Resumes        | 🔐 Admin |
| `/admin/messages`       | Manage Messages       | 🔐 Admin |
| `/admin/settings`       | System Settings       | 🔐 Admin |

Admin Sidebar pada frontend juga menyediakan navigasi ke seluruh halaman CMS tersebut.

---

## 🔗 Integrasi Backend

Frontend terhubung dengan backend portofolio:

**Backend API**

```text
https://be-portfolio-shinta.vercel.app/
```

Backend bertanggung jawab terhadap:

* Authentication.
* Project management.
* Article management.
* Profile management.
* Resume management.
* Experience management.
* Education management.
* Certification management.
* Skills management.
* Contact messages.
* Database management.

Frontend bertanggung jawab terhadap:

* User Interface.
* User Experience.
* Client-side routing.
* Data presentation.
* Form handling.
* API consumption.
* Admin CMS interface.
* Animations dan interactions.

---

## 📊 Alur Data

### Public Website

```text
Visitor
   │
   ▼
React Frontend
   │
   ▼
backendApi.js
   │
   ▼
Backend REST API
   │
   ▼
Database
   │
   ▼
JSON Response
   │
   ▼
React State
   │
   ▼
UI
```

### Admin CMS

```text
Administrator
      │
      ▼
    Login
      │
      ▼
 Authentication
      │
      ▼
 JWT / Session
      │
      ▼
 ProtectedRoute
      │
      ▼
  Admin Dashboard
      │
      ▼
 CRUD Operations
      │
      ▼
 Backend API
      │
      ▼
 Supabase PostgreSQL
```

---

## 📁 Komponen Reusable

Salah satu prinsip utama frontend adalah penggunaan komponen reusable.

### Button

Mendukung:

```text
primary
secondary
outline
ghost
```

dan ukuran:

```text
sm
md
lg
```

Button juga mendukung:

* Left icon.
* Right icon.
* Loading state.
* Disabled state.
* Hover animation.
* Tap animation.

### Card

Mendukung:

* Base card.
* Interactive card.
* Hover effect.
* Tap animation.
* Entry animation.

### Modal

Mendukung:

```text
sm
md
lg
xl
2xl
3xl
4xl
full
```

serta:

* Backdrop.
* Close button.
* Dynamic title.
* Scrollable content.
* Open/close animation.

### LoadingSpinner

Mendukung ukuran:

```text
sm
md
lg
xl
```

dan dua mode:

```text
Inline
Full Screen
```

---

## 🖥️ Admin Dashboard

Dashboard administrator menyediakan ringkasan data dari seluruh modul portofolio:

```text
┌─────────────────────────────────────┐
│           ADMIN DASHBOARD            │
├─────────────────────────────────────┤
│                                     │
│ Projects     Articles     Messages  │
│    10           5            3      │
│                                     │
│ Education    Experience   Skills    │
│     2            3           12     │
│                                     │
├─────────────────────────────────────┤
│        Pesan Masuk Terbaru           │
│                                     │
│        Status Sistem & Backend       │
│                                     │
└─────────────────────────────────────┘
```

Dashboard menggunakan `Promise.allSettled()` untuk mengambil beberapa sumber data secara paralel sehingga kegagalan salah satu endpoint tidak langsung menghentikan pengambilan data lainnya.

---

## 🌍 Deployment

Frontend dapat di-*deploy* menggunakan platform seperti:

* Vercel
* Netlify
* Cloudflare Pages
* Static hosting lainnya

Untuk deployment menggunakan Vercel, pastikan:

1. Repository sudah terhubung dengan Vercel.
2. Environment variable sudah dikonfigurasi.
3. Backend API dapat diakses oleh frontend.
4. Build command menggunakan:

```bash
npm run build
```

5. Output directory mengikuti konfigurasi Vite.

---

## 🔧 Pengembangan

Saat melakukan pengembangan, struktur kode disarankan tetap mengikuti pembagian berikut:

```text
components/
    → Komponen reusable

pages/
    → Halaman aplikasi

sections/
    → Section halaman publik

api/
    → Komunikasi dengan backend

context/
    → Global state

hooks/
    → Custom React hooks

assets/
    → Asset gambar dan ilustrasi
```

Dengan struktur tersebut, perubahan pada UI maupun penambahan fitur dapat dilakukan secara lebih terorganisir dan mudah dipelihara.

---

## 📄 Lisensi

Kode sumber ini didistribusikan sesuai dengan lisensi yang tercantum pada berkas:

```text
LICENSE
```

Penggunaan dan modifikasi kode diperbolehkan dengan tetap mengikuti ketentuan lisensi yang berlaku.

---

<div align="center">

<br>

<i>Dikembangkan dan didokumentasikan sebagai bagian dari sistem portofolio personal Shinta Nursobah Chairani.</i>

<br><br>

**React • Tailwind CSS • Framer Motion • REST API**

</div>