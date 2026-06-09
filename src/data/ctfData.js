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
    // flagHash — NE PAS MODIFIER
    flagHash: '616f10216cb7230228a5229d26221ee28f421df3f29c5fa4ef7d4eaa0df9c6a9',
    hint: {
      icon: 'Zap',
      text: 'Les mots de passe faibles ont une courte espérance de vie.',
      url: 'https://hashcat.net/wiki/doku.php?id=hashcat',
      tooltip: 'SHA-256 est un algorithme de hachage rapide — trop rapide pour protéger un mot de passe.',
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
    title: 'VisionCorp CCTV',
    category: 'pentest',
    difficulty: 'medium',
    points: 200,
    description: "Un système de vidéosurveillance interne tourne sur une app web. Tu as obtenu des credentials guest. Quelque chose dans ta session mérite d'être inspecté de plus près.",
    tags: ['JWT', 'hashcat', 'session', 'authentification'],
    hints: [
      "Les sessions web modernes ne sont pas toujours opaques.",
      "Un secret prévisible ne reste pas secret longtemps.",
    ],
    solution: {
      steps: [
        "Se connecter avec guest / guest123 — un token JWT est stocké dans localStorage",
        "DevTools → Application → Local Storage → http://localhost:5173 → copier la valeur de 'visioncorp_token'",
        "Coller le token dans le champ Encoded sur jwt.io — observer le payload : {\"role\": \"guest\"}",
        "Cracker le secret : hashcat -a 0 -m 16500 <token> rockyou.txt → secret : superman",
        "Sur jwt.io : modifier \"role\": \"guest\" → \"role\": \"admin\" dans le payload (colonne droite), entrer superman dans le champ Verify Signature (bas droite, 'secret base64 encoded' décoché), copier le token mis à jour dans le champ Encoded (colonne gauche)",
        "Retourner sur /visioncorp, coller le token forgé dans le champ 'Coller un token JWT', cliquer 'SE CONNECTER AVEC TOKEN' → accès admin → Live View → flag affiché",
      ],
      tools: ['hashcat', 'jwt.io', 'DevTools'],
      flag: 'FLAG{w34k_s3cr3t_c4m3r4_0wn3d}',
    },
    component: 'VisionCorpCCTV',
    // flagHash — NE PAS MODIFIER
    flagHash: '0992e9847a461a297087210f9ecfd6c42e54d139f5d328a269b1ca5c22dd392b',
  },

  {
    id: 'pentest-3',
    category: 'pentest',
    title: 'Inject the Past',
    difficulty: 'hard',
    description:
      "Un vieux panneau d'administration de Vertex Studio est resté en ligne. " +
      "La base de données des employés est protégée par un login. " +
      "Le développeur en charge était pressé ce vendredi soir-là.",
    tags: ['SQL injection', 'bypass', 'base64', 'JWT'],
    artifact: {
      type: 'form',
      label: 'Panneau admin — Vertex Studio v0.3',
    },
    // flagHash — NE PAS MODIFIER
    flagHash: '359493bed74485eeaf42f4da442aab31a1ee105baf50908e9c5b0ae82e58544c',
    hint: {
      icon: 'Database',
      text: "Injection SQL",
      url: 'https://portswigger.net/web-security/sql-injection',
      tooltip: "Une injection SQL exploite la concaténation dans une requête.",
    },
    dbConfig: {
      users: [
        { username: 'admin',   password: 'V3rt3x@2024!' },
        { username: 'jdupont', password: 'Jean2024'      },
        { username: 'mleroy',  password: 'Agence123'     },
      ],
      sqliBypass: "admin'--",
      fakeSessionToken: 'eyJ1c2VyIjogImFkbWluIiwgImxldmVsIjogMiwgInNlc3Npb24iOiAidmVydGV4X2ludGVybmFsIiwgInJlZGlyZWN0IjogIi92ZXJ0ZXgtYWRtaW4/dG9rZW49Y2Q4Zjg2N2EtMTY2Mi00ZGVhLWExNGMtMTAzZjcyMTY1OTc1In0=',
      sessionUUID: 'cd8f867a-1662-4dea-a14c-103f72165975',
      level1Message: 'Accès accordé. Session token :\n\neyJ1c2VyIjogImFkbWluIiwgImxldmVsIjogMiwgInNlc3Npb24iOiAidmVydGV4X2ludGVybmFsIiwgInJlZGlyZWN0IjogIi92ZXJ0ZXgtYWRtaW4/dG9rZW49Y2Q4Zjg2N2EtMTY2Mi00ZGVhLWExNGMtMTAzZjcyMTY1OTc1In0=',
      failMessage: '[403] Identifiants incorrects.',
      wafMessage: '[BLOCKED] WAF Signature: suspicious pattern detected.',
    },
    solution: {
      flag: 'FLAG{sql1_byw4ss3d_4nd_d3c0d3d}',
      steps: [
        "Accéder à /vertex-admin via le lien dans la carte du challenge",
        "Tenter les payloads SQLi courants — tous bloqués par le WAF avec message explicite",
        "Trouver le payload qui bypass le WAF : admin'-- dans le champ identifiant (mot de passe vide)",
        "Récupérer le token base64 retourné dans le SYSTEM OUTPUT",
        "Décoder le token : atob('<token>') dans la console navigateur ou sur base64decode.org",
        "Lire le champ 'redirect' dans le JSON décodé : /vertex-admin?token=cd8f867a-1662-4dea-a14c-103f72165975",
        "Naviguer vers cette URL — accès au niveau 2 : interface de gestion des comptes cloud Vertex Studio",
        "Repérer le compte OWNER (V. Studio) mis en évidence en amber",
        "Cliquer Reset mot de passe sur le compte OWNER → confirmer dans la modale",
        "Lire le faux email de réinitialisation affiché — le flag est dans le champ 'Token de récupération'",
      ],
      tools: ['navigateur (DevTools)', 'base64decode.org ou console JS (atob())'],
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
      "Une photo anodine prise lors d'une réunion interne de Vertex Studio. " +
      "Les images en disent parfois plus qu'on ne le croit.",
    tags: ['EXIF', 'metadata', 'exiftool'],
    artifact: {
      type: 'image',
      src: '/ctf/osint1.jpg',
      label: 'Photo — Vertex Studio Meeting #4',
    },
    // flagHash — NE PAS MODIFIER
    flagHash: 'bdaa3a8de135c5d96bf3b600196137385461d4b5f726f2270ef4179f904f033e',
    hint: {
      icon: 'Camera',
      text: "Les images embarquent parfois plus que ce que l'on voit.",
      url: 'https://exiftool.org/',
      tooltip: "Un fichier image contient des données invisibles à l'œil nu.",
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
      "Mais Internet n'oublie jamais vraiment.",
    tags: ['Wayback Machine', 'web archive', 'reconnaissance'],
    artifact: {
      type: 'text',
      value: 'benjaminbayle.tech',
      label: 'Cible',
    },
    // flagHash — NE PAS MODIFIER
    flagHash: '9b22ce43a0add4715e0f5ab1031f7c1d0aac6e41215fbb09ec6de0065027d43b',
    hint: {
      icon: 'Clock',
      text: "Internet n'oublie jamais.",
      url: 'https://web.archive.org',
      tooltip: "Certaines pages supprimées restent accessibles. La reconnaissance de base révèle parfois des chemins inattendus.",
    },
    solution: {
      flag: 'FLAG{w4yb4ck_s3cr3t_p4g3}',
      steps: [
        "Effectuer une reconnaissance de base sur le site : consulter robots.txt → https://benjaminbayle.tech/robots.txt",
        "Repérer la directive Disallow: /old/secret.html — chemin exposé involontairement",
        "Tenter l'URL : https://benjaminbayle.tech/old/secret.html → retourne 404 (page supprimée)",
        "Rechercher l'URL sur la Wayback Machine : https://web.archive.org",
        "Ouvrir l'archive disponible — le flag est affiché en clair dans la page archivée",
      ],
      tools: ['web.archive.org', 'curl'],
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
    // flagHash — NE PAS MODIFIER
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
    // flagHash — NE PAS MODIFIER
    flagHash: '5a04980d9c30814c2f9b9a77b1ca76d628c86dcaf24a9deedbea5b738cbccf86',
    hint: {
      icon: 'Code2',
      text: "Les binaires parlent, à qui sait écouter.",
      url: 'https://ghidra-sre.org/',
      tooltip: "L'analyse statique d'un binaire ne nécessite pas toujours un décompilateur.",
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
      'Un exécutable suspect a été intercepté sur un poste Vertex Studio. ' +
      'Obfusqué. Analyse statique uniquement. ' +
      'Le flag est dans le code — mais il te faudra trouver comment le lire.',
    tags: ['malware statique', 'obfuscation', 'Python', 'base64', 'LOLbin'],
    artifact: {
      type: 'download',
      src: '/ctf/dropper_sample.exe',
      label: 'Télécharger dropper_sample.exe (PyInstaller, Windows)',
      warning: '⚠️ Sample éducatif — aucun payload réel, aucune exécution nécessaire',
    },
    // flagHash — NE PAS MODIFIER
    flagHash: '12f71135276f0bd6f85f0479555e27b9cfc7fd5fcd1469eaa665014799c129e1',
    hint: {
      icon: 'Bug',
      text: "Déobfuscation Python",
      url: 'https://github.com/extremecoders-re/pyinstxtractor',
      tooltip: "Un exécutable PyInstaller embarque du bytecode Python extractible.",
    },
    dropperConfig: {
      xorKey: 'V3RT3X',
      encryptedFlagHex: 'PLACEHOLDER_XOR_HEX',
    },
    solution: {
      flag: 'FLAG{dr0pp3r_4n4t0my_d3c0d3d}',
      steps: [
        "Télécharger dropper_sample.exe — binaire compilé avec PyInstaller",
        "Extraire le bytecode Python embarqué : $ python pyinstxtractor.py dropper_sample.exe",
        "Décompiler le .pyc obtenu avec pycdc ou uncompyle6 pour retrouver le source Python",
        "Analyser le code reconstruit : repérer un blob hexadécimal chiffré et une clé de déchiffrement",
        "Repérer une requête HTTP vers une URL distante contenant '/C2' — endpoint de récupération de clé",
        "Naviguer vers /C2 sur ce portfolio — la page affiche la clé de déchiffrement",
        "Déchiffrer le blob avec XOR cyclique (clé récupérée sur /C2) :",
        "  $ python3 -c \"key='V3RT3X'; enc=bytes.fromhex('BLOB_HEX'); print(''.join(chr(b ^ ord(key[i % len(key)])) for i, b in enumerate(enc)))\"",
        "Le contenu déchiffré révèle le flag du challenge",
      ],
      tools: ['pyinstxtractor', 'pycdc ou uncompyle6', 'python3 REPL', 'navigateur (page /C2)'],
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
