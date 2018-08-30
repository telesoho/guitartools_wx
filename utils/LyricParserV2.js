/**
 * 获取歌词说明项
 * @param {*} lyric 
 * @param {*} regex 
 * @param {*} group 
 * @param {*} defaultValue 
 */
function getDescriptionItem(lyric, regex, group, defaultValue) {
    let retVal = defaultValue
    try {
        const result = lyric.match(regex)
        if (result != null) {
            retVal = result[group]
        }
    } catch (e) {}
    return retVal
}

/**
 * 生成歌词tag节点
 * @param {*} line 
 */
function genLyricTag(line) {
    let nodes = []

    let newarray = line.split("}");
    newarray.forEach(element => {
        let newarray = element.replace("{", ",{").split(",");
        newarray.forEach(e => {
            if(e) {
                let a = {}
                if(e.startsWith("{")) {
                    a = {
                        node: 'c',
                        content: e.substring(1),
                    }
                }
                else {
                    a = {
                        node: 't',
                        content: e
                    }
                }
                nodes.push(a)
            }
        })
    });
    return nodes;
}

/**
 * Parse lyric and chord data and generate HTML
 *
 * @class LyricParser
 */
class LyricParserV2 {
    /**
     * Parse lrc, suppose multiple time tag
     * 每一行只能有一个时间
     * @param {any} lrcString  - Format:
     * [mm:ss.xx]lyric
     * [mm:ss.xxx]lyric
     * [mm:ss.xx]lyric
     *
     * @return {list}
     * [{time: xxx, lrcHtml: xxx, focus:false} ...]
     * @memberof LyricParser
     */
    parse(lrcString) {
        try {
            var retObj = {
                title: '',
                artist: '',
                capo: 0,
                lyricData: []
            }

            var lyricData = []
            const lyric = lrcString.split('\n')

            retObj.title = getDescriptionItem(lrcString, /\[ti:(.*?)\]/, 1, '');
            retObj.artist = getDescriptionItem(lrcString, /\[ar:(.*?)\]/, 1, '');
            retObj.album = getDescriptionItem(lrcString, /\[al:(.*?)\]/, 1, '');
            retObj.lyricBy = getDescriptionItem(lrcString, /\[ly:(.*?)\]/, 1, '');
            retObj.composerBy = getDescriptionItem(lrcString, /\[mu:(.*?)\]/, 1, '');
            retObj.OriginalTone = getDescriptionItem(lrcString, /\[原调:(.*?)\]/, 1, '');
            retObj.SelectTone = getDescriptionItem(lrcString, /\[选调:(.*?)\]/, 1, '');
            retObj.capo = getDescriptionItem(lrcString, /\[变调夹:(.*?)\]/, 1, '');
            retObj.creator = getDescriptionItem(lrcString, /\[歌词制作:(.*?)\]/, 1, '');

            let preLyricIdx = null
            let preTime = null
            let preTag = null
            for (let i = 0; i < lyric.length; i++) {
                let line = lyric[i]
                // match lrc time
                const oneTime = line.match(/\[(\d{2}):(\d{2})\.(\d{2,3})]/)
                if (oneTime != null) {
                    // 处理歌词
                    // 删除所有时间标记
                    let lrcText = line.replace(/\[(\d{2}):(\d{2})\.(\d{2,3})]|\s+|\s+$|<\d+>/g, '')
                    let lrcTag = genLyricTag(lrcText)

                    const time = (oneTime[1]) * 60 + parseInt(oneTime[2]) + parseInt(oneTime[3]) / ((oneTime[3] + '').length === 2 ? 100 : 1000)
                    if(preLyricIdx !== null) {
                        lyricData[preLyricIdx].data.endTime = time
                    }
                    preLyricIdx = lyricData.push({
                        type: 'lyric',
                        data: {
                            time: time,
                            nodes: lrcTag,
                            focus: false,
                            endTime: Number.MAX_SAFE_INTEGER
                        }
                    }) - 1
                } else {
                    const match_comment = line.match(/^\s*\[#\](.*)/)
                    if(match_comment !== null) {
                        lyricData.push({
                            type: 'comment',
                            data: match_comment[1],
                        })
                    }
                    const match_img = line.match(/^\s*\[img\](.*)/)
                    if(match_img !== null) {
                        lyricData.push({
                            type: 'img',
                            data: match_img[1],
                        })
                    }

                    const match_trans = line.match(/^\s*\[x-trans\](.*)/)
                    if(match_trans !== null) {
                        lyricData.push({
                            type: 'x-trans',
                            data: match_trans[1],
                        })
                    }

                }
            }
            retObj.lyricData = lyricData
            console.log(retObj)
            return retObj
        } catch (error) {
            console.log(error)
            return retObj
        }
    }

    /**
     * According to the capo position, calculate the corresponding chord
     * @param {string} key key = C    D     Fm
     * @param {number} capo 1
     * @returns B    C#    Em
     * @memberof LyricParser
     */
    getCapoKey(key, capo) {
        var ChordKey = ['C', 'C#/Bb', 'D', 'D#/Eb', 'E', 'F', 'F#/Gb', 'G', 'G#/Ab', 'A', 'A#/Bb', 'B']
        var lens = ChordKey.length
        for (var i = 0; i < lens; i++) {
            if (key === ChordKey[i]) {
                break
            } else if (key.length === 2 && ChordKey[i].search(key) !== -1) {
                break
            }
        }
        i = i - capo
        if (i < 0) {
            i = lens + i
        }
        var retKey = ChordKey[i]
        return retKey.length === 1 ? retKey : retKey.substr(0, 2)
    }

    /**
     * Get short name of chord.
     * @param {any} chord C:maj A:min C:7 D#:min7 N
     * @param {number} [capo=0] 0
     * @returns C     Am    C7  D#m7    Intro
     * @memberof LyricParser
     */
    getShortNameOfChord(chord, capo = 0) {
        if (chord === 'N') {
            return 'Intro'
        }

        var chordArray = chord.split(':')
        var chordKey = this.getCapoKey(chordArray[0], capo)
        var chordShap = chordArray[1]
        chordShap = chordShap.replace('maj', '').replace('min', 'm')
        return chordKey + chordShap
    }

    /**
     * Parse chord data.
     * @param {any} content
     * @returns
     * @memberof LyricParser
     */
    parseChordData(content, capo = 0) {
        var jsonObj = null
        try {
            if (typeof content === 'string') {
                jsonObj = JSON.parse(content)
            } else {
                jsonObj = content
            }
            this.duration = 0
            for (var key in jsonObj) {
                var item = jsonObj[key]
                if (item.chord === 'N') {
                    item.name = 'Intro'
                } else {
                    var chordArray = item.chord.split(':')
                    var chordKey = this.getCapoKey(chordArray[0], capo)
                    var chordShap = chordArray[1]
                    item.chord = `${chordKey}:${chordShap}`
                    var shortChordShap = chordShap.replace('maj', '').replace('min', 'm')
                    item.name = chordKey + shortChordShap
                }
                // item.width = item.end - item.start
                // this.duration += item.width
            }
            return jsonObj
        } catch (err) {
            console.log(err)
            return null
        }
    }
}
export {
    LyricParserV2
}