// Find the albums table and export it
module.exports = (bookshelf) => {
    return bookshelf.model('Photo', {
        tableName: 'photos',
        // Define relationships for table
        user() {
            return this.belongsTo('User');
        }
    });
}