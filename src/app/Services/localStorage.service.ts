import { DOCUMENT } from "@angular/common";
import { Inject, Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class LocalStorageService {
  localStorage: Storage | undefined;

  constructor(@Inject(DOCUMENT) document: Document) {
    this.localStorage = document.defaultView?.localStorage;
  }

  public saveData(key: string, value: string) {
    if (this.localStorage) {
      this.localStorage.setItem(key, value);
    }
  }

  public getData(key: string) {
    if (this.localStorage) {
      return this.localStorage.getItem(key);
    }
    return null;
  }

  public removeData(key: string) {
    if (this.localStorage) {
      return localStorage.removeItem(key);
    }
    return null;
  }

  public clearData() {
    if (this.localStorage) {
      localStorage.clear();
    }
  }

  public needInit()
  {
    if(this.getData("ListAllMalePokemon") == null || this.getData("pokemonOwned") == null)
    {
      return true;
    } else {
      return false;
    }
  }
}
