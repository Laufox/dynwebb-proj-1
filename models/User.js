// Find the users table and export it
module.exports = (bookshelf) => {
    return bookshelf.model('User', {
        tableName: 'users',
        // Define relationships for table
        albums() {
            return this.hasMany('Album');
        },
        photos() {
            return this.hasMany('Photo');
        }
    }, {
        // Function to get a specific user with a relationship
        async fetchById(id, fetchOptions = {}) {
			return await new this({ id }).fetch(fetchOptions);
		}
    }
    )
}