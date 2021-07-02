let btn_buses = document.getElementById("tabs-unidades")
let btn_geocercar = document.getElementById("tabs-geocercas")
let btn_lineas_rutas = document.getElementById("tabs-opc-lineas-rutas")

let btn_close_buses = document.getElementById("btn_close_unidades")
let btn_close_geocoder = document.getElementById("btn_close_geocoder")
let btn_close_lineas_rutas = document.getElementById("btn_close_lineas_rutas")



let floating_action_button = document.getElementById("floating_action_button_more")
let ul_list_leyenda = document.getElementById("ul_lista-leyenda")
var bandera = 0

var auto = 1
floating_action_button.addEventListener("click", function() {

    if ($(ul_list_leyenda).hasClass("lista-leyenda-inactive")) {
        $(ul_list_leyenda).removeClass("lista-leyenda lista-leyenda-inactive")
        $(ul_list_leyenda).addClass("lista-leyenda lista-leyenda-active")
    } else {
        $(ul_list_leyenda).removeClass("lista-leyenda-active")
        $(ul_list_leyenda).addClass("lista-leyenda lista-leyenda-inactive")
    }

})

/** prefijos **/

let OR_prefijo_sql = " OR "
let validator_sql_active_vehiculo = " and V.idEstaVehi = 1 ORDER BY CONVERT(M.CodiVehiMoni, SIGNED INTEGER) ASC"


/***INTERVAL ***/
let interval_rastreo_monitoreo = null

let interval_rastreo_monitoreo_linea_ruta = null
    /******************************* */
let panel_datos_html_rastreo = ""
let panel_datos_html_geocerca = ""
let panel_datos_html_lineas_rutas = ""

let map;

let list_objs_unidades_monitoreo = []
let list_objs_controles = []
let bandera_centrar_mapa = true

let list_objs_lineas = []


/**String rastreo por linea-ruta**/

let string_rastre_linea_ruta = "select M.CodiVehiMoni,M.PlacVehiMoni,M.AlarFuerRutaMoni,M.AlarAnteGPSDescMoni,M.EvenAnteGPSConeMoni, M.EvenAlimBateExteMoni,M.Odometro,M.EstaSaliMoni,M.UltiFechMoni,M.UltiLugaMoni,M.UltiLatiMoni, M.UltiLongMoni,M.UltiRumbMoni,M.UltiVeloMoni,R.LetrRuta from monitoreo as M join ruta as R on M.LetrRutaMoni = R.LetrRuta join vehiculo as V on M.CodiDispMoni = V.CodiDispVehi  where "

/** M.LetrRutaMoni = 'JO' **/

function initMap() {
    map = new google.maps.Map(document.getElementById("google_map"), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8,
        disableDefaultUI: true,
    });


    map.addListener("click", (e) => {
        return;
    });

    map.addListener("dblclick", (e) => {
        return;
    });


}

function allRemoveClassTabsActives() {
    $(btn_buses).removeClass("li-card-tab-active")
    $(btn_geocercar).removeClass("li-card-tab-active")
    $(btn_lineas_rutas).removeClass("li-card-tab-active")
}

function closePanelRight(panel) {
    allRemoveClassTabsActives()
    $(panel).removeClass("container-map-rastreo-active")
}

btn_buses.addEventListener("click", function() {

    var bandera = $(this).hasClass("li-card-tab-active")

    if (bandera) {

        $(this).removeClass("li-card-tab-active")
        $("#container-details-tab-unidades").removeClass("container-map-rastreo-active")

    } else {

        $(this).addClass("li-card-tab-active")
        $("#container-details-tab-unidades").addClass("container-map-rastreo-active")

        $(btn_geocercar).removeClass("li-card-tab-active")

        $("#container-details-tab-geocerca").removeClass("container-map-rastreo-active")




        $(btn_lineas_rutas).removeClass("li-card-tab-active")

        $("#container-details-tab-lineas-rutas").removeClass("container-map-rastreo-active")
    }

})

