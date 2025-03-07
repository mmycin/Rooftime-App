# Architecture Overview of Rooftime App

Rooftime is a cross-platform study tracking application developed using modern web and mobile technologies. It leverages SvelteKit for the frontend, Pocketbase for backend services, and utilizes Capacitor and Tauri for mobile and desktop deployments, respectively. The application is styled using Tailwind CSS and bundled with Vite.

## Project Structure

The project is organized to support multiple platforms and maintain a clean separation of concerns:

```
Rooftime-App/
├── android/                # Android platform-specific code and configurations
├── src-tauri/              # Desktop application code using Tauri
├── src/                   # Shared source code for web and mobile
│   ├── lib/               # Reusable libraries and utilities
│   ├── routes/            # SvelteKit route handlers
│   └── assets/            # Static assets like images and fonts
├── static/                # Public static files
├── .env.example           # Sample environment variables
├── bun.lockb              # Bun.js lock file for dependency management
├── capacitor.config.ts    # Capacitor configuration file
├── package.json           # Project metadata and dependencies
├── svelte.config.js       # Svelte configuration
├── tsconfig.json          # TypeScript configuration
└── vite.config.ts         # Vite configuration
```

## Core Technologies

- **Frontend**: SvelteKit is used for building the user interface, providing a fast and responsive experience. Tailwind CSS is employed for styling, ensuring a consistent and customizable design across platforms.

- **Backend**: Pocketbase serves as the backend, handling data storage, user authentication, and real-time data synchronization.

- **Mobile Deployment**: Capacitor is utilized to build native mobile applications for Android and iOS, allowing access to native device features.

- **Desktop Deployment**: Tauri is used to package the application as a native desktop app, providing a lightweight and secure experience on Windows and macOS.

## Build and Deployment

The project is designed to facilitate easy building and deployment across different platforms:

- **Web**: Developed using SvelteKit, the web application can be built and previewed using Bun.js:

  ```bash
  bun run build
  bun run preview
  ```

- **Mobile (Android/iOS)**: Capacitor manages the mobile builds. To add a platform, configure the app, and open it in the respective development environment:

  ```bash
  bunx cap add android # For Android
  bunx cap add ios    # For iOS

  bun run build
  bunx cap copy
  bunx cap sync

  bunx cap open android # Opens in Android Studio
  bunx cap open ios    # Opens in Xcode
  ```

- **Desktop**: Tauri handles the desktop builds. To build the desktop application:

  ```bash
  bun run tauri run build
  ```

  
This generates the `Rooftime_Setup.msi` installer in the `/src-tauri/target/release/bundle/` directory for Windows.

## Conclusion

Rooftime's architecture is designed for scalability and flexibility, utilizing modern technologies to provide a seamless user experience across web, mobile, and desktop platforms. The separation of platform-specific code and shared resources ensures maintainability and ease of development. 