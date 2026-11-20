# Guide frontend — StudentXchange

## 1. Configuration

En développement :

```text
API_URL=http://localhost:8080
```

Toutes les routes backend commencent par `/api`.

Health check :

```http
GET /actuator/health
```

Résultat attendu :

```json
{
  "status": "UP"
}
```

## 2. Authentification

### Inscription

```http
POST /api/auth/register
Content-Type: application/json
```

```json
{
  "email": "student@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "university": "University",
  "bio": "Computer science student",
  "avatarUrl": "https://example.com/avatar.jpg",
  "phoneNumber": "+212 600-000000"
}
```

Réponse : `201 Created`.

### Connexion

```http
POST /api/auth/login
Content-Type: application/json
```

```json
{
  "email": "student@example.com",
  "password": "password123"
}
```

Le backend retourne un access token dans la réponse JSON et place le refresh token dans un cookie HttpOnly.

Pour les routes utilisant le cookie :

```javascript
fetch(`${API_URL}/api/auth/refresh`, {
  method: "POST",
  credentials: "include"
});
```

Avec Axios :

```javascript
const api = axios.create({
  baseURL: "http://localhost:8080/api",
  withCredentials: true
});
```

L'access token doit être envoyé ainsi :

```http
Authorization: Bearer <access-token>
```

Ne pas stocker le refresh token dans `localStorage`. Il est géré par le cookie HttpOnly.

### Déconnexion

```http
POST /api/auth/logout
```

Après la déconnexion, le frontend doit supprimer l'access token local.

### Utilisateur courant

```http
GET /api/users/me
Authorization: Bearer <access-token>
```

Cette route retourne l'utilisateur connecté.

Le profil peut contenir un numéro de téléphone facultatif. Il pourra être utilisé
comme moyen de communication entre les participants tant que la messagerie interne
n'est pas disponible.

Le frontend doit afficher ce numéro uniquement dans un contexte autorisé, par exemple
sur le détail d'une réservation acceptée. Il ne faut pas l'afficher publiquement
dans les résultats de recherche sans l'accord de l'utilisateur.

### Modifier le profil

```http
PUT /api/users/me/profile
Authorization: ******
Content-Type: application/json
```

```json
{
  "firstName": "Younes",
  "lastName": "Student",
  "university": "University",
  "bio": "Java and tutoring",
  "avatarUrl": "https://example.com/avatar.png",
  "phoneNumber": "+212600000000"
}
```

`firstName` et `lastName` sont obligatoires. Les autres champs sont facultatifs.
Un champ facultatif vide ou `null` sera enregistré comme valeur vide supprimée.

### Interceptor recommandé

Le frontend devrait :

1. Ajouter automatiquement l'access token aux requêtes.
2. Si une requête retourne `401`, appeler `/api/auth/refresh` avec `credentials: include`.
3. Remplacer l'access token.
4. Rejouer la requête initiale.
5. Si le refresh échoue, rediriger vers `/login`.

Il faut éviter de lancer plusieurs refresh simultanément lorsque plusieurs requêtes retournent `401`.

## 3. Compétences

### Mes compétences

```http
GET /api/users/me/skills
Authorization: ******
```

Cette route retourne uniquement les compétences dont l'utilisateur authentifié est
propriétaire. Utiliser cette route pour les pages de profil au lieu de
`GET /api/skills`, qui retourne les compétences de tous les utilisateurs.

### Rechercher les compétences

Routes publiques :

```http
GET /api/skills
GET /api/skills?query=java
```

Réponse :

```json
[
  {
    "id": "skill-id",
    "name": "Java",
    "description": "Cours et accompagnement en Java",
    "price": 25,
    "averageRating": 4.5
  }
]
```

### Description d'une compétence

Une compétence peut contenir une description facultative de 2 000 caractères maximum.
Elle est envoyée lors de la création ou de la modification :

```json
{
  "name": "Java",
  "description": "Cours et accompagnement en Java",
  "price": 25
}
```

### Avis sur une compétence

Après une réservation terminée, l'acheteur peut laisser un avis sur le propriétaire :

```http
POST /api/skills/{skillId}/reviews
Authorization: Bearer <access-token>
Content-Type: application/json
```

```json
{
  "bookingId": "booking-id",
  "rating": 5,
  "comment": "Très bonne explication."
}
```

L'avis est attaché à la compétence. Le `bookingId` sert uniquement à prouver que
l'acheteur a bien réalisé un échange terminé pour cette compétence. Un seul avis est
autorisé par échange et la note doit être comprise entre 1 et 5.
Les avis publics d'une compétence sont disponibles avec :

```http
GET /api/skills/{skillId}/reviews
```

### Rechercher des utilisateurs par compétence

Cette route permet de trouver les étudiants qui proposent une compétence donnée :

