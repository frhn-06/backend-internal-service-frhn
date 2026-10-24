# HelpDesk Internal Service — Backend

Backend API untuk aplikasi **Internal Service**, sebuah platform layanan internal perusahaan yang membantu employee mengajukan permintaan layanan, berkomunikasi dengan agent, dan memantau proses penanganan melalui sistem tiket.

Aplikasi ini menyediakan REST API untuk autentikasi, pengelolaan data, tiket layanan, percakapan, notifikasi, serta integrasi komunikasi realtime menggunakan Socket.IO.

## Fitur Utama

- **Autentikasi dan Otorisasi** — Autentikasi menggunakan JWT dan pembatasan akses berdasarkan role.
- **Manajemen Department** — Pengelolaan departemen perusahaan.
- **Manajemen Agent** — Pengelolaan agent dan penempatan agent ke departemen.
- **Manajemen Employee** — Registrasi dan pengelolaan data employee.
- **Manajemen Ticket** — Pembuatan, pengambilan, pemrosesan, penantian informasi, penyelesaian, pembukaan kembali, penutupan, dan pembatalan tiket.
- **Messaging** — Percakapan antara employee dan agent dalam konteks tiket.
- **Notifikasi Realtime** — Pengiriman informasi aktivitas tiket dan pesan baru menggunakan Socket.IO.
- **Dashboard** — Penyediaan data statistik dan ringkasan tiket berdasarkan role.
- **AI Generate Reply** — Pembuatan saran balasan menggunakan AI untuk membantu agent merespons employee.
- **Dokumentasi API** — Dokumentasi endpoint menggunakan Swagger UI.

## Teknologi

| Teknologi  | Kegunaan                                |
| ---------- | --------------------------------------- |
| Node.js    | Runtime JavaScript                      |
| TypeScript | Pengembangan backend dengan sistem tipe |
| Express.js | Framework REST API                      |
| PostgreSQL | Database relasional                     |
| Neon       | Layanan database PostgreSQL             |
| Prisma ORM | Pengelolaan database dan query          |
| JWT        | Autentikasi berbasis token              |
| Socket.IO  | Komunikasi realtime                     |
| Swagger    | Dokumentasi dan pengujian API           |
| OpenAI API | Integrasi AI untuk saran balasan        |

## Role Aplikasi

| Role         | Hak akses utama                                                                      |
| ------------ | ------------------------------------------------------------------------------------ |
| **Admin**    | Mengelola agent, employee, departemen, dan data pendukung aplikasi.                  |
| **Agent**    | Menangani tiket, berkomunikasi dengan employee, serta memperbarui status penanganan. |
| **Employee** | Membuat tiket layanan, mengirim pesan, dan memantau proses penanganan tiket.         |

## Alur Status Ticket

Sistem tiket menggunakan beberapa status untuk menggambarkan proses penanganan layanan.

| Status        | Keterangan                                                     |
| ------------- | -------------------------------------------------------------- |
| `OPEN`        | Tiket baru yang menunggu penanganan agent.                     |
| `IN_PROGRESS` | Tiket sedang ditangani agent.                                  |
| `WAITING`     | Agent sedang menunggu informasi tambahan.                      |
| `RESOLVED`    | Penanganan tiket telah diselesaikan.                           |
| `RE_PROGRESS` | Tiket dibuka kembali saat masih butuh penanganan lebih lanjut. |
| `CLOSED`      | Tiket telah ditutup oleh employee.                             |
| `CANCELLED`   | Tiket dibatalkan.                                              |

Perubahan status mengikuti aturan dan hak akses masing-masing role.

## Persyaratan

Sebelum menjalankan backend, pastikan perangkat sudah memiliki:

- Node.js versi 22 atau versi yang kompatibel dengan proyek.
- npm.
- Database PostgreSQL, misalnya menggunakan Neon.
- Git.

## Instalasi

### 1. Clone Repository

