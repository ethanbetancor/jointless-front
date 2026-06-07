import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { SignUpComponent } from './auth/sign_up/sign_up.component';
import { Home } from './home/home/home';
import { User } from './home/user/user';
import { History } from './home/history/history';
import { ExerciseComponent } from './exercise/exercise.component';
import { LogoutComponent } from './auth/logout/logout.component';
import { Control } from './auth/control/control';

export const routes: Routes = [
    {
        path: 'login',
        component: Login,
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
        path: 'history',
        component: History
    },
    { 
        path: 'logout',
        component: LogoutComponent
    },
    { 
        path: 'control',
        component: Control
    },
    {
        path: '**',
        redirectTo: 'control'
    },
    
]


