const { app, BrowserWindow, Menu } = require("electron");

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
  mainWindow = new BrowserWindow({});
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "views/index.html"),
      protocol: "file",
      slashes: true
    })
  );
  //para modificar el menu de la aplicacion
  const mainMenu = Menu.buildFromTemplate(templateMenu);
  Menu.setApplicationMenu(mainMenu);
});

function createNewProductWindow() {
  newProductWindow = new BrowserWindow({
    width: 400,
    height: 330,
    title: "Add a new product"
  });
  newProductWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "views/new-product.html"),
      protocol: "file",
      slashes: true
    })
  );
}

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
      }
    ]
  }
];
