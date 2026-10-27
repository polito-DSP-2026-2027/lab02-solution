class Image{    
    constructor(imageId, filmId, name) {
        this.id = Number(imageId);
        this.filmId = Number(filmId);
        this.name = name;
    }
}

module.exports = Image;
