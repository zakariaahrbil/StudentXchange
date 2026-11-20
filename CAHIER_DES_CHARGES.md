# Cahier des charges — StudentXchange

**Version :** 1.1  
**Statut :** Document de conception — plateforme à développer  
**Date :** 19 novembre 2026

## 1. Présentation du projet

StudentXchange sera une plateforme destinée aux étudiants qui souhaitent proposer, rechercher et échanger des compétences et des services.

La plateforme fonctionnera avec une monnaie virtuelle appelée **token**. Un étudiant pourra proposer une compétence avec un prix en tokens. Un autre étudiant pourra réserver cette compétence, convenir d'une date de réalisation, puis confirmer la fin de l'échange.

L'objectif sera de créer un environnement fiable, sécurisé et simple d'utilisation pour favoriser l'entraide entre étudiants.

## 2. Objectifs

La plateforme devra permettre de :

- créer un compte étudiant ;
- gérer un profil personnel ;
- publier des compétences avec un prix ;
- rechercher les compétences disponibles ;
- réserver une compétence auprès d'un autre étudiant ;
- choisir une date de réalisation ;
- gérer les demandes de réservation ;
- sécuriser les paiements en tokens ;
- suivre le solde et l'historique du portefeuille ;
- évaluer les échanges terminés ;
- faciliter la communication entre les participants ;
- permettre à l'administration de modérer la plateforme.

## 3. Utilisateurs et rôles

### 3.1 Étudiant

Un étudiant pourra :

- s'inscrire et se connecter ;
- compléter son profil ;
- créer, modifier et supprimer ses propres compétences ;
- consulter les compétences publiques ;
- réserver la compétence d'un autre étudiant ;
- accepter, refuser ou annuler une réservation selon son rôle ;
- consulter ses réservations ;
- consulter son portefeuille ;
- envoyer et recevoir des messages liés à une réservation ;
- publier une évaluation après un échange terminé.

### 3.2 Administrateur

Un administrateur pourra :

- consulter les utilisateurs ;
- suspendre ou réactiver un compte ;
- modérer les compétences et les contenus ;
- consulter les réservations ;
- consulter les transactions ;
- traiter les signalements et les litiges ;
- gérer les catégories de compétences ;
- consulter les statistiques de la plateforme.

## 4. Fonctionnalités fonctionnelles

## 4.1 Création de compte

L'utilisateur devra fournir :

- une adresse email valide et unique ;
- un mot de passe sécurisé ;
- un prénom ;
- un nom.

Les champs facultatifs pourront être :

- l'université ;
- la biographie ;
- la photo de profil ;
- la localisation.
- un numéro de téléphone facultatif pour la communication.

Après l'inscription :

- le mot de passe devra être chiffré ;
- le compte devra être créé avec le statut `ACTIVE` ;
- un portefeuille devra être créé ;
- un bonus initial de tokens pourra être attribué ;
- l'utilisateur devra recevoir une confirmation de création du compte.

## 4.2 Authentification

La plateforme devra proposer :

- la connexion par email et mot de passe ;
- la génération d'un access token ;
- la génération d'un refresh token ;
- le renouvellement de session ;
- la déconnexion ;
- la protection des routes privées ;
- la gestion des sessions expirées ;
- la possibilité de suspendre l'accès d'un utilisateur.

Le refresh token devra être stocké de manière sécurisée, notamment dans un cookie HttpOnly. Les mots de passe et les tokens ne devront jamais être exposés dans les réponses ou les journaux applicatifs.

## 4.3 Gestion du profil

L'étudiant devra pouvoir :

- consulter son profil ;
- modifier ses informations personnelles via son profil connecté ;
- modifier sa biographie ;
- ajouter ou modifier son avatar ;
- consulter uniquement les compétences qu'il propose ;
- consulter ou modifier son numéro de téléphone ;
- consulter son solde disponible en tokens ;
- consulter sa note moyenne ;
- consulter le nombre d'échanges terminés.

