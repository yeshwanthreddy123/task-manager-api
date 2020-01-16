const sgMail=require('@sendgrid/mail')


sgMail.setApiKey(process.env.SENDGRID_API_KEY)


const sendWelcomeEmail =(email,name)=>{
    sgMail.send({
        to:'yeshwanthreddy1997@gmail.com',
        from:'yeshwanthreddy1997@gmail.com',
        subject:'welcome to the app',
        text:`Hello ${name} let us know your valuable feedback about the app`
    })
}

const sendDeleteEmail =(email,name)=>{
    sgMail.send({
        to:'yeshwanthreddy1997@gmail.com',
        from:'yeshwanthreddy1997@gmail.com',
        subject:'Thanks for using the app',
        text:`Hello ${name} let us know your valuable feedback bu telling us where we went wrong`
    })
}



module.exports={
    sendWelcomeEmail,
    sendDeleteEmail
}
