// Smart Farming Advisor - Main Application
let currentLang = 'en';
let formData = { crop: '', soil: '', season: '', water: '', farmSize: '' };

// DOM Elements
const screens = { lang: document.getElementById('language-screen'), input: document.getElementById('input-screen'), results: document.getElementById('results-screen') };
const langBtns = document.querySelectorAll('.language-btn');
const optionCards = document.querySelectorAll('.option-card');
const form = document.getElementById('farming-form');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupLanguageButtons();
    setupOptionCards();
    setupFormSubmission();
    setupActionButtons();
});

function setupLanguageButtons() {
    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            currentLang = btn.dataset.lang;
            updateUILanguage();
            showScreen('input');
            updateLanguageBadge();
        });
    });
}

function setupOptionCards() {
    document.querySelectorAll('#soil-options .option-card').forEach(card => {
        card.addEventListener('click', () => selectOption('soil-options', 'soil-type', card));
    });
    document.querySelectorAll('#season-options .option-card').forEach(card => {
        card.addEventListener('click', () => selectOption('season-options', 'season', card));
    });
    document.querySelectorAll('#water-options .option-card').forEach(card => {
        card.addEventListener('click', () => selectOption('water-options', 'water', card));
    });
    document.querySelectorAll('#farm-options .option-card').forEach(card => {
        card.addEventListener('click', () => selectOption('farm-options', 'farm-size', card));
    });
}

function selectOption(containerId, inputId, selectedCard) {
    document.querySelectorAll(`#${containerId} .option-card`).forEach(c => c.classList.remove('selected'));
    selectedCard.classList.add('selected');
    document.getElementById(inputId).value = selectedCard.dataset.value;
}

function setupFormSubmission() {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        formData = {
            crop: document.getElementById('crop-type').value,
            soil: document.getElementById('soil-type').value,
            season: document.getElementById('season').value,
            water: document.getElementById('water').value,
            farmSize: document.getElementById('farm-size').value
        };
        if (!formData.crop || !formData.soil || !formData.season || !formData.water || !formData.farmSize) {
            alert(currentLang === 'en' ? 'Please fill all fields' : 'कृपया सभी फ़ील्ड भरें');
            return;
        }
        showScreen('results');
        generateAdvice();
    });
    document.getElementById('back-to-lang').addEventListener('click', () => showScreen('lang'));
}

function setupActionButtons() {
    document.getElementById('new-query-btn').addEventListener('click', () => {
        resetForm();
        showScreen('input');
    });
    document.getElementById('print-btn').addEventListener('click', () => window.print());
}

function showScreen(screenName) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[screenName].classList.add('active');
    window.scrollTo(0, 0);
}

function updateLanguageBadge() {
    const langNames = { en: 'English', hi: 'हिंदी', gu: 'ગુજરાતી', mr: 'मराठी', ta: 'தமிழ்' };
    document.getElementById('current-lang-name').textContent = langNames[currentLang];
}

function updateUILanguage() {
    const t = translations[currentLang];
    document.getElementById('app-title').textContent = t.appTitle;
    document.getElementById('app-subtitle').textContent = t.appSubtitle;
    document.getElementById('form-title').textContent = t.formTitle;
    document.getElementById('form-subtitle').textContent = t.formSubtitle;
    document.querySelector('#crop-label .label-text').textContent = t.cropLabel;
    document.getElementById('crop-placeholder').textContent = t.cropPlaceholder;
    document.querySelector('#soil-label .label-text').textContent = t.soilLabel;
    document.getElementById('soil-black').textContent = t.soilBlack;
    document.getElementById('soil-red').textContent = t.soilRed;
    document.getElementById('soil-sandy').textContent = t.soilSandy;
    document.getElementById('soil-clay').textContent = t.soilClay;
    document.querySelector('#season-label .label-text').textContent = t.seasonLabel;
    document.getElementById('season-kharif').textContent = t.seasonKharif;
    document.getElementById('season-rabi').textContent = t.seasonRabi;
    document.getElementById('season-zaid').textContent = t.seasonZaid;
    document.querySelector('#water-label .label-text').textContent = t.waterLabel;
    document.getElementById('water-low').textContent = t.waterLow;
    document.getElementById('water-medium').textContent = t.waterMedium;
    document.getElementById('water-high').textContent = t.waterHigh;
    document.querySelector('#farm-label .label-text').textContent = t.farmLabel;
    document.getElementById('farm-small').textContent = t.farmSmall;
    document.getElementById('farm-medium').textContent = t.farmMedium;
    document.getElementById('farm-large').textContent = t.farmLarge;
    document.getElementById('submit-text').textContent = t.submitText;
    document.getElementById('loading-text').textContent = t.loadingText;
    document.getElementById('summary-title').textContent = t.summaryTitle;
    document.getElementById('crop-advice-title').textContent = t.cropAdviceTitle;
    document.getElementById('irrigation-title').textContent = t.irrigationTitle;
    document.getElementById('fertilizer-title').textContent = t.fertilizerTitle;
    document.getElementById('pest-title').textContent = t.pestTitle;
    document.getElementById('tips-title').textContent = t.tipsTitle;
    document.getElementById('disclaimer-text').textContent = t.disclaimerText;
    document.getElementById('new-query-text').textContent = t.newQueryText;
    document.getElementById('print-text').textContent = t.printText;
    document.getElementById('footer-text').textContent = t.footerText;

    // Update crop options
    const cropSelect = document.getElementById('crop-type');
    const cropOptions = cropSelect.querySelectorAll('option');
    cropOptions.forEach(opt => {
        if (opt.value && t.crops[opt.value]) {
            opt.textContent = t.crops[opt.value];
        }
    });
}

