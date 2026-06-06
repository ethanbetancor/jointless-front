

import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { IdLevel } from "./id_lvl.service";


interface levelResponse{
    level:level
    isPassed:boolean
}
interface level{
    id: number,
    title: string,
    description: string,
    category: string,
    starterCode: string
}

@Injectable({
    providedIn: 'root'
})
export class Get_lvl{
    private http = inject(HttpClient);
    private idSignal = inject(IdLevel);

    getLvl(){
        const token = localStorage.getItem('token');
        const body = {
        id: this.idSignal.getId(),
        }
        const headers = new HttpHeaders({
            authorization: `Bearer ${token}`
        });
        return this.http.post<levelResponse>('http://jointless-back-production.up.railway.app/api/v1/lvl/get', body,{headers});
    }
}