btn_geocercar.addEventListener("click", function() {

    var bandera = $(this).hasClass("li-card-tab-active")

    if (bandera) {

        $(this).removeClass("li-card-tab-active")
        $("#container-details-tab-geocerca").removeClass("container-map-rastreo-active")

    } else {

        $(this).addClass("li-card-tab-active")
        $("#container-details-tab-geocerca").addClass("container-map-rastreo-active")


        $(btn_buses).removeClass("li-card-tab-active")

        $("#container-details-tab-unidades").removeClass("container-map-rastreo-active")

        $(btn_lineas_rutas).removeClass("li-card-tab-active")

        $("#container-details-tab-lineas-rutas").removeClass("container-map-rastreo-active")

    }
})

btn_lineas_rutas.addEventListener("click", function() {

    var bandera = $(this).hasClass("li-card-tab-active")

    if (bandera) {

        $(this).removeClass("li-card-tab-active")
        $("#container-details-tab-lineas-rutas").removeClass("container-map-rastreo-active")

    } else {

        $(this).addClass("li-card-tab-active")
        $("#container-details-tab-lineas-rutas").addClass("container-map-rastreo-active")


        $(btn_buses).removeClass("li-card-tab-active")

        $("#container-details-tab-unidades").removeClass("container-map-rastreo-active")


        $(btn_geocercar).removeClass("li-card-tab-active")

        $("#container-details-tab-geocerca").removeClass("container-map-rastreo-active")

    }
})


btn_close_buses.addEventListener("click", function() {
    var element = document.getElementById("container-details-tab-unidades")
    closePanelRight(element)
})

btn_close_geocoder.addEventListener("click", function() {
    var element = document.getElementById("container-details-tab-geocerca")
    closePanelRight(element)
})

btn_close_lineas_rutas.addEventListener("click", function() {
    var element = document.getElementById("container-details-tab-lineas-rutas")
    closePanelRight(element)
})

function is_transmitiendo(fechaUltiMoni) {
    var date_ulti = new Date(fechaUltiMoni)
    var fecha_ulti_moni_milisegundos = date_ulti.getTime();

    var date_now = new Date()

    var fecha_now_milisegundos = date_now.getTime();

    var diferencia_time = fecha_now_milisegundos - fecha_ulti_moni_milisegundos

    var convert_diferencia_from_minutes = Math.floor((diferencia_time / 1000 / 60) << 0)

    //console.log("minutos trascurridos " + convert_diferencia_from_minutes)
    var bandera = 1


    if (convert_diferencia_from_minutes < 1) {
        bandera = 1 /**esta transmitiendo**/
    } else if (convert_diferencia_from_minutes > 1 && convert_diferencia_from_minutes < 5) {
        bandera = 2 /**recientemente dejo de transmitir**/
    } else {
        bandera = 3 /** no  atransmitiendo en mucho tiempo**/
    }

    return bandera;

}

let rastreo = () => {

    var json_body = {
        db_name: "uambatena",
        script: "select M.CodiVehiMoni,M.PlacVehiMoni,M.AlarFuerRutaMoni,M.AlarAnteGPSDescMoni,M.EvenAnteGPSConeMoni,M.EvenAlimBateExteMoni,M.Odometro,M.EstaSaliMoni,M.UltiFechMoni,M.UltiLugaMoni,M.UltiLatiMoni,M.UltiLongMoni,M.UltiRumbMoni,M.UltiVeloMoni from monitoreo as M join vehiculo as V on M.CodiVehiMoni = V.CodiVehi where V.idEstaVehi = 1 order by  CONVERT(M.CodiVehiMoni, SIGNED INTEGER)  ASC"
    }

    $.ajax({
        url: 'http://71.6.142.111/cgi-bin/HSrvUrbDataSet/query',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(json_body)
    }).done(function(json_result) {

        var json_string = JSON.stringify(json_result)
        var json_parse = JSON.parse(json_string)
            //console.log(json_parse)
        var dataset = json_parse.dataset
        if (json_parse.res[0].message == "OK") {
            if (dataset.length > 0) {
                panel_datos_html_rastreo = `<div class="class-info-bus">
                <input type="checkbox" name="checkbox-bus" for="checkbox-bus" checked=t rue>
                <label class="checkbox-bus" name="checkbox-bus" for="checkbox-bus">Todas las unidades</label>
            </div>`



                formatListRastreoUnidades();

                if (bandera_centrar_mapa) {
                    map.setCenter(new google.maps.LatLng(dataset[0].ultilatimoni, dataset[0].ultilongmoni))
                    map.setZoom(18)
                    bandera_centrar_mapa = false
                }





                createListRatreo_AndListHtml(dataset)

                //console.log(list_objs_unidades_monitoreo)
                document.getElementById("ul_unidades_rastreo").innerHTML = panel_datos_html_rastreo

            } else {
                alert("No existen unidades disponibles")
            }
        } else {

            alert(json_parse.res[0].message)
        }

    }).fail(function(error) {
        console.log(error)
    })
}



