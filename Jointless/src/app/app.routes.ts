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
import { SignUpComponent } from './sign_up/sign_up.component';

export const routes: Routes = [
    {
        path: 'register',
        component: SignUpComponent
    },
];
