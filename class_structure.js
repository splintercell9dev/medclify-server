class PlantLessInfo{
    constructor(
        {
            common_name,
            scientific_name,
            year,
            bibliography,
            author,
            status,
            rank,
            observations,
            image_url,
            genus,
            family
        },
        index
    ){
        this.link = `/species/${index}` ;
        this.common_name = common_name ;
        this.scientific_name = scientific_name ;
        this.year = year ;
        this.bibliography = bibliography ;
        this.author = author ;
        this.status = status ;
        this.rank = rank ;
        this.observations = observations ;
        this.image_url = image_url ;
        this.genus = genus ;
        this.family = family ;
    }
}

function mapImages(arr){
    if (arr == undefined || arr == null){
        return null ;
    }
    else{
        return arr.map( val => {
            return {
                image_url: val.image_url,
                copyright: val.copyright
            }
        }) ;
    }
}

function mapSources(arr){
    if (arr == undefined || arr == null || arr.length == 0){
        return null ;
    }
    else{
        return arr.map( val => {
            return {
                name: val.name,
                url: val.url,
                citation: val.citation
            }
        }) ;
    }
}

function mapSynonyms(arr){
    if (arr == undefined || arr == null || arr.length == 0){
        return null ;
    }
    else{
        return arr.map( val => {
            return {
                name: val.name,
                author: val.author
            }
        }) ;
    }
}

class PlantFullInfo{

    constructor(
        {
            common_name,
            scientific_name,
            year,
            bibliography,
            author,
            status,
            rank,
            observations,
            image_url,
            genus,
            family,
            images: {
                fruit,
                leaf,
                flower
            },
            common_names: {
                en
            },
            distribution: {
                native
            },
            sources,
            synonyms
        }
    ){
        this.common_name = common_name ;
        this.scientific_name = scientific_name ;
        this.year = year ;
        this.bibliography = bibliography ;
        this.author = author ;
        this.status = status ;
        this.rank = rank ;
        this.observations = observations ;
        this.image_url = image_url ;
        this.genus = genus ;
        this.family = family ;
        
        this.images = {
            fruit: mapImages(fruit),
            leaf: mapImages(leaf),
            flower: mapImages(flower)
        }

        this.common_names = en ? en : null;
        this.distribution = native ? native : null ;
        this.sources = mapSources(sources) ;
        this.synonyms = mapSynonyms(synonyms) ;
    }
}

class PlantUsesAndInfo extends PlantFullInfo{
    constructor(
        baseParam,
        {
            edible,
            medical
        }
    ){
        super(baseParam) ;
        this.edible = edible ;
        this.medical = medical ;
    }
}

module.exports = { PlantUsesAndInfo, PlantLessInfo, PlantFullInfo }