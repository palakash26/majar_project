mapboxgl.accessToken = mapToken;

// Check if valid coordinates exist in listing.geometry
let coordinates = (listing && listing.geometry && listing.geometry.coordinates && listing.geometry.coordinates.length === 2 && (listing.geometry.coordinates[0] !== 0 || listing.geometry.coordinates[1] !== 0))
    ? listing.geometry.coordinates
    : null;

const defaultCenter = coordinates || [77.2090, 28.6139];

const map = new mapboxgl.Map({
    container: 'map',
    style: "mapbox://styles/mapbox/streets-v12",
    center: defaultCenter,
    zoom: 10,
    attributionControl: false
});

// Add navigation controls (zoom in/out, pitch)
map.addControl(new mapboxgl.NavigationControl());

// Helper function to create Popup HTML
function createPopupHTML() {
    const title = listing && listing.title ? listing.title : 'Stay Location';
    const loc = listing && listing.location ? listing.location : '';
    const country = listing && listing.country ? listing.country : '';
    const fullLoc = loc && country ? `${loc}, ${country}` : (loc || country || 'Exact location provided after booking');

    return `
        <div class="p-1">
            <h6 class="fw-bold mb-1 text-dark">${title}</h6>
            <p class="text-danger small mb-1 fw-semibold"><i class="fa-solid fa-location-dot me-1"></i>${fullLoc}</p>
            <p class="text-muted small mb-0" style="font-size: 0.78rem;">Exact location will be provided after booking</p>
        </div>
    `;
}

// Function to render marker
function renderMarker(coords) {
    new mapboxgl.Marker({ color: "#fe424d" })
        .setLngLat(coords)
        .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(createPopupHTML())
        )
        .addTo(map);
    map.flyTo({ center: coords, zoom: 11 });
}

if (coordinates) {
    renderMarker(coordinates);
} else if (listing && (listing.location || listing.country) && mapToken) {
    // Dynamic client-side Mapbox geocoding fallback for listings with missing geometry
    const searchQuery = encodeURIComponent(`${listing.location || ''}, ${listing.country || ''}`);
    fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${searchQuery}.json?access_token=${mapToken}&limit=1`)
        .then(res => res.json())
        .then(data => {
            if (data.features && data.features.length > 0) {
                const fetchedCoords = data.features[0].center;
                renderMarker(fetchedCoords);
            } else {
                renderMarker(defaultCenter);
            }
        })
        .catch(err => {
            console.error("Mapbox client geocoding error:", err);
            renderMarker(defaultCenter);
        });
} else {
    renderMarker(defaultCenter);
}