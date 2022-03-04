// Find the albums table and export it
module.exports = (bookshelf) => {
    return bookshelf.model('Album', {
        tableName: 'albums',
        user() {
            return this.belongsTo('User');
        }
    });
}