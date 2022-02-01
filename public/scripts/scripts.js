//generamos variables con los contenidos
let grid = document.querySelector("#grid"); //caja completa con todas las imagenes/terreno de juego
//constante con todos los elementos del grid
let items = document.querySelectorAll(".grid-item");
//variable que contiene la caja del terreno de juego
let section = document.querySelector("#section");
//contador que usaremos para identificar todas las posiciones del array próximo
let count = 0;
//si vamos a jugar a la versión de 8 caras:
let eightgame = fmix([1,2,3,4,5,6,7,8,1,2,3,4,5,6,7,8]);
//si vamos a jugar a la versión de 16 caras
let sixteengame = fmix([1,2,3,4,5,6,7,8,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]);
//en esta opción almacenaremos el modo de juego, por defecto tiene el modo fácil, 8 imagenes
let gameMode = eightgame;
//inicializamos array donde guardaremos los resultados
let solutionArray = [];
//lugar donde almacenaremos el numero de aciertos del usuario
let hitCounter = 0;
//lugar donde almacenaremos los fallos del usuario
let failCounter = 0;
//Comprobamos si el usuario quiere jugar a la versión de 8 caras o la de 16
//haremos un addEventListener de el botón para personalizar la dificultad del juego
let modeButton = document.querySelector(".mode");
//Obtendremos el contenido del texto, una vez lo tengamos aplicaremos una opción de dificultad o otra
let textMode = document.querySelector(".mode p");
//Aplicaremos la opción que ha seleccionado el usuario para cambiar el modo de juego en el caso de que exista
if(getCookie("mode") != null && items.length > 16){
//Ponemos el modo de texto que el usuario ha seleccionado antes mediante una cookie como modo de juego
    textMode.textContent = `${getCookie('mode')} Mode`;
}else{
//Por defecto estaremos en modo fácil y mostraremos la opción de cambiar al modo difícil
textMode.textContent = "Hard Mode";
}

//Escuchador de eventos
modeButton.addEventListener("click",()=>{
    //Si ya había una partida empezada reinicializaremos las variables de puntuación (scoreboard)
    selectedResults = [];
    lastClick = [];
    hitCounter = 0;
    failCounter = 0;
    //También reiniciaremos los datos que el usuario ve
    let scoreHits = document.querySelector(".viewhits");
        scoreHits.textContent = null;
    let scoreFails = document.querySelector(".viewattemps");
        scoreFails.textContent = null;
    let scoreBoard = document.querySelector("#scoreboard");
        scoreBoard.style.display = "none";
    //en este switch nos basaremos en el contenido del modo de juego
    switch (textMode.textContent){
        //en el caso qué esté puesto el modo fácil si el usuario le da aplicaremos el modo difícil
        case "Easy Mode":
            document.cookie = "mode=Hard";
            //Aplicamos el texto de el modo al que cambiaremos
            textMode.textContent = "Hard Mode";
            gameMode = fmix([1,2,3,4,5,6,7,8,1,2,3,4,5,6,7,8]);
            grid.style.gridTemplateColumns = "100px 100px 100px 100px";
            grid.style.gridTemplateRows = "100px 100px 100px 100px";
            grid.style.height = "400px";
            //constante con todos los elementos del grid
            items = document.querySelectorAll(".grid-item");  //la recogemos de esta manera para que si se ha seleccionado otro modo de juego se apliquen estas inserciones
 
            //Eliminamos los items que podiamos encontrar antes
            for(let c = 0; c < items.length; c++){
                items[c].parentNode.removeChild(items[c]);

            }
            //Volvemos a crear los objetos que queremos
            for(let o = 0; o < 16; o++){
                let createNewImages = document.createElement("div");
                createNewImages.setAttribute("class","grid-item");
                grid.appendChild(createNewImages);
        
            }
            generateImages(count,items,gameMode);
            break;
            //en el caso de que esté puesto el modo difícil si el usuario le da aplicaremos el modo fácil
        case "Hard Mode":
            document.cookie = "mode=Easy";
            //Aplicamos el texto de el modo al que cambiaremos
            textMode.textContent = "Easy Mode";
            gameMode = fmix([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]);
            grid.style.gridTemplateColumns = "100px 100px 100px 100px 100px 100px 100px 100px";
            grid.style.gridTemplateRows = "100px 100px 100px 100px";
            grid.style.height = "auto";
            
            //constante con todos los elementos del grid
            items = document.querySelectorAll(".grid-item");  //la recogemos de esta manera para que si se ha seleccionado otro modo de juego se apliquen estas inserciones      
   

            //Eliminamos los items que podiamos encontrar antes
            for(let c = 0; c < items.length; c++){
                items[c].parentNode.removeChild(items[c]);
     
            }
            //Volvemos a crear los objetos que queremos
            for(let o = 0; o < 32; o++){
                let createNewImages = document.createElement("div");
                createNewImages.setAttribute("class","grid-item");
                grid.appendChild(createNewImages);
        
            }
            generateImages(count,items,gameMode);
            break;
    }
});
generateImages(count,items,gameMode);


