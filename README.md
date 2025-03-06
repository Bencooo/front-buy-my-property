# 🌍 Buy My Property - Blockchain Land Ownership

Bienvenue dans **Buy My Property**, une application décentralisée (dApp) permettant d'acheter des pays en tant que **NFTs** sur la blockchain Ethereum grâce à un système de **minting** sécurisé et un **relayer gasless** via **OpenZeppelin Defender**.

## 🚀 Fonctionnalités principales

- **🌍 Globe 3D interactif** → Sélectionne un pays directement sur un globe terrestre.
- **📍 Coordonnées simplifiées** → Conversion des coordonnées du GeoJSON en un système X/Y simple.
- **✅ Minting des propriétés** → Achetez une parcelle de pays sous forme de NFT avec un simple clic.
- **⚡ Transactions sans gas (Gasless)** → Utilisation d'un relayer via OpenZeppelin Defender.
- **🔗 Intégration Thirdweb** → Gestion des contrats intelligents et des transactions sur Ethereum.

---

## 📦 Installation & Configuration

### 🛠️ Prérequis

- **Node.js** (v16+ recommandé)
- **npm** ou **yarn**
- **Metamask** (pour interagir avec la blockchain)
- **Un compte Thirdweb**
- **Un compte OpenZeppelin Defender** (pour le relayer gasless)

### 🚀 Installation

1. **Cloner le projet :**
```sh
   git clone https://github.com/votre-repo/buy-my-property.git
   cd buy-my-property
```
2. **Installer les dépendances :**

```bash
npm install
```

3. **Créer un fichier .env.local et ajouter vos variables d'environnement :**

```bash
NEXT_PUBLIC_CONTRACT_ADDRESS=0xVotreContrat
NEXT_PUBLIC_FORWARDER_ADDRESS=0xVotreForwarder
NEXT_PUBLIC_RELAYER_URL=https://api.defender.openzeppelin.com/actions/...
```

4. **Lancer le projet en développement :**

```bash
npm run dev
```

# 🎮 Utilisation

1.Sélectionner un pays sur le globe 3D.
2.Vérifier les informations affichées dans la pop-up.
3.Cliquer sur "Acheter" pour mint la parcelle (sous forme de NFT).
4.Consulter la transaction sur Etherscan (lien fourni après mint).
