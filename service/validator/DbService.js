class DBService {
    constructor() { }
    /**
     * Finds single object in database.
     * @param {*} TableName Name of table.
     * @param {*} findQuery Query to be executed.
     * @returns object
     */
    find(TableName,findQuery) {
        return new Promise(async (resolve, reject) => {
            try {
                resolve(await TableName.find(findQuery));
            } catch (err) {
                reject(err);
            }
        })
    }
    findWithPopulate(TableName,findQuery,lookup) {
        return new Promise(async (resolve, reject) => {
            try {
                resolve(await TableName.find(findQuery).populate(lookup));
            } catch (err) {
                reject(err);
            }
        })
    }
    create(TableName,body) {
        return new Promise(async (resolve, reject) => {
            try {
                resolve(await TableName.create(body));
            } catch (err) {
                reject(err);
            }
        })
    }
    insertMant(TableName, body) {
        return new Promise(async (resolve, reject) => {
            try {
                resolve(await TableName.insertMany(body));
            } catch (err) {
                reject(err);
            }
        })
    }
    createByForeignKey(TableName,foreignKeyObj,body) {
        return new Promise(async (resolve, reject) => {
            try {
                resolve(await foreignKeyObj.createProduct(body));
            } catch (err) {
                reject(err);
            }
        })
    }
    update(TableName, findQuery, updateQuery) {
        return new Promise(async (resolve, reject) => {
            try {
                resolve(await TableName.updateOne(findQuery, updateQuery));
            } catch (err) {
                reject(err);
            }
        })
    }
    updateMany(TableName, findQuery, updateQuery) {
        return new Promise(async (resolve, reject) => {
            try {
                resolve(await TableName.updateMany(findQuery, updateQuery));
            } catch (err) {
                reject(err);
            }
        })
    }
    delete(TableName, findQuery) {
        return new Promise(async (resolve, reject) => {
            try {
                resolve(await TableName.deleteOne(findQuery));
            } catch (err) {
                reject(err);
            }
        })
    }
    deleteMany(TableName, findQuery) {
        return new Promise(async (resolve, reject) => {
            try {
                resolve(await TableName.deleteMany(findQuery));
            } catch (err) {
                reject(err);
            }
        })
    }
    aggregate(TableName, aggregation) {
        return new Promise(async (resolve, reject) => {
            try {                
                resolve(await TableName.aggregate(aggregation));
            } catch (err) {
                reject(err);
            }
        })
    }
    count(TableName, filter) {
        return new Promise(async (resolve, reject) => {
            try {                
                resolve(await TableName.count(filter));
            } catch (err) {
                reject(err);
            }
        })
    }
}
module.exports = DBService