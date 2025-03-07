# Installation Guide for Rooftime 🚀

## System Requirements 🖥️
Before installing Rooftime, make sure your system meets the following requirements:

### **For Web & Development:**
- Node.js (Bun runtime) – Install Bun from [https://bun.sh](https://bun.sh)
- Git – Install from [https://git-scm.com](https://git-scm.com)
- PocketBase (Pre-installed in the project)
- Vite (Bundler) – Included in dependencies
- Capacitor (For Mobile Deployment)
- Tauri (For Desktop Deployment)

### **For Mobile (Android & iOS):**
- Android Studio (For Android)
- Xcode (For iOS)
- Capacitor CLI (`bunx cap` installed)

### **For Desktop:**
- Rust & Cargo (Required for Tauri)
- Tauri CLI (`bunx tauri` installed)

---

## Clone and Setup 🔧
```sh
$ git clone https://github.com/mmycin/Rooftime-App.git
$ cd Rooftime-App
$ cp .env.example .env  # Configure environment variables
```
Edit `.env` and provide your PocketBase URL, JWT secrets, and other required configurations.


## Install Dependencies 📦
```sh
$ bun install
```

---

## Running Rooftime Locally 💻
### **For Web:**
```sh
$ bun run dev  # Runs locally on http://localhost:5173
```

### **For Production Build:**
```sh
$ bun run build
$ bun run preview  # Preview the production build
```

---

## Running with Docker 🐳
If you want to containerize Rooftime, use the provided `Dockerfile`.

### **Build the Docker Image:**
```sh
$ docker build -t rooftime .
```

### **Run the Container:**
```sh
$ docker run -p 3000:3000 --name rooftime rooftime
```
Now, Rooftime will be accessible at `http://localhost:3000` (or any configured port).

---

## Mobile Deployment 📱
### **Android Setup:**
```sh
$ bunx cap add android
$ bun run build
$ bunx cap copy
$ bunx cap sync
$ bunx cap open android  # Opens in Android Studio
$ bunx cap build android  # Builds APK
```

### **iOS Setup:**
```sh
$ bunx cap add ios
$ bun run build
$ bunx cap copy
$ bunx cap sync
$ bunx cap open ios  # Opens in Xcode
$ bunx cap build ios  # Builds iOS App
```

---

## Desktop Deployment 🖥️
### **Building for Windows/macOS/Linux:**
```sh
$ bun run tauri build
```
The `.msi` (Windows) or `.app` (macOS) file will be generated inside `src-tauri/target/release/bundle/`.

---

## Troubleshooting & FAQs ❓
### **Common Issues:**
- **Bun not found?** Ensure it is installed globally: `curl -fsSL https://bun.sh/install | bash`
- **PocketBase not running?** Ensure it is configured correctly in `.env`.
- **Docker not running?** Check if Docker is installed and running: `docker ps`

For further help, open an issue on GitHub. 🚀

