<<<<<<< HEAD
import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView from 'react-native-maps';
import RoutePolyline from './RoutePolyline';
import VisitMarker from './VisitMarker';
import type { LocationPoint, Visit } from '@/src/types';
=======
import React, { useMemo, useRef, useCallback, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { WebView } from 'react-native-webview';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { AppColors } from '@/constants/Colors';
import type { LocationPoint, Visit } from '@/src/types';
import { metersPerSecToKmh, haversineDistance, smoothSpeeds } from '@/src/utils/geo';
import { SPEED_THRESHOLDS } from '@/src/utils/constants';
import { formatTime, formatDuration } from '@/src/utils/time';
>>>>>>> adf99c4 (atualização)

interface NativeMapProps {
  locations: LocationPoint[];
  visits: Visit[];
<<<<<<< HEAD
  theme: { textSecondary: string };
}

export default function NativeMap({ locations, visits, theme }: NativeMapProps) {
  const mapRef = useRef<MapView>(null);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    if (locations.length > 0 && mapRef.current) {
      const coords = locations.map(l => ({ latitude: l.lat, longitude: l.lng }));
      mapRef.current.fitToCoordinates(coords, {
        edgePadding: { top: 60, right: 60, bottom: 60, left: 60 },
        animated: true,
      });
    }
  }, [locations]);

  if (mapError) {
    return (
      <View style={[styles.mapContainer, styles.errorContainer]}>
        <Text style={[styles.legendText, { color: theme.textSecondary, fontSize: 14 }]}>
          Could not load map. Please try again later.
        </Text>
      </View>
    );
  }

  return (
    <>
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          showsUserLocation
          showsMyLocationButton
          onMapReady={() => setMapError(false)}
          initialRegion={{
            latitude: locations[0]?.lat ?? 0,
            longitude: locations[0]?.lng ?? 0,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }}>
          <RoutePolyline points={locations} />

          {visits.map(visit => (
            <VisitMarker key={visit.id} visit={visit} />
          ))}
        </MapView>
      </View>

      <View style={styles.legend}>
        <View style={styles.legendRow}>
          <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
          <Text style={[styles.legendText, { color: theme.textSecondary }]}>Walking</Text>
          <View style={[styles.legendDot, { backgroundColor: '#F59E0B' }]} />
          <Text style={[styles.legendText, { color: theme.textSecondary }]}>Driving</Text>
          <View style={[styles.legendDot, { backgroundColor: '#8B5CF6' }]} />
          <Text style={[styles.legendText, { color: theme.textSecondary }]}>Stationary</Text>
        </View>
      </View>
    </>
=======
  theme: { textSecondary: string; card: string; cardBorder: string; text: string; background: string };
  showUserLocation?: boolean;
  onRequestLocation?: () => void;
  onRefreshLocation?: () => Promise<{ lat: number; lng: number } | null>;
  userLat?: number | null;
  userLng?: number | null;
  focusVersion?: number;
  onVisitTap?: (visitId: number) => void;
}

interface Segment {
  coords: [number, number][];
  color: string;
}

interface VisitMarker {
  id: number;
  lat: number;
  lng: number;
  label: string;
  time: string;
  dur: string;
  ongoing: boolean;
}

interface MapData {
  segments: Segment[];
  locs: [number, number][];
  visits: VisitMarker[];
}

function segColor(speed: number): string {
  const kmh = metersPerSecToKmh(speed);
  if (kmh < SPEED_THRESHOLDS.STATIONARY_MAX_KMH) return AppColors.stationary;
  if (kmh <= SPEED_THRESHOLDS.WALKING_MAX_KMH) return AppColors.walking;
  return AppColors.driving;
}

function escHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function preprocessLocations(locations: LocationPoint[]): LocationPoint[] {
  if (locations.length < 2) return locations;

  let filtered = locations.filter(l => l.accuracy <= 25 || l.accuracy === 0);
  if (filtered.length < locations.length * 0.3) filtered = locations;
  if (filtered.length < 2) return filtered;

  const deduped: LocationPoint[] = [filtered[0]];
  for (let i = 1; i < filtered.length; i++) {
    const prev = deduped[deduped.length - 1];
    const distM = haversineDistance(prev.lat, prev.lng, filtered[i].lat, filtered[i].lng) * 1000;
    const timeDiffMs = filtered[i].timestamp - prev.timestamp;
    if (distM >= 3 || timeDiffMs >= 2000) {
      deduped.push(filtered[i]);
    }
  }

  if (deduped.length < 3) return deduped;

  const smoothed: LocationPoint[] = [deduped[0]];
  for (let i = 1; i < deduped.length - 1; i++) {
    smoothed.push({
      ...deduped[i],
      lat: deduped[i - 1].lat * 0.15 + deduped[i].lat * 0.7 + deduped[i + 1].lat * 0.15,
      lng: deduped[i - 1].lng * 0.15 + deduped[i].lng * 0.7 + deduped[i + 1].lng * 0.15,
    });
  }
  smoothed.push(deduped[deduped.length - 1]);

  const speeds = smoothed.map(l => l.speed);
  const smoothedSpeeds = smoothSpeeds(speeds, 5);
  return smoothed.map((l, i) => ({ ...l, speed: smoothedSpeeds[i] }));
}

function buildMapData(locations: LocationPoint[], visits: Visit[]): MapData {
  const processed = preprocessLocations(locations);
  const segments: Segment[] = [];

  if (processed.length > 1) {
    let curColor = segColor(processed[0].speed);
    let curCoords: [number, number][] = [[processed[0].lat, processed[0].lng]];

    for (let i = 1; i < processed.length; i++) {
      const color = segColor(processed[i].speed);
      const coord: [number, number] = [processed[i].lat, processed[i].lng];
      if (color !== curColor) {
        curCoords.push(coord);
        segments.push({ coords: curCoords, color: curColor });
        curColor = color;
        curCoords = [coord];
      } else {
        curCoords.push(coord);
      }
    }
    if (curCoords.length > 1) {
      segments.push({ coords: curCoords, color: curColor });
    }
  }

  const visitMarkers: VisitMarker[] = visits.map(v => ({
    id: v.id,
    lat: v.lat,
    lng: v.lng,
    label: escHtml(v.address ?? `${v.lat.toFixed(4)}, ${v.lng.toFixed(4)}`),
    time: escHtml(
      formatTime(v.arrival_at) +
      (v.departure_at && v.departure_at > v.arrival_at ? ` - ${formatTime(v.departure_at)}` : '')
    ),
    dur: escHtml(formatDuration(Math.max(0, v.duration_minutes))),
    ongoing: !v.departure_at,
  }));

  return {
    segments,
    locs: processed.map(l => [l.lat, l.lng]),
    visits: visitMarkers,
  };
}

