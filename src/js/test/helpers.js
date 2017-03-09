// @flow

import {g, helpers} from '../common';
import {idb, Cache} from '../worker/db';
import {STORES} from '../worker/db/Cache';
import {defaultGameAttributes} from '../worker/util';
import type {Store} from '../worker/db/Cache';

/**
 * Finds the number of times an element appears in an array.
 *
 * @memberOf test.core
 * @param {Array} array The array to search over.
 * @param {*} x Element to search for
 * @return {number} The number of times x was found in array.
 */
function numInArrayEqualTo<T>(array: T[], x: T): number {
    let n = 0;
    let idx = array.indexOf(x);
    while (idx !== -1) {
        n += 1;
        idx = array.indexOf(x, idx + 1);
    }
    return n;
}

const resetCache = async (data: {[key: Store]: any[]}) => {
    idb.cache = new Cache();

    for (const store of STORES) {
        idb.cache._data[store] = {};
        idb.cache._deletes[store] = new Set();
        idb.cache._dirtyRecords[store] = new Set();
        idb.cache._maxIds[store] = -1;

        idb.cache.markDirtyIndexes(store);
    }
    idb.cache._status = 'full';

    if (data.players) {
        for (const p of data.players) {
            await idb.cache.players.add(p);
        }
    }
};

const resetG = () => {
    const season = 2016;
    const teams = helpers.getTeamsDefault();

    Object.assign(g, defaultGameAttributes, {
        userTid: 0,
        userTids: [0],
        season,
        startingSeason: season,
        leagueName: '',
        teamAbbrevsCache: teams.map(t => t.abbrev),
        teamRegionsCache: teams.map(t => t.region),
        teamNamesCache: teams.map(t => t.name),
        gracePeriodEnd: season + 2,
        numTeams: teams.length,
    });
};

export default {
    numInArrayEqualTo,
    resetCache,
    resetG,
};
