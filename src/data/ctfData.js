// Utilitaire SHA-256 via Web Crypto API (aucune dépendance npm)
export async function sha256(str) {
  const buf = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(str)
  );
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export const CTF_CATEGORIES = [
  {
    id: 'pentest',
    label: 'PENTEST',
    icon: 'Terminal',
    colorVar: 'var(--red-team)',
    description: 'Exploitation, injection, traversée de répertoires.',
  },
  {
    id: 'osint',
    label: 'OSINT',
    icon: 'Search',
    colorVar: 'var(--blue-team)',
    description: 'Reconnaissance passive, métadonnées, traces numériques.',
  },
  {
    id: 'cti',
    label: 'CTI & REVERSE',
    icon: 'Cpu',
    colorVar: 'var(--accent)',
    description: 'Analyse de malware, reverse engineering, threat intelligence.',
  },
];

export const CTF_CHALLENGES = [

  // ─────────────────────────────────────────
  // PENTEST
  // ─────────────────────────────────────────

  {
    id: 'pentest-1',
    category: 'pentest',
    title: 'Hash Me If You Can',
    difficulty: 'easy',
    description:
      'Un hash SHA-256 traîne dans les entrailles du système. ' +
      "Quelqu'un a eu la bonne idée de protéger un mot de passe… " +
      'avec un algorithme fait pour la rapidité. Bonne chance.',
    tags: ['SHA-256', 'password cracking', 'hashcat'],
    artifact: {
      type: 'hash',
      value: 'a941a4c4fd0c01cddef61b8be963bf4c1e2b0811c037ce3f1835fddf6ef6c223',
      label: 'Hash à cracker',
    },
    // SHA-256 de FLAG{sunshine} — NE PAS MODIFIER
    flagHash: '616f10216cb7230228a5229d26221ee28f421df3f29c5fa4ef7d4eaa0df9c6a9',
    hint: {
      icon: 'Zap',
      text: 'Hashcat & John the Ripper',
      url: 'https://hashcat.net/wiki/doku.php?id=hashcat',
      tooltip:
        'Hashcat (-m 1400 pour SHA-256) ou John the Ripper avec la wordlist rockyou.txt. ' +
        'Exemple : hashcat -m 1400 -a 0 hash.txt rockyou.txt',
    },
    solution: {
      flag: 'FLAG{sunshine}',
      steps: [
        "Récupérer le hash SHA-256 affiché sur la carte : a941a4c4fd0c01cddef61b8be963bf4c1e2b0811c037ce3f1835fddf6ef6c223",
        "Méthode rapide (en ligne) : soumettre le hash directement sur CrackStation — crackstation.net",
        "Méthode locale : enregistrer le hash dans un fichier puis lancer Hashcat :",
        "  $ echo 'a941a4c4...' > hash.txt",
        "  $ hashcat -a 0 -m 1400 hash.txt rockyou.txt",
        "Le hash correspond au mot de passe en clair : sunshine",
        "Construire et soumettre le flag : FLAG{sunshine}",
      ],
      tools: ['Hashcat', 'John the Ripper', 'CrackStation (web)', 'rockyou.txt'],
      notes: "Mode Hashcat : -m 1400 = SHA-256 non salé. SHA-256 n'est pas adapté au stockage de mots de passe (trop rapide, pas de salage natif) — bcrypt, scrypt ou Argon2 sont les alternatives correctes.",
    },
  },

  {
    id: 'pentest-2',
    category: 'pentest',
    title: "Headers Don't Lie",
    difficulty: 'medium',
    description:
      'Un endpoint interne expose des informations dans ses headers HTTP. ' +
      'Le développeur a oublié de les nettoyer avant la mise en production. ' +
      'Les outils parlent, encore faut-il savoir écouter.',
    tags: ['HTTP headers', 'DevTools', 'curl'],
    artifact: {
      type: 'headers',
      label: 'Endpoint — GET /api/status',
    },
    // SHA-256 de FLAG{h34d3rs_4r3_s1l3nt_w1tn3ss3s} — NE PAS MODIFIER
    flagHash: '8a4546d13cc4fa46d83ed878b02db908bb571acfbffb252deaf85618417e5f05',
    hint: {
      icon: 'Globe',
      text: 'HTTP Headers — MDN',
      url: 'https://developer.mozilla.org/fr/docs/Web/HTTP/Headers',
      tooltip:
        "Les headers HTTP contiennent parfois plus que ce qu'on croit. " +
        "curl -I ou les DevTools Network sont tes meilleurs alliés. " +
        "Cherche un header inhabituel dans la réponse de /api/status.",
    },
    solution: {
      flag: 'FLAG{h34d3rs_4r3_s1l3nt_w1tn3ss3s}',
      steps: [
        "Cliquer sur 'ENVOYER LA REQUÊTE' dans le terminal intégré à la carte — simule un GET /api/status",
        "La réponse JSON apparaît : { \"status\": \"ok\", \"version\": \"2.3.1\", \"env\": \"production\" }",
        "Cliquer sur 'VOIR LES HEADERS BRUTS' pour afficher la réponse HTTP complète",
        "Parcourir les headers — repérer le header non-standard : X-Debug-Flag: FLAG{h34d3rs_4r3_s1l3nt_w1tn3ss3s}",
        "En conditions réelles, utiliser : $ curl -I https://target/api/status",
        "Ou inspecter l'onglet Network des DevTools → clic sur la requête → onglet Headers",
        "Ou intercepter la réponse avec Burp Suite Proxy → onglet Response → Raw",
      ],
      tools: ['curl -I', 'DevTools Network (F12)', 'Burp Suite Proxy'],
      notes: "Les headers de debug (X-Debug-*, X-Internal-*, X-Build-Version...) sont régulièrement oubliés lors du passage en production. Référence : CWE-200 — Exposition d'informations sensibles à un acteur non autorisé.",
    },
  },

  {
    id: 'pentest-3',
    category: 'pentest',
    title: 'Inject the Past',
    difficulty: 'hard',
    description:
      "Un vieux panneau d'administration de Vertex Studio est resté en ligne. " +
      "La base de données des employés est protégée par un login. " +
      "Mais le développeur en charge était pressé ce vendredi soir-là. " +
      'Niveau 1 : passe le login. Niveau 2 : lis ce que le serveur te retourne.',
    tags: ['SQL injection', 'bypass', 'base64', 'JWT'],
    artifact: {
      type: 'form',
      label: 'Panneau admin — Vertex Studio v0.3',
    },
    // SHA-256 de FLAG{sql1_byw4ss3d_4nd_d3c0d3d} — NE PAS MODIFIER
    flagHash: '359493bed74485eeaf42f4da442aab31a1ee105baf50908e9c5b0ae82e58544c',
    hint: {
      icon: 'Database',
      text: "Comprendre l'injection SQL",
      url: 'https://portswigger.net/web-security/sql-injection',
      tooltip:
        "Une injection SQL exploite la concaténation dans une requête. " +
        "Payload classique : ' OR '1'='1. " +
        "Après authentification, lis attentivement ce que le \"serveur\" te retourne.",
    },
    dbConfig: {
      users: [
        { username: 'admin',   password: 'V3rt3x@2024!' },
        { username: 'jdupont', password: 'Jean2024'      },
        { username: 'mleroy',  password: 'Agence123'     },
      ],
      sqliPatterns: [
        /'\s*OR\s*'1'\s*=\s*'1/i,
        /'\s*OR\s*1\s*=\s*1/i,
        /admin'\s*--/i,
        /'\s*--/i,
        /'\s*#/i,
        /1=1/i,
      ],
      // NE PAS MODIFIER
      fakeSessionToken:
        'eyJ1c2VyIjogImFkbWluIiwgInJvbGUiOiAic3VwZXJhZG1pbiIsICJmbGFnIjogIkZMQUd7c3FsMV9ieXc0c3MzZF80bmRfZDNjMGQzZH0ifQ==',
      level1Message:
        'Accès accordé. Session token : eyJ1c2VyIjogImFkbWluIiwgInJvbGUiOiAic3VwZXJhZG1pbiIsICJmbGFnIjogIkZMQUd7c3FsMV9ieXc0c3MzZF80bmRfZDNjMGQzZH0ifQ==\n\nIndice : ce token est encodé. Lis-le.',
      flagPlaintext: 'FLAG{sql1_byw4ss3d_4nd_d3c0d3d}',
      failMessage: '[403] Identifiants incorrects.',
    },
    solution: {
      flag: 'FLAG{sql1_byw4ss3d_4nd_d3c0d3d}',
      steps: [
        "Accéder au panneau admin via le lien dans la carte du challenge : /vertex-admin",
        "Tenter les credentials par défaut — accès accordé mais sans flag (authentification légitime non pertinente)",
        "Niveau 1 — Injecter un payload SQLi classique dans le champ username : ' OR '1'='1",
        "Le formulaire retourne un session token base64 et le message 'Accès accordé'",
        "Plusieurs autres payloads fonctionnent : admin'--, '--, '#, 1=1",
        "Niveau 2 — Décoder le token en base64 :",
        "  Console navigateur : atob('eyJ1c2VyIjogImFkbWluIi...')",
        "  Ou sur base64decode.org",
        "Le JSON décodé contient un champ 'flag' — c'est le flag du challenge",
      ],
      tools: ['navigateur (DevTools)', 'base64decode.org', 'console JS (atob())', 'Burp Suite'],
      notes: "Le token retourné est du JSON encodé en base64 pur — pas un JWT signé (pas de signature HMAC). En conditions réelles, tout payload contournant la concaténation SQL donne le même résultat. Payloads reconnus ici : OR bypass, commentaires SQL (-- et #), et la condition 1=1.",
    },
  },

  // ─────────────────────────────────────────
  // OSINT
  // ─────────────────────────────────────────

  {
    id: 'osint-1',
    category: 'osint',
    title: 'Who Am I?',
    difficulty: 'easy',
    description:
      'Une photo anodine prise dans le jardin du Directeur Général de Vertex Studio. ' +
      'Une simple boîte d\'allumettes dans l\'herbe. ' +
      'Mais les métadonnées, elles, ne mentent jamais.',
    tags: ['EXIF', 'metadata', 'exiftool'],
    artifact: {
      type: 'image',
      src: '/ctf/osint1.jpg',
      label: 'Photo — Vertex Studio Meeting #4',
    },
    // SHA-256 de FLAG{3x1f_m3t4d4t4_n3v3r_l13s} — NE PAS MODIFIER
    flagHash: 'bdaa3a8de135c5d96bf3b600196137385461d4b5f726f2270ef4179f904f033e',
    hint: {
      icon: 'Camera',
      text: 'Métadonnées EXIF — ExifTool',
      url: 'https://exiftool.org/',
      tooltip:
        'Les fichiers JPEG embarquent des métadonnées EXIF : GPS, appareil, auteur, commentaires. ' +
        "Utilise ExifTool (CLI) ou Jeffrey's Exif Viewer (web). " +
        'Exemple : exiftool osint1.jpg | grep -i comment',
    },
    solution: {
      flag: 'FLAG{3x1f_m3t4d4t4_n3v3r_l13s}',
      steps: [
        "Télécharger l'image osint1.jpg depuis la carte du challenge (bouton TÉLÉCHARGER)",
        "Analyser les métadonnées EXIF avec ExifTool :",
        "  $ exiftool osint1.jpg",
        "Filtrer sur le champ contenant le flag :",
        "  $ exiftool osint1.jpg | grep -i comment",
        "Le flag est encodé dans le champ EXIF 'Comment' de l'image",
        "Alternative web sans installation : Jeffrey's Exif Viewer — exif.regex.info — glisser-déposer l'image",
      ],
      tools: ["ExifTool (CLI)", "Jeffrey's Exif Viewer (exif.regex.info)", "FOCA", "strings (rapide mais bruyant)"],
      notes: "Les métadonnées EXIF survivent aux téléchargements directs mais sont supprimées par la plupart des hébergeurs (Twitter, Instagram, WhatsApp). ExifTool parse plus de 200 formats — JPEG, PNG, PDF, DOCX, MP4, etc.",
    },
  },

  {
    id: 'osint-2',
    category: 'osint',
    title: 'Wayback Rabbit',
    difficulty: 'medium',
    description:
      'Le site a été mis à jour. Certaines pages ont disparu. ' +
      "Mais Internet n'oublie jamais vraiment. " +
      'Il existe des sites mystères permettant de voyager dans le temps… 🕳',
    tags: ['Wayback Machine', 'web archive', 'robots.txt'],
    artifact: {
      type: 'text',
      value: 'Indice : consulte le fichier robots.txt de ce site.',
      label: 'Point de départ',
    },
    // SHA-256 de FLAG{w4yb4ck_s3cr3t_p4g3} — NE PAS MODIFIER
    flagHash: '9b22ce43a0add4715e0f5ab1031f7c1d0aac6e41215fbb09ec6de0065027d43b',
    hint: {
      icon: 'Clock',
      text: 'Voyager dans le temps sur le web',
      url: 'https://web.archive.org',
      tooltip:
        'La Wayback Machine archive des milliards de pages. ' +
        "Une page supprimée n'est pas forcément perdue. " +
        '💡 Les robots.txt sont aussi archivés — et parfois révélateurs.',
    },
    solution: {
      flag: 'FLAG{w4yb4ck_s3cr3t_p4g3}',
      steps: [
        "Consulter le fichier robots.txt du portfolio : https://benjaminbayle.tech/robots.txt",
        "Repérer la directive Disallow: /old/ — chemin volontairement exclu du crawl",
        "Construire l'URL de la page cachée : https://benjaminbayle.tech/old/secret.html",
        "La page retourne 404 en direct — elle a été supprimée du site actuel",
        "Rechercher l'URL sur la Wayback Machine : https://web.archive.org",
        "Ouvrir l'archive disponible — le flag est affiché en clair dans la page archivée",
      ],
      tools: ['web.archive.org', 'curl (pour lire robots.txt)', 'Wayback Machine CDX API'],
      notes: "robots.txt n'est pas un mécanisme de sécurité — il est public et indexé. Les directives Disallow sont des mines d'or en OSINT : chemins d'admin, pages de staging, répertoires sensibles. L'API CDX de la Wayback Machine permet d'automatiser la recherche d'archives.",
    },
  },

  {
    id: 'osint-3',
    category: 'osint',
    title: 'Dead Commit',
    difficulty: 'hard',
    description:
      "Le repo GitHub de ce portfolio a eu une vie avant d'être public. " +
      "Un développeur distrait a commité quelque chose qu'il ne fallait pas. " +
      "Il a supprimé le fichier. Il a poussé. Il a cru que c'était réglé.",
    tags: ['git', 'GitHub', 'commit history', 'OSINT passif'],
    artifact: {
      type: 'link',
      value: 'REPO_GITHUB_URL_A_RENSEIGNER',
      label: 'Repo GitHub du portfolio',
    },
    // SHA-256 de FLAG{g1t_n3v3r_f0rg3ts} — NE PAS MODIFIER
    flagHash: '94e896c712e78af13d288db59e2c4492cc72df5d89f1faeee2fe45f911c7f4e7',
    hint: {
      icon: 'GitCommit',
      text: 'Archéologie de dépôt Git',
      url: 'https://docs.github.com/en/repositories/working-with-files/using-files/viewing-a-file',
      tooltip:
        'Git conserve le historique complet, même les fichiers supprimés. ' +
        'CLI : git log --all --full-history -- "*.md" puis git show <hash>. ' +
        "Interface GitHub : onglet Commits — explorer les anciens commits.",
    },
    solution: {
      flag: 'FLAG{g1t_n3v3r_f0rg3ts}',
      steps: [
        "Identifier le repo GitHub du portfolio : https://github.com/Raptoredd/portfolio",
        "Cloner le repo localement :",
        "  $ git clone https://github.com/Raptoredd/portfolio.git && cd portfolio",
        "Rechercher dans l'historique complet un commit ayant introduit le mot FLAG :",
        "  $ git log --all -S 'FLAG' --oneline",
        "Repérer le commit suspect (message 'oops' ou équivalent)",
        "Inspecter le diff de ce commit :",
        "  $ git show <commit_hash>",
        "Le fichier .env.commited_by_mistake contient le flag en clair",
        "Alternative sans clone — onglet Commits GitHub → clic sur le commit suspect → voir le diff",
      ],
      tools: ['git CLI', 'interface GitHub (onglet Commits)', 'gh CLI', 'GitKraken'],
      notes: "git rm + git push ne supprime pas l'objet du dépôt distant — il reste accessible via git show. La commande git log -S 'mot-clé' (pickaxe) retrouve tout commit ayant ajouté ou supprimé ce mot-clé, même si le fichier n'existe plus.",
    },
  },

  // ─────────────────────────────────────────
  // CTI & REVERSE
  // ─────────────────────────────────────────

  {
    id: 'cti-1',
    category: 'cti',
    title: "Strings Don't Lie",
    difficulty: 'easy',
    description:
      'Un binaire ELF circule en interne chez Vertex Studio. ' +
      "Personne ne sait exactement ce qu'il fait. " +
      'Le code est conséquent. Mais parfois, la réponse est là, en clair, ' +
      'si on sait où chercher.',
    tags: ['reverse engineering', 'Ghidra', 'strings', 'ELF'],
    artifact: {
      type: 'download',
      src: '/ctf/chall_strings',
      label: 'Télécharger le binaire (ELF x86-64, ~15 Ko)',
      mimeType: 'application/octet-stream',
    },
    // SHA-256 de FLAG{r3v3rs3_str1ngs_4r3_fun} — NE PAS MODIFIER
    flagHash: '5a04980d9c30814c2f9b9a77b1ca76d628c86dcaf24a9deedbea5b738cbccf86',
    hint: {
      icon: 'Code2',
      text: 'Ghidra — Décompilateur (NSA)',
      url: 'https://ghidra-sre.org/',
      tooltip:
        'Ghidra est un outil de reverse engineering open-source publié par la NSA. ' +
        'Avant Ghidra : essaie strings ./chall_strings | grep FLAG ' +
        "— parfois c'est suffisant. Cherche bien, il y a du bruit.",
    },
    solution: {
      flag: 'FLAG{r3v3rs3_str1ngs_4r3_fun}',
      steps: [
        "Télécharger le binaire ELF chall_strings depuis la carte du challenge",
        "Extraire toutes les chaînes ASCII lisibles du binaire :",
        "  $ strings chall_strings",
        "Le binaire contient beaucoup de chaînes — filtrer directement sur le format du flag :",
        "  $ strings chall_strings | grep -i 'FLAG{'",
        "Le flag apparaît dans la sortie — il est stocké en clair dans une variable globale du programme",
        "Alternative avec Ghidra : importer le binaire → Window → Defined Strings → filtrer sur 'FLAG'",
        "Alternative avec radare2 : $ r2 chall_strings → iz~FLAG",
      ],
      tools: ['strings (Linux/macOS)', 'Ghidra', 'Radare2 (r2)', 'objdump -s'],
      notes: "La commande strings extrait toutes les séquences ASCII de longueur ≥ 4 d'un binaire. C'est toujours la première étape avant d'ouvrir un décompilateur — rapide, sans exécution, et souvent suffisant sur les binaires peu obfusqués.",
    },
  },

  {
    id: 'cti-2',
    category: 'cti',
    title: 'Dropper Anatomy',
    difficulty: 'hard',
    description:
      'Un script Python suspect a été intercepté sur un poste Vertex Studio. ' +
      'Obfusqué, avec des appels LOLbin et une tentative de récupération ' +
      "d'une ressource distante. Analyse statique uniquement. " +
      'Le flag est dans le code — mais il te faudra une clé pour le lire.',
    tags: ['malware statique', 'obfuscation', 'Python', 'base64', 'LOLbin'],
    artifact: {
      type: 'download',
      src: '/ctf/dropper_sample.exe',
      label: 'Télécharger dropper_sample.exe (PyInstaller, Windows)',
      warning: '⚠️ Sample éducatif — aucun payload réel, aucune exécution nécessaire',
    },
    // SHA-256 de FLAG{dr0pp3r_4n4t0my_d3c0d3d} — NE PAS MODIFIER
    flagHash: '12f71135276f0bd6f85f0479555e27b9cfc7fd5fcd1469eaa665014799c129e1',
    hint: {
      icon: 'Bug',
      text: 'Déobfuscation Python & outils',
      url: 'https://github.com/pycdc/pycdc',
      tooltip:
        "Méthode : 1) Lire sans exécuter. 2) Identifier les couches (base64, XOR). " +
        "3) Substituer eval()/exec() par print(). " +
        "4) Le flag est en deux parties — une dans le script, une sur /C2 de ce site.",
    },
    dropperConfig: {
      xorKey: 'V3RT3X',
      encryptedFlagHex: 'PLACEHOLDER_XOR_HEX',
      flagPlaintext: 'FLAG{dr0pp3r_4n4t0my_d3c0d3d}',
    },
    solution: {
      flag: 'FLAG{dr0pp3r_4n4t0my_d3c0d3d}',
      steps: [
        "Télécharger dropper_sample.exe — c'est un binaire compilé avec PyInstaller",
        "Extraire le bytecode Python embarqué : $ python pyinstxtractor.py dropper_sample.exe",
        "Décompiler le .pyc obtenu avec pycdc ou uncompyle6 pour retrouver le source Python",
        "Analyser le code reconstruit : repérer un blob de données hexadécimales obfusqué (variable chiffrée XOR)",
        "Repérer une requête HTTP vers une URL distante contenant '/C2' — l'endpoint de récupération de clé",
        "Naviguer vers /C2 sur ce portfolio — la page affiche en clair la clé de déchiffrement : V3RT3X",
        "Déchiffrer le blob avec XOR cyclique (clé V3RT3X) :",
        "  $ python3 -c \"key='V3RT3X'; enc=bytes.fromhex('BLOB_HEX'); print(''.join(chr(b ^ ord(key[i % len(key)])) for i, b in enumerate(enc)))\"",
        "Le contenu déchiffré révèle le flag du challenge",
      ],
      tools: ['éditeur de texte (VSCode, Notepad++)', 'python3 REPL', 'navigateur (page /C2)'],
      notes: "Le XOR avec clé cyclique est une technique d'obfuscation simple et très répandue dans les droppers réels. La récupération de clé depuis /C2 simule le comportement d'un malware en deux temps : dropper (obfusqué, livré à la victime) + serveur C2 (délivre la clé au runtime). Substituer eval() par print() est la première réflexe face à du code Python obfusqué.",
    },
  },

  {
    id: 'cti-3',
    category: 'cti',
    title: 'IOC Hunt',
    difficulty: 'wip',
    description: '',
    tags: [],
    artifact: {
      type: 'text',
      value: 'Le scénario et les artefacts de ce challenge sont en cours de rédaction.',
      label: 'STATUT',
    },
  },
];
