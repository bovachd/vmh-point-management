
import { createApp, reactive } from 'https://unpkg.com/petite-vue?module'
const store = reactive({
    open: true,
    isLoggedIn: false,
})

function MainComponent() {
    return {
        $template: "#main",
        mounted() {
            let jwt = localStorage.getItem('jwt')
            if (jwt && jwt !== "") {
                store.isLoggedIn = true
            }
        },
    }
}

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

window.HandleLogin = (response) => {
    const responsePayload = parseJwt(response.credential);

    let email = responsePayload.email
    if (email != "hangminhvu.626@gmail.com" && email != "bovachd@gmail.com") {
        alert("Authenticaion Failed. Access Denied!!!")
        store.isLoggedIn = false
        localStorage.clear()
        return
    }

    localStorage.setItem('jwt', `Bearer ${response.credential}`)
    store.isLoggedIn = true
}


createApp({ MainComponent, store }).mount()