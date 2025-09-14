blogCard.querySelector('.ad-content').addEventListener('click', () => {
    if (earnings < 0.10) {
        earnings += 0.01;
        totalEarnings += 0.01;
        updateUI();
        saveData();
        alert('You earned ₹0.01 by watching an ad!');
    } else {
        alert("Daily limit reached! You can't earn more than ₹0.10 today.");
    }
});