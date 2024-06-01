import { getVehiculos } from "./peticiones/getVehiculos.js";

const enviarDatos = (id , marca , imagen , descripcion, modelo , precio) => {

    const archivoHTML = "./Vehiculos.html";

    fetch(archivoHTML)
        .then(response => response.text())
        .then( ( html )=> {


            const parser = new DOMParser();
            const doc = parser.parseFromString(html,"text/html");

            const imagePage = doc.getElementById("imagePage");
            imagePage.src = imagen;
            imagePage.alt = `Imagen de ${marca}`;
            imagePage.classList.add("card-img-top");

            const titlePage = doc.getElementById("titlePage");
            titlePage.textContent = `Marca : ${marca}`;

            const subTitlePage = doc.getElementById("subTitlePage");
            subTitlePage.textContent = `Descripcion : ${descripcion}`;

            const subTitlePage2 = doc.getElementById("subTitlePage2");
            subTitlePage2.textContent = `modelo : ${modelo}`;

            const subTitlePage3 = doc.getElementById("subTitlePage3");
            subTitlePage3.textContent = `precio : ${precio}`;

            const nuevoHTML = new XMLSerializer().serializeToString(doc);

            document.body.innerHTML = nuevoHTML;

        })

}

const crearCards = ( vehiculos = [] ) => {

    let vehiculosRow = document.getElementById("vehiculosRow");

    vehiculos.map((vehiculo) => {
        const { id , marca , imagen , descripcion, modelo , precio} = vehiculo;

        const divCol = document.createElement("div");
        divCol.classList.add("col-xl-3");
        divCol.classList.add("col-lg-3");
        divCol.classList.add("col-md-3");
        divCol.classList.add("col-sm-12");
        divCol.classList.add("col-xs-12");
        divCol.classList.add("mt-2");
        divCol.classList.add("mb-2");

        const card = document.createElement("div");
        card.classList.add("card");

        const img = document.createElement("img");
        img.src= imagen;
        img.alt = `Imagen de ${marca}`;
        img.classList.add("card-img-top");

        const divBody = document.createElement("div");
        divBody.classList.add("card-body");

        const title = document.createElement("h5");
        title.classList.add("text-title");
        title.textContent = `Marca : ${marca}`;

        const subTitle = document.createElement("p");
        subTitle.classList.add("text-title");
        subTitle.textContent = `Modelo : ${modelo}`;

        const subTitle2 = document.createElement("p");
        subTitle2.classList.add("text-title");
        subTitle2.textContent = `Precio : ${precio}`;

        const btnVer = document.createElement("button");
        btnVer.classList.add("btn","btn-success");
        btnVer.textContent = "Ver más";
        btnVer.addEventListener("click", ()=> {
            enviarDatos(id , marca , imagen , descripcion , modelo , precio);
        });

        divCol.appendChild(card);

        card.appendChild(img);
        card.appendChild(divBody);

        divBody.appendChild(title);
        divBody.appendChild(subTitle);
        divBody.appendChild(subTitle2);
        divBody.appendChild(btnVer);

        vehiculosRow.appendChild(divCol);
    })
}
getVehiculos()
    .then( data => crearCards(data))
    .catch( error => console.log(`El error es: ${error}`))

