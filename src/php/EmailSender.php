<?php
  $recipient = $_POST['recipient'];
  $sender = $_POST['sender'];
  $subject = $_POST['subject'];
  $content = $_POST['content'];

  $headers = array();

  $headers[] = "MIME-Version: 1.0";
  $headers[] = "Content-type:text/html;charset=iso-8859-1";
  $headers[] = "From:  $sender";
  $headers[] = "Reply-To: $sender";
  $headers[] = "X-Mailer: PHP/".phpversion();

  mail($recipient, $subject, $content, implode("\r\n", $headers));

?>