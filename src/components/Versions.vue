<template>

  <v-container>
    <h1>Versionsverlauf</h1>
    <h2>anakoda 0.4</h2>
    <p>02.06.2019</p>
    <p>
      <ul>
        <li>Dashboard Kennzahlen
          <ul>
            <li>Weitere Kennzahlen mit Visualisierungen zum Schlaf und der Medikation</li>
            <li>Neues Grafenframework</li>
          </ul>
        </li>
        <li>Fehlerhafte Datensätze können in "Meine Daten" gelöscht werden</li>
        <li>Anpassungen/ Bugfixes, auch mithilfe der Kohortendaten</li>
      </ul>
    </p>
    <h2>anakoda 0.3.1</h2>
    <p>27.05.2019</p>
    <p>
      <ul>
        <li>Fragebogen zur Evaluation hinzugefügt</li>
        <li>kleine Anpassungen an Feedback-Funktion</li>
        <li>
          Bugfix: Unter Umständen können Daten von heMIgrania unvollständig gespeichert werden. Solche unvollständigen Daten hatten
          anakoda derart verwirrt, dass sie bei einigen Usern im "Meine Daten" und "Dashboard" gleich gar nicht dargestellt
          wurden. Diesen Fehler haben wir behoben.
        </li>
        <li>Weitere kleine Bugfixes in "Meine Daten"</li>
      </ul>
    </p>
    <h2>anakoda 0.3</h2>
    <p>14.05.2019</p>
    <p>
      <ul>
        <li>Dashboard
          <ul>
            <li>Auf einem Zeitstrahl werden all deine erfassten Daten angezeigt</li>
            <li>Verschiedene Kennzahlen zu deinen Daten werden aufbereitet dargestellt</li>
          </ul>
        </li>
        <li>Einstellungen: Neue Option "bei MIDATA eingeloggt bleiben"</li>
        <li>Logout-Button im Seitenmenu</li>
        <li>verschiedene Optimierungen im MidataService</li>
      </ul>
    </p>

    <h2>anakoda 0.2</h2>
    <p>29.04.2019</p>
    <p>
      <ul>
        <li>Anzeigen von erfassten Einträgen in Tabellenform</li>
        <li>Feedback-Funktion</li>
        <li>Feedback auf "Daten anzeigen"-Seite</li>
        <li>Erweiterungen MidataService</li>
        <li>Einstellungen: du kannst unlogische Einträge ein- oder ausblenden</li>
        <li>diverse kleinere Anpassungen</li>
        <li>Ein Bug, der das Verbinden mit MIDATA verhinderte, wurde behoben</li>
      </ul>
    </p>

    <h2>anakoda 0.1.1</h2>
    <p>24.04.2019</p>
    <p>
      <ul>
        <li>Ein kleiner Fehler im Datumsformat gespeicherter Einträge wurde behoben</li>
      </ul>

    </p>
    <h2>anakoda 0.1</h2>
    <p>09.04.2019</p>
    <p>
      <ul>
        <li>Erfassung des täglichen Wohlbefindens</li>
        <li>Erfassung von Symptomen und Auffälligkeiten</li>
        <li>Impressum mit Nutzungsbedingungen</li>
        <li>MidataService</li>
        <li>SnomedService</li>
        <li>ResourceService</li>
      </ul>
    </p>
  </v-container>

</template>

<script>

  export default {
    data: () => ({})
  }

</script>

<style>

</style>
