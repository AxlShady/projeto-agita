import React from 'react';
import Navbar from '../../components/publico/Navbar.jsx'; 
import '../../styles/Public.css'; 

// IMPORTAÇÃO DAS FOTOS
import profIsabel from '../../assets/team/prof_isabel.jpg'; 
import profKaylane from '../../assets/team/prof_kaylane.jpg'; 

function About() {
  return (
    <div className="public-page">
      <Navbar />

      {/* CABEÇALHO DA PÁGINA */}
      <div className="page-header">
        <h1 className="header-title-public">Conheça a AGITA</h1>
        <p className="header-subtitle-public">
            Desenvolvendo o talento de jovens atletas desde 2020.
        </p>
      </div>

      <div className="public-container about-content">
        
        <p className="about-intro">
            A AGITA é uma academia de ginástica artística fundada em 2025 com a missão de 
            desenvolver o talento de jovens atletas.
        </p>
        
        {/* MISSAO E VALORES (GRID 2 COLUNAS) */}
        <div className="mission-values-grid">
            
            <section className="section-card">
                <h2 className="content-header-blue">Nossa Visão</h2> {/* CLASSE AZUL APLICADA */}
                <p>
                    Ser referência em Ginástica Rítmica no estado de Pernambuco, reconhecido pela excelência técnica, formação cidadã e impacto positivo na comunidade, contribuindo para o crescimento do esporte e revelação de talentos.

                </p>
            </section>

            <section className="section-card">
                <h2 className="content-header-blue">Nossos Valores</h2> {/* CLASSE AZUL APLICADA */}
                <p>
                  • Respeito: Valorizamos cada atleta em sua individualidade, promovendo um ambiente de empatia e colaboração.<br>
                  
                  
                  </br>
                  • Disciplina: Acreditamos que o comprometimento e a responsabilidade são pilares para o crescimento pessoal e esportivo.
                  • Excelência: Buscamos constantemente a melhoria técnica e pedagógica, com foco na qualidade do ensino e dos resultados.<br></br>
                  • Inclusão: Defendemos o acesso democrático ao esporte, acolhendo atletas de diferentes origens e realidades.<br></br>
                  • Paixão pelo esporte: Cultivamos o amor pela Ginástica Rítmica como fonte de inspiração, alegria e superação.<br></br>
                </p>
            </section>
        </div>


        {/* SEÇÃO DA EQUIPE COM FOTOS */}
        <section className="team-section">
            <h2 className="section-title">Nossa Equipe</h2>
            
            <div className="team-grid">
                
                <div className="team-member-card">
                    <div className="member-photo-placeholder">
                        <img src={profIsabel} alt="Foto da Professora Isabel" className="team-photo" />
                    </div>
                    <h4 className="member-name">Professora Isabel</h4>
                    <p className="member-bio">Técnica Auxiliar • Coreógrafa • Árbitra • Ginasta da Categoria Adulto Elite <br></br>

                    Maria Isabel é uma dos grandes talentos da ginástica rítmica pernambucana. Ela reúne uma trajetória admirável como atleta, técnica e árbitra, consolidando-se como uma referência na modalidade.<br></br>

                    Sua carreira esportiva é marcada por conquistas expressivas:<br></br>

                    • 7 vezes campeã pernambucana, atuando desde a categoria Pré-Infantil até a Adulta<br></br>
                    • 2 vezes campeã regional na categoria Pré-Infantil<br></br>
                    • 1 vez campeã nacional na categoria Pré-Infantil<br></br>
                    • 9 vezes finalista no Campeonato Brasileiro<br></br>
                    • Campeã dos Jogos Escolares da Juventude 2018<br></br>
                    • Vice-campeã dos Jogos Escolares da Juventude 2019<br></br>


                   Além de sua atuação como ginasta da categoria Adulto Elite, Maria Isabel contribui diretamente para o desenvolvimento técnico e artístico da equipe como Técnica Auxiliar e Coreógrafa, aplicando sua experiência prática e sensibilidade estética na formação de novas atletas. Como árbitra, ela também desempenha um papel fundamental na avaliação e promoção da qualidade técnica nas competições.<br></br>

                   Sua presença na equipe representa um compromisso com a excelência, a inovação e o crescimento da ginástica rítmica em Pernambuco.<br></br></p>
                </div>
                
                <div className="team-member-card">
                    <div className="member-photo-placeholder">
                        <img src={profKaylane} alt="Foto da Professora Kaylane" className="team-photo" />
                    </div>
                    <h4 className="member-name">Professora Kaylane</h4>
                    <p className="member-bio">Kayllane começou sua jornada na ginástica aos 9 anos e, desde então, tem se dedicado com paixão e determinação. Mesmo jovem, ela já levou várias ginastas ao pódio em Campeonato, Estadual, Regional, Nacional, entre outros.<br></br>

                    Formada em Educação Física, Kayllane defendeu seu TCC sobre a Ginástica Rítmica, demonstrando seu profundo conhecimento e amor pela modalidade.</p>
                </div>
                
            </div>
        </section>

      </div>
    </div>
  );
}

export default About;