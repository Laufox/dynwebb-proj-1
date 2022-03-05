// Find the albums table and export it
module.exports = (bookshelf) => {
    return bookshelf.model('Album', {
        tableName: 'albums',
        user() {
            return this.belongsTo('User');
        },
        photos() {
            return this.belongsToMany('Photo');
        }
    }, {
        // Function to get a specific album with a relationship
        async fetchById(id, fetchOptions = {}) {
			return await new this({ id }).fetch(fetchOptions);
		}
    }
    );
}