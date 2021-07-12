initReloj()

var html_tabla_unidades = ""
var ListUnidades = []

var table_unidades;

let id_unidad_table = ""


function readUnidades() {

    var obj = {
        "db_name": "uambatena",
        "script": "select V.CodiVehi,V.idTipoDispVehi,V.AutoDespVehi,V.AnotVehi,V.InfoCtrlVehi,V.CodiDispVehi,V.PlacVehi,V.NumeSIMVehi,V.idEstaVehi,V.grupo_id from vehiculo as V group by V.CodiVehi ASC"
    }


    $.ajax({
            url: getUrl(),
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },

            data: JSON.stringify(obj)
        })
        .done(function(datos) {
            var json_string = JSON.stringify(datos)
            var json_parse = JSON.parse(json_string)
            console.log(json_parse)



            if (json_parse.res[0].message == "OK") {
                var dataset_ = json_parse.dataset

                for (var i = 0; i < dataset_.length; i++) {
                    if (dataset_[i].codivehi != null && dataset_[i].codivehi.length > 0) {

                        var obj = {
                            codivehi: dataset_[i].codivehi,
                            codidispvehi: dataset_[i].codidispvehi,
                            autodespvehi: dataset_[i].autodespvehi,
                            placvehi: dataset_[i].placvehi,
                            numesimvehi: dataset_[i].numesimvehi,
                            idestavehi: dataset_[i].idestavehi,
                            idtipodispvehi: dataset_[i].idtipodispvehi,
                            idestavehidetalle: getEstadoString(dataset_[i].idestavehi),
                            grupoid: dataset_[i].grupoid,
                            anotvehi: dataset_[i].anotvehi,
                            grupoiddetalle: getGrupoString(dataset_[i].grupoid),
                            infoctrlvehi: dataset_[i].infoctrlvehi,
                            infoctrlvehidetalle: dataset_[i].infoctrlvehi ? 'Si' : 'No'
                        }

                        html_tabla_unidades += ` <tr id_unidad ="${obj.codivehi}">
                    <td>${obj.codivehi}</td>
                    <td>${obj.codidispvehi}</td>
                    <td>${obj.placvehi}</td>
                    <td>${obj.numesimvehi == null ? "" : obj.numesimvehi}</td>
                    <td>${obj.infoctrlvehi == 1 ? 'Si' : 'No'}</td>
                    <td>${getEstadoString(obj.idestavehi)}</td>
                    <td>${getGrupoString(obj.grupoId)}</td>
                    <td>
                    <div class="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups" style="display: flex;justify-content: flex-end;">

                        <div class="btn-group mr-2" role="group" aria-label="Second group">

                            <button type="button" class="btn btn-info btn-sm2"><i
                                class="ti-info-alt"
                                style="font-size: 1rem;"></i></button>
                            <button type="button" class="btn btn-primary btn-sm2"><i
                class="fa fa-edit"
                style="font-size: 1rem;"></i></button>
                            <button type="button" class="btn btn-danger btn-sm2"><i
                class="fa fa-trash-o"
                style="font-size: 1rem;"></i></button>

                        </div>

                    </div>
                </td>
                </tr>`

                        ListUnidades.push(obj)
                    }
                }



                table_unidades = $('#dataTable5').dataTable({
                    "data": ListUnidades,
                    "columns": [{
                        "data": "codivehi"
                    }, {
                        "data": "codidispvehi"
                    }, {
                        "data": "placvehi"
                    }, {
                        "data": "numesimvehi"
                    }, {
                        "data": "infoctrlvehidetalle"
                    }, {
                        "data": "idestavehidetalle"
                    }, {
                        "data": "grupoiddetalle"
                    }]
                })


                //$("#tbody_unidades").html(html_tabla_unidades)

            } else {
                alert("Sin datos de geocercas")
            }


        }).fail(function(error) {
            console.log(error)
            alert("error read unidades")
        })
}


function getUnidad(id) {
    for (var i = 0; i < ListUnidades.length; i++) {
        if (id == ListUnidades[i].codivehi) {
            return ListUnidades[i];
        }
    }
    return null;
}

function getEstadoString(id_estado) {
    for (var i = 0; i < ListEstadosVehiculos.length; i++) {
        if (id_estado == ListEstadosVehiculos[i].idestavehi) {
            return ListEstadosVehiculos[i].descestavehi
        }
    }
    return ""
}



function getGrupoString(id_grupo) {
    for (var i = 0; i < ListGrupos.length; i++) {
        if (id_grupo == ListGrupos[i].id) {
            return ListGrupos[i].descripcion
        }
    }
    return ""

}


function insertListGrupoHtml() {
    var spinner_grupos = `<option estado_id="${-11}">----------</option>`
        //console.log(ListGrupos)
    for (var i = 0; i < ListGrupos.length; i++) {
        spinner_grupos += `<option grupo_id="${ListGrupos[i].id}">${ListGrupos[i].descripcion}</option>`
    }

    /*console.log("size : " + ListGrupos.length)
    console.log(spinner_grupos)*/
    document.getElementById("select_grupos_add_vehiculo").innerHTML = spinner_grupos
    document.getElementById("select_grupos_editar_vehiculo").innerHTML = spinner_grupos
}


