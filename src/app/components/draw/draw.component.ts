import { Component, OnInit, NgZone } from '@angular/core';
import { AuthService } from "../../shared/services/auth.service";
import { Router } from "@angular/router";
import { fabric } from 'fabric';
import { fromEvent, Observable, Subscription } from "rxjs";
import { trigger } from '@angular/animations';
import { Canvas } from 'fabric/fabric-impl';
@Component({
  selector: 'app-draw',
  templateUrl: './draw.component.html',
  styleUrls: ['./draw.component.css']
})
export class DrawComponent implements OnInit {
  canvas: any;
  color: any;
  brush: any;
  constructor(
    public authService: AuthService,
    public router: Router,
    public ngZone: NgZone
  ) { }
  
  async ngOnInit(): Promise<any>{
      this.canvas = new fabric.Canvas('canvas',{
        selectionLineWidth: 2,
        width: 950,
        height: 950,
        isDrawingMode: true,
      });
    this.brush=this.canvas.freeDrawingBrush;
    const loadedCanvas=await this.authService.getSavedCanvas();
    if(loadedCanvas)
    this.canvas.loadFromJSON(loadedCanvas); 

    this.canvas.on('object:added', this.canvasModifiedCallback.bind(this));
    this.canvas.on('object:modified', this.canvasModifiedCallback.bind(this));
    this.canvas.on('object:removed', this.canvasModifiedCallback.bind(this));
  }
  canvasModifiedCallback () {
    var jsonCanvas= JSON.stringify(this.canvas.toJSON());
    this.authService.UpdateCanvas(jsonCanvas);
    }
  toggleIsDrawing(): void{
    this.canvas.isDrawingMode=!this.canvas.isDrawingMode;
  }
  clearCanvas(): void{
    this.canvas.clear();
    this.canvasModifiedCallback();
  }
} 
