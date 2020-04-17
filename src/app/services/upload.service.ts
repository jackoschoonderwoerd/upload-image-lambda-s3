import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Subject } from 'rxjs'


@Injectable({
  providedIn: 'root'
})
export class UploadService {

  // imageChanged = new EventEmitter<any>();
  imageChanged = new Subject<string>();
  retrievedData: string;

  constructor(private http: HttpClient) { }

  // dataURLtoFile(dataurl, filename) {
    
  //   var arr = dataurl.split(','),
  //     mime = arr[0].match(/:(.*?);/)[1],
  //     bstr = atob(arr[1]),
  //     n = bstr.length,
  //     u8arr = new Uint8Array(n);

  //   while (n--) {
  //     u8arr[n] = bstr.charCodeAt(n);
  //   }
  //   console.log(new File([u8arr], filename, { type: mime}));
    
  //   return new File([u8arr], filename, { type: mime });
  // }


  uploadFile(readerResult, filenName) {
    // console.log(readerResult)
    const message = { "readerResult": readerResult, "fileName": filenName }
    return this.http.post('https://pe1173k0k1.execute-api.eu-central-1.amazonaws.com/kahaduwa/image-upload-kahaduwa', message)
  }



  getFile() {
    console.log('getFile');
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "https://pe1173k0k1.execute-api.eu-central-1.amazonaws.com/kahaduwa/get-image-kahaduwa", true);
    // xhr.responseType = "ArrayBuffer";
    xhr.onload = function (e) {
      // Obtain a blob: URL for the image data.
      var arrayBufferView = new Uint8Array(this.response);
      var blob = new Blob([arrayBufferView], { type: "image/jpeg" });
      var urlCreator = window.URL || window.webkitURL;
      var imageUrl = urlCreator.createObjectURL(blob);

      var img = document.querySelector("#photo");
      // img.src = imageUrl;
      console.log(imageUrl)
    };

    xhr.send();
    return this.http.get('https://pe1173k0k1.execute-api.eu-central-1.amazonaws.com/kahaduwa/get-image-kahaduwa')
  }
}