let rastreoLineaRuta = () => {

    var script = string_rastre_linea_ruta.substring(0, string_rastre_linea_ruta.length - OR_prefijo_sql.length)

    console.log("SCRIPT RASTERO LINEA " + script)

    var json_body = {
        db_name: "uambatena",
        script: script + validator_sql_active_vehiculo
    }

    $.ajax({
        url: 'http://71.6.142.111/cgi-bin/HSrvUrbDataSet/query',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(json_body)
    }).done(function(json_result) {

        var json_string = JSON.stringify(json_result)
        var json_parse = JSON.parse(json_string)
            //console.log(json_parse)
        var dataset = json_parse.dataset
        if (json_parse.res[0].message == "OK") {
            if (dataset.length > 0) {
                panel_datos_html_rastreo = `<div class="class-info-bus">
                <input type="checkbox" name="checkbox-bus" for="checkbox-bus" checked=t rue>
                <label class="checkbox-bus" name="checkbox-bus" for="checkbox-bus">Todas las unidades</label>
            </div>`



                formatListRastreoUnidades();

                if (bandera_centrar_mapa) {
                    map.setCenter(new google.maps.LatLng(dataset[0].ultilatimoni, dataset[0].ultilongmoni))
                    map.setZoom(18)
                    bandera_centrar_mapa = false
                }



                createListRatreo_AndListHtml(dataset)


                //console.log(list_objs_unidades_monitoreo)
                document.getElementById("ul_unidades_rastreo").innerHTML = panel_datos_html_rastreo

            } else {
                alert("No existen unidades disponibles")
            }
        } else {

            alert(json_parse.res[0].message)
        }

    }).fail(function(error) {
        console.log(error)
    })
}




function initRastreo() {



    interval_rastreo_monitoreo = setInterval(function() {
        rastreo()
    }, 10000);


    rastreo();
}


