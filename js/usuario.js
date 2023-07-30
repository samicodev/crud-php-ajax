function VerificarUsuario(){
  var usu = $("#txt_usu").val();
  var con = $("#txt_con").val();


  if(usu.length==0 || usu.length==0){
    return Swal.fire("Mensaje De Advertencia","Llene los campos ","warning")
  }

  $.ajax({
    url:'../controlador/usuario/controlador_verificar_usuario.php',
    type:'POST',
    data:{
      user:usu,
      pass:con
    }
  }).done(function(resp){
    if(resp==0){
      $.ajax({
        url:'../controlador/usuario/controlador_intento_modificar.php',
        type:'POST',
        data:{
          usuario:usu
        }
      }).done(function(resp){
        if(resp==2){
          Swal.fire("Mensaje De Advertencia", 'Usuario y/o Contraseña Incorrectos, Intentos fallidos: '+(parseInt(resp)+1)+' Para poder acceder a su cuenta restablesca su contraseña', 'warning');
        }else{
          Swal.fire("Mensaje De Advertencia", 'Usuario y/o Contraseña Incorrectos, Intentos fallidos: '+(parseInt(resp)+1)+'', 'warning');
        }
      })
    }else{
      var data = JSON.parse(resp);
      if(data[0][5]==='INACTIVO'){
        return Swal.fire("Mensaje De Advertencia", 'Lo sentimos el usuario '+usu+' se encuentra suspendido', 'warning');
      }

      if(data[0][7]==2){
        return Swal.fire("Mensaje De Advertencia", 'Lo sentimos su cuenta se encuentra suspendido, Restablesca su contraseña', 'warning');
      }
      
      $.ajax({
        url:'../controlador/usuario/controlador_crear_session.php',
        type:'POST',
        data:{
          idusuario:data[0][0],
          user:data[0][1],
          rol:data[0][6]
        }
      }).done(function(resp){
        let timerInterval
        Swal.fire({
        title: 'BIENVENIDO AL SISTEMA',
        html: 'Usted sera redireccionado en <b></b> milliseconds.',
        timer: 2000,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading()
          const b = Swal.getHtmlContainer().querySelector('b')
          timerInterval = setInterval(() => {
            b.textContent = Swal.getTimerLeft()
          }, 100)
        },
        willClose: () => {
          clearInterval(timerInterval)
        }
        }).then((result) => {
        /* Read more about handling dismissals below */
        if (result.dismiss === Swal.DismissReason.timer) {
          location.reload();
        }
        })
      })
    }
  })
}

var table
function listar_usuario(){
    table = $("#tabla_usuario").DataTable({
     "ordering":false,
     "paging": false,
     "searching": { "regex": true },
     "lengthMenu": [ [10, 25, 50, 100, -1], [10, 25, 50, 100, "All"] ],
     "pageLength": 100,
     "destroy":true,
     "async": false ,
     "processing": true,
     "ajax":{
         "url":"../controlador/usuario/controlador_usuario_listar.php",
         type:'POST'
     },
     "columns":[
        {"data":"posicion"},
        {"data":"usu_nombre"},
        {"data":"usu_email"},
        {"data":"rol_nombre"},
        {"data":"usu_sexo",
         render: function (data, type, row ) {
             if(data=='M'){
                 return "MASCULINO";                   
             }else{
               return "FEMENINO";                 
             }
           }
         },
         {"data":"usu_estatus",
         render: function (data, type, row ) {
             if(data=='ACTIVO'){
                 return "<span class='label label-success'>"+data+"</span>";                   
             }else{
               return "<span class='label label-danger'>"+data+"</span>";                 
             }
           }
         },   
         {"defaultContent":"<button style='font-size:13px;' type='button' class='editar btn btn-primary'><i class='fa fa-edit'></i></button>&nbsp;<button style='font-size:13px;' type='button' class='desactivar btn btn-danger'><i class='fa fa-trash'></i></button>&nbsp;<button style='font-size:13px;' type='button' class='activar btn btn-success'><i class='fa fa-check'></i></button>"}
     ],

     "language":idioma_espanol,
     select: true
 });

    document.getElementById("tabla_usuario_filter").style.display = "none";

    $('input.global_filter').on( 'keyup click', function () {
      filterGlobal();
    } );
    $('input.column_filter').on( 'keyup click', function () {
      filterColumn( $(this).parents('tr').attr('data-column') );
    });

}

$("#tabla_usuario").on('click','.desactivar',function(){
  var data = table.row($(this).parents('tr')).data();
  if(table.row(this).child.isShown()){
    var data = table.row(this).data();
  }
  Swal.fire({
    title: 'Estas seguro de desactivar al ususario?',
    text: "Una vez hecho esto el usuario no tendra acceso al sistema",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, Eliminar!'
  }).then((result) => {
    if (result.isConfirmed) {
      Modificar_estatus(data.usu_id,'INACTIVO');
    }
  })
})

