export async function getUsuarios() {
    try{

        const response = await fetch('https://api-usuario-1rex.onrender.com/');

        if (!response.ok) {
            
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        return data.Usuarios;
        
    } catch(error){
        console.error('Error:', error);
        throw error;
    }
}