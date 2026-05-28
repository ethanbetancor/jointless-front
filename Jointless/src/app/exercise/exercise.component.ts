import { Component, inject, OnInit, signal } from "@angular/core";
import { IdLevel } from "../service/id_lvl.service";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";

interface exerciseResponse {
    message: string;
    passed: boolean;
}

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


@Component({
    selector: 'exercise-page',
    templateUrl: 'exercise.component.html',
})
export class ExerciseComponent {
    private router = inject(Router);
    private http = inject(HttpClient);
    idInject = inject(IdLevel);
    id = this.idInject.getId();
    title = signal('');
    answer = signal('');

    message = signal('perfe');
    correct = signal(true);

    body = {
        levelId: this.id,
        code: this.answer(),
        credentialsEncrypted: localStorage.getItem("username")
    };
    send() {
        this.http.post<exerciseResponse>('http://localhost:8080/api/v1/solutions', this.body).subscribe({
            next: (response) => {
                this.message.set(response.message);
                this.correct.set(response.passed);
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
