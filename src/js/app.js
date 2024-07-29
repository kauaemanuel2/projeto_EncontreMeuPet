document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3000/api/pets')
        .then(response => response.json())
        .then(data => {
            const feedContainer = document.getElementById('feedContainer');
            const adocaoContainer = document.getElementById('adocaoContainer');

            data.forEach(pet => {
                const card = document.createElement('div');
                card.className = 'col-md-4 mb-4';
            
                let imagesHtml = '';
                if (Array.isArray(pet.images) && pet.images.length > 0) {
                    imagesHtml += `
                    <div id="carousel${pet.id}" class="carousel slide" data-bs-ride="carousel">
                        <div class="carousel-inner">
                    `;
            
                    pet.images.forEach((image, index) => {
                        imagesHtml += `
                        <div class="carousel-item ${index === 0 ? 'active' : ''}">
                            <img src="${image}" class="d-block w-100" alt="${pet.name}">
                        </div>
                        `;
                    });
            
                    imagesHtml += `
                        </div>
                        <button class="carousel-control-prev" type="button" data-bs-target="#carousel${pet.id}" data-bs-slide="prev">
                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Anterior</span>
                        </button>
                        <button class="carousel-control-next" type="button" data-bs-target="#carousel${pet.id}" data-bs-slide="next">
                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Próximo</span>
                        </button>
                    </div>
                    `;
                } else {
                    imagesHtml = '<img src="src/img/default.png" class="card-img-top" alt="Imagem não disponível">';
                }
            
                card.innerHTML = `
                    <div class="card">
                        <div class="card-images">
                            ${imagesHtml}
                        </div>
                        <div class="card-body">
                            <h5 class="card-title">${pet.name}</h5>
                            <p class="card-text">${pet.description}</p>
                            <p class="card-text"><strong>Status:</strong> ${pet.status}</p>
                            <p class="card-text"><strong>Localização:</strong> ${pet.location}</p>
                        </div>
                    </div>
                `;
                
                if (pet.status === 'disponível') {
                    adocaoContainer.appendChild(card);
                } else {
                    feedContainer.appendChild(card);
                }
            });
        })
        .catch(error => {
            console.error('Erro ao buscar os pets:', error);
        });
});
