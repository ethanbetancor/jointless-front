import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { ChangePassword } from './auth/change-password/change-password';

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
        path: '**',
        redirectTo: ()=>{
            return 'login';
        },
    }
];
