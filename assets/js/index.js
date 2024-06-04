import { getVehiculos } from "./peticiones/getVehiculos.js";

let carrito = [];

const actualizarStock = async (id, cantidad) => {
    try {
        const response = await fetch(`https://api-vehiculos-yyve.onrender.com/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ stock: cantidad })
        });
        const data = await response.json();
        console.log(data); // Puedes agregar manejo de errores o lógica adicional según lo necesites
    } catch (error) {
        console.log(`Error al actualizar el stock: ${error}`);
    }
}

const agregarAlCarrito = async (vehiculo) => {
    try {
        // Verificar si hay suficiente stock
        if (vehiculo.stock > 0) {
            const existe = carrito.find(item => item.id === vehiculo.id);
            if (existe) {
                alert(`Se ha agregado el ${vehiculo.marca} ${vehiculo.modelo} al carrito.`)
                existe.cantidad += 1;
            } else {
                carrito.push({ ...vehiculo, cantidad: 1 });
            }
            // Restar 1 al stock al agregar al carrito
            await actualizarStock(vehiculo.id, vehiculo.stock - 1);
            actualizarCarrito();
        } else {
            alert(`Lo sentimos, no hay suficiente stock disponible para el ${vehiculo.marca} ${vehiculo.modelo}.`);
        }
    } catch (error) {
        console.log(`Error al agregar al carrito: ${error}`);
    }
}

const actualizarCarrito = () => {
    const carritoItems = document.getElementById("carritoItems");
    const totalCarrito = document.getElementById("totalCarrito");

    carritoItems.innerHTML = "";

    let total = 0;

    carrito.forEach((item) => {
        const li = document.createElement("li");
        li.classList.add("list-group-item");
        li.classList.add("d-flex");
        li.classList.add("justify-content-between");
        li.classList.add("align-items-center");
        li.textContent = `${item.marca} - $${item.precio} x ${item.cantidad}`;

        const btnEliminar = document.createElement("button");
        btnEliminar.classList.add("btn", "btn-danger", "btn-sm");
        btnEliminar.textContent = "Borrar";
        btnEliminar.addEventListener("click", () => {
            eliminarDelCarrito(item.id);
        });

        li.appendChild(btnEliminar);
        carritoItems.appendChild(li);

        total += item.precio * item.cantidad;
    });

    totalCarrito.textContent = total;
}

const eliminarDelCarrito = (id) => {
    carrito = carrito.filter(item => item.id !== id);
    actualizarCarrito();
}

document.addEventListener('DOMContentLoaded', () => {
    const comprarButton = document.querySelector('.modal-footer .btn-dark');
    comprarButton.addEventListener('click', async () => {
        try {
            // Actualizar stock después de la compra
            for (const item of carrito) {
                await actualizarStock(item.id, item.stock - item.cantidad); // Restamos la cantidad de vehículos comprados al stock
            }
            alert('¡Gracias por comprar su vehículo en Autos del Mar!');
            carrito = [];
            actualizarCarrito();
        } catch (error) {
            console.log(`Error al comprar vehículos: ${error}`);
        }
    });
});

const enviarDatos = (id, marca, imagen, descripcion, modelo, precio, stock) => {
    const archivoHTML = "./Vehiculos.html";

    fetch(archivoHTML)
        .then(response => response.text())
        .then((html) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");

            const imagePage = doc.getElementById("imagePage");
            imagePage.src = imagen;
            imagePage.alt = `Imagen de ${marca}`;
            imagePage.classList.add("card-img-top");

            const titlePage = doc.getElementById("titlePage");
            titlePage.textContent = `Marca: ${marca}`;

            const subTitlePage = doc.getElementById("subTitlePage");
            subTitlePage.textContent = `Descripción: ${descripcion}`;

            const subTitlePage2 = doc.getElementById("subTitlePage2");
            subTitlePage2.textContent = `Modelo: ${modelo}`;

            const subTitlePage3 = doc.getElementById("subTitlePage3");
            subTitlePage3.textContent = `Stock: ${stock}`;

            const subTitlePage4 = doc.getElementById("subTitlePage4");
            subTitlePage4.textContent = `$${precio}`;

            const nuevoHTML = new XMLSerializer().serializeToString(doc);

            document.body.innerHTML = nuevoHTML;
        });
}

const crearCards = (vehiculos = []) => {
    let vehiculosRow = document.getElementById("vehiculosRow");

    vehiculos.map((vehiculo) => {
        const { id, marca, imagen, descripcion, modelo, precio, stock } = vehiculo;

        const divCol = document.createElement("div");
        divCol.classList.add("col-xl-3", "col-lg-3", "col-md-3", "col-sm-12", "col-xs-12", "mb-2");

        const card = document.createElement("div");
        card.classList.add("card");

        const img = document.createElement("img");
        img.src = imagen;
        img.alt = `Imagen de ${marca}`;
        img.classList.add("card-img-top");

        const divBody = document.createElement("div");
        divBody.classList.add("card-body");

        const title = document.createElement("h5");
        title.classList.add("text-title");
        title.textContent = `Marca: ${marca}`;

        const subTitle = document.createElement("p");
        subTitle.classList.add("text-title");
        subTitle.textContent = `Modelo: ${modelo}`;

        const subTitle2 = document.createElement("p");
        subTitle2.classList.add("text-title");
        subTitle2.textContent = `Stock: ${stock}`;

        const subTitle3 = document.createElement("p");
        subTitle3.classList.add("text-title", "text-center", "fs-4");
        subTitle3.textContent = `$${precio}`;

        const btnVer = document.createElement("button");
        btnVer.classList.add("btn", "btn-success");
        btnVer.textContent = "Ver más";
        btnVer.addEventListener("click", () => {
            enviarDatos(id, marca, imagen, descripcion, modelo, precio, stock);
        });

        const btnAgregar = document.createElement("button");
        btnAgregar.classList.add("btn", "btn-primary", "ms-2");
        btnAgregar.textContent = "Agregar al carrito";
        btnAgregar.addEventListener("click", () => {
            agregarAlCarrito(vehiculo);
        });

        divCol.appendChild(card);
        card.appendChild(img);
        card.appendChild(divBody);
        divBody.appendChild(title);
        divBody.appendChild(subTitle);
        divBody.appendChild(subTitle2);
        divBody.appendChild(subTitle3);
        divBody.appendChild(btnVer);
        divBody.appendChild(btnAgregar);

        vehiculosRow.appendChild(divCol);
    });
};

getVehiculos()
    .then(data => crearCards(data))
    .catch(error => console.log(`El error es: ${error}`));