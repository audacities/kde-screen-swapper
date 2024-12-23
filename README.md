# KWin Screen Swapper

Un script KWin qui permet d'intervertir toutes les fenêtres entre deux écrans tout en préservant leur état (taille, position, mode plein écran) et en gérant intelligemment les différences de résolution entre les écrans.

## Fonctionnalités

- Échange intelligent de toutes les fenêtres entre deux écrans
- Préservation de l'état des fenêtres (taille, position, plein écran)
- Gestion automatique des écrans de différentes tailles
- Mise à l'échelle proportionnelle des fenêtres
- Raccourci clavier configurable (par défaut : Meta+Ctrl+S)

## Prérequis

- KDE Plasma 5.x ou supérieur
- KWin comme gestionnaire de fenêtres

## Installation

1. Clonez ce dépôt :
```bash
git clone https://github.com/votre-username/kwin-screen-swapper
cd kwin-screen-swapper
```

2. Créez le package KWin :
```bash
zip -r screenswapper.kwinscript screenswapper/
```

3. Installation via l'interface graphique :
   - Ouvrez Paramètres système > Gestion des fenêtres > Scripts KWin
   - Cliquez sur "Importer un script KWin"
   - Sélectionnez le fichier screenswapper.kwinscript créé
   - Activez le script dans la liste

4. Installation via la ligne de commande :
```bash
plasmapkg2 --type kwinscript -i screenswapper.kwinscript
```

## Configuration

Le raccourci clavier par défaut est Meta+Ctrl+S. Pour le modifier :
1. Ouvrez Paramètres système > Raccourcis > Raccourcis globaux
2. Recherchez "Screen Swapper"
3. Définissez votre raccourci préféré

## Structure du projet

```
screenswapper/
├── contents/
│   └── code/
│       └── main.js         # Script principal
└── metadata.desktop        # Métadonnées du script
```

## Comment ça marche

Le script utilise une approche orientée objet avec deux classes principales :

- `WindowState` : Gère l'état d'une fenêtre
- `ScreenSwapper` : Contient la logique d'échange des fenêtres

Le processus d'échange :
1. Sauvegarde l'état de toutes les fenêtres
2. Calcule les ratios d'échelle entre les écrans
3. Déplace chaque fenêtre vers l'autre écran en ajustant sa position et sa taille
4. Restaure les états (comme le mode plein écran)

## Dépannage

En cas de problème, vérifiez les logs :
```bash
journalctl -f | grep kwin
```

Vous pouvez également désactiver/réactiver le script via les Paramètres système ou la ligne de commande :
```bash
plasmapkg2 --type kwinscript -r screenswapper  # Désinstaller
plasmapkg2 --type kwinscript -i screenswapper.kwinscript  # Réinstaller
```

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
- Signaler des bugs via les Issues
- Proposer des améliorations
- Soumettre des Pull Requests

## Licence

Ce projet est sous licence GPL - voir le fichier LICENSE pour plus de détails.
