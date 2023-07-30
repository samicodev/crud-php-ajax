<script type="text/javascript" src="../js/usuario.js?rev=<?php echo time(); ?>"></script>
<div class="col-md-12">
  <div class="box box-warning box-solid">
    <div class="box-header with-border">
      <h3 class="box-title">BIENVENIDO AL CONTENIDO DEL USUARIO</h3>
      <div class="box-tools pull-right">
        <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i>
        </button>
      </div>

    </div>

    <div class="box-body">
      <div class="form-group">
        <div class="col-lg-10">
          <div class="input-group">
            <input type="text" class="global_filter form-control" id="global_filter" placeholder="Ingresa los datos a buscar">
            <span class="input-group-addon"><i class="fa fa-search"></i></span>
          </div>
        </div>
        <div class="col-lg-2">
          <button class="btn btn-success" style="width:100%" onclick="AbrirModalRegistro()"><i class="glyphicon glyphicon-plus"></i>Nuevo Registro</button>
        </div>
      </div>
        <div class="box-body">
          <table id="tabla_usuario" class="display responsive nowrap" style="width:100%">
          <thead>
            <tr>
              <th>#</th>
              <th>Usuario</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Sexo</th>
              <th>Estatus</th>
              <th>Acci&oacute;n</th>
            </tr>
          </thead>
          <tfoot>
            <tr>
              <th>#</th>
              <th>Usuario</th>              
              <th>Email</th>
              <th>Rol</th>
              <th>Sexo</th>
              <th>Estatus</th>
              <th>Acci&oacute;n</th>
            </tr>
          </tfoot>
          </table>
      </div>
    </div>
  </div>
</div>

<!-- Modal Registro -->
<form autocomplete="off" onsubmit="return false">
  <div class="modal fade" id="modal_registro" role="dialog">
    <div class="modal-dialog modal-sm">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">Registro de usuario</h4>
        </div>
        <div class="modal-body">
          <div class="col-lg-12">
            <label for="">Usuario</label>
            <input type="text" class="form-control" id="txt_usu" placeholder="Escriba su usuario"><br>
          </div>
          <div class="col-lg-12">
            <label for="">Email</label>
            <input type="email" class="form-control" id="txt_email" placeholder="Escriba su correo electronico">
            <label for="" id="emailOK" style="color:red"></label>
            <input type="hidden" id="validar_email">
          </div>
          <div class="col-lg-12">
            <label for="">Contraseña</label>
            <input type="password" class="form-control" id="txt_con1" placeholder="Escriba su contraseña"><br>
          </div>
          <div class="col-lg-12">
            <label for="">Repita su Contraseña</label>
            <input type="password" class="form-control" id="txt_con2" placeholder="Repita su contraseña"><br>
          </div>
          <div class="col-lg-12">
            <label for="">Sexo</label>
            <select class="js-example-basic-single" name="state" style="width: 100%;" id="cbm_sexo">
            <option value="M">MASCULINO</option>
            <option value="F">FEMENINO</option>
            </select><br><br>
          </div>
          <div class="col-lg-12">
            <label for="">Rol</label>
            <select class="js-example-basic-single" name="state" style="width: 100%;" id="cbm_rol">
            </select><br><br>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" onclick="Registrar_Usuario()"> <i class="fa fa-check"></i>&nbsp; Registrar</button>
          <button type="button" class="btn btn-danger" data-dismiss="modal"> <i class="fa fa-close"></i>&nbsp; Cerrar</button>
        </div>
      </div>
    </div>
  </div>
</form>

<!-- Modal Editar -->
<form autocomplete="off" onsubmit="return false">
  <div class="modal fade" id="modal_editar" role="dialog">
    <div class="modal-dialog modal-sm">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">Editar datos del usuario</h4>
        </div>
        <div class="modal-body">
          <div class="col-lg-12">
            <input type="hidden" id="txtidusuario">
            <label for="">Usuario</label>
            <input type="text" class="form-control" id="txtusu_editar" placeholder="Escriba su usuario" disabled><br>
          </div>
          <div class="col-lg-12">
            <label for="">Email</label>
            <input type="email" class="form-control" id="txt_email_editar" placeholder="Escriba su correo electronico">
            <label for="" id="emailOK_editar" style="color:red"></label>
            <input type="hidden" id="validar_email_editar">
          </div>
          <div class="col-lg-12">
            <label for="">Sexo</label>
            <select class="js-example-basic-single" name="state" style="width: 100%;" id="cbm_sexo_editar">
            <option value="M">MASCULINO</option>
            <option value="F">FEMENINO</option>
            </select><br><br>
          </div>
          <div class="col-lg-12">
            <label for="">Rol</label>
            <select class="js-example-basic-single" name="state" style="width: 100%;" id="cbm_rol_editar">
            </select><br><br>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" onclick="Modificar_Usuario()"> <i class="fa fa-check"></i>&nbsp; Modificar</button>
          <button type="button" class="btn btn-danger" data-dismiss="modal"> <i class="fa fa-close"></i>&nbsp; Cerrar</button>
        </div>
      </div>
    </div>
  </div>
</form>

<script>
  $(document).ready(function(){
    listar_usuario();
    $('.js-example-basic-single').select2();
    listar_combo_rol();
    $("#modal_registro").on('shown.bs.modal',function(){
      $("#txt_usu").focus();
    })
  });

  
document.getElementById('txt_email').addEventListener('input', function() {
    campo = event.target;   
    emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
    if(emailRegex.test(campo.value)){
      $(this).css("border","");
      $("#emailOK").html("");
      $("#validar_email").val("correcto");
    }else{
      $(this).css("border","1px solid red");
      $("#emailOK").html("Email incorrecto");
      $("#validar_email").val("incorrecto");
    }

});

document.getElementById('txt_email_editar').addEventListener('input', function() {
    campo = event.target;   
    emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
    if(emailRegex.test(campo.value)){
      $(this).css("border","");
      $("#emailOK_editar").html("");
      $("#validar_email_editar").val("correcto");
    }else{
      $(this).css("border","1px solid red");
      $("#emailOK_editar").html("Email incorrecto");
      $("#validar_email_editar").val("incorrecto");
    }

});
</script>