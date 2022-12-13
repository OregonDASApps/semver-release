'use strict';

const _ = require('lodash');
const compareVersions = require('compare-versions');
const semverSort = require('semver/functions/sort')


module.exports = class JsonUtils {

    constructor(jsonObj) {
        this.jsonObj = jsonObj
    }

    upgradeVersion(version, type, prepend) {
        console.log("orig:", version.replace(prepend, ''), prepend)
        let versionObject = version.replace(prepend, '').split('.')
        let updatedVersion = ''
        let major, minor, patch = ''
        

        console.log(versionObject[0], versionObject[1], versionObject[2])
        
        switch(type.toLowerCase()) {
            case 'major': 
                major = parseInt(versionObject[0]) +1
                minor = 0
                patch = 0
                updatedVersion = `${major}.${minor}.${patch}`
                break;
            case 'minor': 
                major = parseInt(versionObject[0])
                minor = parseInt(versionObject[1]) +1
                patch = 0
                updatedVersion = `${major}.${minor}.${patch}`
                break;
            case 'patch': 
                major = parseInt(versionObject[0])
                minor = parseInt(versionObject[1])
                patch = parseInt(versionObject[2]) +1
                updatedVersion = `${major}.${minor}.${patch}`
                break;
        }
        
        return `${prepend}${updatedVersion}`;

    }

    firstItem(keyName) {
        let first = this.jsonObj[0][keyName]
        return first
    }

    filterByPrepend(prepend) {
        let matched = _.filter(this.jsonObj, function(obj) { 
            return obj.tagName.startsWith(prepend)
        })

        let plain = _.map(matched, function(o){
            
            let obj = {
                "name": o.name,
                "createdAt": o.createdAt,
                "tagName": o.tagName,
                "tag": parseInt(o.tagName.replace(prepend, '').replace(/\./g, ''))
            }
            
            return obj
        })
        
        let sorted = plain.sort((a, b) => (a.tag < b.tag ? 1 : -1))
        if(prepend != '') {
            this.jsonObj = sorted;
        }

        return sorted;
    }

    filterNoPrepend() {
        let matched = _.filter(this.jsonObj, function(obj) { 
            let o = obj.split('.')
            console.log('OOOO: ', typeof o[0])
            return obj.tagName.startsWith(prepend)
        })

        let plain = _.map(matched, function(o){
            
            let obj = {
                "name": o.name,
                "createdAt": o.createdAt,
                "tagName": o.tagName,
                "tag": parseInt(o.tagName.replace(prepend, '').replace(/\./g, ''))
            }
            
            return obj
        })
        
        let sorted = plain.sort((a, b) => (a.tag < b.tag ? 1 : -1))
        if(prepend != '') {
            this.jsonObj = sorted;
        }

        return sorted;
    }
}