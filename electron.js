// electron.js
const { app, BrowserWindow, Menu } = require("electron");
const path = require("path");
const { spawn } = require("child_process");

console.log("=== Electron Main Process Starting ===");

let mainWindow;
let nextServer;
const PORT = 3000;

function startNextServer() {
  return new Promise((resolve, reject) => {
    if (process.env.ELECTRON_DEV) {
      // En dev, pas besoin de démarrer le serveur
      resolve();
      return;
    }

    console.log("Starting Next.js server...");
    const serverPath = path.join(__dirname, ".next", "standalone", "server.js");

    nextServer = spawn("node", [serverPath], {
      env: {
        ...process.env,
        PORT: PORT.toString(),
        HOSTNAME: "localhost"
      },
      cwd: path.join(__dirname, ".next", "standalone")
    });

    nextServer.stdout.on("data", (data) => {
      console.log(`Next.js: ${data}`);
      if (data.toString().includes("Ready") || data.toString().includes("started")) {
        resolve();
      }
    });

    nextServer.stderr.on("data", (data) => {
      console.error(`Next.js Error: ${data}`);
    });

    nextServer.on("error", (error) => {
      console.error("Failed to start Next.js server:", error);
      reject(error);
    });

    // Attendre 3 secondes pour que le serveur démarre
    setTimeout(() => resolve(), 3000);
  });
}

function createWindow() {
  console.log("Attempting to create BrowserWindow...");

  mainWindow = new BrowserWindow({
    fullscreen: true,
    autoHideMenuBar: true,
    width: 1280,
    height: 800,
    show: false, // Ne pas afficher avant que ce soit prêt
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Désactiver le menu de l'application
  Menu.setApplicationMenu(null);

  const url = process.env.ELECTRON_DEV
    ? `http://localhost:${process.env.PORT || 3001}`
    : `http://localhost:${PORT}/authorities`;

  console.log(`Loading URL: ${url}`);

  mainWindow.loadURL(url);

  // Afficher la fenêtre DevTools en mode dev
  if (process.env.ELECTRON_DEV) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
    console.log("✅ Electron window is ready!");
  });

  mainWindow.webContents.on("did-fail-load", (event, errorCode, errorDescription) => {
    console.error(`Failed to load: ${errorCode} - ${errorDescription}`);
  });

  mainWindow.on("closed", () => {
    console.log("Electron window closed");
    mainWindow = null;
  });
}

app.whenReady().then(async () => {
  try {
    await startNextServer();
    createWindow();

    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  } catch (error) {
    console.error("Failed to start application:", error);
    app.quit();
  }
});

app.on("window-all-closed", () => {
  console.log("All windows closed");

  // Arrêter le serveur Next.js
  if (nextServer) {
    nextServer.kill();
  }

  if (process.platform !== "darwin") app.quit();
});
