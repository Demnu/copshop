import { useEffect, useState, useRef } from 'react'

import 'mapbox-gl/dist/mapbox-gl.css'
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'
import { Box } from '@mui/material'
import Map, {
  MapMouseEvent,
  Marker,
  MarkerDragEvent,
  ViewStateChangeEvent,
  MapRef,
} from 'react-map-gl/mapbox'

// will fix this at some point, but for now just ignore the type errors from mapbox-gl-geocoder
// @ts-ignore
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'

interface LocationMapProps {
  latitude: string | null
  longitude: string | null
  onLocationChange?: (lat: string, lng: string) => void
  editable?: boolean
}

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || ''

export function LocationMap({
  latitude,
  longitude,
  onLocationChange,
  editable = false,
}: LocationMapProps) {
  const lat = latitude ? parseFloat(latitude) : 51.5074
  const lng = longitude ? parseFloat(longitude) : -0.1278

  const mapRef = useRef<MapRef>(null)
  const geocoderContainerRef = useRef<HTMLDivElement>(null)

  const [viewState, setViewState] = useState({
    latitude: lat,
    longitude: lng,
    zoom: 13,
  })

  const [markerPosition, setMarkerPosition] = useState<{
    latitude: number
    longitude: number
  }>({
    latitude: lat,
    longitude: lng,
  })

  useEffect(() => {
    if (latitude && longitude) {
      const newLat = parseFloat(latitude)
      const newLng = parseFloat(longitude)
      setViewState((prev) => ({ ...prev, latitude: newLat, longitude: newLng }))
      setMarkerPosition({ latitude: newLat, longitude: newLng })
    }
  }, [latitude, longitude])

  useEffect(() => {
    if (
      !mapRef.current ||
      !geocoderContainerRef.current ||
      !editable ||
      !MAPBOX_TOKEN
    )
      return

    const geocoder = new MapboxGeocoder({
      accessToken: MAPBOX_TOKEN,
      mapboxgl: mapRef.current.getMap().constructor as any,
      marker: false,
      placeholder: 'Search for a location...',
    })

    geocoder.on('result', (e: any) => {
      const [lng, lat] = e.result.center
      setViewState((prev) => ({
        ...prev,
        latitude: lat,
        longitude: lng,
        zoom: 13,
      }))
      setMarkerPosition({ latitude: lat, longitude: lng })
      if (onLocationChange) {
        onLocationChange(lat.toString(), lng.toString())
      }
    })

    geocoderContainerRef.current.appendChild(
      geocoder.onAdd(mapRef.current.getMap()),
    )

    return () => {
      geocoder.onRemove()
    }
  }, [editable, onLocationChange, MAPBOX_TOKEN])

  const handleMapClick = (
    event: MapMouseEvent & { lngLat: { lat: number; lng: number } },
  ) => {
    if (editable && onLocationChange) {
      const { lngLat } = event
      setMarkerPosition({ latitude: lngLat.lat, longitude: lngLat.lng })
      onLocationChange(lngLat.lat.toString(), lngLat.lng.toString())
    }
  }

  if (!MAPBOX_TOKEN) {
    return (
      <Box
        sx={{
          height: 300,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'grey.100',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
        }}
      >
        Mapbox token not configured
      </Box>
    )
  }

  return (
    <Box>
      {editable && <Box ref={geocoderContainerRef} sx={{ mb: 2 }} />}
      <Box sx={{ height: 300, borderRadius: 1, overflow: 'hidden' }}>
        <Map
          ref={mapRef}
          {...viewState}
          onMove={(evt: ViewStateChangeEvent) => setViewState(evt.viewState)}
          onClick={handleMapClick}
          mapStyle="mapbox://styles/mapbox/streets-v12"
          mapboxAccessToken={MAPBOX_TOKEN}
          style={{ width: '100%', height: '100%' }}
          cursor={editable ? 'crosshair' : 'grab'}
        >
          <Marker
            latitude={markerPosition.latitude}
            longitude={markerPosition.longitude}
            anchor="bottom"
            draggable={editable}
            onDragEnd={(event: MarkerDragEvent) => {
              if (editable && onLocationChange) {
                const { lngLat } = event
                setMarkerPosition({
                  latitude: lngLat.lat,
                  longitude: lngLat.lng,
                })
                onLocationChange(lngLat.lat.toString(), lngLat.lng.toString())
              }
            }}
          >
            <Box
              sx={{
                fontSize: '32px',
                lineHeight: 1,
                cursor: editable ? 'grab' : 'default',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
              }}
            >
              🐷
            </Box>
          </Marker>
        </Map>
      </Box>
    </Box>
  )
}
