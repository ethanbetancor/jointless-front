import { Injectable, signal } from "@angular/core";


@Injectable({
    providedIn: 'root'
})
export class IdLevel{
    private id = signal(0);

    getId(): number{
        return this.id();
    }

    setId(id:number){
        this.id.set(id);
    }
}