Les informations personnelles modifiables devront comprendre le prénom, le nom,
l'université, la biographie, l'avatar et le numéro de téléphone. Le prénom et le
nom devront rester obligatoires. Les champs facultatifs pourront être supprimés
avec une valeur vide ou `null`.

Un profil public pourra afficher uniquement les informations autorisées par la plateforme.

Le numéro de téléphone ne devra pas être affiché publiquement par défaut. Tant que
la messagerie interne ne sera pas disponible, il pourra être communiqué au participant
concerné dans le contexte d'une réservation autorisée, selon le consentement de
l'utilisateur et les règles de confidentialité du produit.

## 4.4 Gestion des compétences

Une compétence devra contenir au minimum :

- un identifiant ;
- un nom ;
- une description ;
- un prix en tokens ;
- une catégorie ;
- un niveau ;
- une durée estimée ;
- un propriétaire ;
- une date de création ;
- un statut de disponibilité.

Les niveaux proposés pourront être :

- `BEGINNER` — débutant ;
- `INTERMEDIATE` — intermédiaire ;
- `ADVANCED` — avancé.

Les catégories pourront inclure :

- programmation ;
- langues ;
- design ;
- marketing ;
- mathématiques ;
- musique ;
- soutien scolaire ;
- orientation professionnelle ;
- autres catégories gérées par l'administration.

### Règles métier

- Chaque compétence devra appartenir à un utilisateur.
- Un utilisateur ne pourra pas créer deux compétences portant le même nom.
- La comparaison des noms devra être insensible à la casse.
- Le prix devra être strictement supérieur à zéro.
- Le propriétaire sera le seul à pouvoir modifier ou supprimer sa compétence.
- Une description facultative pourra expliquer le contenu de la compétence.
- La liste « Mes compétences » devra être filtrée par le propriétaire connecté
  afin de ne jamais afficher les compétences d'un autre utilisateur.
- Un utilisateur ne pourra pas réserver sa propre compétence.
- Une compétence indisponible ne devra pas pouvoir être réservée.
- La suppression d'une compétence ayant des réservations devra respecter une règle définie : archivage recommandé plutôt que suppression définitive.

## 4.5 Recherche et découverte

Les utilisateurs devront pouvoir :

- rechercher par nom ;
- filtrer par catégorie ;
- filtrer par niveau ;
- filtrer par prix minimum et maximum ;
- filtrer par disponibilité ;
- trier par prix ;
- trier par note ;
- afficher la note globale de chaque compétence, calculée comme la moyenne des
  évaluations reçues, sur 5 ;
- trier par date de publication ;
- consulter les détails d'une compétence ;
- consulter le profil de son propriétaire.

Les résultats devront être paginés afin de préserver les performances.

La recherche des utilisateurs par compétence devra accepter un paramètre optionnel
`skill`. Lorsque aucun paramètre n'est fourni, l'API devra retourner une liste
vide plutôt qu'une erreur `400 Bad Request`, afin de permettre l'affichage initial
de l'écran de découverte.

## 4.6 Portefeuille et tokens

Chaque étudiant devra disposer d'un portefeuille contenant :

- un solde disponible ;
- un solde bloqué ;
- une version pour gérer les opérations concurrentes ;
- un historique des transactions.

Les types de transactions pourront être :

- bonus initial ;
- blocage lors d'une réservation ;
- libération après refus ou annulation ;
- remboursement ;
- gain du propriétaire ;
- correction administrative.

### Règles de sécurité financière

- Le solde disponible ne devra jamais être négatif.
- Le solde bloqué ne devra jamais être négatif.
- Un étudiant ne pourra pas dépenser des tokens bloqués.
- Chaque mouvement devra être enregistré.
- Une opération financière devra être atomique.
- Une réservation et son blocage de tokens devront être validés dans la même transaction.
- Une erreur devra annuler toutes les modifications liées à l'opération.
- Les mises à jour concurrentes devront être protégées contre la double dépense.

