import { useEffect, useRef, useState, useCallback } from 'react';
import { useApp } from '@/context/AppContext';
import { MapPin, Search, Plus, MapPinOff, Loader } from 'lucide-react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export function NearbyEmergencies() {
  const { hospitals, userLocation, requestLocation, setView } = useApp();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [selectedHospital, setSelectedHospital] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const userMarkerRef = useRef<maplibregl.Marker | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    // Default location (Mumbai)
    const initialLat = userLocation?.lat ?? 19.0760;
    const initialLng = userLocation?.lng ?? 72.8777;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      center: [initialLng, initialLat],
      zoom: 10.5,
      minZoom: 2,
      maxZoom: 18,
      attributionControl: false,
    });

    // Add attribution
    map.current.addControl(
      new maplibregl.AttributionControl({ compact: false }),
      'bottom-left'
    );

    // Add zoom controls
    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    return () => {
      map.current?.remove();
    };
  }, []);

  // Update markers when map is ready
  useEffect(() => {
    if (!map.current || !hospitals) return;

    const onMapLoad = () => {
      // Clear existing markers
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];

      // Add user location marker
      if (userLocation) {
        const userEl = document.createElement('div');
        userEl.className = 'w-4 h-4 bg-primary-500 rounded-full border-2 border-white shadow-lg';
        
        userMarkerRef.current = new maplibregl.Marker({
          element: userEl,
          anchor: 'center',
        })
          .setLngLat([userLocation.lng, userLocation.lat])
          .addTo(map.current!);
      }

      // Filter hospitals by search
      const filteredHospitals = hospitals.filter((h) =>
        h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.location.toLowerCase().includes(searchQuery.toLowerCase())
      );

      // Add hospital markers
      filteredHospitals.forEach((hospital) => {
        const markerEl = document.createElement('div');
        markerEl.className = `w-8 h-8 bg-accent-500 rounded-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-md border-2 border-white`;
        markerEl.innerHTML = '<span class="text-white text-sm font-bold">🏥</span>';

        const marker = new maplibregl.Marker({
          element: markerEl,
          anchor: 'center',
        })
          .setLngLat([hospital.lng, hospital.lat])
          .addTo(map.current!);

        // Click handler
        markerEl.addEventListener('click', () => {
          setSelectedHospital(hospital);
          map.current?.flyTo({
            center: [hospital.lng, hospital.lat],
            zoom: 14,
          });

          // Popup
          new maplibregl.Popup({ offset: 25 })
            .setLngLat([hospital.lng, hospital.lat])
            .setHTML(`
              <div class="p-3 max-w-sm">
                <h3 class="font-bold text-ink-900 mb-1">${hospital.name}</h3>
                <p class="text-sm text-ink-600 mb-3">${hospital.location}</p>
                <button class="text-xs bg-primary-500 text-white px-3 py-1.5 rounded font-semibold hover:bg-primary-600">
                  View Details
                </button>
              </div>
            `)
            .addTo(map.current!);
        });

        markersRef.current.push(marker);
      });
    };

    if (map.current.loaded()) {
      onMapLoad();
    } else {
      map.current.on('load', onMapLoad);
    }

    return () => {
      if (map.current) {
        map.current.off('load', onMapLoad);
      }
    };
  }, [hospitals, searchQuery, userLocation]);

  const handleRequestLocation = useCallback(async () => {
    setIsLoadingLocation(true);
    await requestLocation();
    setIsLoadingLocation(false);
  }, [requestLocation]);

  const handleZoomToUser = useCallback(() => {
    if (userLocation && map.current) {
      map.current.flyTo({
        center: [userLocation.lng, userLocation.lat],
        zoom: 13,
      });
    }
  }, [userLocation]);

  const handleZoomToHospital = useCallback(
    (hospital: any) => {
      if (map.current) {
        map.current.flyTo({
          center: [hospital.lng, hospital.lat],
          zoom: 14,
        });
        setSelectedHospital(hospital);
      }
    },
    []
  );

  const filteredHospitals = hospitals.filter((h) =>
    h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-24 lg:pb-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary-600 mb-2">
          <MapPin className="w-4 h-4" />
          NEARBY HOSPITALS & EMERGENCY REQUESTS
        </div>
        <h1 className="font-display text-3xl font-bold text-ink-900 mb-2">Find Nearby Hospitals</h1>
        <p className="text-ink-500">View all hospitals near you and emergency blood requests</p>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Section */}
        <div className="lg:col-span-2">
          <div className="card overflow-hidden h-[500px] relative">
            <div ref={mapContainer} className="w-full h-full" />

            {/* Map Controls */}
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
              {/* Search */}
              <div className="w-64 relative">
                <Search className="w-5 h-5 text-ink-400 absolute left-3 top-1/2 -translate-y-1/2 z-10" />
                <input
                  type="text"
                  placeholder="Search hospitals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-ink-200 bg-white shadow-sm focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>
            </div>

            {/* User Location Button */}
            <div className="absolute top-24 left-4 z-10 flex flex-col gap-2">
              <button
                onClick={handleZoomToUser}
                disabled={!userLocation}
                className="p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow disabled:opacity-50"
                title="Zoom to your location"
              >
                <MapPin className="w-5 h-5 text-primary-600" />
              </button>

              <button
                onClick={handleRequestLocation}
                disabled={isLoadingLocation}
                className="p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
                title="Request location permission"
              >
                {isLoadingLocation ? (
                  <Loader className="w-5 h-5 text-primary-600 animate-spin" />
                ) : (
                  <MapPinOff className="w-5 h-5 text-ink-600" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar - Hospital List */}
        <div className="lg:col-span-1">
          <div className="card h-[500px] flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-ink-200">
              <h2 className="font-semibold text-ink-900">
                Hospitals {filteredHospitals.length > 0 && `(${filteredHospitals.length})`}
              </h2>
              <p className="text-xs text-ink-500 mt-1">Tap to view on map</p>
            </div>

            {/* Hospital List */}
            <div className="flex-1 overflow-y-auto">
              {filteredHospitals.length > 0 ? (
                <div className="divide-y divide-ink-100">
                  {filteredHospitals.map((hospital) => (
                    <div
                      key={hospital.id}
                      onClick={() => handleZoomToHospital(hospital)}
                      className={`p-4 cursor-pointer transition-all hover:bg-primary-50 ${
                        selectedHospital?.id === hospital.id ? 'bg-primary-100 border-l-4 border-primary-500' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-sm text-ink-900">{hospital.name}</h3>
                        <span className="text-lg">🏥</span>
                      </div>
                      <p className="text-xs text-ink-600 mb-2 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {hospital.location}
                      </p>
                      <div className="text-xs text-ink-400">
                        ID: {hospital.id}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-center">
                  <div>
                    <p className="text-sm text-ink-500">No hospitals found</p>
                    <p className="text-xs text-ink-400 mt-1">Try adjusting your search</p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Button */}
            <div className="p-4 border-t border-ink-200">
              <button
                onClick={() => setView('request-form')}
                className="w-full btn-primary flex items-center justify-center gap-2 py-2"
              >
                <Plus className="w-4 h-4" />
                New Request
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="card p-4 bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200">
          <div className="flex items-center gap-3">
            <MapPin className="w-8 h-8 text-primary-600 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-primary-700">Location Enabled</p>
              <p className="text-sm text-primary-600">
                {userLocation ? '✓ Showing nearby hospitals' : 'Click to enable location'}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-4 bg-gradient-to-br from-accent-50 to-accent-100 border border-accent-200">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🏥</span>
            <div>
              <p className="text-xs font-semibold text-accent-700">Total Hospitals</p>
              <p className="text-sm text-accent-600">{hospitals.length} locations available</p>
            </div>
          </div>
        </div>

        <div className="card p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📍</span>
            <div>
              <p className="text-xs font-semibold text-indigo-700">Nearest Hospital</p>
              <p className="text-sm text-indigo-600">
                {selectedHospital ? selectedHospital.name : 'Select one to view'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
