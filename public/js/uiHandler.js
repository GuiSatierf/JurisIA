document.addEventListener("DOMContentLoaded", function () {
    const contentOne = document.querySelector(".content-one");
    const contentTwo = document.querySelector(".content-two");
    const toggleBtn = document.getElementById("toggle-btn");

    // Inicialmente, esconde content-one e sidebar-container
    contentOne.style.display = "none";


    // Fade-in para content-two ao carregar
    setTimeout(() => {
        contentTwo.classList.add("active");
    }, 10);

    toggleBtn.addEventListener("click", function () {
        // Se content-one está escondido, mostra content-one, sidebar, e esconde o botão
        if (contentOne.style.display === "none") {
            contentTwo.classList.remove("active");
            toggleBtn.style.display = "none";
            contentOne.style.display = "block";

            setTimeout(() => {
                contentOne.classList.add("active");
            }, 10);
            return;
        }

        // Se content-one está visível, esconde content-one e sidebar, e mostra o botão
        contentOne.classList.remove("active");

        setTimeout(() => {
            contentOne.style.display = "none";
            contentTwo.classList.add("active");
            toggleBtn.style.display = "block";
        }, 500);
    });
});