$("#tabla_usuario").on('click','.editar',function(){
  var data = table.row($(this).parents('tr')).data();
  if(table.row(this).child.isShown()){
    var data = table.row(this).data();
  }
  $("#modal_editar").modal({backdrop:'static',keyboard:false});
  $("#modal_editar").modal('show');
  $("#txtidusuario").val(data.usu_id);
  $("#txtusu_editar").val(data.usu_nombre);
  $("#txt_email_editar").val(data.usu_email);
  $("#cbm_sexo_editar").val(data.usu_sexo).trigger("change");
  $("#cbm_rol_editar").val(data.rol_id).trigger("change");/*  */
})

$("#tabla_usuario").on('click','.activar',function(){
  var data = table.row($(this).parents('tr')).data();
  if(table.row(this).child.isShown()){
    var data = table.row(this).data();
  }
  Swal.fire({
    title: 'Estas seguro de activar al ususario?',
    text: "Una vez hecho esto el usuario tendra acceso al sistema",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, Activar!'
  }).then((result) => {
    if (result.isConfirmed) {
      Modificar_estatus(data.usu_id,'ACTIVO');
    }
  })
})

function Modificar_estatus(idusuario,estatus){
  var mensaje = ""
  if(estatus=='INACTIVO'){
    mensaje='desactivo';
  }else{
    mensaje='activo';
  }
  $.ajax({
    "url":"../controlador/usuario/controlador_modificar_estatus_usuario.php",
    type:'POST',
    data:{
      idusuario:idusuario,
      estatus:estatus
    }
  }).done(function(resp){
    if(resp>0){
      Swal.fire("Mensaje De Confirmacion","El usuario se "+mensaje+" con exito","success")
      .then((value)=>{
        table.ajax.reload();
      });
    }
  })
}

function filterGlobal() {
  $('#tabla_usuario').DataTable().search(
      $('#global_filter').val(),
  ).draw();
}

function AbrirModalRegistro(){
  $("#modal_registro").modal({backdrop:'static',keyboard:false});
  $("#modal_registro").modal('show');
}

function listar_combo_rol(){
  $.ajax({
    "url":"../controlador/usuario/controlador_combo_rol_listar.php",
    type:'POST'
  }).done(function(resp){
    var data = JSON.parse(resp);
    var cadena = "";
    if(data.length>0){
      for(var i=0;i<data.length; i++){
        cadena+="<option value='"+data[i][0]+"'>"+data[i][1]+"</option>";
      }
      $("#cbm_rol").html(cadena);
      $("#cbm_rol_editar").html(cadena);
    }else{
      cadena = "<option value=''>NO HAY REGISTROS</option>";
      $("#cbm_rol").html(cadena);/*  */
      $("#cbm_rol_editar").html(cadena);/*  */
    }
  })
}

function Registrar_Usuario(){
  var usu = $("#txt_usu").val();
  var contra = $("#txt_con1").val();
  var contra2 = $("#txt_con2").val();
  var sexo = $("#cbm_sexo").val();
  var rol = $("#cbm_rol").val();
  var email = $("#txt_email").val();
  var validaremail = $("#validar_email").val();
  if(usu.length==0||contra.length==0 || contra2.length==0||sexo.length==0||rol.length==0){
    return Swal.fire("Mensaje De Advertencia","Llene los campos ","warning");
  }

  if(contra != contra2){
    return Swal.fire("Mensaje De Advertencia","Las contraseñas deben coincidir","warning");
  }

  if(validaremail=="incorrecto"){
    return Swal.fire("Mensaje De Advertencia","Ingrese un formato de email correcto","warning");
  }

  $.ajax({
    "url":"../controlador/usuario/controlador_registro_usuario.php",
    type:'POST',
    data:{
      usuario:usu,
      contrasena:contra,
      sexo:sexo,
      rol:rol,
      email:email
    }
  }).done(function(resp){
    if(resp>0){
      if(resp==1){
        $("#modal_registro").modal('hide');
        Swal.fire("Mensaje De Confirmacion","Nuevo registro agregado","success")
        .then((value)=>{
          LimpiarRegistro();
          table.ajax.reload();
        });
      }else{
        return Swal.fire("Mensaje De Advertencia","El ususario se encuentra ocupado","warning");
      }
    }else{
      Swal.fire("Mensaje De Advertencia","No se pudo completar el registro","error")
    }
  })
}

function Modificar_Usuario(){
  var idusuario = $("#txtidusuario").val();
  var sexo = $("#cbm_sexo_editar").val();
  var rol = $("#cbm_rol_editar").val();
  var email = $("#txt_email_editar").val();
  var validaremail = $("#validar_email_editar").val();

  if(idusuario.length==0||sexo.length==0||rol.length==0){
    return Swal.fire("Mensaje De Advertencia","Llene los campos ","warning");
  }

  if(validaremail=="incorrecto"){
    return Swal.fire("Mensaje De Advertencia","Ingrese un formato de email correcto","warning");
  }

  $.ajax({
    "url":"../controlador/usuario/controlador_usuario_modificar.php",
    type:'POST',
    data:{
      idusuario:idusuario,
      sexo:sexo,
      rol:rol,
      email:email
    }
  }).done(function(resp){
    if(resp>0){
        TraerDatosUsuario();
        $("#modal_editar").modal('hide');
        Swal.fire("Mensaje De Confirmacion","Datos actulizados correctamente","success")
        .then((value)=>{
          table.ajax.reload();
        });
    }else{
      Swal.fire("Mensaje De Advertencia","No se pudo modificar el registro","error")
    }
  })
}

