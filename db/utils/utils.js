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
    list.map(obj => lookup[obj['title']] = obj['article_id'])
    return lookup;
};

exports.formatComments = (comments, articleRef) => {
    const newComments = [...comments];
    const formatKeys = comment => {
        comment.author = comment.created_by;
        comment.article_id = articleRef[comment.belongs_to];
        const date = new Date(comment.created_at);
        comment.created_at = date;
        delete comment.created_by;
        delete comment.belongs_to;
        return comment;
    }
    let formatted = newComments.map(comment => formatKeys(comment));
    return formatted;
};