## 4.7 Réservation et échange

Une réservation devra être liée à :

- l'étudiant acheteur ;
- la compétence ;
- le propriétaire de la compétence ;
- le prix au moment de la réservation ;
- la date de réalisation ;
- une description ou demande facultative ;
- le statut ;
- les dates de création et de modification.

Le prix devra être copié dans la réservation afin qu'une modification ultérieure du prix de la compétence n'affecte pas une réservation existante.

La description de la réservation devra permettre à l'acheteur d'expliquer ses
besoins ou les détails souhaités pour l'échange. Elle devra être limitée à
2 000 caractères et pourra être absente.

La réponse liée à une réservation devra permettre au frontend d'afficher les
cartes des deux partenaires. Elle devra inclure pour l'acheteur et le propriétaire :

- l'identifiant ;
- le nom complet ;
- l'adresse électronique ;
- le numéro de téléphone, sous réserve des règles de confidentialité.

### Création d'une réservation

L'acheteur devra :

1. choisir une compétence ;
2. consulter son prix ;
3. sélectionner une date et une heure futures ;
4. confirmer la réservation.

Le système devra :

1. vérifier que la compétence existe ;
2. vérifier que l'acheteur n'est pas le propriétaire ;
3. vérifier que la compétence est disponible ;
4. vérifier que l'acheteur possède suffisamment de tokens ;
5. bloquer le prix dans le portefeuille de l'acheteur ;
6. enregistrer une transaction de type `HOLD` ;
7. créer la réservation avec le statut `PENDING`.

Le client ne devra pas pouvoir envoyer ou modifier le prix, l'acheteur ou le propriétaire. Ces informations devront être calculées côté serveur.

### Date de réalisation

La date de réalisation devra :

- être obligatoire ;
- être dans le futur au moment de la création ;
- utiliser le format ISO-8601 ;
- être enregistrée avec son fuseau ou en UTC ;
- être affichée selon le fuseau horaire de l'utilisateur ;
- pouvoir être consultée par les deux participants.

## 4.8 Cycle de vie d'une réservation

Les statuts seront :

```text
PENDING
ACCEPTED
REJECTED
CANCELLED
COMPLETED
```

Le cycle normal sera :

```text
PENDING -> ACCEPTED -> COMPLETED
```

Les autres sorties possibles seront :

```text
PENDING -> REJECTED
PENDING -> CANCELLED
```

### Acceptation

Seul le propriétaire de la compétence pourra accepter une réservation `PENDING`.

L'acceptation :

- devra passer la réservation à `ACCEPTED` ;
- devra conserver les tokens bloqués ;
- devra notifier l'acheteur.

### Refus

Seul le propriétaire de la compétence pourra refuser une réservation `PENDING`.

Le refus :

- devra passer la réservation à `REJECTED` ;
- devra libérer les tokens bloqués ;
- devra enregistrer une transaction de libération ou de remboursement ;
- devra notifier l'acheteur.

### Annulation

L'acheteur pourra annuler une réservation `PENDING`.

L'annulation :

- devra passer la réservation à `CANCELLED` ;
- devra rembourser les tokens bloqués ;
- devra empêcher toute acceptation ultérieure.

Une règle supplémentaire devra être définie pour l'annulation d'une réservation `ACCEPTED`, par exemple une date limite ou l'ouverture d'un litige.

### Finalisation

L'acheteur ou le propriétaire pourra confirmer la fin d'une réservation `ACCEPTED`, selon la règle métier retenue.

La finalisation :

- devra passer la réservation à `COMPLETED` ;
- devra retirer les tokens du solde bloqué de l'acheteur ;
- devra créditer le portefeuille du propriétaire ;
- devra enregistrer les transactions correspondantes ;
- devra empêcher tout paiement en double ;
- devra permettre l'ouverture d'une évaluation.