function LimpiarRegistro(){
  $('#txt_usu').val("");
  $('#txt_con1').val("");
  $('#txt_con2').val("");
}
/*====== PENDIENTE ======*/
function TraerDatosUsuario(){
  var usuario = $("#usuarioprincipal").val();
  $.ajax({
    "url":"../controlador/usuario/controlador_traerdatos_usuario.php",
    type:'POST',
    data:{
      usuario:usuario
    }
  }).done(function(resp){
    var data = JSON.parse(resp);
    if(data.length>0){
      $("#txtcontra_bd").val(data[0][2]);
      if(data[0][3]==="M"){
        $("#img_nav").attr("src","../plantilla/dist/img/avatar5.png");
        $("#img_subnav").attr("src","../plantilla/dist/img/avatar5.png");
        $("#img_lateral").attr("src","../plantilla/dist/img/avatar5.png");
      }else{
        $("#img_nav").attr("src","../plantilla/dist/img/avatar3.png");
        $("#img_subnav").attr("src","../plantilla/dist/img/avatar3.png");
        $("#img_lateral").attr("src","../plantilla/dist/img/avatar3.png");
      }
    }
  })
}

function AbrirModalEditarContra(){
  $("#modal_editar_contra").modal({backdrop:'static',keyboard:false});
  $("#modal_editar_contra").modal('show');
  $("#modal_editar_contra").on('shown.bs.modal',function(){
    $("#txtcontraactual_editar").focus();
  });
}

function Editar_Contra(){
  var idusuario = $("#txtidprincipal").val();
  var contrabd = $("#txtcontra_bd").val();
  var contraescrita = $("#txtcontraactual_editar").val();
  var contranu = $("#txtcontranu_editar").val();
  var contrare = $("#txtcontrare_editar").val();
  if(contraescrita.length==0 || contranu.length==0 || contrare.length==0){
    return Swal.fire("Mensaje De Advertencia","Llene todos los campos vacios","warning");
  }

  if(contranu != contrare){
    return Swal.fire("Mensaje De Advertencia","Debe repetir la misma contraseña nueva","warning");
  }

  $.ajax({
    url: '../controlador/usuario/controlador_contra_modificar.php',
    type: 'POST',
    data:{
      idusuario:idusuario,
      contrabd:contrabd,
      contraescrita:contraescrita,
      contranu:contranu
    }
  }).done(function(resp){
    if(resp>0){
      if(resp==1){
        $("#modal_editar_contra").modal('hide');
        LimpiarEditarContra();
        Swal.fire("Mensaje De Confirmacion","Contraseña Actualizada correctamente","success")
        .then((value)=>{
          TraerDatosUsuario();
        });
      }else{
        Swal.fire("Mensaje De Error","La contraseña no coincide con la base de datos","error")
      }
    }else{
      Swal.fire("Mensaje De Error","No se pudo actualizar la contraseña","error")
    }
  })
}

function LimpiarEditarContra(){
  $("#txtcontrare_editar").val("");
  $("#txtcontraactual_editar").val("");
  $("#txtcontranu_editar").val("");
}

function AbrirModalRestablecer(){
  $("#modal_restablecer_contra").modal({backdrop:'static',keyboard:false});
  $("#modal_restablecer_contra").modal('show');
  $("#modal_restablecer_contra").on('shown.bs.modal',function(){
    $("#txt_email").focus();
  });
}

function Restablecer_Contra(){
  var email = $("#txt_email").val();
  if(email.length==0){
    return Swal.fire("Mensaje De Advertencia", "Ingrese su correo electronico","warning");
  }
  var caracteres="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
  var contrasena = "";
  for(var i=0;i<6;i++){
    contrasena+=caracteres.charAt(Math.floor(Math.random()*caracteres.length));
  }
  $.ajax({
    url:"../controlador/usuario/controlador_restablecer_contra.php",
    type:"POST",
    data:{
      email:email,
      contrasena:contrasena
    }
  }).done(function(resp){
    if(resp>0){
      if(resp==1){
        Swal.fire("Mensaje De Confirmacion","Su contraseña fue restablecida con exito al correo: "+email+"","success")
      }else{
        Swal.fire("Mensaje De Advertencia","El correo ingresado no pertenece a ningun ususario","warning")

      }
    }else{
      Swal.fire("Mensaje De Error","No se pudo restablecer su contraseña", "error")
    }
  })
}
