import { Component, AfterViewInit, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OlaMaps } from 'olamaps-web-sdk';
import { Geolocation } from '@capacitor/geolocation';
import { ApiService } from '../services/api.service';
@Component({
  selector: 'app-add-location',
  templateUrl: './add-location.page.html',
  styleUrls: ['./add-location.page.scss'],
  standalone: false,
})
export class AddLocationPage implements OnInit {
  olaMaps!: OlaMaps;
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
  distance: any;

  constructor(private route: ActivatedRoute, public apiService : ApiService) { }

  // async ngAfterViewInit() {
  //   await this.loadMap();
  // }

  ngOnInit() {

  }
  async ionViewDidEnter() {
    await this.loadMap();
    this.getCurrentLocation();
  }


  async getCurrentLocation() {

    const coordinates = await Geolocation.getCurrentPosition();

    const latitude = coordinates.coords.latitude;

    const longitude = coordinates.coords.longitude;

    console.log('Latitude:', latitude, 'Longitude:', longitude);

  }

  handleGeolocationError(error: any) {
    if (error.code === 1) {
      alert("Permission denied. Please enable location access.");
    } else if (error.code === 2) {
      alert("Location unavailable. Please check GPS or network.");
    } else if (error.code === 3) {
      alert("Location request timed out. Try again.");
    } else {
      alert("An unknown error occurred.");
    }
  }

  async loadMap() {
    // navigator.geolocation.getCurrentPosition(
    //   async (position) => {


    try {
      const coordinates = await Geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 25000 });
      console.log('Current Position:', coordinates.coords.latitude, coordinates.coords.longitude);
      // const longitude = coordinates.coords.longitude;
      this.userLat = coordinates.coords.latitude;
      this.userLng = coordinates.coords.longitude;
      console.log(this.userLat);
      console.log(this.userLng);
      this.addAddress();
    } catch (error) {
      console.error('Error getting location:', error);
      // const longitude = coordinates.coords.longitude;
      this.userLat = 26.90545;
      this.userLng = 75.7647548;
      this.handleGeolocationError(error);
    }

    // const latitude = coordinates.coords.latitude;



    // Initialize Ola Maps
    this.olaMaps = new OlaMaps({
      apiKey: this.apiKey,
    });

    this.map = this.olaMaps.init({
      style: 'https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard-hi/style.json?key=0.4.0',
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
      this.selectedPlace = '';
      popup.setText(`Lat: ${newPos.lat.toFixed(6)}, Lng: ${newPos.lng.toFixed(6)}`);
    });

    this.map.on('click', async (event: { lngLat: { lng: any; lat: any; }; }) => {
      const { lng, lat } = event.lngLat;

      this.marker.setLngLat([lng, lat]);

      this.selectedAddress = await this.getAddress(lat, lng);
      popup.setText(`Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`);
    });

    // Fetch initial address
    this.selectedAddress = await this.getAddress(this.userLat, this.userLng);
    this.selectedPlace = '';

    // Load nearby places
    // this.loadNearbyPlaces();
    //   },
    //   (error) => {
    //     console.error('Geolocation error:', error);
    //     this.selectedAddress = "Could not fetch location.";
    //   }
    // );
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
      this.addAddress();
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
    console.log(place.structured_formatting);

    this.selectedPlace = place.structured_formatting.main_text;
    this.selectedAddress = place.structured_formatting.secondary_text;
    this.userLng = parseFloat(place.geometry.location.lng);
    this.userLat = parseFloat(place.geometry.location.lat);
    this.suggestions = [];
    this.searchQuery = place.structured_formatting.main_text;

    // Move map and marker to selected place
    await this.map.jumpTo({ center: [lon, lat], zoom: 16 });
    this.marker.setLngLat([lon, lat]);
    this.addAddress();
  }

  // async loadNearbyPlaces() {
  //   try {
  //     const response = await fetch(
  //       `https://api.olamaps.io/places/v1/nearbysearch?layers=venue&types=street_address&location=${this.userLat},${this.userLng}&api_key=${this.apiKey}`,

  //     );

  //     const data = await response.json();
  //     console.log(data);
  //     this.nearbyPlaces = data.predictions || [];

  //     this.nearbyPlaces.forEach((place) => {
  //       const [lon, lat] = place.geometry.location;
  //       this.olaMaps
  //         .addMarker({
  //           color: "#0000FF", 
  //           anchor: "bottom",
  //         })
  //         .setLngLat([lon, lat])
  //         .addTo(this.map);
  //     });
  //   } catch (error) {
  //     console.error("Error fetching nearby places:", error);
  //   }
  // }
  async addAddress()
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
      this.addAddress();
    } catch (error) {
      console.error('Error getting location:', error);
      // const longitude = coordinates.coords.longitude;
      this.userLat = 26.90545;
      this.userLng = 75.7647548;
      this.handleGeolocationError(error);
    }

    console.log(this.userLat);
    console.log(this.userLng);
    this.selectedAddress = await this.getAddress(this.userLat, this.userLng);
    this.map.jumpTo({ center: [this.userLng, this.userLat], zoom: 16 });
    this.marker.setLngLat([this.userLng, this.userLat]);
    this.selectedPlace = '';
  }
}

