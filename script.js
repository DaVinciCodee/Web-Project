const btnLang = document.querySelector(".language")
let language = "fr"

btnLang.addEventListener("click", handleClickLang);

function handleClickLang() {
    language = (language === "fr") ? "en" : "fr";
    loadLang(language)
}

async function loadLang(lang) {
    const translations = await fetch(`/language/${lang}.json`).then(res => res.json());
    applyTranslations(translations);
}

function applyTranslations(t) {
    document.querySelectorAll("[data-lang]").forEach(el => {
        const key = el.dataset.lang.split(".");
        let value = t;
        key.forEach(k => value = value[k]);
        el.textContent = value;
    });
}

loadLang(language);