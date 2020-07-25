const { ipcRenderer } = require("electron");

const products = document.querySelector("#products");

ipcRenderer.on("product:new", (e, newProduct) => {
  const newProductTemplate = `
        <div class="col-xs-4 p-2">
          <div class="card text-center">
            <div class="card-header">
              <h5 class="card-title" id="productName">${newProduct.name}</h5>
            </div>
            <div class="card-body">
                <div class="card-description">
                    ${newProduct.description}
                </div>             
              <hr>
                <div class="card-price">
                    ${"$" + newProduct.price}
                </div> 
            </div>
            <div class="card-footer">
              <button class="btn btn-warning btn-sm">EDIT</button>
              <button class="btn btn-danger btn-sm">DELETE</button>
            </div>
          </div>
        </div>
        `;
  //to add a new card
  products.innerHTML += newProductTemplate;
  //edit btn in card
  const editbtn = document.querySelectorAll(".btn.btn-warning");
  editbtn.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      let nameProduct =
        e.target.parentElement.parentElement.childNodes[1].innerText;
      let descriptionProduct =
        e.target.parentElement.parentElement.childNodes[3].childNodes[1]
          .innerText;
      let priceProduct = e.target.parentElement.parentElement.childNodes[3].childNodes[5].innerText.substr(
        1
      );

      let productToEdit = {
        name: nameProduct,
        description: descriptionProduct,
        price: priceProduct
      };
      ipcRenderer.send("products:edit", productToEdit);
      //pasar la carta completa para ser editada
      console.log(e.target.parentElement.parentElement.childNodes);
    });
  });

  //delete btn in card
  const deletebtn = document.querySelectorAll(".btn.btn-danger");
  deletebtn.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.target.parentElement.parentElement.parentElement.remove();
    });
  });
});

//find te edited card and replace values

//to remove all
ipcRenderer.on("products:remove-all", (e) => {
  products.innerHTML = "";
});
