const { app, BrowserWindow, Menu, ipcMain, dialog } = require("electron");

const url = require("url");
const path = require("path");
const main = require("electron-reload");

//solo vamos a usar electron reload para desarrollo no para cuando este en produccion
if (process.env.NODE_ENV !== "production") {
  require("electron-reload")(__dirname, {
    electron: path.join(__dirname, "../node_modules", ".bin", "electron") //check for new updates in main code
  });
}

let mainWindow;
let newProductWindow;
let editProductWindow;

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
    parent: mainWindow,
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

ipcMain.on("product:editFinished", (e, newProduct) => {
  //falta realizar la busqueda del producto editado para sobreescribir
  mainWindow.webContents.send("product:new", newProduct);
  editProductWindow.close();
});

function createEditProductWindow2() {
  return new Promise((resolve, reject) => {
    editProductWindow = new BrowserWindow({
      width: 400,
      height: 330,
      title: "Edit product",
      webPreferences: {
        nodeIntegration: true
      }
    });

    editProductWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, "views/edit-product.html"),
        protocol: "file",
        slashes: true
      })
    );

    // Create 'close' listener
    editProductWindow.on("closed", () => {
      editProductWindow = null;
    });
    // Create 'did-finish-load' listener
    editProductWindow.webContents.on("did-finish-load", () => {
      resolve();
    });
  });
}

ipcMain.on("products:edit", function (event, ProductToEdit) {
  createEditProductWindow2()
    .then(() => {
      editProductWindow.webContents.send("products:toEdit", ProductToEdit);
    })
    .catch((error) => {
      console.log(error.message);
    });
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
        click() {
          mainWindow.webContents.send("products:remove-all");
        }
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
