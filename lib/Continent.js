'use strict';

class Continent {
    constructor (id, name, bonus) {
        this.id = id;
        this.name = name;
        this.territories = new Set();
        this.bonus = bonus;
    }

    addTerritory (territory) {
        this.territories.add(territory);
    }

    get adjacentContinents () {
        const continents = [];

        for (const territory of this.territories) {
            const adjacentTerritories = territory.adjacentTerritories;

            for (const adjacentTerritory of adjacentTerritories.values()) {
                if (adjacentTerritory.continent !== null && adjacentTerritory.continent !== this) {
                    if (!continents.includes(adjacentTerritory.continent)) {
                        continents.push(adjacentTerritory.continent);
                    }
                }
            }
        }

        return continents;
    }

    get owner () {
        let owner = null;
        const territories = Array.from(this.territories);

        for (let i = 0; i < territories.length - 1; i++) {
            const territory = territories[i];

            if (territory.owner) {
                if (territory.owner === territories[i + 1].owner) {
                    owner = territory.owner;
                } else {
                    return null;
                }
            } else {
                return null;
            }
        }

        return owner;
    }

    toJSON () {
        return {
            id: this.id,
            name: this.name,
            owner: this.owner ? this.owner.id : null,
            bonus: this.bonus,
            territoryIds: Array.from(this.territories.values()).map(territory => {
                return territory.id;
            }),
            adjacentContinentIds: this.adjacentContinents.map(continent => {
                return continent.id;
            })
        };
    }
}

module.exports = Continent;