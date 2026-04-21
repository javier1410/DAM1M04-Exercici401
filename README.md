# DAM1M04-Exercici401 — MiniERP Botiga
Raul trollano
javier Rios

npm install
npm run dev
Navega a: http://localhost:3000


# si no encuentra el  archivo proxmox y falta permisos

chmod +x proxmoxConnect.sh
dos2unix proxmoxConnect.sh
./proxmoxConnect.sh

chmod +x proxmoxDeploy.sh
dos2unix proxmoxDeploy.sh
./proxmoxDeploy.sh


#
mysql -h 127.0.0.1 -P 3307 -u super -p escola
## Estructura

```
├── app.js              → Servidor + totes les rutes GET i POST
├── escola.sql          → Esquema + dades de prova
├── package.json
├── public/
│   ├── style.css       → Estils + 3 temes (clar, nit, contrast)
│   └── main.js         → Tema, menú actiu, validacions JS
└── views/
    ├── layouts/main.hbs
    ├── partials/       → header, menu, footer
    ├── dashboard.hbs
    ├── productes.hbs / producteAfegir.hbs / producteEditar.hbs
    ├── clients.hbs / clientAfegir.hbs / clientEditar.hbs / clientFitxa.hbs
    └── vendes.hbs / vendaAfegir.hbs
```