function createListRatreo_AndListHtml(dataset) {
    for (var j = 0; j < dataset.length; j++) {

        var posInfo = j

        //alert(posInfo)
        console.log(" ** " + posInfo)

        var contentString = `<strong>Unidad</strong> ${dataset[posInfo].codivehimoni}<br>
                    <strong>Placa :</strong> ${dataset[posInfo].placvehimoni}<br>
                    <strong>Fecha : </strong>${dataset[posInfo].ultifechmoni}<br>
                    <strong>Posición : </strong>${dataset[posInfo].ultilatimoni} ${dataset[posInfo].ultilongmoni}<br>
                    <strong>Velo : </strong>${dataset[posInfo].ultivelomoni} km/h`


        var infowindow = new google.maps.InfoWindow({
            content: contentString,
        });





        var bandera_time_trasmicion = is_transmitiendo(dataset[posInfo].ultifechmoni)



        marker_ = new google.maps.Marker({
            position: new google.maps.LatLng(parseFloat(dataset[posInfo].ultilatimoni),
                parseFloat(dataset[posInfo].ultilongmoni)),
            title: `${dataset[posInfo].codivehimoni}`,
            icon: get_image_marker(bandera_time_trasmicion, dataset[posInfo].ultivelomoni, dataset[posInfo].alarfuerrutamoni, ) /*"../public/assets/images/monitoreo/bus_online.svg"*/
        })





        // Add info window to marker    
        google.maps.event.addListener(marker_, 'click', (function(marker, posInfo) {
            return function() {
                console.log(dataset[posInfo].codivehimoni)
                list_objs_unidades_monitoreo[posInfo].infowindow.open({
                    anchor: list_objs_unidades_monitoreo[posInfo].marker,
                    map,
                    position: list_objs_unidades_monitoreo[posInfo].marker.getPosition()
                });
            }
        })(marker_, posInfo));




        var check = validador_check_unidad(dataset[posInfo].codivehimoni)
            //console.log(check)
        var obj_uni_monit = {
            checked: check,
            codivehimoni: dataset[posInfo].codivehimoni,
            placvehimoni: dataset[posInfo].placvehimoni,
            alarfuerrutamoni: dataset[posInfo].alarfuerrutamoni,
            alarantegpsdescmoni: dataset[posInfo].alarantegpsdescmoni,
            evenantegpsconemoni: dataset[posInfo].evenantegpsconemoni,
            evenalimbateextemoni: dataset[posInfo].evenalimbateextemoni,
            odometro: dataset[posInfo].odometro,
            estasalimoni: dataset[posInfo].estasalimoni,
            ultifechmoni: dataset[posInfo].ultifechmoni,
            ultilugamoni: dataset[posInfo].ultilugamoni,
            ultilatimoni: dataset[posInfo].ultilatimoni,
            ultilongmoni: dataset[posInfo].ultilongmoni,
            ultirumbmoni: dataset[posInfo].ultirumbmoni,
            ultivelomoni: dataset[posInfo].ultivelomoni,
            marker: marker_,
            infowindow: infowindow
        }


        list_objs_unidades_monitoreo[posInfo] = obj_uni_monit
        list_objs_unidades_monitoreo[posInfo].marker.setMap(map)

        var span_html = ""

        if (bandera_time_trasmicion == 1) {
            span_html = `<span class="badge badge-pill badge-success">OnLine</span>`
        } else {
            if (dataset[posInfo].alarantegpsdescmoni != null &&
                !dataset[posInfo].alarantegpsdescmoni) /**Equipo con o sin posicion GPS**/ {
                span_html = `<span class="badge badge-pill badge-danger">Sin GPS</span>`
            } else {
                span_html = `<span class="badge badge-pill badge-success">OnLine</span>`
            }
        }

        panel_datos_html_rastreo += `<li class="li-bus" unidad = "${dataset[posInfo].codivehimoni}">
                    <div class="class-info-bus">
                        <input class="check_unidad_rastreo" type="checkbox" unidad_check = "${dataset[posInfo].codivehimoni}"  checked="${dataset[posInfo].checked}" name="checkbox-bus" for="checkbox-bus">
                        <label class="checkbox-bus" name="checkbox-bus" for="checkbox-bus">${dataset[posInfo].codivehimoni} - ${dataset[posInfo].placvehimoni.toUpperCase()}</label>
                    </div>
                    ${span_html}</li>`
    }
}


function get_image_marker(bandera_time_trasmicion_, velo, in_ruta, is_encendido, alar_ante_gps) {
    /**alar_ante_gps -> si es false significa que no tiene posicion valida del gps**/

    if (is_encendido == null || is_encendido) {
        if (alar_ante_gps != null && !alar_ante_gps) {
            return { url: "../public/assets/images/monitoreo/autobus_alerta.png", }
        } else {
            if (in_ruta != null && !in_ruta) {
                return { url: "../public/assets/images/monitoreo/autobus_fuera_ruta.png", }
            } else {
                if (velo == 0) {
                    return { url: "../public/assets/images/monitoreo/autobus_detenido.png", }
                } else {

                    if (bandera_time_trasmicion_ == 1) {
                        return { url: "../public/assets/images/monitoreo/autobus_online.png", }
                    } else if (bandera_time_trasmicion_ >= 2 && bandera_time_trasmicion_ <= 80) {
                        return { url: "../public/assets/images/monitoreo/autobus_detenido_now.png", }
                    } else {
                        return { url: "../public/assets/images/monitoreo/autobus_detenido_full.png", }
                    }
                }
            }

            return { url: "../public/assets/images/monitoreo/autobus_encendido.png", }
        }
    } else {
        return { url: "../public/assets/images/monitoreo/autobus_apagado.png", }
    }




}

