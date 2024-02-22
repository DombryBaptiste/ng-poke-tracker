import { DOCUMENT } from "@angular/common";
import { Inject, Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class LocalStorageService {
    constructor(@Inject(DOCUMENT) document: Document) {
        const localStorage = document.defaultView?.localStorage;
    }

    public saveData(key: string, value: string) {
        localStorage.setItem(key, value);
    }

    public getData(key: string) {
        return localStorage.getItem(key);
    }

    public removeData(key: string) {
        return localStorage.removeItem(key);
    }

    public clearData() {
        localStorage.clear();
    }
}