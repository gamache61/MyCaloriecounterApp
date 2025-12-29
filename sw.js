async function fetchAICalories() {
    const apiKey = document.getElementById('groqKey').value || localStorage.getItem('groq_key');
    const food = document.getElementById('foodInput').value;
    const btn = document.getElementById('aiBtn');

    if (!apiKey) return alert("Please enter your Groq API Key!");
    if (!food) return alert("Enter a food description!");

    btn.innerText = "Consulting AI...";
    btn.disabled = true;

    try {
        const response = await fetch("https://api.groq.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama3-8b-8192",
                messages: [{
                    role: "system",
                    content: "You are a nutrition expert. Return ONLY the total calorie number for the food described. No text, no explanation."
                }, {
                    role: "user", 
                    content: food
                }],
                temperature: 0.1
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Groq API Error:", errorData);
            throw new Error(errorData.error.message || "Failed to fetch");
        }

        const data = await response.json();
        const result = data.choices[0].message.content.replace(/\D/g, '');
        
        if (!result) throw new Error("AI didn't return a number. Try being more specific.");
        
        rawAiCals = parseInt(result);
        updateTotal();
    } catch (error) {
        console.error(error);
        alert("AI Error: " + error.message);
    } finally {
        btn.innerText = "AI Calculate Calories";
        btn.disabled = false;
    }
}