# 🏆 Rooftime - The Study Tracker  

![Rooftime Logo](static/favicon.png)  

> *“Study smart, track smart, compete smarter!”*  

Welcome to **Rooftime**, the *only* study tracker you’ll ever need. Whether you're a hardcore studious nerd, a last-minute crammer, or someone who *stares at books hoping for osmosis*, this app has got your back.  

**📌 What is Rooftime?**  

Rooftime is a cross-platform **study tracking** app designed for the **Rooftop Society** members (a prestigious club of 7 academic warriors 🥷). It helps users track their study sessions, climb the leaderboard, compare stats, and even get **AI-powered feedback** on their progress.  

💻 **Web & Desktop?** Yes!  
📱 **Android & iOS?** Obviously!  
📊 **Leaderboard & Stats?** Always!  
🤖 **AI-powered study insights?** You bet!  

---  

## 🚀 Features That Make Rooftime Legendary  

### 1️⃣ **Secure Login (Because Privacy Matters!)**  
- JWT-based authentication valid for **3 days** (enough time to forget your password).  
- Passwords are hashed with a **ridiculously unpredictable salt** and encrypted **so well** even future AI won't crack it.  

### 2️⃣ **User Profiles - Because You’re Special!**  
- Sleek, **responsive UI** for both mobile & desktop.  
- View and edit account details like a pro.  
- **Data is end-to-end encrypted**, so your embarrassing study hours are safe.  

### 3️⃣ **Leaderboard - Where Legends Are Born!**  
🔥 **Daily Benchmark:** See today’s **top 3 study warriors** with highlighted ranks.  
📆 **Weekly Benchmark:** Filter by:  
   - 🕒 **Time:** Who studied the most this week.  
   - 🏆 **Weekly Score:** 1st place gets **5 points**, 2nd gets **3**, 3rd gets **1** (the rest get a digital pat on the back).  
   - 💯 **Total Score:** Lifetime bragging rights included.  

### 4️⃣ **The Ultimate Timer - Built for Study Ninjas!**  
⏱ **Start/Pause/Reset** in real-time.  
📈 Updates **instantly** on the leaderboard.  
🛠 Edit time using **scroll wheel or input field**.  
⚡ Uses a **ReLU function** to round seconds into minutes (because who counts seconds, really?).  

### 5️⃣ **Performance Insights - Study Smart, Not Hard!**  
📊 **Beautiful Animated Line Chart** - See your **last 7 days’ study time**.  
📈 **Avg & Peak Study Time** - Get an in-depth analysis.  
🤖 **AI-powered Feedback** (Cohere AI):  
   - Strengths & Weaknesses  
   - Study Pattern & Predictions  
   - How to improve as an **HSC candidate** (no sugarcoating!)  

### 6️⃣ **Leaderboard Profile Insights - Spy on Your Friends!**  
- Click **info button** next to any user.  
- See their **profile & all-time stats**.  
- Compare their study time with yours in an **animated line chart**.  
- AI-generated feedback tells you **why they’re better than you** (or not).  

---  

## 🛠 Built With Love ❤️ (and Code 💻)  

- **Frontend:** SvelteKit (TypeScript) + Tailwind CSS + Vite  
- **Backend:** PocketBase (Go)  
- **Runtime:** Bun.js ⚡  
- **Mobile:** Capacitor (Android/iOS)  
- **Desktop:** Tauri (Rust, MSI Installer)  
- **AI:** Cohere AI (because why not?)  

---  

## 🔧 Installation & Setup  

### 📥 Clone the Repo  
```sh
git clone https://github.com/mmycin/Rooftime-App.git
cd Rooftime-App
```  

### 📁 Configure Environment Variables  
Check `.env.example` for required settings and **configure your secrets**.  

---  

### 🏃‍♂️ Running the Web App  
```sh
bun run build
bun run preview
```  

---  

### 🖥 Setting Up for Desktop (Windows MSI)  
```sh
bun run tauri build
```  
This creates `Rooftime_Setup.msi` in `/src-tauri/target/release/bundle/`.  
Double-click it to install (unless your PC warns you, which means you’re doing it right 😉).  

---  

### 📱 Mobile Setup  

#### Add Platforms  
```sh
bunx cap add android   # For Android  
bunx cap add ios       # For iOS  
```  

#### Configure and Sync  
```sh
bun run build
bunx cap copy
bunx cap sync
```  

#### Open the Project  
```sh
bunx cap open android  # Opens in Android Studio  
bunx cap open ios      # Opens in Xcode  
```  

#### Build the Mobile App  
```sh
bunx cap build android
bunx cap build ios
```  

This will generate the **APK (Android)** or **IPA (iOS)** file. 🚀  

---  

## 🤔 Why Use Rooftime?  

✅ **Because tracking study hours manually is a pain.**  
✅ **Because AI feedback is cooler than asking your teacher.**  
✅ **Because competing with friends makes studying bearable.**  
✅ **Because installing this makes you at least 10% more productive.**  

---  

## 🔥 FAQ  

### ❓ Can I use this app if I’m not in the Rooftop Society?  
Nope, unless you **bribe the admin** with high scores. 😆  

### ❓ How secure is my data?  
Your **password is hashed**, your **data is encrypted**, and even **aliens from Area 51 can’t break in**.  

### ❓ What if I lose my streak?  
Cry. Then **study harder**.  

### ❓ Will this app make me smarter?  
That depends on **whether you actually study or just stare at the timer**.  

---  

## 🎉 Shoutouts & Congratulations!  

### 🚀 **Rooftop Society Members**  
The Rooftime app is proudly built for the legendary members of the **Rooftop Society**:  
- **Rafsan Talha**  
- **Riasat Rahil**  
- **Tahcin Ul Karim (Mycin)**  
- **Asik Al Masud (Mahin)**  
- **Tanzim Dihan**  
- **Sabit Hossain**  
- **Abrar Abtahi (Faiyaz)**  

### 🌟 Special Shoutout to Rafsan Talha!  
Big thanks to **Rafsan Talha** for the **idea** and the **design inspiration** behind this app. You truly are the architect of Rooftime’s awesomeness as well as the heart of the Society!

### 🎉 **Hail Sabit Bhai!**  
Let’s all celebrate for **Sabit Bhai** Hail! 🙌🎉  

---  

## 💡 Final Thoughts  

If you’ve made it this far, **congratulations!** 🎉 You either really love reading READMEs or you're **stalling from studying** (in which case, go start your timer NOW! ⏳).  

**Made with ❤️ by Tahcin Ul Karim (Mycin)**  

---