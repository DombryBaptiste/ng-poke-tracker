import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UserData } from "../Entity/UserData";

@Injectable({
    providedIn: 'root'
})

export class UserService {
    constructor(private http: HttpClient) { }

    getUserInfoById(userId: number)
    {
        return this.http.get<UserData>(`assets/data/${userId}.json`);
    }
}