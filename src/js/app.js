document.addEventListener('DOMContentLoaded', function() {
    fetch('http://localhost:3000/api/pets')
        .then(response => response.json())
        .then(pets => {
            console.log('Pets recebidos:', pets);
            const feedContainer = document.getElementById('feedContainer');
            
            if (!feedContainer) {
                console.error('Elemento com ID "feedContainer" não encontrado.');
                return;
            }

            pets.forEach(pet => {
                const card = document.createElement('div');
                card.className = 'col-md-4 mb-4';
                card.innerHTML = `
                    <div class="card">
                        <img src="${pet.imageUrl}" class="card-img-top" alt="${pet.name}">
                        <div class="card-body">
                            <h5 class="card-title">${pet.name}</h5>
                            <p class="card-text">${pet.description}</p>
                        </div>
                    </div>
                `;
                feedContainer.appendChild(card);
            });
        })
        .catch(error => console.error('Erro ao buscar os pets:', error));
});

