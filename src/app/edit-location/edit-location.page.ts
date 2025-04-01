import { Component, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OlaMaps } from 'olamaps-web-sdk';
import { Geolocation } from '@capacitor/geolocation';
import { ApiService } from '../services/api.service';
@Component({
  selector: 'app-edit-location',
  templateUrl: './edit-location.page.html',
  styleUrls: ['./edit-location.page.scss'],
  standalone: false,
})
export class EditLocationPage implements AfterViewInit {
  olaMaps: any;
  map: any;
  marker: any;
  selectedAddress: string = "Fetching location...";
  searchQuery: string = "";
  suggestions: any[] = [];
  userLat: number = 0;
  userLng: number = 0;
  nearbyPlaces: any[] = [];
  apiKey: string = 'Q6pETlo0Z5nhAeXc0RoR49c0apijP4Q6f5X34TPE';
  selectedPlace: any;
  selected: string = 'home';
  addressId: any;
  address: any;
  contactNumber: any;
  name: any;
  type: any;
  latitude: any;
  longitude: any;
  id: any;
  distance: any;

  constructor(private route: ActivatedRoute, public apiService: ApiService) { }

  ngOnInit() {

    this.addressId = this.route.queryParams.subscribe((data) => {
      console.log(data);
      this.address = data['address'];
      this.id = data['id'];
      this.contactNumber = data['contactNumber'];
      this.name = data['name'];
      this.type = data['type'];
      this.selected = data['type'];
      this.latitude = data['latitude'];
      this.longitude = data['longitude'];

    })
  }
  async ngAfterViewInit() {
    await this.loadMap();
  }

  async loadMap() {
    this.userLat = this.latitude
    this.userLng = this.longitude;

    // Initialize Ola Maps
    this.olaMaps = new OlaMaps({
      apiKey: this.apiKey,
    });

    this.map = this.olaMaps.init({
      style: 'https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json',
      container: 'map',
      center: [this.userLng, this.userLat],
      zoom: 16,
    });

    // Add a draggable marker at user's location
    this.marker = this.olaMaps
      .addMarker({
        offset: [0, -10],
        anchor: 'bottom',
        color: '#ff0000',
        draggable: true,
      })
      .setLngLat([this.userLng, this.userLat])
      .addTo(this.map);

    // Add popup to marker
    const popup = this.olaMaps
      .addPopup({ offset: [0, -10], anchor: 'top' })
      .setText(`Lat: ${this.userLat}, Lng: ${this.userLng}`);

    this.marker.setPopup(popup);

    // Fetch address when marker is dragged
    this.marker.on('dragend', async () => {
      const newPos = this.marker.getLngLat();
      this.selectedAddress = await this.getAddress(newPos.lat, newPos.lng);
      popup.setText(`Lat: ${newPos.lat.toFixed(6)}, Lng: ${newPos.lng.toFixed(6)}`);
    });

    this.map.on('click', async (event: { lngLat: { lng: any; lat: any; }; }) => {
      const { lng, lat } = event.lngLat;

      // Move marker to tapped location
      this.marker.setLngLat([lng, lat]);

      // Fetch new address
      this.selectedAddress = await this.getAddress(lat, lng);
      popup.setText(`Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`);
    });

    // Fetch initial address
    this.selectedAddress = await this.getAddress(this.userLat, this.userLng);
    this.selectedPlace = '';
  }

  async getAddress(lat: number, lng: number): Promise<string> {
    try {
      const response = await fetch(
        `https://api.olamaps.io/places/v1/reverse-geocode?latlng=${lat},${lng}&api_key=${this.apiKey}`
      );
      const data = await response.json();
      console.log(data.results);
      this.userLat = lat;
      this.userLng = lng;
      this.editAddress();
      return data.results[0].formatted_address || "Address not found";
    } catch (error) {
      console.error('Error fetching address:', error);
      return "Error retrieving address.";
    }
  }

  async onSearchChange(event: any) {
    const query = event.target.value;
    if (!query || query.length < 3) {
      this.suggestions = [];
      return;
    }

    try {
      const response = await fetch(
        `https://api.olamaps.io/places/v1/autocomplete?input=${query}&api_key=${this.apiKey}`
      );

      const data = await response.json();
      console.log(data);
      if (data.status === 'ok' && data.predictions) {
        this.suggestions = data.predictions; // Store only the predictions
      } else {
        this.suggestions = [];
      }
    } catch (error) {
      console.error("Error fetching autocomplete suggestions:", error);
    }
  }

  async selectPlace(place: any) {
    const lat = parseFloat(place.geometry.location.lat);
    const lon = parseFloat(place.geometry.location.lng);

    this.selectedPlace = place.structured_formatting.main_text;
    this.selectedAddress = place.structured_formatting.secondary_text;
    this.userLng = parseFloat(place.geometry.location.lng);
    this.userLat = parseFloat(place.geometry.location.lat);
    
    this.suggestions = [];
    this.searchQuery = place.structured_formatting.main_text;

    // Move map and marker to selected place
    this.map.flyTo({ center: [lon, lat], zoom: 16 });
    this.marker.setLngLat([lon, lat]);
    this.editAddress();
  }

  async reset() {
    console.log(this.userLng);
    console.log(this.userLat);
    this.selectedAddress = await this.getAddress(this.userLat, this.userLng);
    this.map.flyTo({ center: [this.userLng, this.userLat], zoom: 16 });
    this.marker.setLngLat([this.userLng, this.userLat]);
  }
  // async locateMe() {
  //   navigator.geolocation.getCurrentPosition(
  //     async (position) => {
  //       this.userLat = position.coords.latitude;
  //       this.userLng = position.coords.longitude;

  //       this.selectedAddress = await this.getAddress(this.userLat, this.userLng);
  //       this.map.flyTo({ center: [this.userLng, this.userLat], zoom: 16 });
  //       this.marker.setLngLat([this.userLng, this.userLat]);
  //     }
  //   );
  // }
  async editAddress()
  {
    
    try {
      const data = {
        origins: `26.893947, 75.822454`,
        destinations: `${this.userLat},${this.userLng}`,
        api_key: 'Q6pETlo0Z5nhAeXc0RoR49c0apijP4Q6f5X34TPE',
      };

      const response: any = await this.apiService.getExternal('distanceMatrix', data);
      console.log('Ola Matrix API Response:', response);
      this.distance = response.rows[0]?.elements[0]?.distance || 0;
      console.log(this.distance);
    } catch (error) {
      console.error('Error fetching distance from Ola API:', error);
    }
  }
  async locateMe() {
    try {
      const coordinates = await Geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 25000 });
      console.log('Current Position:', coordinates.coords.latitude, coordinates.coords.longitude);
      // const longitude = coordinates.coords.longitude;
      this.userLat = coordinates.coords.latitude;
      this.userLng = coordinates.coords.longitude;
      console.log('locate latitude', this.userLat);
      console.log('locate longitude', this.userLng);
    } catch (error) {
      console.error('Error getting location:', error);
    }

    console.log(this.userLat);
    console.log(this.userLng);
    this.selectedAddress = await this.getAddress(this.userLat, this.userLng);
    this.map.jumpTo({ center: [this.userLng, this.userLat], zoom: 16 });
    this.marker.setLngLat([this.userLng, this.userLat]);
    this.selectedPlace = '';
  }
}
