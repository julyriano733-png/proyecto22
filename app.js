
var preguntas = [
  {
    pregunta: "¿Qué es la mostacilla en la elaboración de manillas?",
    opciones: ["Cuentas pequeñas de vidrio o plástico", "Hilos gruesos de lana", "Piedras grandes talladas", "Cintas de seda"],
    correcta: 0
  },
  {
    pregunta: "¿Qué tipo de hilo se recomienda para hacer manillas elásticas?",
    opciones: ["Hilo de coser normal", "Hilo elástico (caucho)", "Cuerda de algodón gruesa", "Lana para tejer"],
    correcta: 1
  },
  {
    pregunta: "¿Qué técnica es muy común para tejer figuras con mostacilla?",
    opciones: ["Macramé", "Origami", "Punto peyote o telar", "Crochet"],
    correcta: 2
  },
  {
    pregunta: "¿Qué medida debes tomar antes de hacer una manilla?",
    opciones: ["El largo del brazo", "El ancho de la palma", "La estatura de la persona", "El contorno de la muñeca"],
    correcta: 0
  },
  {
    pregunta: "¿Cómo se suele rematar el hilo elástico para que no se suelte?",
    opciones: ["Con un doble nudo firme", "Con un poco de pegamento", "Con un alfiler", "Con cinta adhesiva"],
    correcta: 0
  }
];



var TIEMPO = 60;          
var numeroPregunta = 0;   // primer preg
var puntaje = 0;        
var segundos = TIEMPO;    // time por preg
var temporizador;         // reloj
var resumen = "";         


var pantallaInicio = document.getElementById("pantalla-inicio");
var pantallaQuiz = document.getElementById("pantalla-quiz");
var pantallaResultado = document.getElementById("pantalla-resultado");

var textoProgreso = document.getElementById("texto-progreso");
var textoPuntaje = document.getElementById("texto-puntaje");
var textoTiempo = document.getElementById("texto-tiempo");
var textoPregunta = document.getElementById("texto-pregunta");
var botonSiguiente = document.getElementById("boton-siguiente");

// Los 4 botones de respuesta se crean aquí una sola vez dentro del contenedor
var contenedorRespuestas = document.getElementById("contenedor-respuestas");
for (var i = 0; i < 4; i++) {
  var boton = document.createElement("button");
  boton.type = "button";
  boton.className = "boton-respuesta";
  boton.dataset.indice = i;
  boton.addEventListener("click", function () {
    responder(Number(this.dataset.indice));
  });
  contenedorRespuestas.appendChild(boton);
}

var botones = document.getElementsByClassName("boton-respuesta");

// Engancho los botones principales a sus funciones
document.getElementById("boton-empezar").addEventListener("click", empezar);
document.getElementById("boton-reiniciar").addEventListener("click", empezar);
botonSiguiente.addEventListener("click", siguientePregunta);


function empezar() {
  clearInterval(temporizador); // por si había un reloj corriendo

  numeroPregunta = 0;
  puntaje = 0;
  resumen = "";


  pantallaInicio.classList.add("oculto");
  pantallaResultado.classList.add("oculto");
  pantallaQuiz.classList.remove("oculto");

  mostrarPregunta();
}

function mostrarPregunta() {
  var pregunta = preguntas[numeroPregunta];

  textoProgreso.textContent = "Pregunta " + (numeroPregunta + 1) + " de " + preguntas.length;
  textoPuntaje.textContent = "Puntaje: " + puntaje;
  textoPregunta.textContent = pregunta.pregunta;//preg actual

  // A cada botón le pongo su texto, le quito los colores de la pregunta anterior y lo activo
  for (var i = 0; i < 4; i++) {
    botones[i].textContent = pregunta.opciones[i];
    botones[i].className = "boton-respuesta";//aplica clase 
    botones[i].disabled = false;//activa el boton para hacer click
  }


  botonSiguiente.classList.add("oculto");


  segundos = TIEMPO;
  textoTiempo.textContent = "Tiempo: " + segundos + "s";//60
  textoTiempo.classList.remove("poco-tiempo");
  clearInterval(temporizador);
  temporizador = setInterval(pasarUnSegundo, 1000);//milisegundos
}

// pasa el segundo
function pasarUnSegundo() {
  segundos = segundos - 1;
  textoTiempo.textContent = "Tiempo: " + segundos + "s";

  if (segundos <= 10) {
    textoTiempo.classList.add("poco-tiempo");
  }

  if (segundos === 0) {
    clearInterval(temporizador);
    puntaje = puntaje - 1;
    textoPuntaje.textContent = "Puntaje: " + puntaje;
    guardarEnResumen("sin-respuesta", "Sin respuesta (se acabó el tiempo)");
    siguientePregunta();
  }
}


function responder(elegida) {
  clearInterval(temporizador); // ya respondió, paro el reloj
  textoTiempo.classList.remove("poco-tiempo");

  var pregunta = preguntas[numeroPregunta];
  var correcta = pregunta.correcta;

  if (elegida === correcta) {
    puntaje = puntaje + 1;
    botones[elegida].classList.add("correcta");
    guardarEnResumen("correcta", pregunta.opciones[elegida]);
  } else {
    
    botones[elegida].classList.add("incorrecta");
    botones[correcta].classList.add("correcta");
    guardarEnResumen("incorrecta", pregunta.opciones[elegida]);
  }

  // Desactivo los 4 botones para que no pueda responder otra vez
  for (var i = 0; i < 4; i++) {
    botones[i].disabled = true;//inactivo
  }

  textoPuntaje.textContent = "Puntaje: " + puntaje;

  //  "Ver resultado" ultima pregunta
  if (numeroPregunta === preguntas.length - 1) {
    botonSiguiente.textContent = "Ver resultado";
  } else {
    botonSiguiente.textContent = "Siguiente";
  }
  botonSiguiente.classList.remove("oculto");
}

function guardarEnResumen(clase, tuRespuesta) {
  var pregunta = preguntas[numeroPregunta];

  resumen = resumen +
    "<div class='item-resultado " + clase + "'>" +
    "<strong>" + (numeroPregunta + 1) + ". " + pregunta.pregunta + "</strong>" +
    "<p>Tu respuesta: " + tuRespuesta + "</p>" +
    "<p>Respuesta correcta: " + pregunta.opciones[pregunta.correcta] + "</p>" +
    "</div>";
}

// Pasa a la siguiente pregunta, o al resultado si ya no quedan más
function siguientePregunta() {
  numeroPregunta = numeroPregunta + 1;

  if (numeroPregunta < preguntas.length) {
    mostrarPregunta();
  } else {
    mostrarResultado();
  }
}

// Pantalla final: puntaje y resumen de todas las preguntas
function mostrarResultado() {
  clearInterval(temporizador);
  textoTiempo.classList.remove("poco-tiempo");

  pantallaQuiz.classList.add("oculto");
  pantallaResultado.classList.remove("oculto");

  document.getElementById("puntaje-final").textContent = puntaje;
  document.getElementById("puntaje-maximo").textContent = preguntas.length;
  document.getElementById("lista-resultados").innerHTML = resumen;
}

// ---------- 5. DATOS DE LA PANTALLA DE INICIO ----------
document.getElementById("total-preguntas").textContent = preguntas.length;
document.getElementById("tiempo-limite").textContent = TIEMPO;