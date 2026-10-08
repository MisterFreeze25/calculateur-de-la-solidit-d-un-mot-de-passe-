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
    abenteuer abholung abschluss absicht abteilung abwechslung achtung adresse adresseingabe
    akademie aktion aktualisierung alphabet anbieter anforderung angabe angelegenheit angewohnheit
    anhang ankunft anlage anmeldung anordnung anruf ansicht anspannung antrag anwendung anwesen
    apotheke architekt archiv argument arztpraxis aufenthalt aufgabe aufmerksamkeit aufnahme auftrag
    auftritt aufzahlung ausbildung ausdruck ausflug auskunft ausland ausstellung auswahl auswirkung
    auszahlung bahnhof balkon bandage bankkonto baustelle bedarf bedeutung bedingung begabung begleitung
    begriff begrundung behorde behorden beibehaltung beitrag bekanntschaft berechnung bericht beratung
    bereich bereicherung beruf beschaftigung beschaftigte besitzer bestand bestellung beteiligung betrieb
    bewegung bewerbung bewertung bezahlung bildschirm bildung bitte blatt boden brett brief briefkasten
    brille bruder buchhandlung buchstabe bundestag burgerschaft burgersaal burgerservice buchhaltung
    dabei dachboden dankbarkeit darstellung datei datenbank datensatz datenschutz dauer decke deckel
    definition detail dialog dienst dienstag dienstleistung dokument dokumentation doppelzimmer dorf
    dorfplatz drucker druckerei durchblick durchgang durchgangigkeit durchfuhrung durchmesser dusche
    einarbeitung einbahn einblick einbruch einfall einfluss einfuhrung eingang eingabe eingangshalle
    eingelegenheit eingemeindung eingriff einhaltung einheit einkauf einladung einkommen einrichtung
    einstellung eintritt einwohner einzelhandel einzelheit einzelzimmer einzahlung empfehlung empfindung
    endergebnis energieverbrauch entscheidung entdeckung entwicklung entwurf entwicklungshilfe erbe
    ereignis ergebnis erlebnis eroberung erzahlung erzielung erziehung fachgebiet fachhandel fachkraft
    fachwissen fahrbahn fahrkarte fahrplan fahrzeug fallschirm familienname familienstand farbe feierabend
    feiertag feldweg fernbedienung fernfahrer fernseher fernsehen festigkeit festplatte feststellung
    finanzamt finanzierung finanzplan firmenname flachland flaschenpost fleischerei flughafen flugblatt
    flugzeug forderung forschung fortbildung fortschritt fotografie fragebogen fragestellung freiberufler
    freizeit freundlichkeit friedhof fuhrerschein fuhrungskraft fuhrungszeugnis fußboden gebaude gebirge
    gedachtnis gedanken gegenstand gegenwart geheimnis gelegenheit gemeinsamkeit gemeinschaft gemeinde
    gerechtigkeit geschwindigkeit geschwister gesellschaft geschaft geschaftsfuhrung geschenk gesundheit
    gesichtspunkt gewohnheit gleichgewicht gleichheit glucklichkeit grundlage grundstuck grundung handarbeit
    handbuch handlung hauptbahnhof hauptstadt herausforderung herkunft herstellung hilfsbereitschaft hinweis
    hintergrund hochschule hochzeit hoffentlich holzhandlung hotelzimmer jahreszeit jahresabschluss
    jahresbericht jahresende jahreskarte jahreswechsel jugendherberge jugendliche jugendzeit kinderbuch
    kindergeld kindergarten kinderzimmer kindheit kirchengemeinde klassenarbeit kleiderschrank kleinigkeit
    klimaschutz kommunikation konversation korperpflege krankenschwester kreativitat kunstwerk landkarte
    landwirtschaft lebensmittel lebensversicherung lebensweise lehrerin lehrgang lehrkraft lehrstuhl
    leistungsergebnis lieblingsfarbe lieblingsessen lieblingsfach lieblingsfilm lieblingslied lieblingsort
    lieblingsplatz lieblingssport lieblingsspiel lieblingstag lieblingswort lieferant lieferung liegenschaft
    menschenrecht menschlichkeit meisterschaft mitarbeiter mittagessen mitternacht nachbarschaft nachfrage
    nachrichtendienst nachmittagshimmel nachschlagewerk naturwissenschaft notfallnummer oberflache obergeschoss
    oberleitung oberstufe offentlichkeit offentlicher ordner ordnungskraft ortschaft partnerschaft passworter
    preisverleihung pressefreiheit produktivitat qualitatskontrolle qualitatsstandard quellenangabe rathaus
    rechtsanwalt rechtschreibung rechtswissenschaft reisebericht reisegesellschaft reiseversicherung
    reinigungskraft reisepass reisetasche rettungsdienst rettungsschwimmer richtungsanzeige ruckmeldung
    rucksichtnahme sammelstelle sachlichkeit schauspieler schauspielerin schadensersatz schattenseite
    schlafzimmer schlussverkauf schneeflocke schneiderin schreibmaschine schreibwaren schulbildung schulbuch
    schulausflug schulfreund schuljahr schulleitung schulmeister schulpause schulweg schwangerschaft
    selbstbewusstsein selbststandigkeit sicherheitsdienst sicherheitsgurt sicherheitskontrolle sicherheitskopie
    sicherheitsmassnahme sicherheitsnummer sonnenaufgang sonnenblume sonnenbrille sonnencreme sonnenlicht
    sonnenschein sonnenuntergang sonderangebot sonderausgabe sonderfall sonderzeichen sozialarbeit
    sozialarbeiter sozialisierung sozialversicherung sprachkenntnis sprachunterricht staatsangehorigkeit
    staatsanwaltschaft stellvertreter steuerberater steuererklarung steuerfreiheit steuerrecht steuerung
    steuerzahlung stimmzettel stundenplan studentenwohnheim studienabschluss studienanfanger studienarbeit
    studienberatung studiengebuhr studienjahr studienleistung studienplatz studienreise studienrichtung
    studienzeit suchmaschine supermarktkasse tagesablauf tageslicht tagesordnung tageszeitung taschenlampe
    teilnehmer telefonnummer terminkalender tiefgarage tierarztpraxis tiergarten tischdecke tochtergesellschaft
    todesanzeige todesursache tonaufnahme tonstudio traumhaus traumreise traumurlaub treppenhaus umfrage
    umgebungskarte umweltbewusstsein umweltschutz unterhaltung unterkunft unternehmen unterrichtsstunde
    unterschrift unterwasserbahn urlaubsantrag urlaubsbeginn urlaubsfoto urlaubsplanung urlaubsreise
    urlaubszeit ursprung verabredung veranstaltung vereinbarung verfassung verhaltensweise verkehrsmittel
    verkehrssicherheit verkehrszeichen verkaufsgesprach vermieter vermutung vernehmung verstandnis verstarkung
    vertrauensperson verwaltungskosten verwaltungsrat verwaltungsweg verwunderung volkswagen vorbereitung
    vorbestellung vorentscheidung vorfahrt vorfreude vorgang vorhaben vorlesung vorschlag vorschrift vorsorge
    vollzeitbeschaftigung vorname wahrnehmung wahlberechtigung wahlentscheidung wahlkampf wahlprogramm
    waldspaziergang wasserfall wasserflasche wasserhahn wasserleitung wasserversorgung weihnachtsabend
    weihnachtsbaum weihnachtsfeier weihnachtsgeschenk weihnachtsmann weihnachtspaket weihnachtszeit
    weiterbildung weltanschauung weltgeschichte weltkarte weltmeister weltmeisterschaft weltreise wettbewerb
    wetterbericht wettervorhersage wichtigkeit widerspruch wiederholung wiedervereinigung willensfreiheit
    wirtschaft wirtschaftskraft wirtschaftsleben wirtschaftspolitik wirtschaftswachstum wissenschaftler
    wissenschaftlerin wohngegend wohnungsbau wohnungsmarkt wohnungsnot wohnungssuche wohnzimmer wortbildung
    worterbuch wortschatz wortstellung wortwahl zeitgeschichte zeitgenosse zeitgeist zeitmanagement zeitschrift
    zeitzone zielgruppe
    abonnement accueil adolescent affichage agriculture aiguille alarme aliment
    alliance ambiance ampoule appareil apprentissage aquarium ascenseur assurance
    auberge autoroute avenir avocat baignoire barquette barriere batterie berger
    bijouterie bijoutier blouse boisson bouchon bracelet branche bretagne brouillard
    bulletin cafetiere caisse caissier camion candidature caniveau canot carafe
    carrefour casserole catalogue caveau cellule champignon chantier charrette chaussure
    cheminee chercheur citoyen civilisation colocataire compteur concierge confiserie
    consigne coquillage corbeille cordonnier couloir couverture cravate crevette
    croissant cuillere cyclisme debat decouverte decoration delicieux dentelle
    dependance deplacement deroulement dessert destination dictionnaire difference
    dimanche direction directeur disque distance distributeur divertissement document
    economie ecureuil editeur elegance electricien emballage embrassade emplacement
    emprunt encre enregistrement enseignement entreprise epicerie equipement escalier
    escargot espaceur evenement evolution excursion fabrication facteurie falaise
    fantaisie fauteuil fiancee fillette fleuriste footballiste formulaire fourchette
    fournisseur framboise friteuse fromageage fruitier fusible galop garantie gardien
    gastronomie gazette geographie gestionnaire girafe gouvernail grammaire grenouille
    grimace guirlande habitation harmonie herisson horloger immeuble imprimeur
    incendie indication industrie informatique instrument intelligence invitation
    itineraire laboratoire largeur lavande librairie licenciement linguiste livraison
    logement locomotive logiciel loyaute macaron magasinage manette maree maritime
    materiel menuisier mercerie messagerie metropole meuble microbe milliard
    nettoyage notification nouveaute nutrition occasionnel operationnel organisateur
    orientation ouverture panneau paravent parcelle patisserie patrimoine pendule
    percussion perruque persil pharmacie pharmacien photographie photographe placette
    plongeur plomberie poignard poivron pompier portefeuille prairie premiere
    priorite professeur programmation promenade proprietaire protection psychologue
    publication punaise punition qualite quotidien quotidiennement radiateur raclette
    rangement rayonner realisateur reception recherche recyclage reglisse remorque
    reparation reportage restaurant reservation responsable richesse robinet rocher
    roulement ruban sablier serrure serrurier silhouette souplesse souriciere spectacle
    stationnaire statistique stockage strategie structure superficie surveillance
    tablette tapisserie tartelette technologie telecommande teletravail temperature
    terminus territoire thermometre tradition trampoline transforme transporteur
    tristesse uniforme universel utilisateur utilisation vaisselle validite variation
    velours vendeur veritable verger verifier vernis vieillesse voisinage volontaire
    abacus academy accelerator accountant accounting achievement acquire activity advisor
    affection afternoon afterward airplane alarm clock alphabet allowance ambulance
    ancestor anniversary apartment appetite applicant architect artwork assistant athlete
    attendance attraction authority backpack bargain battery bedroom bicycle birthday
    blanket bracelet breakfast brochure calculator calendar calculator camping capability
    carpenter category celebration certificate challenge character childhood chimney
    chocolate cinnamon classroom colleague collector combination committee community
    companion competition computer confidence connection consequence consultant container
    contractor conversation corridor counselor creativity customer deadline delivery
    dentist department discovery dishwasher distance documentary downtown drawing driver
    education efficiency electrician elevator emergency employee employer engineering
    entrance envelope equipment estimate evaluation evidence exercise expectation factory
    familiar favorite financial fisherman flashlight foundation friendship furniture
    gallery gardener gateway gentleman geography graduate grocery handbook happiness
    hardware headline healthcare highway holiday household imagination improvement
    independent industry influence information ingredient initiative inspector insurance
    intention internet invention inventory journalist keyboard knowledge landscape laundry
    lawyer lecture library lightning limousine location luggage magazine manufacturer
    mechanic membership microphone midnight milestone miniature minister mountain biking
    newspaper notebook nutrition objective occasion orchestra organization passenger
    pedestrian performance permission personality photograph physician playground pleasure
    population possibility potential practice precious preparation prescription principal
    priority procedure profession professor promotion property purchase quality quantity
    quotation rainfall realization receipt recommendation refrigerator relationship
    reliable reputation reservation restaurant retirement screwdriver secretary security
    shipment shopping signature sidewalk specialist stationery storytelling strawberry
    structure submarine suggestion supermarket supervisor surprise technology television
    temperature tournament tradition translation transportation university vacation
    valuable vegetable veterinary volunteer warehouse wilderness yesterday
    ability absence absolute academic account accuracy achievement acknowledgement acquisition adaptation
    addition administration advantage advertisement advice affection agency agenda agreement agriculture
    aircraft airline airport album alternative ambition analysis ancestor announcement anxiety apology
    appearance appetite appreciation approval architecture arrangement arrival assistance atmosphere attempt
    attention attitude audience authority awareness awareness background balance basketball bedroom behavior
    belief benefit bicycle biology birthday blanket boundary breakfast brother building butterfly cabinet
    calendar campaign candidate capacity capital captain careful celebration celebration century ceremony
    challenge championship character charity chemistry childhood chocolate christmas civilization climate
    clothing collection comfort command commitment communication comparison compassion competition complaint
    conclusion confidence connection consciousness consideration consistency construction content context
    contribution conversation cooperation courage creativity criticism culture customer daughter deadline
    decision delivery democracy department description design destination development difference difficulty
    direction disaster discovery discussion distance education electricity employee employment energy engineer
    entertainment enthusiasm environment equality equipment error essential evening examination example
    exchange excitement exercise existence expectation experience experiment explanation expression failure
    familiar family favorite feature feedback feeling festival finance fireplace flight football friendship
    function furniture gallery generation geography girlfriend government grandfather grandmother grocery
    guidance happiness hardware headline hearing history holiday honesty hospital household husband identity
    imagination importance improvement independence industry influence ingredient initiative instruction
    insurance intelligence intention interaction interest internet introduction invention invitation january
    journey judgment knowledge language laughter leadership learning legislation library lifestyle lightning
    location magazine maintenance management manager marketing marriage mathematics meaning measurement
    medicine member memory message midnight military million minister miracle mistake mixture monday movement
    musician mystery narrative nation nature necessity neighbor newspaper november occasion october operation
    opportunity organization original painting paragraph parent partnership passenger patience payment performance
    permission personality photograph physical piano picture pleasure pocket population position possibility
    practice preference preparation presence president pressure priority privacy problem procedure process
    product profession professor program progress promise promotion property proposal protection purpose
    quality quantity question quotation reaction reading reality reason receipt recipe recognition relationship
    religion reminder restaurant retirement revolution reward rhythm safety saturday scenery schedule science
    season secretary security selection september sentence service session shoulder signature situation society
    solution something speaker species special standard station stomach strategy strength structure student
    substance success suggestion summer sunlight sunday surprise swimming sympathy system teaching teenager
    temperature temporary theater theatre thursday tonight tradition traffic training travel treatment triangle
    trouble tuesday umbrella understanding university vacation vegetable vehicle victory video village violence
    visitor volunteer wallpaper warning wedding weekend western whatever wholesale willingness window winner
    wisdom wonderful worker yesterday youngster yourself
    abeja abogado abrazo academia accidente aceite actividad acuerdo admiracion aeropuerto alegria alquiler
    amistad anuncio apariencia aprendizaje archivo argumento artista asistencia asunto atencion autobus
    autoridad aventura belleza beneficio biblioteca calidad camino capacidad capital capitulo caracter
    carino celebracion cerveza ciudad cliente comienzo companero compania competencia comprension conclusion
    confianza conocimiento consecuencia continente contrato conversacion corazon corriente crecimiento
    cuidado decision diciembre diferencia dificultad direccion disciplina descubrimiento educacion electricidad
    empleado energia enfermedad ensayo entrada entrevista equilibrio escenario espacio especie esperanza
    estacion estudiante examen excelencia existencia explicacion expresion extranjero facilidad felicidad
    fotografia funcionario herramienta humanidad importancia impuesto incendio industria influencia ingrediente
    iniciativa institucion instrumento inteligencia interaccion interes invierno investigacion jardinero laboratorio
    lanzamiento lectura libertad literatura mantenimiento manera maquillaje matrimonio medicina mensaje millon
    misterio movimiento nacimiento naturaleza necesidad negocio noviembre objetivo obligacion observacion
    oportunidad organizacion origen paciencia paisaje palabra pelicula pensamiento porcentaje personaje permiso
    personalidad perspectiva poblacion posibilidad posicion practica pregunta presencia presidente presupuesto
    principio problema procedimiento producto profesion programa progreso promesa proteccion provincia proyecto
    publicidad realidad razonamiento recuerdo referencia reflexion relacion rendimiento reunion riqueza seguridad
    sentimiento septiembre servicio situacion sociedad solucion sorpresa trabajador tradicion transporte universidad
    variedad vegetacion velocidad visitante voluntad zapateria zapatero
    abbraccio accoglienza attenzione avventura bellezza biblioteca capacita carattere celebrazione cittadino
    civilta colazione commercio compagnia comprensione comunicazione conoscenza conseguenza costruzione
    conversazione coraggio creativita decisione dicembre differenza difficolta direzione educazione elettricita
    emozione esperienza espressione felicita fotografia gentilezza giardino giornale giustizia illuminazione
    immaginazione importanza indipendenza industria informazione intelligenza interazione interesse inverno
    investimento occasione ottobre organizzazione opportunita operazione opinione orchestra pazienza paesaggio
    partecipazione passione pensione personalita possibilita preferenza preparazione presentazione presidente
    principio probabilita professione progresso protezione pubblicazione qualita quantita questione ragione
    riconoscimento relazione responsabilita ristorante rivoluzione sicurezza situazione societa soluzione
    soddisfazione solidarieta sorpresa stazione studente settimana tecnologia televisione tradizione trattamento
    tranquillita universita verita velocita vittoria
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

  const wordRanks = new Map(roots.map((word, index) => [word, index + 1]));
  const passwordRanks = new Map(
    commonPasswords.map((password, index) => [password, index + 1]),
  );

  function getGuessEstimate(password) {
    const normalized = normalize(password);
    if (!normalized) return null;

    let bestGuessCount = passwordRanks.get(normalized) ?? Infinity;
    const rootRank = wordRanks.get(normalized);
    if (rootRank !== undefined) {
      bestGuessCount = Math.min(bestGuessCount, 10_000 + (rootRank - 1) * 100);
    }

    suffixes.forEach((suffix, suffixIndex) => {
      const normalizedSuffix = normalize(suffix);
      if (!normalizedSuffix || !normalized.endsWith(normalizedSuffix)) return;

      const baseWord = normalized.slice(0, -normalizedSuffix.length);
      const baseRank = wordRanks.get(baseWord);
      if (baseRank !== undefined) {
        bestGuessCount = Math.min(
          bestGuessCount,
          50_000 + (baseRank - 1) * 200 + suffixIndex * 100,
        );
      }
    });

    const combinations = Array(normalized.length + 1).fill(Infinity);
    combinations[0] = 1;
    for (let end = 1; end <= normalized.length; end++) {
      for (let start = Math.max(0, end - 24); start < end; start++) {
        const rank = wordRanks.get(normalized.slice(start, end));
        if (rank === undefined || !Number.isFinite(combinations[start])) continue;

        const wordGuesses = 10_000 + (rank - 1) * 100;
        const combinedGuesses =
          start === 0
            ? wordGuesses
            : Math.min(1e300, combinations[start] * wordGuesses);
        combinations[end] = Math.min(combinations[end], combinedGuesses);
      }
    }

    bestGuessCount = Math.min(
      bestGuessCount,
      combinations[normalized.length],
    );
    return Number.isFinite(bestGuessCount) ? bestGuessCount : null;
  }

  return {
    getGuessEstimate,
    patternCount:
      commonPasswords.length + roots.length * (roots.length + suffixes.length + 1),
    wordCount: roots.length,
  };
})();
