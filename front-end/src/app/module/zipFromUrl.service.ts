import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';  
import * as JSZip from 'jszip';  
import * as FileSaver from 'file-saver';  

@Injectable({
  providedIn: 'root'
})
export class ZipFromUrlService {
  jsonHeader = 'application/json; odata=verbose';  
  noAuthHeader = { headers: new HttpHeaders({ 'NoAuth': 'True' }) };
  constructor(  
    private httpClient: HttpClient,  
  ) { 
  }  
  async getFile(url: string) {  
    const httpOptions = {  
      responseType: 'blob' as 'json'  
    };  
    const res = await this.httpClient.get(url, httpOptions).toPromise().catch((err: HttpErrorResponse) => {  
      const error = err.error;  
      return error;  
    });  
    return res;  
  }  
  async downLoadFile(url){
    const fileData: any = await this.getFile(url);  
    const b: any = new Blob([fileData], { type: '' + fileData.type + '' });  
    FileSaver.saveAs(b,url.substring(url.lastIndexOf('/') + 1));
  }
  async createZip(files: any[], zipName: string) {  
    const zip = new JSZip();  
    const name = zipName + '.zip';  
    // tslint:disable-next-line:prefer-for-of  
    for (let counter = 0; counter < files.length; counter++) {  
      const element = files[counter];  
      const fileData: any = await this.getFile(element);  
      const b: any = new Blob([fileData], { type: '' + fileData.type + '' });  
      zip.file(element.substring(element.lastIndexOf('/') + 1), b);  
    }  
    zip.generateAsync({ type: 'blob' }).then((content) => {  
      if (content) {  
        FileSaver.saveAs(content, name);  
      }  
    });  
  }  
  async createMultiFileZip(video, videoText, image, textOfImage, zipName: string) {  
    const zip = new JSZip();  
    const name = zipName + '.zip';  
    // for image
    for (let counter = 0; counter < image.length; counter++) {  
      const element = image[counter];  
      const fileData: any = await this.getFile(element);  
      const b: any = new Blob([fileData], { type: '' + fileData.type + '' });  
      zip.file('image/'+(counter+1)+'/detail.txt'+element.substring(element.lastIndexOf('/') + 1), b);  
      zip.file('image/'+(counter+1)+'/detail.txt', textOfImage[counter]);  
    }  
    //for video
    if(video) {
      const fileData: any = await this.getFile(video);  
      const b: any = new Blob([fileData], { type: '' + fileData.type + '' });  
      zip.file(video.substring(video.lastIndexOf('/') + 1), b); 
    }
    zip.file('video-detail.txt', videoText);  
    zip.generateAsync({ type: 'blob' }).then((content) => {  
      if (content) {  
        FileSaver.saveAs(content, name);  
      }  
    });  
  }  
  async createCloudVideoFileZip(detailText, videoList, zipName: string) {  
    const zip = new JSZip();  
    const name = zipName + '.zip';  
    // for video List
    for (let counter = 0; counter < videoList.length; counter++) {  
      const videoURL = videoList[counter];  
      const fileData: any = await this.getFile(videoURL);  
      const video_blob: any = new Blob([fileData], { type: '' + fileData.type + '' });  
      zip.file('video/'+videoURL.substring(videoURL.lastIndexOf('/') + 1), video_blob);  
    }  
    //for video
    zip.file('video-detail.txt', detailText);  
    zip.generateAsync({ type: 'blob' }).then((content) => {  
      if (content) {  
        FileSaver.saveAs(content, name);  
      }  
    });  
  } 
}  