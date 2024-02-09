
const miFormulario = document.querySelector('form');

miFormulario.addEventListener('submit', ev => {
    ev.preventDefault();

    const formData = {}

    for(let el of miFormulario.elements){
        if( el.name.length > 0)
            formData[el.name] = el.value
    }

    fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(resp => resp.json())
    .then(({ msg, token }) => {
        if( msg ){
            return console.error( msg );
        }

        localStorage.setItem( 'token', token ); //Guardar en el local storage
        window.location = 'chat.html';

    })
    .catch(console.warn);
});

function handleCredentialResponse(response) {

    const body = {id_token: response.credential}

    // Google token : ID_TOKEN
    // console.log('id_token', response.credential);

    fetch('http://localhost:3001/api/auth/google', {
        method: 'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify(body)
    })
        .then(resp => resp.json())
        .then(resp => {
            console.log(resp);
            localStorage.setItem( 'email', resp.usuario.correo ); //Guardar en el local storage
            localStorage.setItem( 'token', resp.token ); //Guardar en el local storage
            window.location = 'chat.html';

        })
        .catch(console.warn);

}

const button = document.getElementById('google_signout');

button.onclick = () => {

    console.log(google.accounts.id);
    google.accounts.id.disableAutoSelect();

    google.accounts.id.revoke( localStorage.getItem( 'email' ), done => {
        localStorage.clear();
        location.reload();
    });

}