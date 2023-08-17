var player;

const updateUI = async () => {
    const fullName = document.getElementById("full-name");
    const avatar = document.getElementById("avatar");

    try {
        const response = await axios.get("/user/me");
        const { nickname, picture, email: userEmail, id } = response.data;
        window.email = userEmail;
        window.userId = id;
        
        const isAuthenticated = nickname && email;
        document.getElementById("btn-login").style.display = isAuthenticated ? "none" : "block";
        document.getElementsByClassName("user-profile")[0].style.display = isAuthenticated ? "block" : "none";
        if (nickname && picture) {
            fullName.innerHTML = nickname;
            avatar.src = picture;

            fullName.style.visibility = "visible";
            avatar.style.visibility = "visible";
        }
    } catch (error) {
        document.getElementsByClassName("user-profile")[0].style.display = 'none';
        // console.log(error.message);
    }

    (localStorage.getItem('theme') === 'dark-mode') ? setTheme('dark-mode') : setTheme("light-mode");
    setLogo();
}

updateUI();

function setTheme(themeName) {
    localStorage.setItem('theme', themeName);
    document.documentElement.className = themeName;
}

function toggleTheme() {
    (localStorage.getItem("theme") === "light-mode") ? setTheme("dark-mode") : setTheme("light-mode");
    setLogo();
}

function setLogo() {
    const navBrand = document.getElementsByClassName("navbar-brand")[0];
    if (localStorage.getItem("theme") === "light-mode") {
        navBrand.innerHTML = `
            <img src='https://res.cloudinary.com/v-webdev/image/upload/v1683379129/test/BT_Logo_Gold_4x_sqr75j.png' alt="logo" width="80" 
            height="80" />
        `;
    } else {
        navBrand.innerHTML = `
        <img src="https://res.cloudinary.com/v-webdev/image/upload/v1683379366/test/bt3_bkcnhc.png" alt="logo" width="80" height="80"/>
        `;
    }
}