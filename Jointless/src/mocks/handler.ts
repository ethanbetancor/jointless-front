
import { http, HttpResponse } from 'msw';


export const handlers = [
    http.post('/register', async( {request} ) =>{


        const values = await request.json();

        console.log("Datos recibidos", values);

        return HttpResponse.json({
            success: true,
            message: 'Usuario registrado'
        });
    }),
    http.post('/api/v1/users/login', async( {request} ) =>{


        const values = await request.json();

        console.log("Datos recibidos", values);

        return HttpResponse.json({
            success: true,
            message: 'Usuario identificado'
        });
    }),
    http.post('/api/v1/users/change-password', async( {request} ) =>{


        const values = await request.json();

        console.log("Datos recibidos", values);

        return HttpResponse.json({
            success: true,
            message: 'Contraseña cambiada'
        });
    }),

    http.post('/api/v1/lvl/get', async( {request} ) =>{


        const values = await request.json();

        console.log("Datos recibidos", values);

        return HttpResponse.json({
            success: true,
            message: 'Enunciado 1',
            categoria: 'bucles',
            id: 3
        });
    }),

    http.post('/api/v1/lvl/get/all', async( {request} ) =>{


        const values = await request.json();

        console.log("Datos recibidos", values);

        return HttpResponse.json([{
            success: true,
            message: 'Enunciado 1',
            categoria: 'bucles',
            id: 1
        },{
            success: false,
            message: 'Enunciado 2',
            categoria: 'bucles',
            id: 2
        },{
            success: true,
            message: 'Enunciado 3',
            categoria: 'string',
            id: 3
        },{
            success: true,
            message: 'Enunciado 4',
            categoria: 'string',
            id: 4
        },{
            success: false,
            message: 'Enunciado 5',
            categoria: 'colecciones',
            id: 5
        },{
            success: false,
            message: 'Enunciado 6',
            categoria: 'colecciones',
            id: 6
        },{
            success: true,
            message: 'Enunciado 7',
            categoria: 'arrays',
            id: 7
        },{
            success: true,
            message: 'Enunciado 8',
            categoria: 'arrays',
            id: 8
        },{
            success: true,
            message: 'Enunciado 9',
            categoria: 'variables',
            id: 9
        },{
            success: true,
            message: 'Enunciado 10',
            categoria: 'arrays',
            id: 10
        },{
            success: true,
            message: 'Enunciado 10',
            categoria: 'variables',
            id: 11
        },{
            success: false,
            message: 'Enunciado 10',
            categoria: 'variables',
            id: 12
        }]);
    })
];