function sendWithdrawalEmail(upiId, amount) {
    const email = "ankurboro236@gmail.com";
    const subject = "Withdrawal Request";
    const body = `User with UPI ID: ${upiId} has requested withdrawal of ₹${amount.toFixed(2)}.`;
    
    // Open default email client
    window.open(`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
}