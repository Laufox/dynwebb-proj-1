// Find the users table and export it
module.exports = (bookshelf) => {
    return bookshelf.model('User', {
        tableName: 'users'
    })
}