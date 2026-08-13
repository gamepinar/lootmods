const fetch = require('node-fetch'); // Si falla usa node 18 nativo fetch. Como estamos en entorno de prueba, vamos a intentar usar fetch nativo.

async function test() {
    try {
        const res = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'gamepinar@yahoo.com', password: 'VK14ZclVnoROhBnA' })
        });
        const text = await res.text();
        console.log(`Status: ${res.status}`);
        console.log(`Body: ${text}`);
    } catch(e) {
        console.error(e);
    }
}

test();