function insertListEstadoVehicularHtml() {
    var spinner_estado_vehicular = `<option estado_id="${-11}">----------</option>`
        //console.log(ListEstadosVehiculos)
    for (var i = 0; i < ListEstadosVehiculos.length; i++) {
        spinner_estado_vehicular += `<option estado_id="${ListEstadosVehiculos[i].idestavehi}">${ListEstadosVehiculos[i].descestavehi}</option>`
    }

    document.getElementById("id_estado_vehicular").innerHTML = spinner_estado_vehicular
    document.getElementById("id_editar_estado_vehicular").innerHTML = spinner_estado_vehicular
}


function insertListTiposDispositivosHtml() {
    var spinner_dispositivo = `<option dispositivo_id="${-11}">----------</option>`
        //console.log(ListDispositivos)
    for (var i = 0; i < ListDispositivos.length; i++) {
        spinner_dispositivo += `<option dispositivo_id="${ListDispositivos[i].iddisptipo}">${ListDispositivos[i].descdisptipo}</option>`
    }

    document.getElementById("id_tipos_dispositivos").innerHTML = spinner_dispositivo
    document.getElementById("id_editar_tipos_dispositivos").innerHTML = spinner_dispositivo
}


$('#dataTable5 tbody').on('click', 'tr', function() {
    if ($(this).hasClass('selected')) {
        $(this).removeClass('selected');
    } else {
        table_unidades.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');

        var elemtn = $(this)
        console.log(elemtn[0].children[0].outerText)

        id_unidad_table = elemtn[0].children[0].outerText
    }
});


$(document).on("click", "#btn_info_unidad", function() {

    if (id_unidad_table.length > 0) {
        $('#id_modal_more_information').modal({
            show: true
        })
    } else {
        info("Sin Unidad", "Por favor selecione una unidad,", "info")
    }
})


$(document).on("click", "#btn_edit_unidad", function()

    {
        if (id_unidad_table.length > 0) {



            var obj = getUnidad(id_unidad_table);
            console.log(obj)

            document.getElementById("id_editar_codigo_unidad").value = obj.codivehi
            document.getElementById("editarLabelUnidad").innerText = "Unidad " + obj.codivehi
            document.getElementById("id_editar_serie_unidad").value = obj.codidispvehi
            document.getElementById("id_editar_placa_unidad").value = obj.placvehi
            document.getElementById("id_editar_sim_unidad").value = obj.numesimvehi
            document.getElementById("id_editar_anotaciones").value = obj.anotvehi

            var sele_estado_vehi = document.getElementById("id_editar_estado_vehicular")
            var sele_dispositivo_vehi = document.getElementById("id_editar_tipos_dispositivos")
            var sele_grupos_vehi_ = document.getElementById("select_grupos_add_vehiculo")

            updateSelected(sele_estado_vehi, obj.idestavehi)
            updateSelected(sele_dispositivo_vehi, obj.idtipodispvehi)
            updateSelected(sele_grupos_vehi_, obj.grupoid)





            var bandera_info = obj.infoctrlvehi ? true : false
            var bandera_auto = obj.autodespvehi ? true : false

            document.getElementById("id_editar_check_informate").checked = bandera_info
            document.getElementById("id_editar_check_autodespacho").checked = bandera_auto

            $('#id_modal_editar_unidad').modal({
                show: true
            })

        } else {
            info("Sin Unidad", "Por favor selecione una unidad,", "info")
        }


    })


$(document).on("click", "#btn_delete_unidad", function() {
    if (id_unidad_table.length > 0) {
        delete_cancel(`Unidad ${id_unidad_table}`, "Esta seguro que desea elimnar esta unidad",
            "question", "Si,Elimnar", "Cancelar")
    } else {
        info("Sin Unidad", "Por favor selecione una unidad,", "info")
    }
})



$(document).on("click", "#grupos-tap", function() {
    console.log("click frecuencias tab")
    readGrupos()
})


