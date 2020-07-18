const { app, BrowserWindow, Menu, ipcMain } = require("electron");

const url = require("url");
const path = require("path");

//solo vamos a usar electron reload para desarrollo no para cuando este en produccion
if (process.env.NODE_ENV !== "production") {
  require("electron-reload")(__dirname, {
    electron: path.join(__dirname, "../node_modules", ".bin", "electron") //check for new updates in main code
  });
}

let mainWindow;
let newProductWindow;

app.on("ready", () => {
  mainWindow = new BrowserWindow({
    webPreferences: {
      //darle permisos para usar node
      nodeIntegration: true
    }
  });
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "views/index.html"),
      protocol: "file",
      slashes: true
    })
  );
  //change menu app
  const mainMenu = Menu.buildFromTemplate(templateMenu);
  Menu.setApplicationMenu(mainMenu);
  //close all windows
  mainWindow.on("closed", () => {
    app.quit();
  });
});

function createNewProductWindow() {
  newProductWindow = new BrowserWindow({
    width: 400,
    height: 330,
    title: "Add a new product",
    webPreferences: {
      nodeIntegration: true
    }
  });
  //newProductWindow.setMenu(null); //without menu
  newProductWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "views/new-product.html"),
      protocol: "file",
      slashes: true
    })
  );

  newProductWindow.on("closed", () => {
    newProductWindow = null;
  });
}

ipcMain.on("product:new", (e, newProduct) => {
  mainWindow.webContents.send("product:new", newProduct);
  newProductWindow.close();
});

const templateMenu = [
  {
    label: "File",
    submenu: [
      {
        label: "New Product",
        accelerator: "Ctrl+N", //atajo en el teclado
        click() {
          createNewProductWindow();
        }
      },
      {
        label: "Remove All Products",
        click() {}
      },
      {
        label: "Exit",
        //check where we are running the app
        accelerator: process.platform == "darwin" ? "command+Q " : "Ctrl+Q",
        click() {
          app.quit();
        }
      }
    ]
  }
];

//to show the name app first if we are running in mac
if (process.platform === "darwin") {
  templateMenu.unshift({
    label: app.getName()
  });
}
//to get development tools on our app
if (process.env.NODE_ENV !== "production") {
  templateMenu.push({
    label: "DevTools",
    submenu: [
      {
        label: "Show/Hide Dev Tools",
        accelerator: "Ctrl+D",
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        }
      },
      {
        role: "reload"
      }
    ]
  });
}
