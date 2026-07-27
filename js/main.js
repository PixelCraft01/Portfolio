/* =================================================
    MOBILE VIEWPORT HEIGHT UTILITY
    Mobile browsers have a dynamic address bar that
    changes the actual viewport height. This sets a
    CSS custom property --vh based on the real
    innerHeight, updating on resize.
================================================= */

function setMobileViewportHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", vh + "px");
}

setMobileViewportHeight();
window.addEventListener("resize", setMobileViewportHeight);

/* =================================================
    NAVBAR RECALCULATION HELPER
    Forces the browser to fully recalculate the
    navbar's position after AOS transforms and
    resource loading. This prevents the mobile
    bug where the navbar appears shifted on first
    load and only corrects after scrolling.
================================================= */

function forceNavbarRecalculation() {
    const navbar = document.querySelector(".custom-navbar");
    if (!navbar) return;

    // Temporarily toggle visibility to force a
    // complete repaint of the fixed-position navbar
    navbar.style.visibility = "hidden";
    void navbar.offsetHeight;
    navbar.style.visibility = "";
}

/* =================================================
    ALL DOM-DEPENDENT INITIALIZATION
    Wrapped in DOMContentLoaded so elements are
    guaranteed to exist before querying them.
================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =================================================
        LOADER
    ================================================= */

    // Loader hide is deferred to window.load so
    // the spinner shows until all resources
    // (images, fonts, scripts) are fully loaded.

    window.addEventListener("load", () => {

        const loader = document.getElementById("loader");
        loader.style.opacity = "0";

        setTimeout(() => {
            loader.style.display = "none";
        }, 500);

        /* =================================================
            POST-LOAD NAVBAR RECALCULATION
            After all resources are loaded and AOS has
            processed its elements, force the browser to
            recalculate the navbar position. This is the
            critical fix: AOS transforms on hero elements
            (data-aos="fade-right", data-aos="zoom-in")
            can break position:fixed rendering on mobile.
            The scroll event normally triggers a reflow
            that corrects it — we do that here on load
            so the user never sees the broken state.
        ================================================= */

        // 1) Refresh AOS so it recalculates element
        //    positions after images/fonts have loaded
        AOS.refresh();

        // 2) Force navbar reflow on the next animation
        //    frame (after the browser has painted)
        requestAnimationFrame(() => {
            forceNavbarRecalculation();
        });

        // 3) Second reflow after a brief delay for
        //    slower mobile browsers that may not have
        //    finished layout by the first rAF
        setTimeout(forceNavbarRecalculation, 300);

    });

    /* =================================================
        AOS INITIALIZE
        Initialized here (DOM ready) so data-aos
        elements are found. AOS.refresh() in the
        window.load handler above recalculates
        positions after all resources load.
    ================================================= */

    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });

    /* =================================================
        TYPED JS
    ================================================= */

    new Typed("#typed", {

        strings: [
            "Frontend Developer",
            "UI Designer",
            "Web Developer"
        ],

        typeSpeed: 80,
        backSpeed: 50,
        loop: true

    });

    /* =================================================
        NAVBAR SCROLL EFFECT
    ================================================= */

    const navbar = document.querySelector(".custom-navbar");

    window.addEventListener("scroll", () => {

        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        }
        else {
            navbar.classList.remove("scrolled");
        }

    });

    /* =================================================
        ACTIVE NAV LINK
    ================================================= */

    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-link");

    window.addEventListener("scroll", () => {

        let current = "";

        sections.forEach(section => {

            const sectionTop = section.offsetTop - 100;
            if (scrollY >= sectionTop) {
                current = section.getAttribute("id");
            }

        });

        navLinks.forEach(link => {

            link.classList.remove("active");
            if (link.getAttribute("href") == "#" + current) {
                link.classList.add("active");
            }

        });

    });

    /* =================================================
        DARK MODE
    ================================================= */

    const themeBtn = document.getElementById("theme-toggle");

    themeBtn.addEventListener("click", () => {

        document.body.classList.toggle("dark");
        const icon = themeBtn.querySelector("i");

        if (document.body.classList.contains("dark")) {
            icon.classList.remove("bi-moon-stars");
            icon.classList.add("bi-sun");
        }
        else {
            icon.classList.remove("bi-sun");
            icon.classList.add("bi-moon-stars");
        }

    });

    /* =================================================
        COUNTER ANIMATION
    ================================================= */

    const counters = document.querySelectorAll("[data-count]");
    let counterStarted = false;

    function startCounter() {

        const section = document.querySelector(".about-section");
        const position = section.getBoundingClientRect().top;

        if (position < window.innerHeight && !counterStarted) {
            counterStarted = true;

            counters.forEach(counter => {
                let target = +counter.dataset.count;
                let count = 0;

                let update = () => {

                    let speed = target / 100;

                    if (count < target) {
                        count += speed;
                        counter.innerText = Math.ceil(count) + "+";
                        setTimeout(update, 20);
                    }
                    else {
                        counter.innerText = target + "+";
                    }

                }

                update();
            });
        }

    }

    window.addEventListener("scroll", startCounter);

    /* =================================================
        SCROLL PROGRESS
    ================================================= */

    window.addEventListener("scroll", () => {

        let scrollTop = document.documentElement.scrollTop;

        let height = document.documentElement.scrollHeight
            - document.documentElement.clientHeight;

        let progress = (scrollTop / height) * 100;

        document.getElementById("scroll-progress")
            .style.width = progress + "%";

    });

    /* =================================================
        BACK TO TOP
    ================================================= */

    const backBtn = document.getElementById("backToTop");

    window.addEventListener("scroll", () => {

        if (window.scrollY > 500) {
            backBtn.style.display = "flex";
        }
        else {
            backBtn.style.display = "none";
        }

    });

    backBtn.addEventListener("click", () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

    /* =================================================
        SMOOTH SCROLL
    ================================================= */

    document.querySelectorAll('a[href^="#"]')
        .forEach(anchor => {

            anchor.addEventListener("click", function (e) {

                let target = document.querySelector(
                    this.getAttribute("href")
                );

                if (target) {

                    e.preventDefault();

                    target.scrollIntoView({
                        behavior: "smooth"
                    });

                }

            });

        });

    /* =================================================
        WHATSAPP CONTACT FORM
    ================================================= */

    const contactForm = document.querySelector(".contact-form");

    if (contactForm) {

        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();

            let name = document.querySelector(
                'input[placeholder="Your Name"]'
            ).value;

            let email = document.querySelector(
                'input[placeholder="Your Email"]'
            ).value;

            let subject = document.querySelector(
                'input[placeholder="Subject"]'
            ).value;

            let message = document.querySelector(
                'textarea'
            ).value;

            let whatsappMessage =
                `
Hello Nilesh 👋

Name: ${name}

Email: ${email}

Subject: ${subject}

Message:
${message}

`;

            let whatsappURL =
                "https://wa.me/919509612559?text="
                +
                encodeURIComponent(whatsappMessage);

            window.open(
                whatsappURL,
                "_blank"
            );

            contactForm.reset();

        });
    }
    /* =================================================
       PROJECT FILTER + APPLE 3D TILT EFFECT
    ================================================= */


    const filterButtons = document.querySelectorAll(".filter-btn");
    const projects = document.querySelectorAll(".project-item");



    /* =========================
       PROJECT FILTER
    ========================= */


    filterButtons.forEach(btn => {


        btn.addEventListener("click", () => {


            let filter = btn.dataset.filter;



            // Active Button Change

            filterButtons.forEach(button => {

                button.classList.remove("active");

            });


            btn.classList.add("active");



            // Project Filtering

            projects.forEach(project => {


                let category = project.dataset.category;



                if(filter === "all" || filter === category){


                    project.classList.remove("d-none");


                    // Smooth Animation

                    setTimeout(()=>{

                        project.style.opacity = "1";
                        project.style.transform = "scale(1)";

                    },50);


                }

                else{


                    project.style.opacity = "0";
                    project.style.transform = "scale(.8)";


                    setTimeout(()=>{

                        project.classList.add("d-none");

                    },300);


                }


            });



        });


    });






    /* =========================
       APPLE STYLE 3D TILT
    ========================= */


    const projectCards = document.querySelectorAll(".project-card");



    projectCards.forEach(card => {



        card.addEventListener("mousemove", (e)=>{


            const rect = card.getBoundingClientRect();



            const x = e.clientX - rect.left;

            const y = e.clientY - rect.top;



            const centerX = rect.width / 2;

            const centerY = rect.height / 2;



            const rotateY = ((x - centerX) / centerX) * 12;

            const rotateX = ((centerY - y) / centerY) * 12;



            card.style.transform = `

                perspective(1000px)

                rotateX(${rotateX}deg)

                rotateY(${rotateY}deg)

                translateY(-15px)

            `;



        });





        card.addEventListener("mouseleave", ()=>{


            card.style.transform = `

                perspective(1000px)

                rotateX(0deg)

                rotateY(0deg)

                translateY(0)

            `;



        });



    });

}); /* end DOMContentLoaded */
