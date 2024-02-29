
//variables
const padreCarrito = document.querySelector(".carrito");// el a por encima de div
const carritoGeneral = document.querySelector(".carrito_dentro");//el div que contiene todo
const tableBody = document.querySelector(".lista_carrito tbody");//el tbody de table
const vaciarCarrito = document.querySelector(".vaciar_carrito");//botton vaciar carrito
const listaCursos = document.querySelector(".courses");
const parrafo = document.querySelector(".precio_total")
let contenidoCarrito = [];
const precioCurso = 14;
const precioNull = 0;


//funciones
const anadirListeners = ()=>{
    listaCursos.addEventListener("click", agregarCurso);
    tableBody.addEventListener("click", eliminarCurso);
    vaciarCarrito.addEventListener("click", vaciar);

    //Muestra los cursos del localstorage en el dom
    document.addEventListener("DOMContentLoaded", () => {
        const cursosStorage = localStorage.getItem('carrito');
        if(cursosStorage !== null){
            contenidoCarrito = JSON.parse(cursorsStorage);
            crearHtml();
        }
        
    })
}

//
const agregarCurso = (element)=>{
    element.preventDefault();
    if(element.target.classList.contains("boton_cursos")){
        let parent = element.target.parentElement;
        let imagen = parent.previousElementSibling.querySelector('img').src;
        const regexp = /img/i;
        const indice = imagen.search(regexp);
        imagen = imagen.substring(indice);
        
        let lenguaje = element.target.parentElement.firstElementChild.textContent;
        let precio = element.target.previousElementSibling.textContent.substring(1,6);
        producto(imagen, lenguaje,precio);
    }
}
const eliminarCurso =(element)=>{
    element.preventDefault();
    
    if(element.target.classList.contains("borrar")){
        const cursoId = element.target.getAttribute("id");
        const carritoActualizado = contenidoCarrito.map((e)=>{
            if(cursoId === e.len && e.cantidad>1){
                e.precio -= precioCurso;
                e.cantidad--;
                return e
            } else if (cursoId === e.len && e.cantidad===1){
                e.precio -= precioCurso;
                e.cantidad--;
                return e
            }else{
                return e
            }
        })
        contenidoCarrito = [...carritoActualizado];
        
    }
    const cursoId = element.target.getAttribute("id");
    const respuesta = contenidoCarrito.some((e)=>cursoId === e.len && e.cantidad===0);
    if(respuesta){
        contenidoCarrito = contenidoCarrito.filter(e => cursoId !== e.len);
    }

    crearHtml();
}
const vaciar = (element)=>{
    element.preventDefault();
    if(element.target.classList.contains("vaciar_carrito")){
        contenidoCarrito = [];
        
        crearHtml();
    }
}

//Creamos un objeto con el curso seleccionado
const producto = (imagen, lenguaje, precio)=>{
    const curso = {
        img: imagen,
        len: lenguaje,
        precio: precio,
        cantidad: 1
    }
    curso.precio = Number(curso.precio)
    
    //revisar si se repite un curso
    const respuesta = contenidoCarrito.some((e)=>e.len === curso.len);
    if(respuesta){
        const newCurso = contenidoCarrito.map((e)=>{
            if(e.len === curso.len){
                e.precio += precioCurso
                e.cantidad++
                return e
            }else{
                return e
            }
        });
        contenidoCarrito = [...newCurso];
        
    }else{
        contenidoCarrito = [...contenidoCarrito,curso];
    }
    crearHtml();
}
//Crear el html a partir del array
const crearHtml = ()=>{
    //para que no se acumulen los elementos
    limpiarHtml();
    
    let precioTotal = contenidoCarrito.reduce((acumulador, elemento)=>{
        return acumulador + elemento.precio;
    },0); 
    
    if(contenidoCarrito.length == 0){
        parrafo.textContent = `Total Amount: ${precioNull}$`;
        parrafo.style.backgroundColor = "red";
    }else{
        parrafo.textContent = `Total Amount: ${precioTotal.toFixed(2)}$`;
        parrafo.style.backgroundColor = "green";
    }

    sincronizarLocalStorage()
    contenidoCarrito.forEach((curso)=>{
        const fila = document.createElement("tr");
        
        fila.innerHTML =`
            <td>
                <img src="${curso.img}" width=100>
            </td>
            <td>${curso.len}</td>
            <td>${curso.precio.toFixed(2)}$</td>
            <td>${curso.cantidad}</td>
            <td>
                <a href="#" class="borrar" id="${curso.len}"> X </a>
            <td>
            
        `;
        
        tableBody.append(fila);
        //sincronizamos con localstorage
        
    })
}

function sincronizarLocalStorage(){
    localStorage.setItem('carrito', JSON.stringify(contenidoCarrito));
}
//limpiarhtml
const limpiarHtml=()=>{
    while(tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild);
    }
}

//
const carritoPermanente = (elemento)=>{
    if (elemento.style.display === "flex"){
        return elemento.style.display="none"
    }else{
        return elemento.style.display="flex";
    }
}
padreCarrito.addEventListener("click",()=>carritoPermanente(carritoGeneral));

anadirListeners();

//mobile
const icono = document.querySelector(".touch");
const navegacion = document.querySelector(".inside");
icono.addEventListener("click", () => {
    if(navegacion.style.display ==="block"){
        return navegacion.style.display ="none";
    }else{
        return  navegacion.style.display ="block";
    }
});