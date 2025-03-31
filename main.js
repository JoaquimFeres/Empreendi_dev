function sendMail() {
    let parms = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        feedback__text: document.getElementById("feedback__text").value,
    };

    emailjs.send("service_cnqlqkw", "template_lggaxu6", parms)
        .then(function(response) {
            alert("Email enviado com sucesso!");
        })
        .catch(function(error) {
            console.error("Erro ao enviar o email:", error);
            alert("Ocorreu um erro ao enviar o email. Verifique os dados e tente novamente.");
        });
}