## 4.9 Notifications

Les participants devront être informés lors des événements suivants :

- nouvelle réservation ;
- réservation acceptée ;
- réservation refusée ;
- réservation annulée ;
- réservation terminée ;
- date de réalisation proche ;
- nouveau message ;
- nouveau litige ;
- nouvelle évaluation.

Les notifications pourront être envoyées :

- dans l'application ;
- par email ;
- éventuellement par notification push.

## 4.10 Messagerie

Chaque réservation pourra posséder une conversation privée entre l'acheteur et le propriétaire.

La messagerie devra permettre :

- l'envoi de messages texte ;
- la consultation de l'historique ;
- l'affichage de la date d'envoi ;
- la notification des nouveaux messages ;
- le signalement d'un contenu abusif.

Seuls les participants de la réservation et les administrateurs autorisés pourront consulter la conversation.

## 4.11 Évaluations et réputation

Après une réservation `COMPLETED`, l'acheteur pourra évaluer la compétence utilisée.
Le propriétaire pourra ainsi obtenir une réputation liée à sa prestation.

Une évaluation pourra contenir :

- une note de 1 à 5 ;
- une note globale de la compétence calculée à partir de toutes ses évaluations ;
- un commentaire ;
- une date ;
- une référence vers la réservation.

Règles :

- une seule évaluation par réservation ;
- une évaluation uniquement après finalisation ;
- aucune auto-évaluation ;
- impossibilité de modifier une note après validation, ou modification limitée dans le temps ;
- calcul d'une moyenne affichable sur le profil.

## 4.12 Litiges

Un participant pourra ouvrir un litige concernant une réservation.

Motifs possibles :

- service non réalisé ;
- retard important ;
- contenu non conforme ;
- problème de paiement ;
- comportement inapproprié ;
- désaccord sur la finalisation.

Un litige devra contenir :

- la réservation concernée ;
- l'auteur ;
- le motif ;
- une description ;
- les pièces jointes éventuelles ;
- un statut ;
- les dates de création et de résolution.

L'administrateur pourra :

- demander des informations complémentaires ;
- rembourser l'acheteur ;
- confirmer le paiement du propriétaire ;
- clôturer le litige ;
- suspendre un utilisateur.

## 4.13 Administration et modération

L'espace d'administration devra proposer :

- une liste des utilisateurs ;
- une recherche d'utilisateur ;
- la suspension et la réactivation d'un compte ;
- la consultation des compétences ;
- la suppression ou l'archivage d'un contenu ;
- la consultation des réservations ;
- la consultation des transactions ;
- la gestion des catégories ;
- le traitement des signalements ;
- la gestion des litiges ;
- des statistiques globales.

Toutes les actions administratives sensibles devront être journalisées.

## 5. API à prévoir

