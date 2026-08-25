


import transport from "./transport.js";

const TEAM_EMAIL = 'harminv251@gmail.com';
export async function registerEmail(username, email, subject){

    await transport.sendMail({
        from: "Instant Chat", 
        to: email,
        subject,
        html: `
            <div> An Account has been created recently from your <b> ${email} </b> email address. if you not done this then contact to our team on ${TEAM_EMAIL}, 
                <br/> 
                Thank You <br/> 
                Team <b> Instant Chat </b>  

                <br/>
                <br/>
                <p style="color: gray;"> 
                    This is an auto generated email, please do reply on it.
                </p>
            </div>
        `
    });
};