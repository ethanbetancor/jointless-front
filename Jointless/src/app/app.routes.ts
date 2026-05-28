import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { ChangePassword } from './auth/change-password/change-password';
import { SignUpComponent } from './auth/sign_up/sign_up.component';
import { Home } from './home/home/home';
import { User } from './home/user/user';
import { ExerciseComponent } from './exercise/exercise.component';

export const routes: Routes = [
    {
        path: 'login',
        component: Login,
    },
    {
        path: 'change-password',
        component: ChangePassword,
    },
    {
        path: 'register',
        component: SignUpComponent
    },
    {
        path: 'home',
        component: Home,
    },
    { 
        path: 'user',
        component: User
    },
    { 
        path: 'exercise',
        component: ExerciseComponent
    },
    {
        path: '**',
        redirectTo: ()=>{
            return 'login';
        },
    },
    
]

    