$(document).on("click", "#save_update_unidad", function() {

    let unidades = []


    var id_estado_vehicular = id_updateSelected(document.getElementById("id_editar_estado_vehicular"))
    var id_dispositivo = id_updateSelected(document.getElementById("id_editar_tipos_dispositivos"))
    var id_grupo = id_updateSelected(document.getElementById("select_grupos_editar_vehiculo"))


    var check_info = document.getElementById("id_editar_check_informate")
    var check_auto = document.getElementById("id_editar_check_autodespacho")


    var unidad = document.getElementById("id_editar_codigo_unidad").value


    console.log("id_grupo : " + id_grupo)


    if (id_estado_vehicular < 0 && id_dispositivo < 0) {
        info("Unidad " + unidad, "Existen datos vacios.", "info")
        return;
    }

    var obj_unidad = {
        codivehi: unidad,
        codidispvehi: document.getElementById("id_editar_serie_unidad").value,
        placvehi: document.getElementById("id_editar_placa_unidad").value,
        numesimvehi: document.getElementById("id_editar_sim_unidad").value,
        idestavehi: (id_estado_vehicular).toString(),
        idtipodispvehi: id_dispositivo.toString(),
        grupo_id: id_grupo < 0 ? "0" : id_grupo.toString(),
        anotvehi: document.getElementById("id_editar_anotaciones").value,
        infoctrlvehi: check_info.checked ? "true" : "false"
    }




    unidades.push(obj_unidad)

    var obj = {
        "db_name": "uambatena",
        "table": "vehiculo",
        "dataset": unidades
    }

    var body_data = JSON.stringify(obj)


    console.log(body_data)
    console.log(obj)

    $.ajax({
        url: getUrlUpdate(),
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },

        data: body_data
    }).done(function(datos) {
        var json_string = JSON.stringify(datos)
        var json_parse = JSON.parse(json_string)
            /**089134**/
        console.log(datos)

        if (json_parse.res[0].value == "0") {

            info("Unidad " + 45, "Los datos han sido actualizados correctamente.", "success")
        } else {
            info("Unidad " + 45, "Los sentimos los datos no han sido actualizados", "error")
        }


    }).fail(function(error) {
        info("Error 404", error.message, "error")
    })

})

function updateSelected(element, valor) {
    var options = $(element)[0].options

    console.log(options)

    try {
        for (var i = 0; i <= options.length; i++) {
            if (options[i].attributes[0].value == valor) {
                element.options.item(i).selected = 'selected';
                i = options.length + 10
                return;
            }
        }
    } catch (error) {
        console.log(error)
        element.options.item(0).selected = 'selected';
    }
    element.options.item(0).selected = 'selected';
}


function id_updateSelected(element) {

    var opt = $(element)[0]
    return opt.options[opt.options.selectedIndex].attributes[0].value
}


/******************************************************* */


/**select all grupos**/
let ListaGruposComplete = []

function readGrupos() {

    var obj = {
        "db_name": "uambatena",
        "script": "select VG.id,VG.descripcion,VG.activo,VG.color,VG.color1,VG.color2 from vehiculo_grupo as VG"
    }


    $.ajax({
            url: getUrl(),
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },

            data: JSON.stringify(obj)
        })
        .done(function(datos) {
            var json_string = JSON.stringify(datos)
            var json_parse = JSON.parse(json_string)
            console.log(json_parse)



            if (json_parse.res[0].message == "OK") {
                var dataset_ = json_parse.dataset

                for (var i = 0; i < dataset_.length; i++) {
                    var obj = {
                        id: dataset_[i].id,
                        descripcion: dataset_[i].descripcion,
                        estado: dataset_[i].activo ? 1 : 0,
                        fondo: dataset_[i].color,
                        texto: dataset_[i].color1,
                        linea: dataset_[i].color2
                    }

                    ListaGruposComplete[i] = (obj)
                }


                initDynamicTableGrupos(ListaGruposComplete)

            } else {
                alert("Sin datos de geocercas")
            }


        }).fail(function(error) {
            console.log(error)
            alert("error read unidades")
        })
}



function initDynamicTableGrupos(datos) {

    $("#table-grupos").dynamicTable({
        columns: [{
                text: "Descripciòn",
                key: "descripciòn"
            },
            {
                text: "Estado",
                key: "estado"
            },
            {
                text: "Fondo",
                key: "fondo"
            },
            {
                text: "Texto",
                key: "texto"
            },
            {
                text: "Linea",
                key: "linea"
            },
        ],
        data: datos,
        buttons: {
            addButton: '<input type="button" value="Agregar" class="btn btn-primary" />',
            cancelButton: '<input type="button" value="Cancelar" class="btn btn-primary" />',
            deleteButton: '<input type="button" value="Eliminar" class="btn btn-danger" />',
            editButton: '<input type="button" value="Editar" class="btn btn-primary" />',
            saveButton: '<input id="btn_save_grupo_edit" type="button" value="Guardar" class="btn btn-success" />',
        },
        showActionColumn: true,
        getControl: function(columnKey) {
            if (columnKey == "estado") {
                return '<select class="form-control"><option value="1">Activo</option><option value="0">Inactivo</option></select>';
            }
            if (columnKey == "fondo") {
                return '<input type="color" class="form-control" style="height:2.5rem"/>';
            }

            if (columnKey == "texto") {
                return '<input type="color" class="form-control" style="height:2.5rem"/>';
            }

            if (columnKey == "linea") {
                return '<input type="color" class="form-control" style="height:2.5rem"/>';
            }

            return '<input type="text" class="form-control" />';
        }
    });
}


$(document).on("click", "#btn_save_grupo_edit", function() {
    alert("save edit")
    console.log($(this)[0].parentNode.parentNode);
})