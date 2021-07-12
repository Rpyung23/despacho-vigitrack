const ListGrupos = []
const ListEstadosVehiculos = []

const ListDispositivos = []

async function readGrupos() {

    var obj = {
        db_name: "uambatena",
        script: "select VG.id,VG.descripcion,VG.activo,VG.color,VG.color1,VG.color2 from vehiculo_grupo as VG where VG.activo = 1;"
    }


    return $.ajax({
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
                        activo: dataset_[i].activo,
                        color: dataset_[i].color,
                        color1: dataset_[i].color1,
                        color2: dataset_[i].color2
                    }

                    ListGrupos.push(obj)
                }
            } else {
                alert("Sin datos de geocercas")
            }


        }).fail(function(error) {
            console.log(error)
            alert("error read unidades")
        })
}


async function readEstadosVehiculos() {

    var obj = {
        db_name: "uambatena",
        script: "select EV.idEstaVehi,EV.DescEstaVehi from estadovehiculo as EV"
    }


    return $.ajax({
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
                        idestavehi: dataset_[i].idestavehi,
                        descestavehi: dataset_[i].descestavehi
                    }
                    ListEstadosVehiculos.push(obj)
                }
                console.log(ListEstadosVehiculos)
            } else {
                alert("Sin datos de geocercas")
            }


        }).fail(function(error) {
            console.log(error)
            alert("error read unidades")
        })
}


async function readDispositivos() {

    var obj = {
        db_name: "uambatena",
        script: "select DT.idDispTipo,DT.DescDispTipo from dispositivo_tipo as DT;"
    }


    return $.ajax({
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
                        iddisptipo: dataset_[i].iddisptipo,
                        descdisptipo: dataset_[i].descdisptipo
                    }

                    ListDispositivos.push(obj)
                }
            } else {
                alert("Sin datos de dispositivos tipo")
            }


        }).fail(function(error) {
            console.log(error)
            alert("error read dispositivos tipo")
        })
}