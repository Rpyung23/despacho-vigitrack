let mueveReloj = () => {
    momentoActual = new Date()
    hora = momentoActual.getHours()
    minuto = momentoActual.getMinutes()
    segundo = momentoActual.getSeconds()

    hora = hora < 1 ? 24 : hora
    console.log("hora : " + hora)

    horaImprimible = (hora < 10 ? "0" + hora : hora) + " : " + (minuto < 10 ? "0" + minuto : minuto) + " : " + (segundo < 10 ? "0" + segundo : segundo)

    var html_hora = `<strong>${horaImprimible}</strong>`
        //console.log(horaImprimible)
    document.getElementById('_reloj').innerHTML = html_hora
}



function initReloj() {
    setInterval(function() {
        mueveReloj()
    }, 1000);
}