```http
GET /api/users/search?skill=java
```

La recherche est publique et ne nécessite pas d'access token.

Réponse :

```json
[
  {
    "userId": "user-id",
    "firstName": "Younes",
    "lastName": "Student",
    "university": "University",
    "avatarUrl": null,
    "phoneNumber": "+212 600-000000",
    "skillId": "skill-id",
    "skillName": "Java",
    "skillDescription": "Java tutoring",
    "skillPrice": 25,
    "skillRating": 4.5
  }
]
```

La recherche est insensible à la casse et retourne une ligne par compétence correspondante.
Lorsqu'un utilisateur authentifié lance la recherche, ses propres compétences sont
exclues des résultats afin qu'il ne trouve pas sa propre offre.
`skillRating` est la moyenne des notes reçues par cette compétence, sur 5. Une
compétence sans avis retourne `0.0`.
Le numéro de téléphone étant une donnée personnelle, l'interface doit l'afficher avec
prudence et respecter les règles de confidentialité du produit.

### Créer une compétence

```http
POST /api/users/me/skills
Authorization: Bearer <access-token>
Content-Type: application/json
```

```json
{
  "name": "Java",
  "price": 25
}
```

Règles :

- `name` est obligatoire ;
- les espaces au début et à la fin sont supprimés ;
- `price` est obligatoire ;
- `price` doit être supérieur à zéro ;
- un utilisateur ne peut pas avoir deux compétences du même nom, sans distinction majuscule/minuscule.

Réponse : `201 Created`.

### Modifier une compétence

```http
PUT /api/users/me/skills/{skillId}
Authorization: Bearer <access-token>
Content-Type: application/json
```

```json
{
  "name": "Java avancé",
  "price": 35
}
```

### Supprimer une compétence

```http
DELETE /api/users/me/skills/{skillId}
Authorization: Bearer <access-token>
```

Réponse : `204 No Content`.

Une compétence appartenant à un autre utilisateur retourne `404`.

## 4. Réservations

### Créer une réservation

```http
POST /api/skills/{skillId}/book
Authorization: Bearer <access-token>
Content-Type: application/json
```

```json
{
  "realizationAt": "2026-12-01T14:00:00Z",
  "description": "I would like to practice Java streams and error handling."
}
```

`description` est facultative, limitée à 2 000 caractères, et permet au buyer
d'ajouter une demande ou des précisions sur l'échange.

`realizationAt` doit être :

- obligatoire ;
- au format ISO-8601 ;
- dans le futur ;
- envoyé en UTC de préférence.

Exemple JavaScript :

```javascript
const realizationAt = new Date(selectedDate).toISOString();
```

Le frontend ne doit pas envoyer le prix, l'identifiant du buyer ou l'identifiant du propriétaire. Le backend les détermine automatiquement.

Réponse : `201 Created`.

```json
{
  "id": "booking-id",
  "buyerId": "buyer-id",
  "skillId": "skill-id",
  "skillOwnerId": "owner-id",
  "skillName": "Java",
  "price": 25,
  "realizationAt": "2026-12-01T14:00:00Z",
  "description": "I would like to practice Java streams and error handling.",
  "status": "PENDING",
  "createdAt": "2026-11-19T05:00:00Z",
  "updatedAt": "2026-11-19T05:00:00Z"
}
```

Lors de la création :

- le prix est copié dans la réservation ;
- les tokens sont réservés dans le portefeuille du buyer ;
- la réservation est créée avec le statut `PENDING`.

Le frontend doit toujours afficher le prix enregistré dans la réservation, et non le prix actuel de la compétence. Le prix de la compétence peut changer après la réservation.

### Voir mes réservations

```http
GET /api/users/me/bookings
Authorization: Bearer <access-token>
```

Cette route retourne les réservations où l'utilisateur est buyer ou propriétaire de la compétence.

Séparation côté frontend :

```javascript
const myRequests = bookings.filter(
  booking => booking.buyerId === currentUser.id
);

const receivedRequests = bookings.filter(
  booking => booking.skillOwnerId === currentUser.id
);
```

### Accepter une réservation

Seul le propriétaire de la compétence peut accepter :

```http
PATCH /api/bookings/{bookingId}/accept
Authorization: Bearer <access-token>
```

Transition :

```text
PENDING -> ACCEPTED
```

### Refuser une réservation

```http
PATCH /api/bookings/{bookingId}/reject
Authorization: Bearer <access-token>
```

Transition :

```text
PENDING -> REJECTED
```

Les tokens réservés sont rendus au buyer.

### Annuler une réservation

Le buyer peut annuler une réservation `PENDING` :

```http
PATCH /api/bookings/{bookingId}/cancel
Authorization: Bearer <access-token>
```

Transition :

```text
PENDING -> CANCELLED
```

Les tokens sont remboursés.

