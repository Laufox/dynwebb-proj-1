// Find the users table and export it
module.exports = (bookshelf) => {
    return bookshelf.model('User', {
        tableName: 'users',
        // Define relationship with table albums
        albums() {
            return this.hasMany('Album');
        }
    }, {
        // Function to get a specific user with a relationship
        async fetchById(id, fetchOptions = {}) {
			return await new this({ id }).fetch(fetchOptions);
		}
    }
    )
}