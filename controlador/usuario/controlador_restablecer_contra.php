<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;


  require 'PHPMailer/src/Exception.php';
  require 'PHPMailer/src/PHPMailer.php';
  require 'PHPMailer/src/SMTP.php';
  
  require '../../modelo/modelo_usuario.php';

  $MU = new Modelo_Usuario();

  $email = htmlspecialchars($_POST['email'],ENT_QUOTES,'UTF-8');
  $contraactual = htmlspecialchars($_POST['contrasena'],ENT_QUOTES,'UTF-8');
  $contra = password_hash($_POST['contrasena'],PASSWORD_DEFAULT,['cost'=>10]);

  $consulta = $MU->Restablecer_Contra($email,$contra);
  if($consulta=="1"){
    //Create an instance; passing `true` enables exceptions
    $mail = new PHPMailer(true);

    try {
        $mail->SMTPOptions = array(
            'ssl' => array(
            'verify_peer' => false,
            'verify_peer_name' => false,
            'allow_self_signed' => true
            )
        );
        //Server settings
        $mail->SMTPDebug = 0;                      //Enable verbose debug output
        $mail->isSMTP();                                            //Send using SMTP
        $mail->Host       = 'smtp.gmail.com';                     //Set the SMTP server to send through
        $mail->SMTPAuth   = true;                                   //Enable SMTP authentication
        $mail->Username   = 'leo2000messie@gmail.com';                     //SMTP username
        $mail->Password   = 'zyvdbcqluinuturq';                               //SMTP password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;            //Enable implicit TLS encryption
        $mail->Port       = 465;                                    //TCP port to connect to; use 587 if you have set `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`

        //Recipients
        $mail->setFrom('leo2000messie@gmail.com', 'Leo');
        $mail->addAddress($email);     //Add a recipient
        //Attachments

        //Content
        $mail->isHTML(true);                                  //Set email format to HTML
        $mail->Subject = 'Restablecer Password';
        $mail->Body    = 'Su contraseña fue restablecida con exito!<br> Nueva Contraseña: '.$contraactual.'</b>';

        $mail->send();
        echo '1';
    } catch (Exception $e) {
        echo "0";
    }
  }else{
    echo '2';
  }
?>