function buildInitialHTML(initial: MapData, userLat: number | null, userLng: number | null): string {
  const lat = userLat ?? initial.locs[0]?.[0] ?? initial.visits[0]?.lat ?? 38.7;
  const lng = userLng ?? initial.locs[0]?.[1] ?? initial.visits[0]?.lng ?? -9.1;
  const zoom = initial.locs.length > 0 ? 14 : initial.visits.length > 0 ? 16 : 6;

  return `<!DOCTYPE html>
<html><head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=5,user-scalable=yes"/>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"><\/script>
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body,#map{width:100%;height:100%;background:#eef2f5}
@keyframes pulse{
  0%{transform:scale(1);opacity:.9}
  70%{transform:scale(2.4);opacity:0}
  100%{transform:scale(2.4);opacity:0}
}
.user-dot{width:18px;height:18px;position:relative}
.user-dot-inner{width:18px;height:18px;border-radius:50%;background:${AppColors.primary};border:3px solid #fff;box-shadow:0 2px 10px rgba(0,0,0,.4),0 0 0 1px rgba(0,0,0,.1);position:absolute;z-index:2}
.user-dot-pulse{width:18px;height:18px;border-radius:50%;background:${AppColors.primary};position:absolute;z-index:1;animation:pulse 2.4s ease-out infinite}
.pin{position:relative;width:30px;height:38px;cursor:pointer;transform-origin:50% 100%;transition:transform .15s ease}
.pin:active{transform:scale(.92)}
.pin-head{width:28px;height:28px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);position:absolute;left:1px;top:0;box-shadow:0 2px 6px rgba(0,0,0,.3),0 0 0 2px #fff}
.pin-head-inner{width:12px;height:12px;border-radius:50%;background:#fff;position:absolute;left:8px;top:8px;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;color:#374151;font-family:system-ui}
.pin-stem{position:absolute;left:12px;top:28px;width:6px;height:8px;background:inherit}
.pin.live .pin-head{animation:pulse-pin 2s ease-out infinite}
@keyframes pulse-pin{0%,100%{box-shadow:0 2px 6px rgba(0,0,0,.3),0 0 0 2px #fff,0 0 0 2px ${AppColors.success}66}50%{box-shadow:0 2px 6px rgba(0,0,0,.3),0 0 0 2px #fff,0 0 0 8px ${AppColors.success}00}}
.endpoint{width:20px;height:20px;border-radius:50%;border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.3);display:flex;align-items:center;justify-content:center;color:#fff;font-size:9px;font-weight:800;font-family:system-ui}
.route-arrow{display:flex;align-items:center;justify-content:center;pointer-events:none}
.leaflet-popup-content-wrapper{border-radius:14px;box-shadow:0 6px 20px rgba(0,0,0,.14);padding:4px}
.leaflet-popup-content{margin:10px 14px;font-family:-apple-system,system-ui,sans-serif}
.leaflet-popup-tip{box-shadow:0 2px 8px rgba(0,0,0,.08)}
.popup-title{font-size:13px;font-weight:700;color:#0F172A;margin-bottom:4px;line-height:1.3}
.popup-time{color:#6B7280;font-size:11px;margin-bottom:4px}
.popup-dur{font-weight:700;font-size:12px}
.popup-btn{display:inline-block;margin-top:8px;padding:6px 10px;background:${AppColors.primary};color:#fff;font-size:11px;font-weight:700;border-radius:8px;border:none;cursor:pointer;font-family:inherit;letter-spacing:.2px}
.leaflet-control-zoom{border:none!important;box-shadow:0 2px 8px rgba(0,0,0,.15)!important;border-radius:12px!important;overflow:hidden}
.leaflet-control-zoom a{background:rgba(255,255,255,.98)!important;color:#0F172A!important;font-weight:600!important;border-color:rgba(0,0,0,.05)!important}
.leaflet-bar a:hover{background:#f1f5f9!important}
</style>
</head><body>
<div id="map"></div>
<script>
function notifyNative(msg){
  try{if(window.ReactNativeWebView){window.ReactNativeWebView.postMessage(JSON.stringify(msg))}}catch(e){}
}

var map=L.map('map',{zoomControl:false,zoomAnimation:true,fadeAnimation:true,inertia:true,wheelDebounceTime:40}).setView([${lat},${lng}],${zoom});
L.control.zoom({position:'topright'}).addTo(map);

var tileLoaded=false,tileErrors=0;
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{
  attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  maxZoom:19,
  crossOrigin:true
})
.on('tileload',function(){if(!tileLoaded){tileLoaded=true;notifyNative({type:'tilesReady'})}})
.on('tileerror',function(){tileErrors++;if(!tileLoaded&&tileErrors>=3){notifyNative({type:'tilesUnavailable'})}})
.addTo(map);
notifyNative({type:'mapReady'});
setTimeout(function(){if(!tileLoaded){notifyNative({type:'tilesUnavailable'})}},6000);

var routeGroup=L.layerGroup().addTo(map);
var visitGroup=L.layerGroup().addTo(map);
var userMarker=null;

function colorForSpeed(c){return c}

function calcBearing(la1,ln1,la2,ln2){var dL=(ln2-ln1)*Math.PI/180;var y=Math.sin(dL)*Math.cos(la2*Math.PI/180);var x=Math.cos(la1*Math.PI/180)*Math.sin(la2*Math.PI/180)-Math.sin(la1*Math.PI/180)*Math.cos(la2*Math.PI/180)*Math.cos(dL);return(Math.atan2(y,x)*180/Math.PI+360)%360}

function renderRoute(data){
  routeGroup.clearLayers();
  (data.segments||[]).forEach(function(s){
    L.polyline(s.coords,{color:'#000',weight:9,opacity:0.08,lineJoin:'round',lineCap:'round',smoothFactor:1.5}).addTo(routeGroup);
    L.polyline(s.coords,{color:s.color,weight:5,opacity:0.95,lineJoin:'round',lineCap:'round',smoothFactor:1.5,dashArray:s.color==='${AppColors.stationary}'?'6,8':null}).addTo(routeGroup);
  });
  var locs=data.locs||[];
  if(locs.length>3){
    var step=Math.min(Math.max(Math.floor(locs.length/10),6),30);
    for(var i=step;i<locs.length-1;i+=step){
      var ang=calcBearing(locs[i][0],locs[i][1],locs[i+1][0],locs[i+1][1])-90;
      var ai=L.divIcon({className:'',html:'<div class="route-arrow" style="transform:rotate('+ang+'deg)"><svg width="10" height="10" viewBox="0 0 10 10"><polygon points="2,1 8,5 2,9" fill="rgba(55,65,81,0.55)"/></svg></div>',iconSize:[10,10],iconAnchor:[5,5]});
      L.marker(locs[i],{icon:ai,interactive:false,zIndexOffset:-100}).addTo(routeGroup);
    }
  }
  if(locs.length>1){
    var si=L.divIcon({className:'',html:'<div class="endpoint" style="background:${AppColors.success}">S</div>',iconSize:[20,20],iconAnchor:[10,10]});
    var ei=L.divIcon({className:'',html:'<div class="endpoint" style="background:#EF4444">E</div>',iconSize:[20,20],iconAnchor:[10,10]});
    L.marker(locs[0],{icon:si,zIndexOffset:500}).addTo(routeGroup);
    L.marker(locs[locs.length-1],{icon:ei,zIndexOffset:500}).addTo(routeGroup);
  }
}

function renderVisits(visits){
  visitGroup.clearLayers();
  (visits||[]).forEach(function(v){
    var color=v.ongoing?'${AppColors.success}':'${AppColors.stationary}';
    var ic=L.divIcon({className:'',html:'<div class="pin'+(v.ongoing?' live':'')+'"><div class="pin-head" style="background:'+color+'"><div class="pin-head-inner"></div></div></div>',iconSize:[30,38],iconAnchor:[15,36]});
    var marker=L.marker([v.lat,v.lng],{icon:ic,zIndexOffset:600}).addTo(visitGroup);
    var html='<div class="popup-title">'+v.label+'</div>'+
             '<div class="popup-time">'+v.time+'</div>'+
             '<div class="popup-dur" style="color:'+(v.ongoing?'${AppColors.success}':color)+'">'+(v.ongoing?'Still here':v.dur)+'</div>'+
             '<button class="popup-btn" onclick="window.openVisitInTimeline('+v.id+')">Open in Timeline</button>';
    marker.bindPopup(html,{maxWidth:240,autoPan:true,autoPanPadding:[20,20]});
  });
}

window.openVisitInTimeline=function(id){notifyNative({type:'visitTap',visitId:id})};

function showUser(lat,lng){
  if(userMarker){map.removeLayer(userMarker)}
  var ic=L.divIcon({className:'',html:'<div class="user-dot"><div class="user-dot-pulse"></div><div class="user-dot-inner"></div></div>',iconSize:[18,18],iconAnchor:[9,9]});
  userMarker=L.marker([lat,lng],{icon:ic,zIndexOffset:1000,interactive:false}).addTo(map);
}

function flyToUser(lat,lng){showUser(lat,lng);map.flyTo([lat,lng],Math.max(map.getZoom(),16),{duration:0.6})}

function fitBounds(coords,padding){
  if(coords&&coords.length>1){map.fitBounds(coords,{padding:padding||[40,40],maxZoom:17,animate:true,duration:0.5})}
  else if(coords&&coords.length===1){map.flyTo(coords[0],16,{duration:0.5})}
}

function handleMessage(data){
  try{
    var msg=typeof data==='string'?JSON.parse(data):data;
    if(msg.type==='updateData'){renderRoute(msg.data);renderVisits(msg.data.visits);if(msg.fit){fitBounds(msg.data.locs.length?msg.data.locs:(msg.data.visits||[]).map(function(v){return[v.lat,v.lng]}),msg.padding)}}
    else if(msg.type==='fit'){fitBounds(msg.coords,msg.padding)}
    else if(msg.type==='showUser'&&msg.lat&&msg.lng){showUser(msg.lat,msg.lng)}
    else if(msg.type==='flyToUser'&&msg.lat&&msg.lng){flyToUser(msg.lat,msg.lng)}
  }catch(e){}
}
document.addEventListener('message',function(e){handleMessage(e.data)});
window.addEventListener('message',function(e){handleMessage(e.data)});

var INITIAL=${JSON.stringify(initial)};
renderRoute(INITIAL);renderVisits(INITIAL.visits);
if(INITIAL.locs.length>1){map.fitBounds(INITIAL.locs,{padding:[40,40],maxZoom:17})}
else if(INITIAL.visits.length>0){map.setView([INITIAL.visits[0].lat,INITIAL.visits[0].lng],16)}
${userLat && userLng ? `showUser(${userLat},${userLng});` : ''}
<\/script>
</body></html>`;
}

