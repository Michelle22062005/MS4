const API_URL = "http://localhost:3000/products";

document.addEventListener('DOMContentLoaded', () => {

    // TASK 1: Selección de elementos del DOM
    const formProduct = document.getElementById("formProduct");
    const message = document.getElementById("message");
    const listProduct = document.getElementById("listProduct");
    
    // TASK 4: Arreglo global para almacenar productos
    let products = [];
    
    // Variable para controlar el modo de edición
    let editMode = false;
    let editingProductId = null;

    // TASK 5: GET - Cargar productos al iniciar la aplicación
    async function loadProducts() {
        try {
            // Intentar obtener de la API primero
            const response = await fetch(API_URL);
            
            if (!response.ok) {
                throw new Error("Error al cargar productos de la API");
            }
            
            products = await response.json();
            
            // TASK 4: Sincronizar con localStorage
            localStorage.setItem("products", JSON.stringify(products));
            
            // TASK 3: Renderizar en el DOM
            showProducts();
            
            showMessage("Productos cargados correctamente", "success");
            
        } catch (error) {
            console.error("Error al cargar productos:", error);
            
            // Si falla la API, cargar desde localStorage
            const storedProducts = localStorage.getItem("products");
            if (storedProducts) {
                products = JSON.parse(storedProducts);
                showProducts();
                showMessage("Productos cargados desde almacenamiento local", "warning");
            } else {
                showMessage("No se pudieron cargar los productos", "danger");
            }
        }
    }

    // TASK 2: Captura e interacción con el usuario
    formProduct.addEventListener("submit", async function(e) {
        e.preventDefault();
        
        // Verificar si estamos en modo edición o modo agregar
        if (editMode) {
            await updateProduct();
        } else {
            await saveProduct();
        }
    });

    // TASK 2: Validación de campos
    function validateProductInput(nameProduct, priceProduct, descriptionProducto) {
        // Validar que los campos no estén vacíos
        if (nameProduct === '' || priceProduct === '' || descriptionProducto === '') {
            showMessage("Por favor complete todos los campos", "danger");
            return false;
        }
        
        // Validar que el precio sea un número positivo
        if (isNaN(priceProduct) || parseFloat(priceProduct) <= 0) {
            showMessage("El precio debe ser un número positivo", "danger");
            return false;
        }
        
        // Validar longitud del nombre
        if (nameProduct.length < 3) {
            showMessage("El nombre debe tener al menos 3 caracteres", "danger");
            return false;
        }
        
        return true;
    }

    // TASK 2: Mostrar mensajes dinámicos al usuario
    function showMessage(text, type) {
        message.textContent = text;
        message.className = `alert alert-${type} mt-2`;
        
        // Ocultar mensaje después de 3 segundos
        setTimeout(() => {
            message.textContent = "";
            message.className = "";
        }, 3000);
    }

    // TASK 5: POST - Guardar nuevo producto
    async function saveProduct() {
        try {
            // Capturar datos del formulario
            const nameProduct = document.getElementById("product").value.trim();
            const priceProduct = document.getElementById("price").value.trim();
            const descriptionProducto = document.getElementById("description").value.trim();
            
            // TASK 2: Validar datos
            if (!validateProductInput(nameProduct, priceProduct, descriptionProducto)) {
                return;
            }
            
            // Crear objeto producto
            const newProduct = {
                nameProduct,
                priceProduct,
                descriptionProducto
            };
            
            // TASK 5: Enviar a la API
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newProduct)
            });
            
            if (!response.ok) {
                throw new Error("Error al guardar el producto");
            }
            
            const savedProduct = await response.json();
            
            // TASK 4: Agregar al arreglo local y guardar en localStorage
            products.push(savedProduct);
            localStorage.setItem("products", JSON.stringify(products));
            
            // TASK 3: Actualizar el DOM
            showProducts();
            
            // Limpiar formulario y mostrar mensaje
            formProduct.reset();
            showMessage("✅ Producto agregado exitosamente", "success");
            
            console.log("Producto guardado:", savedProduct);
            
        } catch (error) {
            console.error("Error al guardar producto:", error);
            showMessage("❌ Error al guardar el producto", "danger");
        }
    }

    // TASK 3: Manipulación dinámica del DOM - Mostrar productos
    function showProducts() {
        // Limpiar lista actual
        listProduct.innerHTML = "";
        
        // Renderizar cada producto
        products.forEach(product => {
            // Crear elemento de lista
            const listItem = document.createElement("li");
            listItem.className = "list-group-item mb-2";
            
            // Estructura del producto
            listItem.innerHTML = `
                <div class="d-flex justify-content-between align-items-start">
                    <div class="flex-grow-1">
                        <h5 class="mb-1">${product.nameProduct}</h5>
                        <p class="mb-1"><strong>Precio:</strong> $${product.priceProduct}</p>
                        <p class="mb-1"><strong>Descripción:</strong> ${product.descriptionProducto}</p>
                        <small class="text-muted">ID: ${product.id}</small>
                    </div>
                    <div class="btn-group" role="group">
                        <button type="button" class="btn btn-outline-warning btn-sm btn-edit">Editar</button>
                        <button type="button" class="btn btn-outline-danger btn-sm btn-delete">Eliminar</button>
                    </div>
                </div>
            `;
            
            // TASK 3: Agregar evento al botón eliminar
            const buttonDelete = listItem.querySelector(".btn-delete");
            buttonDelete.addEventListener("click", () => {
                deleteProduct(product.id);
            });
            
            // TASK 5: PUT - Agregar evento al botón editar
            const buttonEdit = listItem.querySelector(".btn-edit");
            buttonEdit.addEventListener("click", () => {
                editProduct(product);
            });
            
            // TASK 3: Agregar al DOM usando appendChild
            listProduct.appendChild(listItem);
        });
    }

    // TASK 5: DELETE - Eliminar producto
    async function deleteProduct(id) {
        // Confirmar eliminación
        const confirmDelete = confirm("¿Estás seguro de que deseas eliminar este producto?");
        if (!confirmDelete) {
            return;
        }
        
        try {
            // TASK 5: Eliminar en la API
            const response = await fetch(`${API_URL}/${id}`, {
                method: "DELETE",
            });
            
            if (!response.ok) {
                throw new Error("Error al eliminar el producto");
            }
            
            // TASK 4: Eliminar del arreglo local
            products = products.filter(product => product.id !== id);
            
            // TASK 4: Actualizar localStorage
            localStorage.setItem("products", JSON.stringify(products));
            
            // TASK 3: Actualizar el DOM
            showProducts();
            
            showMessage("🗑️ Producto eliminado correctamente", "info");
            console.log("Elemento eliminado:", id);
            
        } catch (error) {
            console.error("Error al eliminar:", error);
            showMessage("❌ Error al eliminar el producto", "danger");
        }
    }

    // TASK 5: PUT - Preparar formulario para editar producto
    function editProduct(product) {
        // Activar modo edición
        editMode = true;
        editingProductId = product.id;
        
        // Prellenar el formulario con los datos actuales
        document.getElementById("product").value = product.nameProduct;
        document.getElementById("price").value = product.priceProduct;
        document.getElementById("description").value = product.descriptionProducto;
        
        // Cambiar el texto del botón
        const submitButton = formProduct.querySelector('input[type="submit"]');
        submitButton.value = "Actualizar Producto";
        submitButton.className = "form-control btn btn-warning";
        
        // Agregar botón de cancelar
        let cancelButton = document.getElementById("cancelEditBtn");
        if (!cancelButton) {
            cancelButton = document.createElement("button");
            cancelButton.id = "cancelEditBtn";
            cancelButton.type = "button";
            cancelButton.className = "form-control btn btn-secondary mt-2";
            cancelButton.textContent = "Cancelar Edición";
            cancelButton.addEventListener("click", cancelEdit);
            submitButton.parentNode.insertBefore(cancelButton, submitButton.nextSibling);
        }
        
        // Scroll al formulario
        formProduct.scrollIntoView({ behavior: 'smooth' });
        
        console.log("Modo edición activado para producto:", product.id);
    }

    // TASK 5: PUT - Actualizar producto en la API
    async function updateProduct() {
        try {
            // Capturar datos actualizados
            const nameProduct = document.getElementById("product").value.trim();
            const priceProduct = document.getElementById("price").value.trim();
            const descriptionProducto = document.getElementById("description").value.trim();
            
            // TASK 2: Validar datos
            if (!validateProductInput(nameProduct, priceProduct, descriptionProducto)) {
                return;
            }
            
            const updatedProduct = {
                id: editingProductId,
                nameProduct,
                priceProduct,
                descriptionProducto
            };
            
            // TASK 5: PUT - Actualizar en la API
            const response = await fetch(`${API_URL}/${editingProductId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updatedProduct)
            });
            
            if (!response.ok) {
                throw new Error("Error al actualizar el producto");
            }
            
            const savedProduct = await response.json();
            
            // TASK 4: Actualizar en el arreglo local
            const index = products.findIndex(p => p.id === editingProductId);
            if (index !== -1) {
                products[index] = savedProduct;
            }
            
            // TASK 4: Actualizar localStorage
            localStorage.setItem("products", JSON.stringify(products));
            
            // TASK 3: Actualizar el DOM
            showProducts();
            
            // Salir del modo edición
            cancelEdit();
            
            showMessage("✏️ Producto actualizado exitosamente", "success");
            console.log("Producto actualizado:", savedProduct);
            
        } catch (error) {
            console.error("Error al actualizar:", error);
            showMessage("❌ Error al actualizar el producto", "danger");
        }
    }

    // Función para cancelar la edición
    function cancelEdit() {
        // Desactivar modo edición
        editMode = false;
        editingProductId = null;
        
        // Limpiar formulario
        formProduct.reset();
        
        // Restaurar botón
        const submitButton = formProduct.querySelector('input[type="submit"]');
        submitButton.value = "Agregar Producto";
        submitButton.className = "form-control btn btn-primary";
        
        // Eliminar botón de cancelar
        const cancelButton = document.getElementById("cancelEditBtn");
        if (cancelButton) {
            cancelButton.remove();
        }
        
        console.log("Modo edición cancelado");
    }

    // TASK 6: Inicializar aplicación cargando productos
    loadProducts();

    // TASK 6: Log de estado inicial para pruebas
    console.log("Aplicación iniciada");
    console.log("LocalStorage actual:", localStorage.getItem("products"));
});

