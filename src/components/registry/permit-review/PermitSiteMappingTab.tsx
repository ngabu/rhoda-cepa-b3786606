import { useEffect, useRef, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { usePermitDetails } from '@/hooks/usePermitDetails';
import { area } from '@turf/area';
import { polygon } from '@turf/helpers';

interface PermitSiteMappingTabProps {
  application: {
    id: string;
    coordinates?: any;
    project_boundary?: any;
    activity_location?: string | null;
    province?: string | null;
    district?: string | null;
    llg?: string | null;
    project_site_description?: string | null;
    site_ownership_details?: string | null;
    total_area_sqkm?: number | null;
    land_type?: string | null;
    tenure?: string | null;
    legal_description?: string | null;
  };
}

export function PermitSiteMappingTab({ application }: PermitSiteMappingTabProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  
  // Data is now passed directly from the view - no need for separate fetch
  // Fallback to usePermitDetails only if view data is incomplete
  const { details, loading } = usePermitDetails(application.id);

  // Use view data if available (passed via application prop), otherwise fallback to child table data
  const province = application.province ?? details?.province;
  const district = application.district ?? details?.district;
  const llg = application.llg ?? details?.llg;
  const projectBoundary = application.project_boundary ?? details?.project_boundary;
  const coordinates = application.coordinates ?? details?.coordinates;
  const activityLocation = application.activity_location;
  const projectSiteDescription = application.project_site_description ?? details?.project_site_description;
  const siteOwnershipDetails = application.site_ownership_details ?? details?.site_ownership_details;
  const totalAreaSqKm = application.total_area_sqkm ?? details?.total_area_sqkm;

  // Calculate area dynamically from the project boundary using Turf.js
  // This ensures consistency with how other components calculate area
  const { areaSqKm, areaHectares } = useMemo(() => {
    if (!projectBoundary) {
      return { areaSqKm: 0, areaHectares: 0 };
    }

    try {
      // Handle both direct geometry and Feature formats
      const geometry = projectBoundary.type === 'Feature' 
        ? projectBoundary.geometry 
        : projectBoundary;

      if (geometry?.type === 'Polygon' && geometry?.coordinates) {
        const turfPolygon = polygon(geometry.coordinates);
        const areaSqMeters = area(turfPolygon);
        const calculatedSqKm = areaSqMeters / 1_000_000;
        const calculatedHectares = areaSqMeters / 10_000;
        return { areaSqKm: calculatedSqKm, areaHectares: calculatedHectares };
      } else if (geometry?.type === 'MultiPolygon' && geometry?.coordinates) {
        // For MultiPolygon, calculate area of all polygons
        let totalAreaSqMeters = 0;
        for (const coords of geometry.coordinates) {
          const turfPoly = polygon(coords);
          totalAreaSqMeters += area(turfPoly);
        }
        const calculatedSqKm = totalAreaSqMeters / 1_000_000;
        const calculatedHectares = totalAreaSqMeters / 10_000;
        return { areaSqKm: calculatedSqKm, areaHectares: calculatedHectares };
      }
    } catch (error) {
      console.error('Error calculating area from boundary:', error);
    }

    // Fallback to stored value if calculation fails
    const fallbackSqKm = details?.total_area_sqkm ?? application.total_area_sqkm ?? 0;
    return { areaSqKm: fallbackSqKm, areaHectares: fallbackSqKm * 100 };
  }, [projectBoundary, details?.total_area_sqkm, application.total_area_sqkm]);

  useEffect(() => {
    if (!mapContainer.current || !projectBoundary) return;

    // Validate projectBoundary has the required structure
    const hasValidPolygonStructure = projectBoundary.type === 'Polygon' && 
      Array.isArray(projectBoundary.coordinates) && 
      projectBoundary.coordinates.length > 0;
    
    const hasValidFeatureStructure = projectBoundary.geometry && 
      projectBoundary.geometry.type === 'Polygon' &&
      Array.isArray(projectBoundary.geometry.coordinates) && 
      projectBoundary.geometry.coordinates.length > 0;

    if (!hasValidPolygonStructure && !hasValidFeatureStructure) {
      console.warn('Invalid project boundary structure:', projectBoundary);
      return;
    }

    // Set Mapbox access token
    mapboxgl.accessToken = 'pk.eyJ1IjoiZ2FidW5vcm1hbiIsImEiOiJjbWJ0emU0cGEwOHR1MmtxdXh2d2wzOTV5In0.RUVMHkS-KaJ6CGWUiB3s4w';

    // Calculate bounds for the polygon
    const boundaryCoords = hasValidPolygonStructure 
      ? projectBoundary.coordinates[0]
      : projectBoundary.geometry.coordinates[0];
    
    const bounds = new mapboxgl.LngLatBounds();
    boundaryCoords.forEach((coord: [number, number]) => {
      bounds.extend(coord);
    });

    const center = bounds.getCenter();
    
    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [center.lng, center.lat],
      zoom: 14,
      interactive: true,
      cooperativeGestures: false,
    });

    // Enable all interactions
    map.current.scrollZoom.enable();
    map.current.dragPan.enable();
    map.current.dragRotate.enable();
    map.current.touchZoomRotate.enable();
    map.current.keyboard.enable();
    map.current.doubleClickZoom.enable();

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.current.on('load', () => {
      if (!map.current) return;

      // Add the boundary as a source
      const geometryData = hasValidPolygonStructure 
        ? projectBoundary 
        : projectBoundary.geometry;
        
      map.current.addSource('boundary', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: geometryData
        }
      });

      // Add fill layer
      map.current.addLayer({
        id: 'boundary-fill',
        type: 'fill',
        source: 'boundary',
        paint: {
          'fill-color': '#ff0000',
          'fill-opacity': 0.2
        }
      });

      // Add outline layer
      map.current.addLayer({
        id: 'boundary-outline',
        type: 'line',
        source: 'boundary',
        paint: {
          'line-color': '#ff0000',
          'line-width': 2,
          'line-dasharray': [2, 2]
        }
      });

      // Fit map to bounds with padding
      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 17
      });

      // Add center marker
      new mapboxgl.Marker({ 
        color: '#ef4444',
        scale: 1.2
      })
        .setLngLat([center.lng, center.lat])
        .addTo(map.current);

      // Build popup HTML content
      const locationInfo = [
        llg ? `${llg}` : null,
        district ? `${district}` : null,
        province ? `${province}` : null
      ].filter(Boolean).join(', ');

      const popupHTML = `
        <div style="padding: 16px; font-family: system-ui, -apple-system, sans-serif; min-width: 220px;">
          <h4 style="margin: 0 0 12px 0; font-size: 15px; font-weight: 600; color: #1a1a1a; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">
            Area of Interest (AOI)
          </h4>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${locationInfo ? `
              <div style="padding: 8px; background: #f3f4f6; border-radius: 6px;">
                <p style="margin: 0; font-size: 13px; color: #374151; line-height: 1.5;">
                  ${locationInfo}
                </p>
              </div>
            ` : ''}
            <div style="padding: 6px 0;">
              <p style="margin: 0; font-size: 12px; color: #6b7280;">
                <strong>Coordinates:</strong> ${center.lat.toFixed(6)}, ${center.lng.toFixed(6)}
              </p>
            </div>
            ${areaSqKm > 0 ? `
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                <div style="padding: 8px; background: #fef3c7; border-radius: 6px; border-left: 3px solid #f59e0b;">
                  <p style="margin: 0; font-size: 11px; color: #d97706; font-weight: 600;">AREA (ha)</p>
                  <p style="margin: 4px 0 0 0; font-size: 16px; font-weight: 700; color: #b45309;">${areaHectares.toFixed(2)}</p>
                </div>
                <div style="padding: 8px; background: #ecfdf5; border-radius: 6px; border-left: 3px solid #10b981;">
                  <p style="margin: 0; font-size: 11px; color: #059669; font-weight: 600;">AREA (sq km)</p>
                  <p style="margin: 4px 0 0 0; font-size: 16px; font-weight: 700; color: #047857;">${areaSqKm.toFixed(2)}</p>
                </div>
              </div>
            ` : ''}
          </div>
        </div>
      `;

      // Create popup that shows on hover only
      let currentPopup: mapboxgl.Popup | null = null;

      // Hover events for popup on boundary fill
      map.current.on('mouseenter', 'boundary-fill', (e) => {
        if (!map.current) return;
        map.current.getCanvas().style.cursor = 'pointer';
        
        if (currentPopup) currentPopup.remove();
        
        currentPopup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false,
          maxWidth: '350px'
        })
          .setLngLat(e.lngLat)
          .setHTML(popupHTML)
          .addTo(map.current);
      });

      map.current.on('mousemove', 'boundary-fill', (e) => {
        if (currentPopup) {
          currentPopup.setLngLat(e.lngLat);
        }
      });

      map.current.on('mouseleave', 'boundary-fill', () => {
        if (!map.current) return;
        map.current.getCanvas().style.cursor = '';
        if (currentPopup) {
          currentPopup.remove();
          currentPopup = null;
        }
      });
    });

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [projectBoundary, activityLocation, province, district, llg, areaSqKm, areaHectares]);

  const renderField = (label: string, value: any) => (
    <div className="p-3 bg-muted/30 rounded-lg">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium">{value || 'Not specified'}</p>
    </div>
  );

  // Only show loading if we don't have data from the view AND the hook is still loading
  const hasViewData = application.project_boundary || application.province || application.district;
  
  if (loading && !hasViewData) {
    return (
      <Card>
        <CardHeader className="bg-blue-500/10">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="w-5 h-5 text-blue-600" />
            Project Site Description
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="h-96 flex items-center justify-center bg-muted/50 rounded-lg">
            <p className="text-muted-foreground">Loading site mapping data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="bg-blue-500/10">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MapPin className="w-5 h-5 text-blue-600" />
          Project Site Description
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Map Display */}
          {projectBoundary ? (
            <div>
              <div 
                ref={mapContainer} 
                className="h-96 w-full rounded-lg border border-border overflow-hidden"
                style={{ touchAction: 'none' }}
              />
              {areaSqKm > 0 && (
                <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-blue-500/10 rounded-lg">
                    <p className="text-muted-foreground text-xs font-medium mb-1">Area (sq km)</p>
                    <p className="font-bold text-lg">{areaSqKm.toFixed(2)}</p>
                  </div>
                  <div className="p-3 bg-blue-500/10 rounded-lg">
                    <p className="text-muted-foreground text-xs font-medium mb-1">Area (hectares)</p>
                    <p className="font-bold text-lg">{areaHectares.toFixed(2)}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center bg-muted/50 rounded-lg">
              <div className="text-center text-muted-foreground">
                <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No project boundary defined</p>
              </div>
            </div>
          )}

          {/* Location Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {renderField('Province', province)}
            {renderField('District', district)}
            {renderField('LLG', llg)}
          </div>

          {activityLocation && (
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground">Project Site Address</p>
              <p className="font-medium">{activityLocation}</p>
            </div>
          )}

          {projectSiteDescription && (
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground">Project Site Description</p>
              <p className="font-medium whitespace-pre-wrap">{projectSiteDescription}</p>
            </div>
          )}

          {siteOwnershipDetails && (
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground">Site Ownership Details</p>
              <p className="font-medium whitespace-pre-wrap">{siteOwnershipDetails}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
