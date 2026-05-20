import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { ChangePassword } from './auth/change-password/change-password';
import { SignUpComponent } from './sign_up/sign_up.component';

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
        path: '**',
        redirectTo: ()=>{
            return 'login';
        },
    },
    
]

    

