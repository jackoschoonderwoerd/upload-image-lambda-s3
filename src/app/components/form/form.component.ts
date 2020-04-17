import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UploadService } from 'src/app/services/upload.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  @ViewChild('uploadForm') uploadForm: ElementRef;

  constructor(private uploadService: UploadService) { }

  imageSrc: string;

  ngOnInit(): void {
  }

  uploadFile(event) {
    
    const file = event.target.files[0];
    const reader = new FileReader()
    reader.onloadend = (e) => {
      const readerResult = reader.result.toString();
      this.uploadService.uploadFile(readerResult, file.name).subscribe(
        (data: any) => {
          if(typeof(data) === 'string'){
            alert(data);
            return;
          }
          this.imageSrc = data.Location;
          console.log(data);
        }
      );
    }
    reader.readAsDataURL(file);
    this.resetFileInput()
  }

  resetFileInput() {
    this.uploadForm.nativeElement.reset();
  }
}
