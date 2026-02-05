const API_URL = "http://localhost:3000/products";

document.addEventListener('DOMContentLoaded', () => {

    const formProduct=document.getElementById("formProduct");

    //const message =document.getElementById("message")
    const listProduct =document.getElementById("listProduct")

    let products=JSON.parse(localStorage.getItem("products")) || []
    /*function validateTaskInput(){
        if(nameProduct === '' || priceProduct === '' || descriptionProducto === ''){
        message.textContent="Please fill out the fields"
        message.style.color="red"
    }
    }*/
    formProduct.addEventListener("submit", function(e){
        e.preventDefault()
        Save()
    })

    function Save(){

        const newProduct={
        //id:ID.now(),
        nameProduct:document.getElementById("product").value.trim(),
        priceProduct:document.getElementById("price").value.trim(),
        descriptionProducto:document.getElementById("description").value.trim()
        }

        products.push(newProduct)
        
        //-----------
        return fetch(API_URL,{
            method: "POST",
            headers:{
                "Content-Type": "application/json",
            },
            body:JSON.stringify(newProduct)
        })
        .then((res) => {
        if (!res) return; // Evita errores si el usuario ya existía
        return res.json();
        })
        .then((user) => {
        if (!user) return;
            localStorage.setItem("products", JSON.stringify(products))
        formProduct.reset();
        showProduct()
        })
    }

    //<button class="btn btn-outline-danger"
    function showProduct(){
        listProduct.innerHTML= ""

        products.forEach((product, index) =>{
            const list =document.createElement("li")
            list.innerHTML=`
                <li class="mb-1">Name= ${product.nameProduct}
                </li>
                <li class="mb-1">Price= ${product.priceProduct}</li>
                <li class="mb-1">Description= ${product.descriptionProducto}</li>
                <button type="button" class="btn btn-outline-danger">Delete</button>
                <hr>
            `
            const buttonDelete = list.querySelector(".btn");

            //buttonDelete.textContent = "Eliminar";
            
            buttonDelete.addEventListener("click", () => {
                deleteProduct(index);

            
                })

            listProduct.append(list)
        })
    
    }
    
    showProduct()
    function deleteProduct(index){
        if(deleteProduct){
            alert("Seguros que quieres eliminar el producto")
            products.splice(index, 1);
            localStorage.setItem("products", JSON.stringify(products));
            console.log("Elemento eliminado:", list);
            showProduct();
        }
    }
})