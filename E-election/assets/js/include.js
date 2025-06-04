// assets/js/include.js

// Fonction pour inclure un composant HTML dans un élément du DOM (comme un header ou un footer)
function includeComponent(selector, url) {
    
    // fetch() permet de charger le contenu du fichier spécifié par l'URL
    fetch(url)
        .then(response => response.text()) // Une fois le fichier récupéré, on le transforme en texte HTML
        .then(data => {
            // On insère le contenu HTML dans l'élément ciblé par le sélecteur (par exemple "#header-container")
            document.querySelector(selector).innerHTML = data;
        })
        .catch(error => 
            // Si une erreur survient (ex. : le fichier n’existe pas), on affiche un message dans la console
            console.error(`Erreur lors du chargement de ${url} :`, error)
        );
}
