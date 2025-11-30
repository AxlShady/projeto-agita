import React from 'react';
import Navbar from "../../components/publico/Navbar.jsx"; 
import '../../styles/Public.css'; 

// FUNÇÃO PARA RESOLVER CAMINHO DINAMICAMENTE
const getImageUrl = (name) => {
    // Isso resolve a URL da imagem de forma segura, partindo do módulo atual
    // O caminho 'assets/gallery' é o caminho relativo correto que você tinha
    try {
        return new URL(`../../assets/gallery/${name}`, import.meta.url).href;
    } catch (e) {
        console.error("Erro ao carregar imagem:", name, e);
        return ''; // Retorna vazio em caso de erro
    }
};

// Array de dados com o caminho dinâmico para evitar erros de import
const galleryPhotos = [
    { id: 1, src: getImageUrl('Maria_heloisa_pre_infantil.jpg'), alt: "Campeonato Pernambucano 2025" },
    { id: 2, src: getImageUrl('Maria_alice_pre_infantil.jpg'), alt: "Campeonato Pernambucano 2025" },
    { id: 3, src: getImageUrl('Larissa_Mirim.jpg'), alt: "Campeonato Pernambucano 2025" },
    { id: 4, src: getImageUrl('Valentina_Hunka_pre_infantil.jpg'), alt: "Campeonato Pernambucano 2025" },
    { id: 5, src: getImageUrl('Julia_infantil.jpg'), alt: "Campeonato Pernambucano 2025" },
    { id: 6, src: getImageUrl('Maria_Camilly_Juvenil.jpg'), alt: "Campeonato Pernambucano 2025" }
];


function Gallery() {
  return (
    <div className="public-page">
      <Navbar />

      {/* CABEÇALHO DA PÁGINA */}
      <div className="page-header">
        <h1 className="header-title-public">Galeria de Fotos</h1>
        <p className="header-subtitle-public">
            Reviva os melhores momentos das nossas apresentações e treinos.
        </p>
      </div>

      <div className="public-container">
        
        <div className="gallery-grid">
            {galleryPhotos.map(photo => (
                <div key={photo.id} className="gallery-item">
                    {/* A tag IMG usa o src resolvido pela função */}
                    <img src={photo.src} alt={photo.alt} />
                </div>
            ))}
        </div>

        {/* Mensagem se a galeria estiver vazia */}
        {galleryPhotos.length === 0 && (
             <div className="empty-message-public" style={{marginTop: '40px'}}>
                <p>Nenhuma foto disponível no momento.</p>
             </div>
        )}

      </div>
    </div>
  );
}

export default Gallery;