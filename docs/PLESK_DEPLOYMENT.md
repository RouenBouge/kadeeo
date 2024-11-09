## Guide de déploiement sur Plesk avec GitHub

### 1. Préparation GitHub

1. Assurez-vous que votre projet est sur GitHub
2. Générez un token d'accès GitHub :
   - Allez dans Settings > Developer settings > Personal access tokens
   - Générez un nouveau token avec les droits `repo`
   - Copiez le token, il ne sera plus visible après

### 2. Configuration de la base de données MariaDB

1. Dans Plesk, allez dans "Bases de données"
2. Cliquez sur "Ajouter une base de données"
3. Créez une nouvelle base de données :
   - Nom : `kadeeo`
   - Type : MariaDB
   - Créez un utilisateur avec des droits complets
   - **Important** : Notez les identifiants

### 3. Configuration du domaine dans Plesk

1. Sélectionnez votre domaine
2. Allez dans "Hébergement"
3. Configurez :
   - Document root : `/httpdocs`
   - Version Node.js : 18.x ou supérieure
   - Activez SSL si ce n'est pas déjà fait

### 4. Configuration Git dans Plesk

1. Dans Plesk, allez sur votre domaine
2. Cliquez sur "Git"
3. Cliquez sur "Ajouter un dépôt Git"
4. Configurez :
   - URL du dépôt : `https://github.com/votre-username/votre-repo.git`
   - Branche : `main` (ou votre branche principale)
   - Login : votre username GitHub
   - Mot de passe : votre token d'accès GitHub
   - Chemin cible : `/httpdocs`
5. Cochez "Synchronisation automatique"
6. Cliquez sur "OK"

### 5. Configuration de l'environnement

1. Via le gestionnaire de fichiers Plesk, créez `.env` dans `/httpdocs/server` :
```env
DATABASE_URL="mysql://utilisateur:motdepasse@localhost:3306/kadeeo"
JWT_SECRET="votre-secret-jwt-super-securise"
PORT=3000
```

2. Créez `.env.production` dans `/httpdocs` :
```env
VITE_API_URL=https://api.votredomaine.com
```

### 6. Configuration du déploiement automatique

1. Dans Plesk, allez dans "Scheduled Tasks"
2. Ajoutez une nouvelle tâche :
```bash
cd /var/www/vhosts/votredomaine.com/httpdocs && npm install && cd server && npm install && npx prisma generate && npx prisma migrate deploy && cd .. && npm run build
```
3. Programmez-la pour s'exécuter après chaque synchronisation Git

### 7. Configuration de la base de données initiale

1. Connectez-vous en SSH :
```bash
ssh utilisateur@votreserveur.com
```

2. Initialisez la base de données :
```bash
cd /var/www/vhosts/votredomaine.com/httpdocs/server
npm run seed
```

### 8. Configuration du proxy Node.js

Dans Plesk :
1. Allez dans "Node.js"
2. Cliquez sur "Ajouter une application Node.js"
3. Configurez :
   - Document root : `/httpdocs/server`
   - Point d'entrée : `server.js`
   - Nom de domaine : `api.votredomaine.com`
   - Port : 3000
   - Variables d'environnement : copiez le contenu du fichier `.env`

### 9. Configuration des redirections Apache

Dans Plesk > Apache & nginx Settings, ajoutez dans la section "Additional directives" :

```apache
# Front-end (domaine principal)
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>

# API (sous-domaine api)
<IfModule mod_rewrite.c>
  RewriteEngine On
  ProxyPreserveHost On
  RewriteCond %{HTTP:Upgrade} =websocket [NC]
  RewriteRule ^/?(.*) ws://localhost:3000/$1 [P,L]
  RewriteCond %{HTTP:Upgrade} !=websocket [NC]
  RewriteRule ^/?(.*) http://localhost:3000/$1 [P,L]
</IfModule>
```

### 10. Démarrage et vérification

1. Dans Plesk > Node.js, démarrez l'application
2. Vérifiez les URLs :
   - Front-end : https://votredomaine.com
   - API : https://api.votredomaine.com

### Workflow de mise à jour

1. Poussez vos modifications sur GitHub
2. Plesk synchronisera automatiquement les changements
3. Le script de déploiement s'exécutera automatiquement
4. L'application Node.js redémarrera

### Dépannage

Si l'application ne démarre pas :
1. Vérifiez les logs dans Plesk > Node.js
2. Assurez-vous que tous les fichiers `.env` sont présents
3. Vérifiez les permissions des dossiers :
```bash
chmod -R 755 /var/www/vhosts/votredomaine.com/httpdocs
chown -R webuser:psacln /var/www/vhosts/votredomaine.com/httpdocs
```

### Identifiants par défaut

- Email : admin@example.com
- Mot de passe : admin123

⚠️ **Important** : Changez ces identifiants immédiatement après la première connexion !