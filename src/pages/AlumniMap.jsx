import React, { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';
import { Tooltip } from 'react-tooltip';
import { motion } from 'framer-motion';
import { MapPin, Users, Globe } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';
import { cityCoordinates } from '../data/cityCoordinates';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function AlumniMap() {
  const { t } = useLanguage();
  const [mapData, setMapData] = useState([]);
  const [stats, setStats] = useState({ total: 0, countries: 0 });
  const [content, setContent] = useState("");
  const [currentZoom, setCurrentZoom] = useState(1);

  useEffect(() => {
    // Dummy Data for Preview (focused on Java/Indonesia)
    const dummyData = [
      { city: 'Bandung', count: 125 },
      { city: 'Jakarta', count: 85 },
      { city: 'Surabaya', count: 32 },
      { city: 'Yogyakarta', count: 45 },
      { city: 'Semarang', count: 18 },
      { city: 'Malang', count: 12 },
      { city: 'Solo', count: 8 },
      { city: 'Bogor', count: 15 },
      { city: 'Depok', count: 10 },
      { city: 'Tangerang', count: 22 },
      { city: 'Bekasi', count: 20 },
      { city: 'Denpasar', count: 5 },
      { city: 'Makassar', count: 3 },
      { city: 'Tokyo', count: 2 },
      { city: 'London', count: 1 },
      { city: 'Paris', count: 4 },
      { city: 'Rome', count: 3 },
      { city: 'New York', count: 5 },
      { city: 'Los Angeles', count: 2 }
    ];

    const mapMarkers = [];
    let totalAlumni = 0;

    dummyData.forEach(item => {
      totalAlumni += item.count;
      const matchedCityKey = Object.keys(cityCoordinates).find(
        k => item.city.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(item.city.toLowerCase())
      );
      
      if (matchedCityKey) {
        mapMarkers.push({
          name: matchedCityKey,
          originalName: item.city,
          coordinates: cityCoordinates[matchedCityKey],
          count: item.count
        });
      }
    });

    setMapData(mapMarkers);
    setStats({
      total: totalAlumni,
      countries: 3 // Indonesia, Japan, UK
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A] overflow-hidden flex flex-col pt-24 relative">
      
      {/* Map Container */}
      <div className="absolute inset-0 z-0">
        <ComposableMap
          projectionConfig={{
            scale: 250,
            center: [70, 10] // Center between Europe/Africa and Asia to show West and East
          }}
          className="w-full h-full opacity-80"
        >
          <ZoomableGroup 
            zoom={1} 
            maxZoom={4} 
            onMoveEnd={({ zoom }) => setCurrentZoom(zoom)}
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="#1A1A1A"
                    stroke="#333333"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: "none" },
                      hover: { fill: "#222222", outline: "none" },
                      pressed: { fill: "#1A1A1A", outline: "none" },
                    }}
                  />
                ))
              }
            </Geographies>

            {mapData.map((marker, index) => {
              // Calculate size based on count (min 3, max 15)
              const size = Math.min(Math.max(marker.count * 2, 4), 15);
              return (
                <Marker 
                  key={index} 
                  coordinates={marker.coordinates}
                  onMouseEnter={() => {
                    setContent(`${marker.name} — ${marker.count} ${t('Alumni')}`);
                  }}
                  onMouseLeave={() => {
                    setContent("");
                  }}
                  data-tooltip-id="map-tooltip"
                  data-tooltip-content={`${marker.name} — ${marker.count} ${t('Alumni')}`}
                >
                  <g className="cursor-pointer">
                    <circle
                      r={(size + 4) / currentZoom}
                      fill="#C81D25"
                      opacity={0.3}
                      className="animate-pulse"
                    />
                    <circle
                      r={size / currentZoom}
                      fill="#E63946"
                      stroke="#0A0A0A"
                      strokeWidth={1 / currentZoom}
                      style={{ filter: "drop-shadow(0px 0px 4px rgba(230, 57, 70, 0.8))" }}
                    />
                  </g>
                </Marker>
              );
            })}
          </ZoomableGroup>
        </ComposableMap>
        
        <Tooltip 
          id="map-tooltip" 
          className="bg-[#1A1A1A]/90 backdrop-blur-md border border-white/10 text-white font-button text-xs tracking-widest z-50 rounded-sm px-3 py-2" 
        />
      </div>

      {/* Sidebar UI */}
      <div className="absolute bottom-0 left-0 right-0 md:top-24 md:bottom-auto md:left-6 md:right-auto z-10 w-full md:w-80 p-4 md:p-0 flex flex-col pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0A0A0A]/90 backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-lg p-5 md:p-6 pointer-events-auto max-h-[45vh] md:max-h-none overflow-y-auto shadow-2xl"
          style={{ scrollbarWidth: 'none' }}
        >
          <div className="flex items-center space-x-3 mb-4 md:mb-6 border-b border-white/10 pb-4">
            <Globe className="w-5 h-5 md:w-6 md:h-6 text-accent-secondary" />
            <div>
              <h1 className="text-white font-heading font-bold text-lg md:text-xl leading-tight">SENAPATI GLOBAL</h1>
              <p className="text-[10px] text-supporting font-button tracking-widest uppercase">{t('Jejak Alumni')}</p>
            </div>
          </div>

          <div className="flex flex-row md:flex-col justify-between md:justify-start gap-4 md:gap-6 mb-6">
            <div>
              <p className="text-[10px] text-supporting font-button tracking-widest uppercase mb-1">{t('Total Alumni Terdata')}</p>
              <p className="text-3xl md:text-4xl font-heading font-bold text-white" style={{ textShadow: '0 0 10px rgba(230,57,70,0.5)' }}>
                {stats.total}+
              </p>
            </div>
            <div className="text-right md:text-left">
              <p className="text-[10px] text-supporting font-button tracking-widest uppercase mb-1">{t('Kota/Negara')}</p>
              <p className="text-xl md:text-2xl font-heading font-bold text-white" style={{ textShadow: '0 0 10px rgba(230,57,70,0.5)' }}>
                {stats.countries}+
              </p>
            </div>
          </div>

          <div className="border-t border-white/10 pt-4 md:pt-6">
            <p className="text-[10px] text-supporting font-button tracking-widest uppercase mb-3 md:mb-4">{t('Sebaran Terbesar')}</p>
            <div className="space-y-3 max-h-32 md:max-h-40 overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}>
              {mapData.sort((a, b) => b.count - a.count).slice(0, 5).map((m, i) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-3 h-3 text-accent-secondary" />
                    <span className="text-white font-body">{m.name}</span>
                  </div>
                  <span className="text-accent-secondary font-mono text-xs">{m.count}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

    </div>
  );
}