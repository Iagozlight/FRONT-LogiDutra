import { AfterViewInit, Component, inject, Input} from '@angular/core';
import { VroomService } from '../../../services/vroom.service';
import { Veiculo } from '../../../models/veiculos';
import { Rota} from '../../../models/rota';
import { ClienteRomaneio } from '../romaneio-tela-principal/romaneio-tela-principal.component';
import * as Leaflet from 'leaflet';
import polyline from '@mapbox/polyline';

@Component({
  selector: 'app-map',
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements AfterViewInit{
  @Input() veiculo!:Veiculo;
  @Input() clientes!:ClienteRomaneio[];

  entregasCords:[number, number][] = [];

  private map!: Leaflet.Map;

  vroomService = inject(VroomService);


   ngAfterViewInit(): void{
    this.initMap();

    this.desenharRota();
  }

  private initMap():void{
    this.map = Leaflet.map('map').setView([-25.5478, -54.5882], 13);
    Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution:'&copy; OpenStreetMap contributors'}).addTo(this.map);
  }

  private async getCordenadas(){
    for(let i = 0; i < this.clientes.length; i++){
      var cordenada = await this.vroomService.getCordenadas(`${this.clientes[i].dados.logradouro}, ${this.clientes[i].dados.cidade}`, 0);

      console.log(cordenada);
      this.entregasCords.push([cordenada[0], cordenada[1]]);

      for(let i = 0; i < this.entregasCords.length; i++){
        Leaflet.marker(this.entregasCords[i]).addTo(this.map).bindPopup("Cliente " + (i + 1));

      }
    
    }
  }

  private async getGeolocalizacao() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition((posicao) => {
        resolve(posicao.coords);
      })
    })
  }

  private async desenharRota(){
    await this.getCordenadas();

    const posicao = (await this.getGeolocalizacao() as {latitude:number, longitude:number});

    this.vroomService.getRotaOtimizada(new Rota(this.veiculo, this.entregasCords, [posicao.longitude, posicao.latitude])).subscribe({
      next: (rotaOtimizada)=>{
        const cordenadas = polyline.decode(rotaOtimizada.routes[0].geometry);

        const routeLine = Leaflet.polyline(cordenadas, {color: '#8400ff', weight: 5, opacity: 0.8}).addTo(this.map);

        console.log("Passei por aqui");

        this.map.fitBounds(routeLine.getBounds());
      }
    })
  }
}