### Authentification

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
```

### Utilisateurs et profils

```text
GET    /api/users/me
PUT    /api/users/me/profile
GET    /api/users/{userId}
GET    /api/users/{userId}/skills
```

`GET /api/users/me` devra inclure le solde disponible `tokenBalance`.
`PUT /api/users/me/profile` devra permettre la modification complète des
informations personnelles du profil connecté.

### Compétences

```text
GET    /api/skills
GET    /api/skills/{skillId}
GET    /api/users/me/skills
GET    /api/users/search?skill={skillName}
POST   /api/users/me/skills
PUT    /api/users/me/skills/{skillId}
DELETE /api/users/me/skills/{skillId}
```

La recherche par compétence devra retourner les informations de base de l'étudiant
et la compétence correspondante, notamment son nom, sa description, son prix et sa
note globale. Le paramètre `skill` devra être facultatif. `GET /api/users/me/skills`
devra retourner uniquement les compétences du propriétaire authentifié.

### Réservations

```text
POST  /api/skills/{skillId}/book
GET   /api/users/me/bookings
GET   /api/bookings/{bookingId}
PATCH /api/bookings/{bookingId}/accept
PATCH /api/bookings/{bookingId}/reject
PATCH /api/bookings/{bookingId}/cancel
PATCH /api/bookings/{bookingId}/complete
```

La demande de réservation pourra contenir `realizationAt` et une `description`
facultative limitée à 2 000 caractères.

Les objets de réservation devront présenter les informations des partenaires :
`buyerName`, `buyerEmail`, `buyerPhoneNumber`, `skillOwnerName`,
`skillOwnerEmail` et `skillOwnerPhoneNumber`, ainsi que `description`.

### Portefeuille

```text
GET /api/users/me/wallet
GET /api/users/me/wallet/transactions
```

### Messages, évaluations et litiges

```text
GET  /api/bookings/{bookingId}/messages
POST /api/bookings/{bookingId}/messages
POST /api/skills/{skillId}/reviews
GET  /api/skills/{skillId}/reviews
POST /api/bookings/{bookingId}/dispute
GET  /api/users/me/disputes
```

## 6. Exigences de sécurité

La plateforme devra :

- chiffrer les mots de passe avec un algorithme adapté ;
- utiliser HTTPS en production ;
- protéger les routes par authentification ;
- vérifier les droits sur chaque ressource ;
- empêcher un utilisateur d'accéder aux réservations d'autrui ;
- valider toutes les données entrantes ;
- limiter les tentatives de connexion ;
- appliquer une protection contre les attaques par force brute ;
- sécuriser les cookies ;
- éviter les informations sensibles dans les logs ;
- protéger les opérations de portefeuille contre la concurrence ;
- journaliser les opérations administratives et financières ;
- appliquer une politique CORS restrictive ;
- prévoir une stratégie de sauvegarde de la base de données.

## 7. Exigences techniques

### Backend

Le backend devra :

- exposer une API REST ;
- utiliser une base de données relationnelle ;
- versionner les migrations de schéma ;
- séparer contrôleurs, services, repositories et entités ;
- centraliser la gestion des erreurs ;
- fournir une documentation API ;
- produire des logs exploitables ;
- respecter les principes de transaction et d'intégrité des données.

### Frontend

Le frontend devra :

- être responsive ;
- fonctionner sur ordinateur, tablette et mobile ;
- proposer des états de chargement, erreur et absence de données ;
- gérer l'expiration des sessions ;
- afficher clairement les statuts ;
- empêcher les doubles soumissions ;
- respecter les règles d'accessibilité ;
- fournir des messages d'erreur compréhensibles.

## 8. Scénarios principaux

### Scénario A — Création d'une compétence

1. L'étudiant se connecte.
2. Il ouvre la page « Mes compétences ».
3. Il saisit le nom, la description, la catégorie, le niveau et le prix.
4. Le système valide les données.
5. La compétence est créée et devient visible dans la recherche.

### Scénario B — Réservation d'une compétence

1. L'étudiant recherche une compétence.
2. Il consulte son prix et son propriétaire.
3. Il choisit une date future et peut saisir une description de ses besoins.
4. Il confirme la réservation.
5. Le système vérifie son solde.
6. Le prix est bloqué.
7. La réservation passe à `PENDING`.
8. Le propriétaire reçoit une notification.

### Scénario D — Gestion du profil

1. L'étudiant ouvre la page de profil.
2. Il consulte ses informations actuelles et son solde de tokens.
3. Il modifie ses noms, sa biographie, son université, son avatar ou son téléphone.
4. Le backend valide les données et retourne le profil mis à jour.
5. Sur la page « Mes compétences », l'utilisateur consulte uniquement les compétences
   appartenant à son compte via `GET /api/users/me/skills`.

### Scénario C — Acceptation et réalisation

1. Le propriétaire consulte ses demandes reçues.
2. Il accepte la réservation.
3. La réservation passe à `ACCEPTED`.
4. Les participants réalisent l'échange à la date prévue.
5. L'un des participants confirme la fin.
6. La réservation passe à `COMPLETED`.
7. Les tokens sont transférés au propriétaire.
8. L'acheteur peut publier une évaluation.

### Scénario D — Refus ou annulation

1. Une réservation est `PENDING`.
2. Le propriétaire la refuse ou l'acheteur l'annule.
3. La réservation passe à `REJECTED` ou `CANCELLED`.
4. Les tokens bloqués sont rendus à l'acheteur.
5. Les participants sont notifiés.

### Scénario E — Solde insuffisant

1. L'étudiant tente de réserver une compétence.
2. Le système constate que le solde disponible est insuffisant.
3. Aucune réservation ne doit être créée.
4. Aucun token ne doit être bloqué.
5. Un message explicite doit être affiché.

## 9. Règles d'erreur

Les réponses d'erreur devront utiliser une structure standard contenant au minimum :

- la date ;
- le code HTTP ;
- le type d'erreur ;
- un message lisible ;
- le chemin de la requête ;
- les erreurs par champ si nécessaire.

Codes attendus :

| Code | Utilisation |
|---|---|
| `400` | Données invalides ou format incorrect |
| `401` | Authentification absente ou invalide |
| `403` | Action interdite pour l'utilisateur |
| `404` | Ressource inexistante ou non accessible |
| `409` | Conflit métier ou solde insuffisant |
| `429` | Trop de requêtes |
| `500` | Erreur interne |

## 10. Tests et critères d'acceptation

### Tests fonctionnels

Les tests devront couvrir :

- inscription valide ;
- inscription invalide ;
- email déjà utilisé ;
- connexion valide ;
- mauvais mot de passe ;
- refresh token invalide ;
- accès sans authentification ;
- création, modification et suppression d'une compétence ;
- compétence appartenant à un autre utilisateur ;
- prix nul ou négatif ;
- réservation d'une compétence inexistante ;
- réservation de sa propre compétence ;
- réservation avec solde insuffisant ;
- réservation avec date passée ;
- réservation en double ;
- acceptation par le propriétaire ;
- acceptation par un utilisateur non autorisé ;
- refus et remboursement ;
- annulation et remboursement ;
- finalisation et transfert ;
- double finalisation ;
- concurrence sur le portefeuille ;
- accès à une réservation étrangère ;
- création d'une évaluation avant finalisation ;
- création de plusieurs évaluations pour une même réservation.

### Critères d'acceptation généraux

Le projet sera considéré comme prêt lorsque :

- les parcours principaux fonctionneront de bout en bout ;
- les règles d'autorisation seront vérifiées ;
- aucune opération financière ne pourra créer de solde négatif ;
- les migrations fonctionneront sur une base vide et une base existante ;
- les tests automatisés seront passants ;
- les erreurs seront explicites ;
- les données sensibles seront protégées ;
- la documentation API et frontend sera disponible ;
- l'application sera déployable avec une procédure documentée.

## 11. Livrables attendus

- application backend ;
- application frontend ;
- schéma de base de données ;
- migrations versionnées ;
- documentation API ;
- guide d'installation ;
- guide frontend ;
- documentation d'administration ;
- tests unitaires ;
- tests d'intégration ;
- tests des endpoints ;
- configuration Docker ;
- procédure de déploiement ;
- procédure de sauvegarde et restauration.

## 12. Évolutions futures

Les évolutions suivantes pourront être étudiées après la première version :

- notifications push ;
- calendrier synchronisable ;
- paiement externe ;
- échanges entre plusieurs participants ;
- abonnements premium ;
- recommandations personnalisées ;
- système de niveaux et de badges ;
- vérification de diplômes ou certificats ;
- application mobile native ;
- support de plusieurs langues ;
- conversion de tokens selon des règles administratives.
