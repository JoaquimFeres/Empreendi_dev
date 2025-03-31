function sendMail(){
    let parms = {
        name : document.getElementById("name").value,
        email : document.getElementById("email").value,
        feedback__text : document.getElementById("feedback__text").value,
    }   

    emailjs.send("service_cnqlqkw","template_lggaxu6",parms).then(alert("Email enviado!!"))

}