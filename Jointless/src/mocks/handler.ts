
import { http, HttpResponse } from 'msw';


export const handlers = [
    http.post('/register', async( {request} ) =>{


        const values = await request.json();

        console.log("Datos recividos", values);

        return HttpResponse.json({
            success: true,
            message: 'Usuario registrado'
        });
    })
];