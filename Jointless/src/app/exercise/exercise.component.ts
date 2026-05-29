import { Component, inject, OnInit, signal } from "@angular/core";
import { IdLevel } from "../service/id_lvl.service";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { Get_lvl } from "../service/get_lvl.service";
import { http } from 'msw';

interface exerciseResponse {
    message: string;
    success: boolean;
}




@Component({
    selector: 'exercise-page',
    templateUrl: 'exercise.component.html',
})
export class ExerciseComponent {

    private router = inject(Router);
    private http = inject(HttpClient);

    idInject = inject(IdLevel);
    lvlInject = inject(Get_lvl);

    id = this.idInject.getId();
    title = signal('');
    description = signal('');
    answer = signal('');

    ngOnInit(){
        this.lvlInject.getLvl().subscribe({
            next: (response)=>{
                this.title.set(response.level.title);
                this.description.set(response.level.description);
                this.answer.set(response.level.starterCode);
            }
        })
    }
    message = signal('');
    correct = signal(false);

    

    

    send() {
        const body = {
        code: this.answer(),
        levelId: this.id,
        credentialsEncrypted: localStorage.getItem("credentials")
    };
        this.http.post<exerciseResponse>('http://localhost:8080/api/v1/solutions/submit', body).subscribe({
            next: (response) => {
                this.message.set(response.message);
                this.correct.set(response.success);
            },
            error: (error) => {

            }
        });
    }
    goBack() {
        this.router.navigateByUrl('home');
    }

    change(){
        this.message.set('');
        this.correct.set(false);
    }

    autocomplete(tecla: KeyboardEvent, textarea: HTMLTextAreaElement) {
        let apertura = '';
        let cierre = '';

        switch (tecla.key) {
            case '{':
                apertura = '{';
                cierre = '}';
                break;

            case '(':
                apertura = '(';
                cierre = ')';
                break;

            case '[':
                apertura = '[';
                cierre = ']';
                break;

            default:
                return;
        }

        tecla.preventDefault();

        const principio = textarea.selectionStart;
        const fin = textarea.selectionEnd;
        const value = textarea.value;

        const newValue =
            value.substring(0, principio) +
            apertura +
            cierre +
            value.substring(fin);
        textarea.value = newValue;
        this.answer.set(newValue);

        textarea.selectionStart = principio + 1;
        textarea.selectionEnd = principio + 1;

    }
}
