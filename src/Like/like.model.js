/**
 * Model class representing a Like entity.
 */
class LikeModel {
    /**
     * Creates a new Like object.
     *
     * @param {string} id - The ID of the item being liked (postId or commentId).
     * @param {string} userId - The ID of the user who liked the item.
     * @param {"post"|"comment"} item - The type of item being liked.
     */
    constructor(id, userId, item) {
        
        this.itemId = id;
        this.userId = userId;
        this.item = item;
    }
}

/**
 * Temporary in-memory storage for likes.
 * @type {LikeModel[]}
 */
export let likes = [];

export default LikeModel;