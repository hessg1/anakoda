<!DOCTYPE html>
<html>
<head>
  <title>anakoda - MSG Tool</title>
  <meta charset="UTF-8" />
  <meta name="description" content="Part of the anakoda project, a Bachelor Thesis at I4MI, Bern University of Applied Science" />
  <meta name="author" content="Gabriel Hess" />
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

  <!-- Bootstrap CSS -->
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
  <link href="anakoda.css" rel="stylesheet">
  <link rel="shortcut icon" href="img/favicon.ico">
</head>
<body>
  <nav class="navbar navbar-expand-md navbar-dark fixed-top">
    <a class="navbar-brand" href="#">anakoda MSG-Tool</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarsExampleDefault">
      <ul class="nav navbar-nav ml-auto w-100 justify-content-end">
        <li class="nav-item">
          <a class="nav-link" href="?newmessage=true" class="addlink">Nachricht hinzufügen</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="?logout=true">logout</a>
        </li>
      </ul>
    </div>
  </nav>

  <main role="main">

    <!-- Main jumbotron for a primary marketing message or call to action -->
    <div class="jumbotron">
      <div class="container">
        <div class="row align-items-center">
          <div class="col">

            <?php
            session_start();

            // of course, this is not the way to do user management, but it's just a quick & dirty proof of concept
            $loginPass = "*******";
            $loginUser = "research@anakoda.ch";

            if(isset($_SESSION['user']) && $_SESSION['user'] == $loginUser){
              // Read the file contents into a string variable,
              // and parse the string into a data structure
              $str_data = file_get_contents("data.json");
              $messages = json_decode($str_data,true);

              // process data from form input
              if(isset($_POST['patient']) && isset($_POST['message'])){
                // add the new message to the messages array
                $messages[] = ["patient" => $_POST['patient'], "message" => $_POST['message'], "contact" => $_POST['contact']];

                // save the file
                $fh = fopen("data.json", 'w')
                or die("Error opening output file");
                fwrite($fh, json_encode($messages,JSON_UNESCAPED_UNICODE));
                fclose($fh);
                echo('<p class="info">Nachricht an ' . $_POST['patient'] . ' erfolgreich gespeichert.</p>');
                echo('<hr /');
              }

              // handle delete
              if(isset($_GET['del'])){
                // remove the entry from the array
                $i = $_GET['del'];
                //unset($messages[$i]);
                array_splice($messages, $i, 1);

                // save the file
                $fh = fopen("data.json", 'w')
                or die("Error opening output file");
                fwrite($fh, json_encode($messages,JSON_UNESCAPED_UNICODE));
                fclose($fh);

                // notify the user
                $i++;
                echo('<p class="info">Nachricht Nr. ' .$i. ' erfolgreich gelöscht.</p>');
                echo('<hr /');
              }

              // handle logout
              if(isset($_GET['logout'])){
                unset($_SESSION['user']);
                header('Location: '. 'index.php');
              }

              // handle new entry page
              if(isset($_GET['newmessage'])){
                echo('
                <h3>Neue Nachricht erfassen</h3>
                <form action="index.php" method="post">
                Pseudonym des Patienten:<br />
                <input type="text" name="patient" value="P-XXXX-XXXX"/><br/>

                Mitteilung an den Patienten:<br />
                <textarea name="message"></textarea><br />

                Kontaktadresse für Patient:<br />
                <input type="text" name="contact" /><br/><br/>

                <input type="submit" value="Nachricht absenden">
                </form>');
                echo('<br /><p><a href="/msg/">abbrechen</a></p>');
                echo('<hr /');
              }

              echo('<h3>Liste der gespeicherten Nachrichten:</h3><ul>');
              for($i = 0; $i < count($messages); $i++){
                echo('<li class="message"><ul>');
                echo('<li><b>Patient: </b>' . $messages[$i]["patient"] . '</li>');
                echo('<li><b>Nachricht: </b>' . $messages[$i]["message"] . '</li>');
                echo('<li><b>Kontakt: </b>' . $messages[$i]["contact"] . '</li>');
                echo('<li class="deleter"><a href="?del='.$i.'" class="deletelink">[ löschen ]</a></li>');
                echo('</ul></li>');
              }
            }
            else {
              // in the act of logging in
              if(isset($_POST['pwd'])){
                if($_POST['pwd'] == $loginPass && $_POST['user'] == $loginUser){
                  $_SESSION['user'] = $_POST['user'];
                  echo('<p>Erfolgreich eingeloggt.</p>');
                  header('Location: '. 'index.php');
                }
                else{
                  echo('<h3>Login</h3><p>Falscher Username / Passwort.</p>');
                  echo('
                  <form action="index.php" method="post">
                  User: <input type="text" name="user"><br />
                  Passwort: <input type="password" name="pwd" />
                  <input type="submit" value="Nachricht absenden">
                  </form>
                  ');
                }
              }
              // not logged in, show login form
              else{
                echo('
                <h3>Login</h3>
                <form action="index.php" method="post">
                User: <input type="text" name="user">
                Passwort: <input type="password" name="pwd" />
                <input type="submit" value="log in">
                </form>
                ');
              }
            }
            ?>

          </div>
        </div>
      </div>
    </div>
  </main>

  <footer class="footer footer-dark">
    <a class="footer-text" href="mailto:info@anakoda.ch">info@anakoda.ch</a>
    <a class="footer-text" href="https://anakoda.ch/app/#/about">Impressum</a>
  </footer>

  <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49" crossorigin="anonymous"></script>
  <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js" integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy" crossorigin="anonymous"></script>

</body>
</html>