/**--------------------------------------En este apartado configuraremos el ScoreBoard--------------------------------------------- */

function score(hitCounter, failCounter){
    let scoretable = document.querySelector("#scoreboard");
    grid.addEventListener("click",()=>{
        scoretable.style.display = "flex";
    });
    //en el caso de que haya algún movimiento (acierto o error)
    if(hitCounter > 0){
        let view = document.querySelector(".viewhits");
        view.textContent = `Score: ${hitCounter}`;  //Inyectamos la puntuación de la partida
    }
    if(failCounter > 0){
        let attempts = document.querySelector(".viewattemps");
        attempts.textContent = `Fails: ${failCounter}`; //Inyectamos los fallos realizados (intentos)
    }
    }

//De esta manera reiniciaremos la partida
let restartButton = document.querySelector(".restartButton");
restartButton.addEventListener("click", ()=>{
    //La mejor forma de borrar todo es recargando la página, así nos aseguramos de que no queda ningún dato
    location.reload();
});



/**---------------------------------FUNCIONES (Libreria) -------------------------------------------------- */

function generateImages(count, items, gameMode){
    //reiniciamos el array de resultados del juego
    solutionArray = [];
    items = document.querySelectorAll(".grid-item"); 
    //recorremos el nodeList de todos los objetos de el grid, cada elemento lo trataremos como "object"
items.forEach((object)=>{
    //recorremos el array de los numeros que organizaran las imagenes, en este caso le asignaremos una etiqueta de nombre
        //asignamos el atributo de nombre con el 
        //object.setAttribute('name',eightgame[count]);
        //creamos un elemento de imagen "<img>"
   
        let insertImage = document.createElement("img");
        //le asignamos la ruta a cada imagen con el "source" del array y la posición 
        insertImage.src = `public/resources/${gameMode[count]}.jpg`;
        //agregamos la imagen a el padre (que en este caso es el div de grid-item que le pertoca)
            object.appendChild(insertImage);    
        count++;    //aumentamos el contador en una posición más
    });
    //necesito obtener de una manera la solución del ejercicio en un array de JSON, así poder comparar más tarde
    //de esta manera evitamos hacer trucos no muy útiles como poner el nombre de la foto en un tag del div para luego recogerlo
    //recorremos las entradas de todos los items que hemos asignado
    items = document.querySelectorAll(".grid-item");
    for (let [position] of items.entries()) {
        //conseguimos el src completo de las nuevas imagenes
        let sourceString = items[position].children[0].getAttribute("src");
        //insertamos en el array todas las piezas que generamos, ejemplo: {"11":"2"}
        solutionArray.push(encodeArrayJSON(position, sourceString));
        //en el array nos quedaría algo asi: (extracto real de un posible resultado)
        //['{"0":"7"}', '{"1":"6"}', '{"2":"6"}', '{"3":"1"}', '{"4":"7"}', '{"5":"1"}', '{"6":"2"}', '{"7":"8"}', '{"8":"5"}', '{"9":"3"}', '{"10":"4"}', '{"11":"5"}', '{"12":"3"}', '{"13":"2"}', '{"14":"4"}', '{"15":"8"}']
        
    }
    //Giramos todas las imagenes para que el juego tenga gracia
    let images = document.querySelectorAll("img");
    images.forEach((posImage)=>{
    posImage.src = `public/resources/0.jpg`;
    
});


let checks = 0; //si ha hecho más de un click
let selectedResults = [];   //inicializamos el array donde haremos push de las dos respuestas del usuario
let lastClick = [];  //incializamos la variable que nos bloqueará que de 2 clicks en el mismo sitio y de true
let hits = [];  //inicializamos el array donde guardaremos los aciertos del usuario, de esta manera almacenaremos la cantidad de aciertos que hace y tambíen tendremos una copia de en qué parte de la partida se encuentra
let firtsPos = 0;
let hitCounter = 0; //contador de aciertos
items = document.querySelectorAll(".grid-item");

//Volvemos a recorrer el grid, ya que la vez anterior fué para incializar la plantilla, esta vez será para jugar:
for(let i = 0; i < (items.length); i++){    
    items[i].addEventListener("click",()=>{
        if(selectedResults.length < 2){
       
        let getJSON = decodeArrayJSON(solutionArray,i); //obtendremos el array de JSON que pertenece a este bloque
       
        //a continuación lo que haremos será comprovar si clica en 2 casillas diferentes  y el src de la imagen es el mismo
        if(checks <= 0){
            
            selectedResults.push(getJSON.src);  //inyectamos el src
            lastClick.push(getJSON.position);   //inyectamos la posición, que no se puede repetir
            checks+=1;  //ha seleccionado una vez
            //Cuando damos un click giraremos la imagen
            let thisImage = document.querySelectorAll("img")[getJSON.position];
            thisImage.src = `public/resources/${getJSON.src}.jpg`;
            firtsPos = getJSON;
        }else{
            checks = 0;
            //Cuando damos un click giraremos la imagen
            let thisImage = document.querySelectorAll("img")[getJSON.position];
            thisImage.src = `public/resources/${getJSON.src}.jpg`;
           
            selectedResults.push(getJSON.src);  //inyectamos el src
            lastClick.push(getJSON.position);   //inyectamos la posición, que no se puede repetir
            
            //si la siguiente función da true significa que ha habido una coincidencia
            if(sameCardChecker(selectedResults) == true && denyDoubleCheck(lastClick) == true){
                hits.push([firtsPos,getJSON]);  //almacenamos los asientos
                //En el caso de que haya dado true, es decir, que no se ha repetido casilla y que se haya encontrado una pareja:
                hitCounter+=1;
                //timeout para mostrar alerta
                setTimeout(()=>{
                    alert("Match!!");
                },200);
            }else{
                failCounter+=1;
                //en el caso de que no sea así lo que haremos será devolver las imagenes al src de img 0.jpg
                setTimeout(()=>{
                    failedCombo(lastClick);
                    keepHits(hits);
                },1500);
                
            }
            setTimeout(()=>{
                //si le ha dado dos veces reinicializaremos el array
                selectedResults = [];
                lastClick = []; 
            },1500);
            
           
        }
    }
    //método que controla el score de la partida
    score(hitCounter, failCounter);
     });
        
}
//console.log(solutionArray);
}


