var player;

const updateUI = async () => {
    const fullName = document.getElementById("full-name");
    const avatar = document.getElementById("avatar");

    try {
        const response = await axios.get("/user/me");
        const { nickname, picture, email } = response.data;
        const isAuthenticated = nickname && email;
        document.getElementById("btn-login").style.display = isAuthenticated ? "none" : "block";
        document.getElementsByClassName("user-profile")[0].style.display = isAuthenticated ? "block" : "none";
        if (nickname && email) {
            fullName.innerHTML = nickname;
            avatar.src = avatar;
            fullName.style.visibility = "visible";
            avatar.style.visibility = "visible";
        }
    } catch (error) {
        document.getElementsByClassName("user-profile")[0].style.display = 'none';
        console.log(error.message);
    }
}

updateUI();