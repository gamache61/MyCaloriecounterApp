const foodLibrary = { "apple": 95, "banana": 105, "chicken": 165, "pizza": 285, "egg": 78, "steak": 679, "rice": 205 };

document.addEventListener('DOMContentLoaded', function() {
    loadProfileFields();
    refreshUI();
});

function searchFood() {
    const input = document.getElementById('foodInput').value.toLowerCase();
    const suggestions = document.getElementById('foodSuggestions');
    suggestions.innerHTML = '';
    if (input.length < 1) { suggestions.style.display = 'none'; return; }
    
    for (let food in foodLibrary) {
        if (food.includes(input)) {
            let div = document.createElement('div');
            div.className = 'food-item';
            div.innerText = `${food} (${foodLibrary[food]} kcal)`;
            div.onclick = function() {
                document.getElementById('foodInput').value = food;
                document.getElementById('baseCal').value = foodLibrary[food];
                suggestions.style.display = 'none';
            };
            suggestions.appendChild(div);
            suggestions.style.display = 'block';
        }
    }
}

function calculateAndSave() {
    console.log("Button 1 Clicked: Calculating...");
    const age = parseInt(document.getElementById('age').value);
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);
    const system = document.getElementById('unitSystem').value;

    if (!age || !weight || !height) {
        alert("Please enter age, weight, and height.");
        return;
    }

    let w = (system === 'imperial') ? weight * 0.453592 : weight;
    let h = (system === 'imperial') ? height * 2.54 : height;
    
    // BMR Calculation
    let bmr = (10 * w) + (6.25 * h) - (5 * age) + 5;
    const goal = Math.round(bmr * 1.2);

    localStorage.setItem('health_goal', goal);
    localStorage.setItem('health_age', age);
    localStorage.setItem('health_weight', weight);
    localStorage.setItem('health_height', height);
    localStorage.setItem('health_unit', system);
    
    alert("Profile Saved. Goal set to: " + goal);
    refreshUI();
}

function addCalories() {
    console.log("Button 2 Clicked: Adding Calories...");
    const base = parseFloat(document.getElementById('baseCal').value);
    const portion = parseFloat(document.getElementById('portion').value) || 1;

    if (isNaN(base) || base <= 0) {
        alert("Please enter calories or select a food.");
        return;
    }

    const added = Math.round(base * portion);
    let currentTotal = parseInt(localStorage.getItem('health_calories')) || 0;
    let newTotal = currentTotal + added;
    
    localStorage.setItem('health_calories', newTotal);

    // Save History
    const today = new Date().toLocaleDateString();
    let history = JSON.parse(localStorage.getItem('health_history')) || {};
    history[today] = newTotal;
    localStorage.setItem('health_history', JSON.stringify(history));

    // Reset Inputs
    document.getElementById('foodInput').value = '';
    document.getElementById('baseCal').value = '';
    document.getElementById('portion').value = '1';

    refreshUI();
}

function loadProfileFields() {
    document.getElementById('age').value = localStorage.getItem('health_age') || '';
    document.getElementById('weight').value = localStorage.getItem('health_weight') || '';
    document.getElementById('height').value = localStorage.getItem('health_height') || '';
    document.getElementById('unitSystem').value = localStorage.getItem('health_unit') || 'metric';
}

function refreshUI() {
    const goal = parseInt(localStorage.getItem('health_goal')) || 0;
    const total = parseInt(localStorage.getItem('health_calories')) || 0;
    const history = JSON.parse(localStorage.getItem('health_history')) || {};

    document.getElementById('displayGoal').innerText = goal + " kcal";
    document.getElementById('displayTotal').innerText = total + " kcal";
    document.getElementById('displayRemaining').innerText = (goal - total) + " kcal";

    const log = document.getElementById('historyLog');
    log.innerHTML = '';
    const dates = Object.keys(history).sort((a,b) => new Date(b) - new Date(a));
    dates.forEach(date => {
        log.innerHTML += `<div class="history-item"><strong>${date}</strong>: ${history[date]} kcal</div>`;
    });
}

function clearAllData() {
    if(confirm("Wipe all data?")) {
        localStorage.clear();
        location.reload();
    }
}