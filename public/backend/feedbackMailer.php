<?php
// hessg1 / 2019-04-28, based on
// http://webkompetenz.wikidot.com/html-handbuch:einfacher-formmailer-php


// ======= Konfiguration:

$mailTo = 'info@anakoda.ch';
$mailFrom = 'feedback';
$mailSubject    = 'Feedback';
$mailText = "";

// ======= Text der Mail aus den Formularfeldern erstellen:

// Wenn Daten mit method="post" versendet wurden:
if(isset($_POST)) {
  $mailSubject .= " (" . $_POST["page"] . ")";

  // Metadaten ausfüllen
  $mailText .= "{\n  \"meta\": {\n";
  $mailText .= "    \"userID\": \"" . $_POST["userID"] . "\",\n";
  $mailText .= "    \"date:\": \"" . date("Y-m-d-h:i:sa") . "\",\n";
  $mailText .= "    \"page:\": \"" . $_POST["page"] . "\"\n";
  $mailText .= "  },\n  \"feedback\": {\n";

  $i = 1;
   // alle Formularfelder der Reihe nach durchgehen:
   foreach($_POST as $name => $value) {
     if($name != "userID" && $name != "page"){
       // Wenn der Feldwert aus mehreren Werten besteht:
       if(is_array($value)) {
           $multiLineText = "";
           foreach($valueArray as $entry) {
              $multiLineText .= "   " . $value . "\\n";
           }
           $mailText .= "    \"" . $name . "\": \"" . $multiLineText . "\"";
       }

       // Wenn der Feldwert ein einzelner Feldwert ist:
       elseif($name == "rating"){
           $mailText .= "    \"" . $name . "\": "  . $value;
       }
       else{
         // Zeilenumbrüche entfernen
         $value = str_replace("\r", "", $value);
         $value = str_replace("\n", " \\n", $value);
         $mailText .= "    \"" . $name . "\": \"" . $value . "\"";
       }

       if($i < count($_POST)){
         $mailText .= ",\n";
       }
       else {
         // JSON korrekt abschliessen
         $mailText .= "\n  }\n}";
       }
     }
     $i++;
   }

   // ======= Mailversand

   // Mail versenden und Versanderfolg merken
   $mailSent = mail($mailTo, $mailSubject, $mailText, "From: ".$mailFrom);

   // ======= HTTP-Statuscode antworten

   // Wenn der Mailversand erfolgreich war:
   if($mailSent == TRUE) {
      header($_SERVER["SERVER_PROTOCOL"]." 200 OK",true, 200);
      //header('Access-Control-Allow-Origin: *'); //enable this for testing from localhost
      echo($mailText);
   }
   // Wenn die Mail nicht versendet werden konnte:
   else {
      header($_SERVER["SERVER_PROTOCOL"]." 400 Bad Request",true, 400);
      //header('Access-Control-Allow-Origin: *'); //enable this for testing from localhost
      echo('{"message": "some error occured, feedback not sent"}');
   }
}

exit();

?>
