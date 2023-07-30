<?php
$pass = password_hash('12345',PASSWORD_DEFAULT,['cost'=>12]);

echo $pass;
?>