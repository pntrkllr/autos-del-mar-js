export const getVehiculos = async() => {
    try{

        const response = await fetch("https://api-vehiculos-yyve.onrender.com");
        const data = await response.json();

        return data.vehiculos;

    }catch(error){
        console.log(`El error es: ${error}`);
    }
}