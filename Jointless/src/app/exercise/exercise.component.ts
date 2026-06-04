import { Component, inject, OnInit, signal } from "@angular/core";
import { IdLevel } from "../service/id_lvl.service";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { Get_lvl } from "../service/get_lvl.service";
import { FormsModule } from "@angular/forms";
import { MonacoEditorModule } from "ngx-monaco-editor-v2";


interface exerciseResponse {
    message: string;
    success: boolean;
}

interface clueResponse {
    clue: string;
}



@Component({
    selector: 'exercise-page',
    standalone: true,
    templateUrl: 'exercise.component.html',
    imports: [FormsModule, MonacoEditorModule]
})
export class ExerciseComponent {

    editorOptions = {
        theme: "vs-dark",
        language: "java",
        automaticLayout: true,
        wordWrap: "on",
        minimap: {
            enabled: false
        }
    };
    private router = inject(Router);
    private http = inject(HttpClient);

    idInject = inject(IdLevel);
    lvlInject = inject(Get_lvl);

    id = this.idInject.getId();
    title = signal('');
    description = signal('');
    answer = signal('');
    clueMessage = signal('');
    clueUsed = signal(false);

    ngOnInit() {
        this.lvlInject.getLvl().subscribe({
            next: (response) => {
                this.title.set(response.level.title);
                this.description.set(response.level.description);
                this.answer.set(response.level.starterCode);
            }
        })
    }
    message = signal('');
    correct = signal(false);


    onInput(value: string) {
        this.answer.set(value);
        this.change();
    }


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

    clue() {
        const body = {
            code: this.answer(),
            token: localStorage.getItem("token")
        };
        this.http.post<clueResponse>('http://localhost:8080/api/v1/clue', body).subscribe({
            next: (response) => {
                this.clueUsed.set(true);
                this.clueMessage.set(response.clue);

            },
            error: (error) => {

            }
        });
    }
    goBack() {
        this.router.navigateByUrl('home');
    }

    change() {
        this.message.set('');
        this.correct.set(false);
    }


}
