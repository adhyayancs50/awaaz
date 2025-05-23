
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { indiaStateCoordinates } from "@/lib/mapData";
import { useTranslation } from "@/contexts/TranslationContext";

// Define props type
interface Language {
  name: string;
  count: number;
  region: string;
  recordings: string[];
}

interface MapComponentProps {
  languages: Language[];
}

const MapComponent: React.FC<MapComponentProps> = ({ languages }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [mapLoaded, setMapLoaded] = useState(false);
  
  useEffect(() => {
    // Set up the map
    setupImageMap();
  }, [languages]);
  
  const setupImageMap = () => {
    // Simple map implementation using just DOM elements
    if (!mapRef.current) return;
    
    // Clear previous markers
    const existingMarkers = mapRef.current.querySelectorAll('.language-marker');
    existingMarkers.forEach(marker => marker.remove());
    
    // Set the background image container with India outline map
    mapRef.current.style.backgroundImage = 'url(/lovable-uploads/india-map.png)';
    mapRef.current.style.backgroundSize = 'contain';
    mapRef.current.style.backgroundPosition = 'center';
    mapRef.current.style.backgroundRepeat = 'no-repeat';
    mapRef.current.style.position = 'relative';
    
    // Add a border to highlight the map outline
    mapRef.current.style.border = '2px solid #10b981';
    mapRef.current.style.borderRadius = '8px';
    
    // Add markers for each language
    languages.forEach(lang => {
      // Get coordinates based on region/state name
      const coordinates = getCoordinatesForRegion(lang.region);
      if (coordinates) {
        addMarker(lang, coordinates.x, coordinates.y);
      } else {
        // If region not found, place marker in center of India with small random offset
        const randomX = 45 + (Math.random() * 10) - 5; // Center of India with offset
        const randomY = 50 + (Math.random() * 10) - 5;
        addMarker(lang, randomX, randomY);
        
        // Log warning for missing region coordinates
        console.warn(`No coordinates found for region: ${lang.region}`);
      }
    });
    
    setMapLoaded(true);
  };
  
  const getCoordinatesForRegion = (region: string): { x: number, y: number } | null => {
    if (!region) return null;
    
    // Normalize region name for comparison
    const normalizedRegion = region.toLowerCase().trim();
    
    // Check if we have coordinates for this region
    for (const [state, coords] of Object.entries(indiaStateCoordinates)) {
      if (normalizedRegion.includes(state.toLowerCase())) {
        return coords;
      }
    }
    
    return null;
  };
  
  const addMarker = (lang: Language, x: number, y: number) => {
    if (!mapRef.current) return;
    
    const marker = document.createElement('div');
    marker.className = 'language-marker absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2';
    marker.style.left = `${x}%`;
    marker.style.top = `${y}%`;
    marker.style.zIndex = '10';
    
    // Create marker content
    const markerPin = document.createElement('div');
    markerPin.className = "w-4 h-4 bg-green-600 rounded-full border-2 border-white shadow-md flex items-center justify-center hover:scale-125 transition-transform duration-200";
    
    // Create tooltip
    const tooltip = document.createElement('div');
    tooltip.className = "absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 bg-white p-2 rounded shadow-lg text-xs w-32 opacity-0 invisible transition-opacity duration-200 z-10";
    tooltip.innerHTML = `
      <div class="font-bold text-green-700">${lang.name}</div>
      <div class="text-gray-600">${lang.count} ${t("recordings")}</div>
      <div class="text-gray-600">${lang.region}</div>
    `;
    
    // Add hover effects
    marker.addEventListener('mouseenter', () => {
      tooltip.classList.remove('opacity-0', 'invisible');
      tooltip.classList.add('opacity-100', 'visible');
      markerPin.classList.add('scale-125');
    });
    
    marker.addEventListener('mouseleave', () => {
      tooltip.classList.add('opacity-0', 'invisible');
      tooltip.classList.remove('opacity-100', 'visible');
      markerPin.classList.remove('scale-125');
    });
    
    // Add click event
    marker.addEventListener('click', () => {
      navigate('/archive', { state: { filterLanguage: lang.name } });
    });
    
    // Append elements
    marker.appendChild(markerPin);
    marker.appendChild(tooltip);
    mapRef.current.appendChild(marker);
  };
  
  return (
    <div className="relative w-full h-full bg-green-50 rounded-md overflow-hidden">
      <div 
        ref={mapRef} 
        className="w-full h-full"
      >
        {!mapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-pulse text-green-600">Loading map...</div>
          </div>
        )}
      </div>
      <div className="absolute bottom-2 right-2 bg-white bg-opacity-70 p-1 rounded text-xs text-green-700">
        {t("clickOnMarkersToExplore")}
      </div>
    </div>
  );
};

export default MapComponent;