//no importa qué caso se de, debemos de mantener las imagenes que ya han sido resueltas
function keepHits(hits){
    hits.forEach((h)=>{
        h.forEach((hJson)=>{
            let thisImage = document.querySelectorAll("img")[hJson.position];
            thisImage.src = `public/resources/ok.jpg`;
        });
    });
}

function failedCombo(pos){
    let thisImage = document.querySelectorAll("img");
    thisImage.forEach((pi)=>{
        pi.src = `public/resources/0.jpg`;
    });
}
function denyDoubleCheck(lastClick){
  //inicializamos variables
  let firts = "";
  let second = "";
  let count = 0;
  lastClick.forEach((position)=>{ //recorremos el array obtenido
      if(count == 0){
          firts = position;
          count ++;
      }else{
          second = position;
          count = 0;
      }
  });
   //una vez tenemos las dos variables las comparamos
   if(firts != second){
  
      return true;
  }
  return false;
}

function sameCardChecker(selectedResults){
    //inicializamos variables
    let firts = "";
    let second = "";
    let count = 0;
    selectedResults.forEach((source)=>{ //recorremos el array obtenido
   
        if(count == 0){
            firts = source;
            count ++;
        }else{
            second = source;
            count = 0;
        }
    });
     //una vez tenemos las dos variables las comparamos
     if(firts == second){
       
        return true;
    }
    return false;
}

function decodeArrayJSON(solutionArray, position){
    let checkJSON = JSON.parse(solutionArray[position]);
    return checkJSON;
}

function encodeArrayJSON(position, src){
    let assocArray = {};  //inicializamos el array
    assocArray.position = position; //insertamos una posición
    assocArray.src = fmatchsrc(src); //insertamos un src modificado
    //'{"position":0,"src":"2"}', '{"position":1,"src":"7"}', '{"position":2,"src":"6"}',   //recogemos unicamente la parte que nos interesa, el nombre del archivo

    return JSON.stringify(assocArray);
}

function fmatchsrc(src){
    //si es un nº de 2 cifras

    if(src.length == 21){
        return src.substr(17,2);
    }else if(src.length == 22){
    return src.substr(17,1);
    }
    return src.substr(17,1);
}

function fmix(array) {
    //coseguimos la longitud de el array
    let index = array.length,  rand;
    while (index != 0) {
        
      rand = Math.floor(Math.random() * index);
      index--;
      //Modificamos el array y ponemos el elemento que queremos en el indice por el que estamos pasando
      [array[index], array[rand]] = [array[rand], array[index]];
    }
    //devolvemos el nuevo array
    return array;
  }

  //Método para conseguir el value de la cookie mediante el nombre
  function getCookie(cookieName) {
    let cookie = {};
    document.cookie.split(';').forEach(function(el) {
      let [key,value] = el.split('=');
      cookie[key.trim()] = value;
    })
    return cookie[cookieName];
  }