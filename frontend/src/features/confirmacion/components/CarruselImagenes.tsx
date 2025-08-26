import React, { useState, useEffect } from 'react';

// Importar las imágenes locales
import imagen1 from '../../../img/1.webp';
import imagen2 from '../../../img/2.webp';
// import imagen3 from '../../../img/3.webp'; // Descomenta cuando tengas la tercera imagen

interface CarruselImagenesProps {
  imagenes?: string[];
  autoPlay?: boolean;
  interval?: number;
}

export const CarruselImagenes: React.FC<CarruselImagenesProps> = ({ 
  imagenes, 
  autoPlay = true, 
  interval = 4000 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Imágenes locales de la graduación
  const imagenesDefault = [
    imagen1,
    imagen2,
    // imagen3, // Descomenta cuando tengas la tercera imagen
  ].filter(Boolean); // Filtra valores undefined

  const imagenesActuales = imagenes && imagenes.length > 0 ? imagenes : imagenesDefault;

  useEffect(() => {
    if (!autoPlay || imagenesActuales.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === imagenesActuales.length - 1 ? 0 : prevIndex + 1
      );
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, imagenesActuales.length, interval]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? imagenesActuales.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === imagenesActuales.length - 1 ? 0 : currentIndex + 1);
  };

  if (imagenesActuales.length === 0) return null;

  return (
    <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-2xl overflow-hidden shadow-xl bg-gradient-to-r from-slate-900 to-slate-700">
      {/* Imagen actual */}
      <div className="relative w-full h-full">
        <img
          src={imagenesActuales[currentIndex]}
          alt={`Imagen del evento ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-opacity duration-500"
          loading="lazy"
        />
        
        {/* Overlay con gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        
        {/* Texto sobre la imagen */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
          <div className="text-white">
            <h3 className="text-lg md:text-xl font-semibold mb-1">
              🎓 Graduación de Ingeniería
            </h3>
            <p className="text-sm md:text-base text-white/90">
              Sábado 6 de Septiembre - Salón de Eventos Varela II
            </p>
          </div>
        </div>
      </div>

      {/* Controles de navegación */}
      {imagenesActuales.length > 1 && (
        <>
          {/* Flecha anterior */}
          <button
            onClick={goToPrevious}
            className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 rounded-full transition-all duration-300 hover:scale-110"
            aria-label="Imagen anterior"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Flecha siguiente */}
          <button
            onClick={goToNext}
            className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 rounded-full transition-all duration-300 hover:scale-110"
            aria-label="Imagen siguiente"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Indicadores de puntos */}
          <div className="absolute bottom-2 md:bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="flex space-x-2">
              {imagenesActuales.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-white scale-125'
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                  aria-label={`Ir a imagen ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {/* Contador de imágenes */}
      {imagenesActuales.length > 1 && (
        <div className="absolute top-2 md:top-4 right-2 md:right-4 bg-black/30 backdrop-blur-sm text-white text-xs md:text-sm px-2 md:px-3 py-1 rounded-full">
          {currentIndex + 1} / {imagenesActuales.length}
        </div>
      )}
    </div>
  );
};