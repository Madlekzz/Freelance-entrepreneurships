import bannerImg from "../../../assets/Banner Emprendimiento.png";

export default function CatalogHero() {
  return (
    <div className="relative h-80 overflow-hidden">
      <img
        src={bannerImg}
        alt="Catálogo de productos - Emprendimientos internos Freelance Latin America"
        className="w-full h-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-primary/60" />

      {/* Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
        <p className="text-white/70 text-lg md:text-xl font-medium mb-1 uppercase tracking-wider">
          Emprendimientos internos
        </p>
        <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-2">
          Catálogo de productos
        </h1>
        <p className="text-white/60 md:text-xl text-lg">
          Apoya a tus compañeros comprando sus productos
        </p>
      </div>
    </div>
  );
}