```bash
git clone https://github.com/frhn-06/backend-internal-service-frhn
cd backend-internal-service-frhn
```

Sesuaikan URL repository dan nama direktori dengan repository yang digunakan.

### 2. Install Dependencies

```bash
npm install
```

### 3. Konfigurasi Environment

Buat file `.env` di direktori utama project, sejajar dengan `package.json`.

Isi file `.env` dengan variabel environment yang dibutuhkan oleh aplikasi, seperti:

- `PORT` — Port server lokal.
- `DATABASE_URL` — URL koneksi database PostgreSQL.
- `JWT_SECRET` — Secret key untuk proses autentikasi JWT.
- `OPENAI_API_KEY` — API key OpenAI untuk fitur AI Generate Reply, jika fitur tersebut digunakan.
- `CLIENT_URL` — URL Koneksi Socket.IO dari frontend.

Sesuaikan nama variabel dan format nilainya dengan konfigurasi yang digunakan pada source code.

**Penting:**

- Jangan mengunggah file `.env` ke repository publik.
- Jangan membagikan password database, JWT secret, atau API key.
- Pastikan file `.env` tercantum dalam `.gitignore`.

### 4. Generate Prisma Client

```bash
npx prisma generate
```

Pastikan konfigurasi Prisma dan koneksi database sudah sesuai sebelum menjalankan migration.

Jika migration sudah tersedia di repository dan perlu diterapkan ke database deployment:

```bash
npx prisma migrate deploy
```

### 5. Jalankan Backend

Untuk menjalankan server dalam mode development:

```bash
npm run dev
```

Backend akan berjalan pada port yang ditentukan oleh konfigurasi aplikasi.

## Dokumentasi API

Swagger UI digunakan untuk melihat endpoint, memeriksa parameter request, memahami response, dan mencoba API yang tersedia.

**Swagger UI:** `<URL_BACKEND>/api-doc`

Ganti `<URL_BACKEND>` dengan alamat backend yang aktif.

Untuk endpoint yang membutuhkan autentikasi, gunakan access token melalui fitur **Authorize** pada Swagger UI apabila konfigurasi endpoint tersebut mendukungnya.

## Real-time Communication

Backend menggunakan Socket.IO untuk mengirimkan pembaruan secara realtime ke frontend.

| Event              | Kegunaan                                                                |
| ------------------ | ----------------------------------------------------------------------- |
| `notification:new` | Memberi tahu frontend bahwa data notifikasi perlu diperbarui.           |
| `message:new`      | Memberi tahu adanya pesan baru pada percakapan tiket.                   |
| `all-messages:new` | Memberi sinyal pesan baru kepada penerima jika digunakan oleh frontend. |
| `toast:new`        | Mengirimkan informasi untuk ditampilkan sebagai toaster di frontend.    |

Koneksi Socket.IO menggunakan access token untuk autentikasi.

## Integrasi AI

Fitur AI Generate Reply digunakan untuk menghasilkan saran balasan berdasarkan konteks tiket dan percakapan.

Saran balasan ditampilkan kepada agent untuk ditinjau dan diedit sebelum dikirim sebagai pesan. Fitur ini memerlukan konfigurasi OpenAI API yang valid serta ketersediaan penggunaan API.

## Deployment

Backend dirancang untuk dapat dijalankan secara lokal dan dideploy ke layanan hosting yang mendukung aplikasi Node.js.

- **Backend API:** `https://backend-internal-service.vercel.app`
- **Swagger UI:** `https://backend-internal-service.vercel.app/api-doc`

## Catatan

- Hak akses endpoint mengikuti role dan aturan akses tiket.
- Fitur realtime membutuhkan koneksi Socket.IO yang berhasil.
- Fitur AI bergantung pada konfigurasi dan ketersediaan layanan eksternal.
- Data demo, apabila tersedia, dapat berubah sewaktu-waktu.

## Lisensi

Belum ditentukan.
