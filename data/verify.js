// Takes in a string argument.
// Return true if the argument is non-empty, a string, and non-empty when trimmed; otherwise return false.
function validString(str) {
    if (!str || typeof str !== 'string' || !str.trim()) return false;
    return true;
}

// Takes in a single argument.
// Return true if the argument is a boolean; otherwise return false.
function validBoolean(bool) {
    if (typeof bool !== 'boolean') return false;
    return true;
}

// Takes in a MongoDB document (JavaScript object).
// Returns the same document with its _id field as a string.
function convertId(doc) {
    doc._id = doc._id.toString();
    return doc;
}

// Takes in a number argument.
// Return true if the argument is above 0 and is a positive integer, false otherwise.
function validAge(age){
    if (!age || typeof age != 'number' || !Number.isInteger(age) || age < 1) return false;
    return true;
}

function validRating(num){
    if (!num || (typeof num != 'number') || !Number.isInteger(num) || num < 1 || num > 5) return false;
    return true;
}

// Takes in a string argument.
// Return true if the argument is a valid email using regex expression.
function validEmail(email) {
    if (!validString(email)) return false;
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function validMetrics(metrics) {
    if ((!metrics || typeof(metrics)!=='object') || (!validBoolean(metrics.distancedTables)) ||
        (!validBoolean(metrics.maskedEmployees)) || (!validBoolean(metrics.noTouchPayment))  ||
        (!validBoolean(metrics.outdoorSeating))  || (!validRating(metrics.price)) ||
        (!validRating(metrics.rating))) return false;

    return true;
}


module.exports = {
    validString,
    convertId,
    validAge,
    validEmail,
    validBoolean,
    validRating,
    validMetrics
};