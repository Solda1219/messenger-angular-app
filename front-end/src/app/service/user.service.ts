import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  loginURL = '/login';
  firstPage = '';
  noAuthHeader = { headers: new HttpHeaders({ 'NoAuth': 'True' }) };

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService,
  ) { }
  //For request
  postRequest(URL, data = {}, header = true) {
    if(!this.isLoggedIn() && header == true){
      this.gotoLogin();
    } 
    if (header==true){
      return this.http.post(URL, data, this.getHeader())
    } 
    else{
      return this.http.post(URL, data, this.noAuthHeader)
    }
  }
  getRequest(URL, header = false) {
    if(!this.isLoggedIn() && header == true) this.gotoLogin();
    if (header) return this.http.get(URL,this.getHeader())
    else return this.http.get(URL,this.noAuthHeader)
  }
  //message
  handleSuccess(message){
    this.toastr.success(message)
  }
  errorMessage(message){
    this.toastr.error(message)
  }
  handleError(err) {
    if (err.status == 504) this.toastr.error("Server is not responsing.")
    else err.error.message ? this.toastr.error(err.error.message) : this.toastr.error('something went wrong')
  }
  //for authentication
  logOut(){
    this.deleteToken();
    this.gotoLogin();
  }
  gotoLogin(){
    this.router.navigateByUrl(this.loginURL);
  }
  gotoURL(url){
    this.router.navigateByUrl(url);
  }
  gotoFirstPage() {
    this.router.navigateByUrl(this.firstPage);
  }
  setToken(token) {
    localStorage.setItem('token', JSON.stringify(token));
  }
  setUserInfo(userInfo) {
    localStorage.setItem('userInfo', JSON.stringify(userInfo))
  }
  getToken() {
    return JSON.parse(localStorage.getItem('token'));
  }
  getUserInfo() {
    return JSON.parse(localStorage.getItem('userInfo'));
  }
  deleteToken() {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
  }
  getUserPayload() {
    var token = this.getToken();
    if (token) {
      var userPayload = atob(token['token'].split('.')[1]);
      return JSON.parse(userPayload);
    }
    else
      return null;
  }
  isLoggedIn() {
    var userPayload = this.getUserPayload();
    if (userPayload)  return userPayload.exp > Date.now() / 1000
    else return false;
  }
  getHeader() {
    if(!this.getToken()) {
      this.router.navigateByUrl(this.loginURL);
      return;
    }
    else if(!this.isLoggedIn()){
      this.router.navigateByUrl(this.loginURL);
      return;
    }
    const header = { headers: { Authorization: `Bearer ${this.getToken().token}` }, user: this.getToken().userInfo }
    return header;
  }
}
