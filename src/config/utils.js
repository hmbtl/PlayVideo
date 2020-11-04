const validateEmail = (email) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

const secondsToClock = (time) => {
    const minutes = ~~(time / 60);
    const seconds = ~~(time - (minutes * 60));
    return minutes + ":" + (seconds < 10 ? "0" + seconds : seconds)
}

const utils = {
    validateEmail,
    secondsToClock
}

export default utils