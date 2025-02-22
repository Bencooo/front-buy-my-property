import { useEffect, useRef, useState } from "react";
import Globe from "globe.gl";
import worldData from "../../../public/world.json"; // GeoJSON du monde
import countryCoordinates from "../../../public/country_coordinates.json"; // Coordonnées simplifiées

interface CountryData {
  properties: {
    name: string;
  };
  geometry: {
    coordinates: number[][][];
  };
}

interface GlobeProps {
  onSelect?: (country: CountryData, x: number, y: number) => void;
}

const GlobeComponent: React.FC<GlobeProps> = ({ onSelect }) => {
  const globeRef = useRef<HTMLDivElement | null>(null);
  const globeInstance = useRef<InstanceType<typeof Globe> | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  useEffect(() => {
    if (!globeRef.current) return;

    // ✅ Initialisation unique du globe
    if (!globeInstance.current) {
      globeInstance.current = new Globe(globeRef.current)
        .globeImageUrl("//unpkg.com/three-globe/example/img/earth-dark.jpg")
        .bumpImageUrl("//unpkg.com/three-globe/example/img/earth-topology.png")
        .polygonsData(worldData.features) // Données GeoJSON
        .polygonSideColor(() => "rgba(255, 255, 255, 0.15)")
        .polygonStrokeColor(() => "#111")
        .polygonLabel((polygon: any) => polygon?.properties?.name || "Pays inconnu")
        .onPolygonClick((polygon: any) => {
          const countryName = polygon?.properties?.name;
          console.log("✅ Pays sélectionné :", countryName);

          const country = countryCoordinates.find((c) => c.Country === countryName);
          if (country) {
            console.log(`🌍 Coordonnées simplifiées pour ${countryName} → X: ${country.X}, Y: ${country.Y}`);

            setSelectedCountry(countryName);

            if (onSelect) onSelect(polygon, country.X, country.Y);
          } else {
            console.warn("⚠️ Aucune coordonnée trouvée pour ce pays !");
          }
        });
    }

    // ✅ Mise à jour de la couleur du pays sélectionné sans recréer le globe
    globeInstance.current.polygonCapColor((polygon: any) =>
      polygon?.properties?.name === selectedCountry ? "rgba(0, 0, 255, 0.7)" : "rgba(0, 255, 0, 0.5)"
    );

  }, [selectedCountry]); // Met à jour seulement quand un pays est sélectionné

  return <div ref={globeRef} style={{ width: "100%", height: "600px" }} />;
};

export default GlobeComponent;
