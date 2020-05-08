exports.formatDates = list => {
    const newList = [...list];
    const convertTimestamp = obj => {
        const date = new Date(obj.created_at);
        obj.created_at = date;
        return obj;
    }
    return newList.map(obj => convertTimestamp(obj));
};

exports.makeRefObj = list => {
    const lookup = {};
    if (list.length === 0){
        return lookup;
    }
    list.forEach(obj => {
        lookup[obj['title']] = obj['article_id'];
    })
    return lookup;
};

exports.formatComments = (comments, articleRef) => {
    const formatKeys = comment => {
        const newComment = {...comment}
        newComment.author = newComment.created_by;
        newComment.article_id = articleRef[newComment.belongs_to];
        const date = new Date(newComment.created_at);
        newComment.created_at = date;
        delete newComment.created_by;
        delete newComment.belongs_to;
        return newComment;
    }
    let formatted = comments.map(comment => formatKeys(comment));
    return formatted;
};
