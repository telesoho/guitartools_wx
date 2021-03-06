const CHORDS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

class ChordTranspoter {

    /**
     * 构造函数
     * @param {string} orgKey 
     * @param {string} newKey 
     */
    constructor(orgKey, newKey) {
        this.orgKey = orgKey;
        this.newKey = newKey;
        let orgIndex = CHORDS.indexOf(orgKey);
        var newIndex = CHORDS.indexOf(newKey);
        newIndex = orgIndex > newIndex ? CHORDS.lastIndexOf(newKey) : newIndex;
        this.offset = Math.abs(orgIndex - newIndex)
    }

    /**
     * 将原Key的和弦数组转化为新Key的和弦
     * @param {Array} chords 
     */
    getTransChords(chords) {
        for (var i = chords.length; i--;) {
            chords[i] = this.getTransChord(chords[i]);
        }
        return chords;
    }

    /**
     * 
     * @param {string} chord 
     */
    getTransChord(chord) {
        let chords = chord.split("/");
        for (var i = 0; i < chords.length; i++) {
            chords[i] = this._getTransChord(chords[i]);
        }
        return chords.join("/");
    }

    _getTransChord(chord) {
        let c = chord
        var extension = c.indexOf('#') !== -1 ? c.slice(c.indexOf('#') + 1, c.length) : c.slice(1, c.length);
        c = c.replace(extension, "");

        if (CHORDS.indexOf(c) !== -1) {
            c = c.replace(extension, "");
            c = CHORDS[CHORDS.indexOf(c) + this.offset] + extension;
        } else {
            return chord;
        }
        return c;
    }
}

/**
 * 根据原调和选调取得变调夹位置
 * @param {*} selectKey 选调
 * @param {*} originKey 原调
 */
const getCapo = function (selectKey, originKey) {
    let selectKeyIndex = CHORDS.indexOf(selectKey);
    var originKeyIndex = CHORDS.indexOf(originKey);
    originKeyIndex = selectKeyIndex > originKeyIndex ? CHORDS.lastIndexOf(originKey) : originKeyIndex;

    return Math.abs(selectKeyIndex - originKeyIndex)
}

module.exports = {
    ChordTranspoter,
    getCapo
}