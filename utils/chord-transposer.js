const CHORDS = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B','C','C#','D','D#','E','F','F#','G','G#','A','A#','B']

class ChordTranspoter {

    constructor(orgKey, newKey) {
        this.orgKey = orgKey;
        this.newKey = newKey;
        let orgIndex = CHORDS.indexOf(orgKey);
        var newIndex = CHORDS.indexOf(newKey);
        newIndex = orgIndex > newIndex ? CHORDS.lastIndexOf(newKey) : newIndex;
        this.offset = Math.abs(orgIndex - newIndex)
    }

    getTransChords(chords) {
        var i = 0;
        for (i = chords.length; i--;) {
            var c = chords[i]
            chords[i] = this.getTransChord(c);
        }
        return chords;
    }

    getTransChord(chord) {
        let c = chord
        var extension = c.indexOf('#') !== -1 ? c.slice(c.indexOf('#') + 1, c.length) : c.slice(1, c.length);
        c = c.replace(extension, "");
        c = CHORDS[CHORDS.indexOf(c) + this.offset] + extension;
        return c;
    }
}

/**
 * 根据原调和选调取得变调夹位置
 * @param {*} selectKey 选调
 * @param {*} originKey 原调
 */
const getCapo = function(selectKey, originKey) {
    let selectKeyIndex = CHORDS.indexOf(selectKey);
    var originKeyIndex = CHORDS.indexOf(originKey);
    originKeyIndex = selectKeyIndex > originKeyIndex ? CHORDS.lastIndexOf(originKey) : originKeyIndex;

    return Math.abs(selectKeyIndex - originKeyIndex)
}

module.exports = {
    ChordTranspoter,getCapo
}