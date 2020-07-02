module.exports.add = function(a, b, callback) {
    if (typeof a === "object")
	callback(null, a.a + a.b)
    else
	callback(null, a + b);
}

module.exports.mul = function(a, b, callback) {
    callback(null, a * b);
}

module.exports.sign = function(a, callback) {
    callback(null, 0 - a);
}


module.exports.addAsync = function(a, b) {
    return new Promise((resolve, reject) => {
        this.add(a, b, (err = null, res) => {
             if (err) 
                 reject(err);
             else 
                 resolve(res);
        })
    })
}
