import { Component, OnInit, NgZone } from '@angular/core';
import { AuthService } from "../../shared/services/auth.service";
import { Router } from "@angular/router";
import { fabric } from 'fabric';
@Component({
  selector: 'app-draw',
  templateUrl: './draw.component.html',
  styleUrls: ['./draw.component.css']
})
export class DrawComponent implements OnInit {
  public canvas: any;
  color: any;
  brush: any;
  constructor(
    public authService: AuthService,
    public router: Router,
    public ngZone: NgZone
  ) { }
  
  async ngOnInit(): Promise<any>{
      const canvasSize= document.getElementsByClassName('canvasWrapper');
      this.canvas = new fabric.Canvas('canvas',{
        selectionLineWidth: 2,
        width: canvasSize[0].clientWidth*0.9,
        height: canvasSize[0].clientHeight*0.9,
        backgroundColor: '#FFFF',
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
  onSelectFile(event) { // called each time file input changes
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const img =new Image();
      img.src= URL.createObjectURL(file);
      const useFromURL = () => {
        //const canvas= this.canvas;
        fabric.Image.fromURL(img.src, (img) => {
          this.canvas.add(img);
        },{
          crossOrigin:'annonymous'
        });
        return this.canvas;
      }
      fabric.Image.prototype.toDatalessObject = fabric.Image.prototype.toObject;
      fabric.Image.prototype.toObject = (function(toObject) {
        return function() {
          return fabric.util.object.extend(toObject.call(this), {
            src: this.toDataURL()
          });
        };
      })(fabric.Image.prototype.toObject);
      
      this.canvas = useFromURL();
      console.log(this.canvas.toJSON);
    }
  };
} 