### Terminer une réservation

Le buyer ou le propriétaire peut terminer une réservation acceptée :

```http
PATCH /api/bookings/{bookingId}/complete
Authorization: Bearer <access-token>
```

Transition :

```text
ACCEPTED -> COMPLETED
```

À ce moment :

- les tokens retenus sont libérés du buyer ;
- les tokens sont ajoutés au portefeuille du propriétaire ;
- le paiement ne peut pas être exécuté une seconde fois.

## 5. États à afficher

| Statut | Affichage recommandé | Actions |
|---|---|---|
| `PENDING` | En attente | Propriétaire : accepter/refuser ; buyer : annuler |
| `ACCEPTED` | Acceptée | Buyer/propriétaire : terminer |
| `REJECTED` | Refusée | Aucune |
| `CANCELLED` | Annulée | Aucune |
| `COMPLETED` | Terminée | Aucune |

Le frontend doit désactiver les boutons immédiatement après une action pour éviter les doubles clics.

## 6. Codes d'erreur

Format standard :

```json
{
  "timestamp": "2026-11-19T05:00:00Z",
  "status": 409,
  "error": "Conflict",
  "message": "Insufficient wallet balance",
  "path": "/api/skills/skill-id/book",
  "fieldErrors": {}
}
```

| Code | Signification | Action frontend |
|---|---|---|
| `400` | Données invalides | Afficher les erreurs du formulaire |
| `401` | Token absent ou expiré | Tenter le refresh puis rediriger vers login |
| `404` | Ressource inexistante ou inaccessible | Afficher « Ressource introuvable » |
| `409` | Conflit métier | Afficher le message retourné |
| `500` | Erreur serveur | Afficher un message générique |

Erreurs fréquentes pour les réservations :

```text
You cannot book your own skill
Insufficient wallet balance
An active booking already exists for this skill
Only pending bookings can be cancelled
Booking must be ACCEPTED
```

## 7. Format des dates

Le backend utilise des dates UTC au format ISO-8601 :

```text
2026-12-01T14:00:00Z
```

Pour l'affichage local :

```javascript
new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "long",
  timeStyle: "short"
}).format(new Date(booking.realizationAt));
```

Ne pas envoyer une date locale ambiguë comme :

```text
01/12/2026 14:00
```

Utiliser le format ISO lors de l'envoi à l'API.

## 8. Pages frontend recommandées

### Pages publiques

- Recherche des compétences ;
- détail d'une compétence ;
- connexion ;
- inscription.

### Pages authentifiées

- tableau de bord ;
- mes compétences ;
- création/modification d'une compétence ;
- mes demandes de réservation ;
- demandes reçues ;
- détail d'une réservation ;
- calendrier des dates de réalisation ;
- profil utilisateur.

### Composants importants

- `AuthProvider`
- `ProtectedRoute`
- `SkillCard`
- `SkillForm`
- `BookingForm`
- `BookingStatusBadge`
- `BookingActions`
- `DateTimePicker`
- `ErrorAlert`
- `LoadingState`

## 9. Flux utilisateur complet

### Buyer

```text
1. Se connecter
2. Rechercher une compétence
3. Ouvrir le détail
4. Choisir une date future
5. Créer la réservation
6. Voir le statut PENDING
7. Attendre l'acceptation
8. Réaliser l'échange
9. Cliquer sur Terminer
```

### Propriétaire de la compétence

```text
1. Se connecter
2. Ouvrir les demandes reçues
3. Consulter la compétence, le prix et la date
4. Accepter ou refuser
5. Réaliser l'échange si accepté
6. Confirmer la fin de la réservation
```

## 10. Checklist frontend

- [ ] Configurer `API_URL`.
- [ ] Prévoir le champ facultatif `phoneNumber` dans le profil.
- [ ] Afficher le numéro uniquement selon les règles de confidentialité du produit.
- [ ] Configurer `withCredentials: true` pour le refresh token.
- [ ] Ajouter l'access token dans `Authorization`.
- [ ] Implémenter le refresh automatique après `401`.
- [ ] Protéger les routes authentifiées.
- [ ] Afficher les prix en tokens.
- [ ] Ne jamais envoyer le prix lors d'une réservation.
- [ ] Utiliser un sélecteur de date et d'heure.
- [ ] Envoyer `realizationAt` au format ISO UTC.
- [ ] Refuser côté interface les dates passées.
- [ ] Afficher le statut de chaque réservation.
- [ ] Masquer les actions qui ne correspondent pas au rôle de l'utilisateur.
- [ ] Désactiver les boutons pendant une requête.
- [ ] Gérer les erreurs `400`, `401`, `404`, `409` et `500`.
- [ ] Afficher un état de chargement et un état vide.
- [ ] Afficher le prix sauvegardé dans la réservation.
