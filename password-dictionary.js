window.PasswordDictionary = (() => {
  const roots = [...new Set(`
    amour ami animal arbre arc-en-ciel argent armee bateau bebe bijou bonheur
    bonjour cadeau campagne canada capitale chanson chat cheval chien chocolat
    ciel cinema coeur couleur cuisine danse dauphin dimanche dragon ecole enfant
    etoile famille femme ferme fleur france fromage fruit galaxie garcon gateau
    gentleman histoire hiver jardin juillet juin lapin licorne livre maison maman
    manon mardi marine mercredi meilleur mer montagne musique nature neige noel
    nuit ocean ordinateur orange papa papillon paris partage passion paix peche
    pierre pirate plage plaisir poisson printemps princesse probleme royaume
    soleil souris sport samedi secret securite sourire star super tableau telephone
    tempete terre tigre tomate travail vacances vendredi voiture voyage
    password welcome sunshine football baseball basketball dragon monkey shadow
    master freedom whatever princess sunshine summer winter autumn spring flower
    family friend secret angel heaven coffee chocolate cookie butter happy lucky
    sunshine star moon ocean river mountain forest garden orange apple banana
    computer internet keyboard desktop mobile laptop soccer hockey tennis music
    hello love beautiful trust forever adventure butterfly rainbow silver golden
    phoenix warrior ninja rocket thunder lightning crystal magic fantasy dream
    house home school student teacher book library science planet galaxy universe
    america canada england france germany london paris madrid roma berlin tokyo
    morning night friday monday saturday sunday january december birthday summer
    red blue green black white purple yellow silver gold diamond ruby emerald
    car truck bicycle motorcycle airplane train boat speed racer racing champion
    password passw0rd letmein admin login access secret qwerty azerty sunshine
    estrella amor familia amigo casa perro gato clave verano invierno escuela
    mundo secreto cielo luna sol flor jardin caballo manzana naranja bonita
    haus liebe familie sommer winter stern blume garten freund schule katze hund
    abricot acteur adresse aeroport agence aigle allumette ambulance anniversaire
    appartement aspirateur atelier avion bagage balade ballon banane banque bureau
    cabane calcul camera canard canape caramel carte cascade ceinture cerise chance
    chaleur chateau chemise chemin chiffre citron classe clavier clef client cloche
    colline combat commerce concert confiture conseil contact courage cousin crayon
    culture dame danger decor dentiste detail docteur dossier douceur energie equipe
    erreur espace espoir examen exemple facteur fantome farine festival figure garage
    genie glacier groupe guitare horloge hotel image indice insecte invitation journal
    jouet lac lampe lecture legume lettre lumiere machine magasin mairie maladie
    manteau marche medecin message minute modele moteur moulin morceau musee navire
    objet offrande oiseau papier parapluie parent parfum pelouse peinture personne
    pharmacie piano placard plante plateau plume poche pomme porte poulet prairie
    premiere quartier question recette region reponse reunion richesse robe salade
    saison salon sandale sardine serrure service silence statue succes tableau talent
    tapis tarte taxi tissu toilette touriste trousse tulipe valise vapeur velo
    village visage visite voisine zeste
    actor airport airport airplane alarm album almond alphabet animal answer apartment
    artist athlete author autumn bakery balance beach beauty bedroom bicycle blanket
    blossom bottle bridge brother building camera candle captain carpet castle center
    century cereal chair cheese cherry chicken children circle citizen class cloud
    college comfort company concert country cousin culture curtain diamond doctor earth
    engine evening example family farmer father feather festival field figure finger
    flight flower football forest fortune friend future garage garden ginger glass
    golden government grandfather grandmother grocery guitar happiness health heart holiday
    honey hospital hotel hundred journey kitchen language laughter lesson letter library
    machine manager market marriage meaning medicine memory message million minute mirror
    morning mother mountain movement movie museum mystery nation nature neighbor nobody
    notebook number october office olive orange orchard package painting parent partner
    party patient pattern peace people pepper person picture pillow planet pocket poetry
    potato present prince princess problem product promise pumpkin purple quality question
    rabbit rainbow reason recipe record restaurant rhythm rocket sailor school science
    season second sentence september shadow shoulder silence sister society station story
    student success sunset teacher theater theatre thursday ticket timber tomorrow treasure
    umbrella village visitor volcano water weather wedding welcome whatever window winner
    wonderful yellow yesterday youngster
    aeropuerto alegria amarillo amigo animal anillo arbol arena artista avion ayuda
    bandera belleza bicicleta bolsillo bosque botella caballo cabello cadena calendario
    camino camisa campana campo cancion caramelo cartera carrera carta casa cebolla
    celebre centro cerebro cerdo cerveza cielo ciudad cliente cocina colegio comida
    companero consejo corazon corona corriente cuidado cultura cuadro cuarto cuento
    cuerpo desafio destino domingo dibujo dinero edificio elefante energia enfermedad
    equipo escuela espejo estrella familia fantasia febrero felicidad feria fiesta figura
    fuego fuente futuro gallina gallo garganta gato generacion gobierno guitarra hermano
    herramienta historia hogar hombre hospital idioma iglesia invierno izquierdo juguete
    justicia kilometro laguna lampara lenguaje libertad libro limpieza llegada lluvia
    madera madre maestro manana mariposa mercado mesa metro milagro minuto moneda
    montana mundo musica naranja negocio noviembre objeto octubre oficina palabra palacio
    pantalla pantalon papel parque partido pelota pensamiento persona pescado pintura
    planeta pluma poblacion policia princesa profesor proyecto pueblo puerto pregunta
    recuerdo regreso reloj respuesta riqueza rio sabado semana sentimiento septiembre
    servicio seguridad semilla sonrisa sonrisa sorpresa telefono television temporada
    tienda tigre trabajo tristeza universo universidad vecino ventana viernes zapato
    zucchero amico animale arancia bambino bellezza bicicletta bottiglia cucina famiglia
    felicita finestra fiore fragola giardino giornata inverno macchina maestro mattina
    montagna mondo notte nuvola ombrello ragazzo ragazza ricchezza sicurezza settimana
    sorella sorpresa stazione storia studente tavolo telefono tesoro vacanza verdura
    abenteuer abend adresse anfang antwort arbeit augenblick ausbildung ausstellung bank
    baum beispiel besuch bewohner bildung blume boden braut bruder buchstabe business
    chance chef dankbarkeit dienstag donnerstag dorf drache einkommen einzelhandel eltern
    erde ereignis erinnerung erzahler fabel familie feier fenster fernsehen feuer
    flasche flughafen fluss folge frage freiheit freundschaft fruhling geburtstag gedanke
    gefuhl geld geschichte gesundheit gewitter gluck großvater großmutter grund gruppe
    handwerker hauptstadt heimat herbst hilfe himmel hoffnung holz idee industrie
    jahr januar februar juli kamera karte keller kind kino kirche klasse kleidung
    konig korper kraft kultur kunst kunden lampe land landschaft leben lehrer
    liebe liebling licht losung madchen mann mantel markt meister mensch mittwoch
    monat morgen mutter nachbar nachmittag nacht name natur nebel november nummer
    oktober ordnung ostern papier park partner pause pferd pflicht pflanze pilz
    polizei post preis prinzessin problem produktion professor regen reise religion
    richtung samstag schatten schlaf schluss schlussel schmetterling schnee schokolade
    schule schwester see sekretar sicherheit sommer sonntag sonne spiel sprache
    stadt start stern straße student stunde sturm sucht tag tasche taxi technik
    telefon temperatur teppich theater tier tiefgarage tochter todesfall tradition traube
    traum treppe treue uberraschung uhr umgebung urlaub ursache vater vergnugen
    verkehr versicherung versprechen vertrauen verwaltung vogel vollmond vorstellung wald
    wand wasser weihnachten wein welt wert wetter woche wohnung zeichen zeit zeitung
    `
    .trim()
    .split(/\s+/)
    .map((word) => normalize(word))
    .filter((word) => word.length >= 4))];

  const commonPasswords = `
    123456 123456789 12345678 12345 1234567 1234567890 password password1
    123123 111111 000000 abc123 qwerty qwerty123 1q2w3e4r admin admin123
    letmein welcome welcome1 monkey dragon sunshine iloveyou princess football
    baseball shadow master superman trustno1 freedom whatever access flower
    mustang michael password123 passw0rd login guest root test test123
    azerty azerty123 motdepasse motdepasse1 bonjour bienvenue soleil amour
    chevalier chocolat fromage ordinateur portable secret famille printemps
    `
    .trim()
    .split(/\s+/)
    .map((password) => normalize(password));

  const guessesByPattern = new Map();
  const suffixes = [
    "1",
    "12",
    "123",
    "1234",
    "12345",
    "!",
    "@",
    "2020",
    "2021",
    "2022",
    "2023",
    "2024",
    "2025",
    "2026",
    "2027",
    "2028",
    "2029",
    "2030",
  ];

  function normalize(value) {
    return value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
  }

  function add(pattern, guesses) {
    const normalized = normalize(pattern);
    if (!normalized) return;
    const previous = guessesByPattern.get(normalized);
    if (previous === undefined || guesses < previous) {
      guessesByPattern.set(normalized, guesses);
    }
  }

  commonPasswords.forEach((password, index) => add(password, index + 1));

  roots.forEach((word, index) => {
    add(word, 10_000 + index * 100);
    suffixes.forEach((suffix, suffixIndex) => {
      add(`${word}${suffix}`, 50_000 + index * 200 + suffixIndex * 100);
    });
  });

  roots.forEach((firstWord, firstIndex) => {
    roots.forEach((secondWord, secondIndex) => {
      const rank = firstIndex * roots.length + secondIndex;
      add(`${firstWord}${secondWord}`, 1_000_000 + rank * 500);
    });
  });

  function getGuessEstimate(password) {
    return guessesByPattern.get(normalize(password)) ?? null;
  }

  return {
    getGuessEstimate,
    patternCount: guessesByPattern.size,
  };
})();
