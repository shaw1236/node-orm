module.exports.f1 = function(a) { 
    return Promise.resolve(a);
}

module.exports.f2 = function(a) { 
    return Promise.resolve(this.f1(a));
}

module.exports.f3 = async function(a) {
    return a;
}

module.exports.f4 = function(a) {
    return new Promise(resolve => resolve(a))
}

module.exports.f5 = async function(a) {
    return this.f3(a);
}

module.exports.f6 = async function(a) {
    return await this.f5(a);
}

module.exports.f7 = function(a, callback) {
    callback(null, a)
}
