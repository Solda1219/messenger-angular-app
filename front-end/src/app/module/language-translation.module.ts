/**
 * This module is used to language translations.
 * The translations are saved in a json file in /src/app/assets/i18n directory
 * Docs: https://www.codeandweb.com/babeledit/tutorials/how-to-translate-your-angular7-app-with-ngx-translate
 */
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
// import ngx-translate and the http loader
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// ngx-translate - required for AOT compilation
export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    declarations: [],
    imports: [
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient]
            }
        })
    ],
    exports: [TranslateModule]
}) 
export class LanguageTranslationModule {
    constructor(private translate: TranslateService) {
        // Gets Default language from browser if available, otherwise set English ad default
        this.translate.addLangs(['english','simplified_chinese','traditional_chinese','korean','japanese']);
        this.translate.setDefaultLang('english');
        const browserLang = this.translate.getBrowserLang();
        
        this.translate.use(browserLang.match(/english|simplified_chinese|traditional_chinese|korean|japanese/) ? browserLang : 'english');
    }
}