export default function NativeMap({
  locations,
  visits,
  theme,
  showUserLocation,
  onRequestLocation,
  onRefreshLocation,
  userLat,
  userLng,
  focusVersion,
  onVisitTap,
}: NativeMapProps) {
  const webViewRef = useRef<WebView>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const [locating, setLocating] = useState(false);
  const [refreshingLoc, setRefreshingLoc] = useState(false);
  const [mapStatus, setMapStatus] = useState<'loading' | 'ready' | 'offline'>('loading');
  const [mapReady, setMapReady] = useState(false);
  const lastFocusVersion = useRef<number | undefined>(focusVersion);

  // Build HTML only once from the initial data snapshot. Later updates are
  // delivered as messages so the WebView keeps its zoom/pan.
  const initialDataRef = useRef<MapData | null>(null);
  if (initialDataRef.current === null) {
    initialDataRef.current = buildMapData(locations, visits);
  }
  const initialHtml = useMemo(
    () => buildInitialHTML(initialDataRef.current!, userLat ?? null, userLng ?? null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Memoized current data snapshot. Reference changes trigger a soft update.
  const data = useMemo(() => buildMapData(locations, visits), [locations, visits]);

  // Debounced data updates to the WebView — never rebuilds the HTML.
  useEffect(() => {
    if (!mapReady || !webViewRef.current) return;
    const shouldFit = focusVersion !== lastFocusVersion.current;
    lastFocusVersion.current = focusVersion;
    const payload = {
      type: 'updateData',
      data,
      fit: shouldFit,
      padding: shouldFit ? [60, 60] : undefined,
    };
    webViewRef.current.postMessage(JSON.stringify(payload));
  }, [data, mapReady, focusVersion]);

  // User position marker — only moves the marker; no view change.
  useEffect(() => {
    if (!mapReady || !webViewRef.current) return;
    if (userLat != null && userLng != null) {
      webViewRef.current.postMessage(JSON.stringify({ type: 'showUser', lat: userLat, lng: userLng }));
    }
  }, [userLat, userLng, mapReady]);

  // Fallback timer for tiles.
  useEffect(() => {
    const timeout = setTimeout(() => {
      setMapStatus((status) => (status === 'ready' ? status : 'offline'));
    }, 8000);
    return () => clearTimeout(timeout);
  }, []);

  const handleLocatePress = useCallback(() => {
    setLocating(true);
    Animated.sequence([
      Animated.timing(pulseAnim, { toValue: 0.9, duration: 90, useNativeDriver: true }),
      Animated.timing(pulseAnim, { toValue: 1, duration: 90, useNativeDriver: true }),
    ]).start();
    if (onRequestLocation) onRequestLocation();
    if (userLat != null && userLng != null && webViewRef.current) {
      webViewRef.current.postMessage(
        JSON.stringify({ type: 'flyToUser', lat: userLat, lng: userLng })
      );
    }
    setTimeout(() => setLocating(false), 900);
  }, [onRequestLocation, userLat, userLng, pulseAnim]);

  const handleRefreshPress = useCallback(async () => {
    setRefreshingLoc(true);
    if (onRefreshLocation) {
      const result = await onRefreshLocation();
      if (result && webViewRef.current) {
        webViewRef.current.postMessage(
          JSON.stringify({ type: 'flyToUser', lat: result.lat, lng: result.lng })
        );
      }
    }
    setTimeout(() => setRefreshingLoc(false), 600);
  }, [onRefreshLocation]);

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ html: initialHtml }}
        style={styles.map}
        originWhitelist={['*']}
        javaScriptEnabled
        domStorageEnabled
        mixedContentMode="compatibility"
        scrollEnabled={false}
        bounces={false}
        overScrollMode="never"
        androidLayerType="hardware"
        onMessage={(event) => {
          try {
            const message = JSON.parse(event.nativeEvent.data);
            if (message.type === 'mapReady') setMapReady(true);
            if (message.type === 'tilesReady') setMapStatus('ready');
            if (message.type === 'tilesUnavailable') setMapStatus('offline');
            if (message.type === 'visitTap' && typeof message.visitId === 'number' && onVisitTap) {
              onVisitTap(message.visitId);
            }
          } catch {}
        }}
        onError={() => setMapStatus('offline')}
      />

      {mapStatus === 'offline' && (
        <View style={[styles.offlineNotice, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <FontAwesome name="wifi" size={14} color={AppColors.warning} />
          <View style={styles.offlineText}>
            <Text style={[styles.offlineTitle, { color: theme.text }]}>Map unavailable offline</Text>
            <Text style={[styles.offlineSubtitle, { color: theme.textSecondary }]}>
              Tracking continues on this device.
            </Text>
          </View>
        </View>
      )}

      {showUserLocation !== false && (
        <>
          <TouchableOpacity
            style={[styles.refreshButton, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
            onPress={handleRefreshPress}
            activeOpacity={0.7}
            accessibilityLabel="Refresh location"
          >
            <FontAwesome
              name="refresh"
              size={13}
              color={refreshingLoc ? AppColors.primary : theme.textSecondary}
            />
          </TouchableOpacity>
          <Animated.View style={[styles.locateButtonWrapper, { transform: [{ scale: pulseAnim }] }]}>
            <TouchableOpacity
              style={[styles.locateButton, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
              onPress={handleLocatePress}
              activeOpacity={0.7}
              accessibilityLabel="Center on me"
            >
              <FontAwesome
                name="crosshairs"
                size={20}
                color={locating ? AppColors.primary : theme.text}
              />
            </TouchableOpacity>
          </Animated.View>
        </>
      )}

      <View style={styles.bottomBar}>
        {locations.length > 0 && (
          <View style={[styles.legendRow, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: AppColors.walking }]} />
              <Text style={[styles.legendText, { color: theme.text }]}>Walk</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: AppColors.driving }]} />
              <Text style={[styles.legendText, { color: theme.text }]}>Drive</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: AppColors.stationary }]} />
              <Text style={[styles.legendText, { color: theme.text }]}>Stop</Text>
            </View>
          </View>
        )}
      </View>
    </View>
>>>>>>> adf99c4 (atualização)
  );
}

const styles = StyleSheet.create({
<<<<<<< HEAD
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  legend: {
    paddingHorizontal: 16,
    paddingVertical: 8,
=======
  container: { flex: 1 },
  map: { flex: 1 },
  offlineNotice: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 64,
    minHeight: 50,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 9,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
  },
  offlineText: { flex: 1 },
  offlineTitle: { fontSize: 13, fontWeight: '700' },
  offlineSubtitle: { fontSize: 11, marginTop: 2 },
  refreshButton: {
    position: 'absolute',
    bottom: 110,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  locateButtonWrapper: {
    position: 'absolute',
    bottom: 56,
    right: 16,
  },
  locateButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 14,
    left: 14,
    right: 76,
    alignItems: 'flex-start',
>>>>>>> adf99c4 (atualização)
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
<<<<<<< HEAD
    justifyContent: 'center',
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 4,
  },
  legendText: {
    fontSize: 11,
    marginRight: 12,
=======
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    fontWeight: '600',
>>>>>>> adf99c4 (atualização)
  },
});
