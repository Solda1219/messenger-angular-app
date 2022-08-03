import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class CommonFunctionService {
  checkAll = false;
  checkbox = [];
  regex_yyyymmddhhmmss = /[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]/;
  regex_numberAndPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  regex_chinesePhoneNumber = /^(13[0-9]|14[57]|15[012356789]|17[0678]|18[0-9])[0-9]{8}$/;
  constructor(
    private lang: TranslateService
  ) { }
  //new
  isDate(_date){
    return !isNaN(new Date(_date).getDate());
  }
  getDateRange(key){//0-today 1-this week 2- this month 3-this year
    let today = new Date();
    if(key==0) return {from:new Date().setHours(0,0,0,0),to:new Date().setHours(23,59,59,999)}
    else if(key==1) {
      var startofweek = today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1);
      return {from:new Date(today.setDate(startofweek)).setHours(0,0,0,0),to:new Date().setHours(23,59,59,999)}
    }
    else if(key==2) {
      return {from:new Date(today.getFullYear(), today.getMonth(), 1).setHours(0,0,0,0),to:new Date().setHours(23,59,59,999)}
    }
    else if(key==3) {
      return {from:new Date(today.getFullYear(), 0, 1).setHours(0,0,0,0),to:new Date().setHours(23,59,59,999)}
    }
  }
  getChineseTime(time){
    if(!time) return ''
    return this.getDateStringYYYYMMDDHHMMSS(new Date(time).toLocaleString())
  }
  //old
  getDateStringMMDDYYYY(ss) {
    const getFormat = (text) => {
      if (text < 10) return '0' + text
      else return text;
    }
    const d = new Date(ss);
    return (getFormat(d.getMonth() + 1)) + '/' + getFormat(d.getDate()) + '/' + d.getFullYear();
  }
  findMatchedColumn(serachKey, columnIndexs, srcForSearch) {
    for (let j = 0; j < columnIndexs.length; j++) {
      const column = String(srcForSearch[columnIndexs[j]]);
      if (column.indexOf(serachKey) != -1)
        return srcForSearch
    }
    return false;
  }
  getSerialNumber(){
    const getFormat = (text) => {
      if (text < 10) return '0' + text
      else return text;
    }
    const d = new Date();
    const dateFormat = d.getFullYear() + '-' + getFormat(d.getMonth() + 1) + '-' + getFormat(d.getDate()) + '-' + getFormat(d.getHours()) + '' + getFormat(d.getMinutes()) + '' + getFormat(d.getSeconds());
    return dateFormat;
  }
  getDateStringYYYYMMDDHHMMSS(ss) {
    const getFormat = (text) => {
      if (text < 10) return '0' + text
      else return text;
    }
    const d = new Date(ss);
    const dateFormat = d.getFullYear() + '-' + getFormat(d.getMonth() + 1) + '-' + getFormat(d.getDate()) + ' ' + getFormat(d.getHours()) + ':' + getFormat(d.getMinutes()) + ':' + getFormat(d.getSeconds());
    return dateFormat;
  }
  getDateStringHHMM(ss) {
    const getFormat = (text) => {
      if (text < 10) return '0' + text
      else return text;
    }
    const d = new Date(ss);
    const dateFormat = getFormat(d.getHours()) + ':' + getFormat(d.getMinutes());
    return dateFormat;
  }
  getDateStringYYYYMMDD(ss) {
    const getFormat = (text) => {
      if (text < 10) return '0' + text
      else return text;
    }
    const d = new Date(ss);
    const dateFormat = d.getFullYear() + '-' + getFormat(d.getMonth() + 1) + '-' + getFormat(d.getDate());
    return dateFormat;
  }
  getDateStringYYYYMMDDROW(ss) {
    const getFormat = (text) => {
      if (text < 10) return '0' + text
      else return text;
    }
    const d = new Date(ss);
    const dateFormat = d.getFullYear() + getFormat(d.getMonth() + 1) + getFormat(d.getDate());
    return dateFormat;
  }
  getDateStringYYYYMMDDHHMMSSROW(ss) {
    const getFormat = (text) => {
      if (text < 10) return '0' + text
      else return text;
    }
    const d = new Date(ss);
    const dateFormat = d.getFullYear() + getFormat(d.getMonth() + 1) + getFormat(d.getDate()) + getFormat(d.getHours()) + getFormat(d.getMinutes()) + getFormat(d.getSeconds());
    return dateFormat;
  }
  convertTOYYYYMMDDHHMMSS(ss) {
    const str = String(ss).split('');
    return str[0] + str[1] + str[2] + str[3] + '-' + str[4] + str[5] + '-' + str[6] + str[7] + ' ' + str[8] + str[9] + ':' + str[10] + str[11] + ':' + str[12] + str[13];
  }
  translate(word) {
    if (localStorage.getItem('language')) this.lang.use(localStorage.getItem('language'))
    else this.lang.use('english');
    return this.lang.instant(word);
  }
}