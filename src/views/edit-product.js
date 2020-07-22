const { ipcRenderer } = require("electron");

const form = document.querySelector("form");

//get values from selected
ipcRenderer.on("products:toEdit", (e, ProductToEdit) => {
  document.querySelector("#name").value = ProductToEdit.name;
  document.querySelector("#price").value = ProductToEdit.price;
  document.querySelector("#description").value = ProductToEdit.description;
});

//send updated info
form.addEventListener("submit", (e) => {
  const nameProduct = document.querySelector("#name").value;
  const priceProduct = document.querySelector("#price").value;
  const descriptionProduct = document.querySelector("#description").value;

  const editedProduct = {
    name: nameProduct,
    price: priceProduct,
    description: descriptionProduct
  };
  //send edited
  ipcRenderer.send("product:editFinished", editedProduct); //buscar a cual tarjeta corresponde
  e.preventDefault();
});