function initRastreoForLineaRuta() {

    interval_rastreo_monitoreo_linea_ruta = setInterval(function() {
        rastreoLineaRuta()
    }, 10000);

    rastreoLineaRuta();

}


$(document).on("change", ".check_unidad_rastreo", function() {
    var element = $(this)[0]
    var unidad = element.attributes[2].value
    console.log(element)

    var pos = buscar_unidad(unidad)

    if (!pos) {
        element.checked ? list_objs_controles[pos].checked = true : list_objs_controles[pos].checked = false
        element.checked ? element.checked = true : element.checked = false
    } else {
        list_objs_controles[pos].checked = true
    }


})


$(document).on("click", ".li-bus", function() {
    var element = $(this)
    var unidad = element[0].attributes[1].value

    var obj_unidad = null
    for (var i = 0; i < list_objs_unidades_monitoreo.length; i++) {
        if (list_objs_unidades_monitoreo[i].codivehimoni == unidad) {
            /**center mapa**/

            map.setCenter(new google.maps.LatLng(list_objs_unidades_monitoreo[i].ultilatimoni,
                list_objs_unidades_monitoreo[i].ultilongmoni))
            map.setZoom(18)

            list_objs_unidades_monitoreo[i].infowindow.open({
                anchor: list_objs_unidades_monitoreo[i].marker,
                map,
                position: new google.maps.LatLng(list_objs_unidades_monitoreo[i].ultilatimoni,
                    list_objs_unidades_monitoreo[i].ultilongmoni)
            })
            return;
        }
    }

})


$(document).on("click", ".li-geocerca", function() {
    var element = $(this)
    var geocerca = element[0].attributes[1].value


    for (var i = 0; i < list_objs_controles.length; i++) {
        if (list_objs_controles[i].codictrl == geocerca) {
            /**center mapa**/

            map.setCenter(new google.maps.LatLng(list_objs_controles[i].lati1ctrl,
                list_objs_controles[i].long1ctrl))
            map.setZoom(18)

        }
    }
})


$(document).on("change", ".check_linea_ruta_", function() {
    /*if (interval_rastreo_monitoreo != null) {
        formatListRastreoUnidades()
        clearInterval(interval_rastreo_monitoreo)

    }*/



    var checked_ = $(this)[0]
    console.log(checked_)
    var element = $(this)[0].parentNode.parentNode.attributes

    if (interval_rastreo_monitoreo != null) {
        clearInterval(interval_rastreo_monitoreo)
    }

    var add = "M.LetrRutaMoni = '" + element[1].value + "'" + OR_prefijo_sql



    if (checked_.checked == true) {
        if (string_rastre_linea_ruta.search(element[1].value) == -1) {
            string_rastre_linea_ruta += add
            console.log(string_rastre_linea_ruta)
            clearInterval(interval_rastreo_monitoreo_linea_ruta)
            initRastreoForLineaRuta()
        }
    } else {

        var strinaxu = string_rastre_linea_ruta.replace(add, "")
        string_rastre_linea_ruta = strinaxu
        console.log("FALSE : " + strinaxu)
        verificar_checks_in_list_lineas()
    }


})




let initTrazoRuta = () => {

    var json_body = {
        db_name: "uambatena",
        script: "select T.idTram,T.Lati1Tram,T.Long1Tram,T.Lati2Tram,T.Long2Tram,T.AnchTram from tramos as T"
    }


    $.ajax({
        url: 'http://71.6.142.111/cgi-bin/HSrvUrbDataSet/query',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(json_body)
    }).done(function(json) {
        var json_string = JSON.stringify(json)
        var json_parse = JSON.parse(json_string)
        console.log(json_parse)
        var dataset = json_parse.dataset
        if (json_parse.res[0].message == "OK") {
            var polylines_list = []




            for (var i = 0; i < dataset.length; i++) {
                var obj1 = { lat: parseFloat(dataset[i].lati1tram), lng: parseFloat(dataset[i].long1tram) }

                var obj2 = { lat: parseFloat(dataset[i].lati2tram), lng: parseFloat(dataset[i].long2tram) }

                polylines_list[0] = obj1
                polylines_list[1] = obj2

                var flightPath = new google.maps.Polyline({
                    path: polylines_list,
                    strokeColor: '#085FDC',
                    strokeOpacity: 0.5,
                    fillColor: '#085FDC',
                    fillOpacity: 0.5,
                    draggable: false,
                    geodesic: false,
                    strokeWeight: dataset[i].anchtram,
                });

                flightPath.setMap(map);




            }



        } else {
            alert("Sin datos de trazo rutas")
        }

    }).fail(function(error) {
        console.log(error)
        alert("error trazo ruta")
    })
}


