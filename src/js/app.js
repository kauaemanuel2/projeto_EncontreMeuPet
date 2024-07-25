document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3000/api/pets')
        .then(response => response.json())
        .then(data => {
            const feedContainer = document.getElementById('feedContainer');
            const adocaoContainer = document.getElementById('adocaoContainer');

            data.forEach(pet => {
                const card = document.createElement('div');
                card.className = 'col-md-4 mb-4';

                const imageUrl = pet.imageUrl || '';
                card.innerHTML = `
                    <div class="card">
                        <div class="card-images">
                            <img src="${imageUrl}" class="card-img-top" alt="${pet.name}">
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

    const form = document.getElementById('adicionarPetForm');
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = new FormData(form);

        fetch('http://localhost:3000/api/pets', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na resposta do servidor');
            }
            return response.json();
        })
        .then(data => {
            console.log('Pet adicionado com sucesso:', data);
            alert('Pet adicionado com sucesso!');
            location.reload(); // Atualiza a página para mostrar o novo pet
        })
        .catch(error => {
            console.error('Erro ao adicionar o pet:', error);
            alert('Erro ao adicionar o pet.');
        });
    });
});
