// Replace with your deployed Apps Script Web App URL
const SHEET_URL = "https://script.google.com/macros/s/AKfycbzvMOJiY6qRQBNCpaoPqaU5HNUR-wgrPrTuPdbeOlToymtc-R9HvtYh_2ICaSAMRfKK/exec";

document.getElementById('eventForm').addEventListener('submit', async function(e){
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const events = [...document.querySelectorAll('input[name="event"]:checked')].map(e => e.value);

  const count = events.length;
  if(count === 0){
    showMessage("❌ Please select at least one event.", "error");
    return;
  }

  let amount = (count === 4) ? 1 : count * 0.50;
  document.getElementById("amount").innerText = "Total Amount: ₹" + amount;

  // Generate UPI QR
  const upiLink = `upi://pay?pa=ashendokar774@okicici&pn=Organizer&am=${amount}&cu=INR`;
  document.getElementById("qrcode").innerHTML = "";
  QRCode.toCanvas(document.createElement("canvas"), upiLink, (err, canvas) => {
    if (!err) document.getElementById("qrcode").appendChild(canvas);
  });

  // Save to Google Sheet
  const data = {name, email, phone, events: events.join(", "), amount};

  try {
    let res = await fetch(SHEET_URL, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {"Content-Type": "application/json"}
    });
    let result = await res.json();

    if(result.status === "success"){
      showMessage("✅ Registration successful! Please scan the QR to pay.", "success");
    } else {
      showMessage("❌ Error: " + result.message, "error");
    }
  } catch (err) {
    showMessage("⚠️ Failed to connect to server: " + err.message, "error");
  }
});

function showMessage(msg, type){
  const box = document.getElementById("message");
  box.style.display = "block";
  box.className = "message " + type;
  box.innerText = msg;
}