let initGeocerca = () => {
    var json_body = {
        db_name: "uambatena",
        script: "select C.CodiCtrl,C.DescCtrl,C.Lati1Ctrl,C.Long1Ctrl,C.Lati2Ctrl,C.Long2Ctrl,C.RadiCtrl from controles as C where C.EstaCtrl = 1;"
    }


    $.ajax({
        url: 'http://71.6.142.111/cgi-bin/HSrvUrbDataSet/query',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(json_body)
    }).done(function(json) {
        var json_string = JSON.stringify(json)
        var json_parse = JSON.parse(json_string)
        console.log(json_parse)
        var dataset_ = json_parse.dataset
        if (json_parse.res[0].message == "OK") {

            for (var i = 0; i < dataset_.length; i++) {

                var bounds = null

                if (dataset_[i].long2ctrl > dataset_[i].long1ctrl) {
                    bounds = {

                        north: dataset_[i].lati1ctrl,
                        south: dataset_[i].lati2ctrl,
                        east: dataset_[i].long2ctrl,
                        west: dataset_[i].long1ctrl

                    }
                } else {
                    bounds = {

                        north: dataset_[i].lati1ctrl,
                        south: dataset_[i].lati2ctrl,
                        east: dataset_[i].long1ctrl,
                        west: dataset_[i].long2ctrl

                    }
                }

                var rectangle = new google.maps.Rectangle({
                    strokeColor: "#FF0000",
                    strokeOpacity: 0.8,
                    strokeWeight: dataset_[i].radictrl > 10 ? (dataset_[i].radictrl / 10) : dataset_[i].radictrl,
                    fillColor: "#FF0000",
                    fillOpacity: 0.35,
                    map,
                    bounds: bounds,
                });


                var obj_control = {
                    codictrl: dataset_[i].codictrl,
                    descctrl: dataset_[i].descctrl,
                    lati1ctrl: dataset_[i].lati1ctrl,
                    long1ctrl: dataset_[i].long1ctrl,
                    lati2ctrl: dataset_[i].lati2ctrl,
                    long2ctrl: dataset_[i].long2ctrl,
                    radictrl: dataset_[i].radictrl,
                    rectangle: rectangle
                }

                list_objs_controles[i] = obj_control

                panel_datos_html_geocerca += `<li class="li-geocerca" geocerca="${obj_control.codictrl}">
                <div class="class-info-bus">
                    <label class="checkbox-bus" name="checkbox-bus " for="checkbox-bus ">${obj_control.descctrl.substring(0,18)}</label>
                </div>

                <div class="group-btn-edit-delete-cercas ">
                    <i class="btn-edit-geocerca fa fa-edit "></i>
                    <i class="btn-delete-geocerca fa fa-trash-o "></i>
                </div>
               
            </li>`

            }

            document.getElementById("ul_geocercas_rastreo").innerHTML = panel_datos_html_geocerca

        } else {
            alert("Sin datos de geocercas")
        }

    }).fail(function(error) {
        console.log(error)
        alert("error geocercas")
    })
}

/**Verificar si existe al menos un check activo -> sino se detinene el interval rastreo linea e iniciar el rastreo normal**/
function verificar_checks_in_list_lineas() {
    var list = document.getElementById("ul_lineas_rutas");
    var bandera = 0

    for (var i = 0; i < list.children.length; i++) {
        console.log(" - " + i + " - " +
            list.children[i].children[0].children[0].checked)
        if (list.children[i].children[0].children[0].checked == true) {
            bandera = 1
        }
    }


    if (bandera == 0) {
        if (interval_rastreo_monitoreo_linea_ruta != null) {
            console.log("init rastreo normal")
            clearInterval(interval_rastreo_monitoreo_linea_ruta)
            initRastreo();
            return;
        } else {
            console.log("interval_rastreo_monitoreo_linea_ruta is null")
        }

    }

}


