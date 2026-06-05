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
        'Récupérer le hash affiché sur la card : a941a4c4fd0c01cddef61b8be963bf4c1e2b0811c037ce3f1835fddf6ef6c223',
        'Enregistrer dans un fichier : echo "a941..." > hash.txt',
        'Lancer Hashcat : hashcat -m 1400 -a 0 hash.txt rockyou.txt',
        'Le mot de passe "sunshine" est retrouvé (rang ~4000 dans rockyou.txt)',
        'Soumettre le flag : FLAG{sunshine}',
      ],
      tools: ['hashcat', 'john', 'rockyou.txt', 'CrackStation (web)'],
      notes: 'hashcat -m 1400 = mode SHA-256. Alternative online : crackstation.net',
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
        "Cliquer sur 'ENVOYER LA REQUÊTE' dans la card pour simuler GET /api/status",
        "Cliquer ensuite sur 'VOIR LES HEADERS BRUTS'",
        "Repérer le header non-standard : X-Debug-Flag",
        "La valeur du header contient le flag",
        "Soumettre : FLAG{h34d3rs_4r3_s1l3nt_w1tn3ss3s}",
      ],
      tools: ['curl -I', 'DevTools Network', 'Burp Suite'],
      notes: "Les headers de debug oubliés en production sont une source fréquente de fuite d'information (CWE-200).",
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
        "Niveau 1 — Bypass login : entrer ' OR '1'='1 dans le champ username",
        'Le formulaire retourne un "session token" (chaîne base64)',
        'Niveau 2 — Décoder le token : base64decode.org ou console JS : atob("eyJ1...")',
        'Le JSON décodé contient le champ "flag"',
        'Soumettre : FLAG{sql1_byw4ss3d_4nd_d3c0d3d}',
      ],
      tools: ['base64decode.org', 'console navigateur (atob())', 'Burp Suite'],
      notes: "Le token simulé est du JSON encodé en base64 pur (pas un vrai JWT signé).",
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
        "Télécharger l'image depuis la card (clic droit → Enregistrer)",
        'Analyser les métadonnées : exiftool osint1.jpg',
        'Le flag se trouve dans le champ "Comment" des métadonnées EXIF',
        "Alternative web : Jeffrey's Exif Viewer — coller l'image",
        'Soumettre : FLAG{3x1f_m3t4d4t4_n3v3r_l13s}',
      ],
      tools: ["exiftool", "Jeffrey's Exif Viewer (web)", 'ExifPurge'],
      notes: "Les EXIF ne survivent pas à tous les hébergements d'images (Twitter les supprime).",
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
        'Consulter le fichier robots.txt du site : https://[portfolio]/robots.txt',
        'Observer la ligne Disallow: /old/ — chemin suspect',
        'Aller sur web.archive.org et rechercher : https://[portfolio]/old/secret.html',
        'Trouver la version archivée de la page supprimée',
        'Le flag est affiché en clair sur la page archivée',
        'Soumettre : FLAG{w4yb4ck_s3cr3t_p4g3}',
      ],
      tools: ['web.archive.org', 'Wayback Machine', 'robots.txt'],
      notes: "Le fichier robots.txt est public et indexé par les moteurs — il liste souvent des chemins sensibles.",
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
        'Ouvrir le repo GitHub du portfolio',
        'Aller dans l\'onglet "Commits" (historique)',
        'Chercher un commit suspect : "remove sensitive file" ou similaire',
        'Cliquer sur ce commit — voir les fichiers modifiés',
        'Le fichier notes.md supprimé est visible avec son contenu',
        'CLI alternative : git clone [repo] && git log --all -- notes.md && git show <hash>:notes.md',
        'Soumettre : FLAG{g1t_n3v3r_f0rg3ts}',
      ],
      tools: ['git CLI', 'interface GitHub', 'GitKraken'],
      notes: "Un git push --force ne supprime pas l'historique côté GitHub (protections par défaut).",
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
        'Télécharger le binaire depuis la card',
        'Méthode 1 (simple) : strings ./chall_strings | grep -i flag',
        'Le binaire contient beaucoup de chaînes — filtrer intelligemment',
        'Méthode 2 (Ghidra) : importer le binaire, chercher dans les strings définies',
        'Le flag est hardcodé dans une variable globale char[] du programme',
        'Soumettre : FLAG{r3v3rs3_str1ngs_4r3_fun}',
      ],
      tools: ['strings (Linux/Mac)', 'Ghidra', 'Radare2', 'objdump'],
      notes: 'grep -i "flag{" est le filtre le plus direct.',
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
      src: '/ctf/dropper_sample.py',
      label: 'Télécharger dropper_sample.py',
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
        "Télécharger dropper_sample.py et l'ouvrir dans un éditeur (SANS l'exécuter)",
        'Repérer : 1) une variable contenant une suite hexadécimale — le flag chiffré',
        '          2) une URL de fetch vers [portfolio]/C2',
        'Naviguer vers [portfolio]/C2 — la page affiche la clé : V3RT3X',
        "Déchiffrer avec XOR cyclique : python3 -c \"key='V3RT3X'; enc=bytes.fromhex('ENCRYPTED_HEX'); print(''.join(chr(enc[i]^ord(key[i%len(key)])) for i in range(len(enc))))\"",
        'Une variable dans le code déchiffré contient le flag complet',
        'Soumettre : FLAG{dr0pp3r_4n4t0my_d3c0d3d}',
      ],
      tools: ['éditeur de texte', 'python3 REPL', 'navigateur (page /C2)'],
      notes:
        'XOR avec clé cyclique = technique d\'obfuscation simple mais courante dans les droppers. ' +
        'La clé sur /C2 simule la récupération d\'une clé depuis un serveur C2 réel.',
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