function generateAdvice() {
    const loading = document.getElementById('loading');
    const content = document.getElementById('results-content');
    loading.classList.remove('hidden');
    content.classList.remove('visible');

    setTimeout(() => {
        loading.classList.add('hidden');
        content.classList.add('visible');
        renderSummary();
        renderCropAdvice();
        renderIrrigationAdvice();
        renderFertilizerAdvice();
        renderPestAdvice();
        renderTips();
    }, 2000);
}

function renderSummary() {
    const t = translations[currentLang];
    const icons = { crop: '🌾', soil: '🏔️', season: '🗓️', water: '💧', farmSize: '📐' };
    const labels = { crop: t.cropLabel, soil: t.soilLabel, season: t.seasonLabel, water: t.waterLabel, farmSize: t.farmLabel };
    const values = {
        crop: t.crops[formData.crop] || formData.crop,
        soil: t['soil' + formData.soil.charAt(0).toUpperCase() + formData.soil.slice(1)] || formData.soil,
        season: t['season' + formData.season.charAt(0).toUpperCase() + formData.season.slice(1)] || formData.season,
        water: t['water' + formData.water.charAt(0).toUpperCase() + formData.water.slice(1)] || formData.water,
        farmSize: t['farm' + formData.farmSize.charAt(0).toUpperCase() + formData.farmSize.slice(1)] || formData.farmSize
    };

    let html = '';
    Object.keys(icons).forEach(key => {
        html += `<div class="summary-item"><span class="summary-icon">${icons[key]}</span><span class="summary-label">${labels[key]}</span><span class="summary-value">${values[key]}</span></div>`;
    });
    document.getElementById('summary-grid').innerHTML = html;
}

function renderCropAdvice() {
    const advice = farmingAdvice[currentLang];
    let text = '';
    if (advice.cropSuitability[formData.crop] && advice.cropSuitability[formData.crop][formData.soil]) {
        text = advice.cropSuitability[formData.crop][formData.soil];
    } else {
        text = currentLang === 'en' ? 'Good combination. Follow standard practices.' : 'अच्छा संयोजन। मानक तरीके अपनाएं।';
    }
    document.getElementById('crop-advice').innerHTML = `<ul><li>${text}</li></ul>`;
}

function renderIrrigationAdvice() {
    const advice = farmingAdvice[currentLang];
    const tips = advice.irrigation[formData.water] || [];
    let html = '<ul>';
    tips.forEach(tip => { html += `<li>${tip}</li>`; });
    html += '</ul>';
    document.getElementById('irrigation-advice').innerHTML = html;
}

function renderFertilizerAdvice() {
    const advice = farmingAdvice[currentLang];
    let html = '<ul>';
    html += `<li><strong>${currentLang === 'en' ? 'Organic:' : 'जैविक:'}</strong></li>`;
    advice.fertilizer.organic.slice(0, 3).forEach(tip => { html += `<li>${tip}</li>`; });
    html += `<li><strong>${currentLang === 'en' ? 'Chemical:' : 'रासायनिक:'}</strong></li>`;
    advice.fertilizer.chemical.slice(0, 3).forEach(tip => { html += `<li>${tip}</li>`; });
    html += '</ul>';
    document.getElementById('fertilizer-advice').innerHTML = html;
}

function renderPestAdvice() {
    const advice = farmingAdvice[currentLang];
    let pests = advice.pests[formData.crop] || [];
    if (pests.default) pests = pests.default;
    let html = '<ul>';
    pests.slice(0, 4).forEach(pest => { html += `<li>${pest}</li>`; });
    html += '</ul>';
    document.getElementById('pest-advice').innerHTML = html;
}

function renderTips() {
    const advice = farmingAdvice[currentLang];
    const tips = advice.tips[formData.farmSize] || [];
    let html = '<ul>';
    tips.forEach(tip => { html += `<li>${tip}</li>`; });
    html += '</ul>';
    document.getElementById('tips-advice').innerHTML = html;
}

function resetForm() {
    form.reset();
    document.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
    document.getElementById('soil-type').value = '';
    document.getElementById('season').value = '';
    document.getElementById('water').value = '';
    document.getElementById('farm-size').value = '';
}