function formatListRastreoUnidades() {
    for (var i = 0; i < list_objs_unidades_monitoreo.length; i++) {
        list_objs_unidades_monitoreo[i].marker.setMap(null)
    }

    list_objs_unidades_monitoreo = []
}

function buscar_unidad(unidad) {
    var pos_unidad_encontrda = null

    for (var i = 0; i < list_objs_unidades_monitoreo.length; i++) {
        if (unidad == list_objs_unidades_monitoreo[i].codivehimoni) /**encontrado**/ {
            /**se debe actualizar**/

            pos_unidad_encontrda = i;

            i = (list_objs_unidades_monitoreo.length + 10)
        }
    }

    return pos_unidad_encontrda

}

function validador_check_unidad(unidad) {
    var check = true

    var pos = buscar_unidad(unidad)

    if (pos != null) {
        var ch = list_objs_controles[pos].checked
        console.log("ch " + ch)
        return ch
    }

    return check

}


function update(obj) {

    var bandera = false;

    for (var i = 0; i < list_objs_unidades_monitoreo.length; i++) {
        if (obj.codivehimoni == list_objs_unidades_monitoreo[i].codivehimoni) /**encontrado**/ {
            /**se debe actualizar**/
            console.log("update " + obj.codivehimoni)
            list_objs_unidades_monitoreo[i] = obj
            list_objs_unidades_monitoreo[i].marker
                .setPosition(new google.maps.LatLng(-34, 151))
            bandera = true;
            i = (list_objs_unidades_monitoreo.length + 10)
        }
    }

    if (!bandera) { console.log("agregado") }
    return bandera

}



let lineas = () => {

    var json_body = {
        db_name: "uambatena",
        script: "select R.idRuta,R.DescRuta,R.LetrRuta,R.HoraInicSaliProgRuta,R.HoraFinaSaliProgRuta from ruta as R where R.ActiRuta = 1"
    }

    /**
     * 
     *             "idruta": 1,
            "descruta": "JOYA CAMAL",
            "letrruta": "JO",
            "horainicsaliprogruta": "05:00:00.000",
            "horafinasaliprogruta": "23:59:00.000"
     * **/

    $.ajax({
        url: 'http://71.6.142.111/cgi-bin/HSrvUrbDataSet/query',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(json_body)
    }).done(function(json) {
        var json_string = JSON.stringify(json)
        var json_parse = JSON.parse(json_string)
        console.log(json_parse)
        var dataset = json_parse.dataset
        if (json_parse.res[0].message == "OK") {


            for (var i = 0; i < dataset.length; i++) {
                var linea = {
                    idruta: dataset[i].idruta,
                    descruta: dataset[i].descruta,
                    letrruta: dataset[i].letrruta,
                    horainicsaliprogruta: dataset[i].horainicsaliprogruta,
                    horafinasaliprogruta: dataset[i].horafinasaliprogruta
                }

                list_objs_lineas[i] = (linea)



                panel_datos_html_lineas_rutas += `<li class="li_linea_ruta" linea_ruta_check = "${list_objs_lineas[i].letrruta}">
                <div class="class-info-bus">
                    <input class="check_linea_ruta_" type="checkbox" unidad_check = "${list_objs_lineas[i].letrruta}" name="checkbox-bus" for="check_linea_ruta">
                    <label class="check_linea_ruta" name="check_linea_ruta" for="check_linea_ruta">${list_objs_lineas[i].descruta.substring(0,25).toUpperCase()}</label>
                </div>
                </li>`

            }

            document.getElementById("ul_lineas_rutas").innerHTML = panel_datos_html_lineas_rutas

        } else {
            alert("Sin datos de lineas")
        }

    }).fail(function(error) {
        console.log(error)
        alert("error en lineas")
    })
}




initReloj()


initGeocerca()

//initTrazoRuta()

initRastreo()

lineas()